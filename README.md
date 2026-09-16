# NVIDIA AEC Digital Twin Experience

Independent educational AEC web demo — **From BIM to Physical AI**.

This is **not** an official NVIDIA product. NVIDIA product names and trademarks belong to NVIDIA Corporation.

Demo educativo independiente de AEC. **No** es un producto oficial de NVIDIA.

## Truthfulness / Veracidad

Every feature UI surface that shows a status uses only:

- `INTERACTIVE WEB` — the browser is actually computing or manipulating the feature.
- `PRECOMPUTED` — the browser is visualizing data/results produced ahead of time.
- `WORKFLOW DEMO` — the interaction demonstrates how a real NVIDIA workflow would operate, but no NVIDIA backend is running.

Never claim live NVIDIA inference, live Earth-2 forecasts, in-browser Isaac Sim, or that cuOpt generated a route unless that is actually true.

Cada superficie de UI con estado usa solo esas tres etiquetas. Nunca se presenta un resultado precomputado o simulado como inferencia NVIDIA en vivo.

## Phase 1 vs later phases

**Phase 1 (this branch):** core 3D world on the Phase 0 shell.

- Procedural 8-storey construction scene (structure, partial envelope, MEP sample, site, equipment, context).
- Camera presets with smooth transitions and reset.
- Discipline/layer visibility.
- Object picking, hover highlight, metadata ID.
- Quality High / Low / Auto (DPR, shadows, particles, context LOD).
- Deterministic loader stages, optional-asset skip, global error boundary.

**Deferred to Phase 2+ (not in this branch):** landing hero extras, guided tour engine, How NVIDIA Fits, BIM inspector dataset (≥60 elements), structural/wind/flood visualization, video AI, logistics playback, robotics animation, reality capture, digital-twin dashboard, copilot.

See `docs/09_DELIVERY_PLAN.md` and `docs/TICKETS.md` (AECN-010 … AECN-015).

Scene coordinates: `src/experience/scene/coordinates.ts` and `public/data/scene/coordinates.json`.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run test     # Vitest unit tests
npm run lint
npm run build    # astro check + static production build
npm run preview  # serve the static `dist/` folder
npm run test:e2e # Playwright (builds, then serves `dist/`)
```

Production output is static files in `dist/`. Host them on any static server (GitHub Pages, Netlify, Cloudflare Pages, `npx serve dist`). No environment variables, API keys, or backend process are required.

El build de producción es estático: se puede servir `dist/` sin servidor de aplicación.

## Stack

Astro (static) · TypeScript strict · React island on `/experience` · React Three Fiber + Drei · Zustand · Tailwind CSS · Zod · Vitest · Playwright.

## License

Apache-2.0. Asset licenses are listed in `public/assets/ATTRIBUTION.md`.
