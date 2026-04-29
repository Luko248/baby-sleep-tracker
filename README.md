# Baby Sleep Tracker

A tiny, offline-first PWA for tracking how much your baby sleeps.
One screen. One button. Stays on the bottom of your phone where your thumb is.

🌙 Dark theme · ✦ Heroicons · 📊 Chart.js per-day chart · 💾 100% local (no
account, no servers, no telemetry).

---

## Features

- **One-tap tracking.** A sticky button at the bottom of the screen flips
  between *Start sleep tracking* and *End sleep tracking* and shows a live
  `h:mm:ss` timer while baby sleeps.
- **Daily totals.** Each day shows a count of sleeps and total sleep time,
  with a Chart.js bar chart of session durations through the day.
- **Swipe history.** Swipe the day card left/right to browse the last 14 days;
  scroll the list below for a detailed timeline.
- **First-run name prompt.** A native `<dialog>` (invoker commands API)
  asks for the baby's name on first launch and shows it in the header.
  Tap the title later to edit.
- **Confirm-on-delete.** Per-row delete and "clear all" both go through a
  styled confirm dialog — no `window.confirm` boxes.
- **Offline-first PWA.** Service worker pre-caches the app shell and runtime-
  caches Google Fonts. Installable on iOS / Android / desktop.
- **Local-only data.** Everything lives in `localStorage`:
  - `baby-sleep:sessions` — array of `{ id, start, end }`
  - `baby-sleep:name` — child's display name

---

## Stack

| Layer        | Choice                  |
| ------------ | ----------------------- |
| Framework    | Astro 5 (static)        |
| Styling      | Tailwind CSS 4 (Vite plugin, `@theme` tokens) |
| Language     | TypeScript (strict)     |
| Charts       | Chart.js 4              |
| Icons        | Heroicons 2 (24/solid + 20/solid, imported as `?raw` SVG strings) |
| PWA          | `@vite-pwa/astro` + Workbox |
| Runtime      | Bun (local dev + CI) on Node LTS-compatible toolchain |
| Hosting      | GitHub Pages            |

---

## Development

```sh
bun install
bun dev          # http://localhost:4321
bun run build    # static site to ./dist
bun run preview  # preview the built site
```

The dev server does **not** register the service worker (`devOptions.enabled:
false`); offline behaviour is verified against `bun run preview` or the
deployed build.

---

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which:

1. Sets up Bun (`oven-sh/setup-bun@v2`).
2. Runs `bun install --frozen-lockfile`.
3. Builds with `BASE_PATH=/${{ github.event.repository.name }}` so that
   project-pages assets resolve correctly.
4. Uploads `./dist` and deploys via `actions/deploy-pages`.

In the repo's GitHub Pages settings, **Source** must be set to
**GitHub Actions** for the workflow to publish.

---

## Project layout

```
.
├── astro.config.mjs        # Astro + Tailwind 4 + @vite-pwa/astro config
├── public/favicon.svg      # also used as the PWA icon
├── src/
│   ├── env.d.ts            # vite-plugin-pwa virtual module types
│   ├── layouts/Layout.astro
│   ├── lib/icons.ts        # Heroicons → SVG strings, with size helper
│   ├── pages/index.astro   # the entire app: template + script
│   └── styles/global.css   # Tailwind import, theme tokens, dialog css, animations
└── .github/workflows/deploy.yml
```

The app is a single page. All UI lives in `src/pages/index.astro`; the
client script is colocated in a `<script>` tag and bundled by Vite.

---

## License

MIT.
