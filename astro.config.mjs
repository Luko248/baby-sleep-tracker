import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

// Served from https://luko248.github.io/baby-sleep-tracker/ in production.
// In CI we override the base via the BASE_PATH env so it works on
// project-pages and a custom domain alike.
const base = process.env.BASE_PATH ?? (process.env.NODE_ENV === 'production' ? '/baby-sleep-tracker' : '/');
const baseWithSlash = base.endsWith('/') ? base : base + '/';

export default defineConfig({
  site: 'https://luko248.github.io',
  base,
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: "Baby Sleep Tracker",
        short_name: "Baby Sleep",
        description: "Track your baby's sleep — fully offline.",
        theme_color: '#07061a',
        background_color: '#07061a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: baseWithSlash,
        scope: baseWithSlash,
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff,woff2}'],
        navigateFallback: baseWithSlash,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 30, maxAgeSeconds: 31_536_000 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: true,
  },
});
