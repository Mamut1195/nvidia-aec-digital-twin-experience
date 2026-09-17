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

## Phase 3 vs later phases

**Phase 3 (this branch):** engineering visualization on the Phase 0–2 shell.

- Illustrative structural results (3 load cases, per-element scalars and displacement vectors) with heatmap, legend, deformation scale, and “not a design check” disclaimer.
- Precomputed wind field (3 speeds × 2 directions) with particles/streamlines, facade pressure, and pedestrian-zone overlay. PhysicsNeMo explainer: solver → training data → surrogate → validated inference. No live inference and no invented speedups.
- Weather scenarios labeled **WORKFLOW DEMO**, flood time series (≥6 steps, 3 rainfall cases) with water surface, depth legend, and road/building impact. Earth-2 explainer states Earth-2 is **not** the hydraulic flood solver.

**Deferred to Phase 4+:** video AI, logistics playback, robotics animation, reality capture, digital-twin dashboard, copilot, final tour, hardening.

See `docs/09_DELIVERY_PLAN.md` and `docs/TICKETS.md` (AECN-040 … AECN-053).

Official NVIDIA documentation links were last checked on 2026-09-16. See `docs/10_REFERENCES.md`.

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
