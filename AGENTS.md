# AGENTS.md

Guidance for AI coding agents working on this repository. Keep it short:
this is a small static app, not a framework playground.

## What this app is

A single-page PWA that tracks baby sleep sessions in `localStorage`.
There is **no backend**, no auth, no user accounts, and no analytics.
All state lives in two `localStorage` keys (`baby-sleep:sessions`,
`baby-sleep:name`). When in doubt, do not invent server-side concepts.

## Stack & runtime

- **Astro 5** static output. No SSR, no adapter. `bun run build` → `dist/`.
- **Tailwind CSS 4** via `@tailwindcss/vite`. Theme tokens are declared in
  `src/styles/global.css` under `@theme` (e.g. `--color-night-900`,
  `--color-moon`). Use those over arbitrary hex values.
- **TypeScript strict** mode. Do not loosen `tsconfig.json`.
- **Chart.js 4** for the per-day bar chart. Imported in the page script and
  registered with `Chart.register(...registerables)`.
- **Heroicons 2**, imported as `?raw` SVG strings via `src/lib/icons.ts`. Use
  the `icon(name, "w-? h-?")` helper to render with sizing classes.
- **PWA**: `@vite-pwa/astro` with Workbox. Service worker is generated at
  build time; dev server does *not* register one (`devOptions.enabled:
  false`).
- **Runtime**: Bun for local + CI. Avoid adding npm-only tooling.

## Files you will touch most

| File                              | Why                                |
| --------------------------------- | ---------------------------------- |
| `src/pages/index.astro`           | The entire UI + client script.     |
| `src/styles/global.css`           | Theme tokens, animations, `<dialog>` styling. |
| `src/lib/icons.ts`                | Add or remove Heroicons imports.   |
| `src/layouts/Layout.astro`        | `<head>`, manifest link, SW registration. |
| `astro.config.mjs`                | `base`/`site`, PWA + Workbox config. |
| `.github/workflows/deploy.yml`    | Bun-based GitHub Pages deploy.     |

## Conventions

- **One page, one script.** Keep the app logic colocated in
  `src/pages/index.astro`'s `<script>` tag. Don't extract framework-style
  components or stores unless the file genuinely outgrows itself (it
  hasn't yet).
- **Dialogs use the native `<dialog>` element + the HTML invoker commands
  API** (`command="show-modal"` / `command="close"` with `commandfor=`).
  Don't reach for custom modal implementations or `window.confirm`. The
  result of a confirm dialog is delivered via `<form method="dialog">`
  with `value="confirm" | "cancel"` on the submit buttons; read it from
  the dialog's `close` event using `dialog.returnValue`.
- **No emoji icons.** Use Heroicons through `icon(...)`. Decorative
  text glyphs in headings are also out — that includes ✦ ✧ ☾ etc.
- **Sub-text contrast.** Avoid `text-mist/30..50` for anything readable;
  use `/70..85`. Stat labels are `font-semibold uppercase tracking-wider`.
- **GitHub Pages base path.** Anything that links to a static asset (the
  favicon, manifest, etc.) must be prefixed with `import.meta.env.BASE_URL`.
  The PWA integration handles `start_url` / `scope` from `astro.config.mjs`.
- **Charts.** The Y-axis is hidden on purpose (the stat card already shows
  total time). Don't re-enable it without first checking the visual balance
  — Chart.js reserves left-side space for ticks, which made margins look
  asymmetric. If you change this, also adjust `layout.padding`.
- **Sessions can span midnight.** When summarising or charting per day,
  clip session intervals to the day window (`sessionsForDay`). Don't add
  per-day stats by `start` alone unless you also clip.
- **localStorage is the source of truth.** Read once into a `let sessions`
  array, mutate that, then `saveSessions(...)` and re-render. Do not
  introduce reactivity libraries.
- **No comments restating obvious code.** The codebase explains *why*
  when it isn't obvious (e.g. "Y-axis is hidden — the stat card already
  shows total time."). Don't add narration like `// loop over sessions`.

## Things to avoid

- Don't add a UI framework (React/Preact/Vue/Svelte). The app is small
  enough to not need one.
- Don't replace Tailwind v4 tokens with hardcoded colours.
- Don't introduce a new state library or signal abstraction.
- Don't add server-rendered routes or an SSR adapter — GitHub Pages is
  static, and `base` handling assumes static.
- Don't enable Workbox `devOptions`. SW behaviour should be tested against
  `bun run preview` of a real build.
- Don't run `npm install` — it desyncs with `bun.lock` and breaks CI's
  `bun install --frozen-lockfile`.
- Don't add icons by inlining SVG markup in templates. Add them to
  `src/lib/icons.ts` and consume via `icon(...)`.

## When you change things

- Run `bun run build` locally before claiming the change works. The build
  also validates the PWA manifest and service worker output.
- For UI changes, manually verify in the browser at the mobile viewport
  (~390×844). The app is mobile-first; desktop is incidental.
- `localStorage` keys are public contract; if you rename them, write a
  one-time migration in the script (don't break existing users' data).

## Releasing

Push to `main`. The GitHub Action builds with the correct base path and
publishes to GitHub Pages. There is no release branch and no version tag.
