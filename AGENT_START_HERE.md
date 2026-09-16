# Agent Start Here

You are implementing **NVIDIA AEC Digital Twin Experience**, a public interactive web demo for engineers, architects and construction professionals.

## Mission

Build a polished browser experience that makes the NVIDIA AEC stack understandable through interaction rather than through a long article.

The visitor must be able to enter one 3D construction scene and switch between modes that demonstrate:

- BIM and multidisciplinary data composition.
- GPU visualization.
- Structural-result visualization.
- Wind/CFD + Physics AI concepts.
- Weather-to-flood workflow.
- Construction video intelligence.
- Logistics optimization.
- Robotics and Physical AI.
- Reality capture.
- Digital-twin thinking.
- An AI-copilot-style command surface.

## Do not build

Do **not** add any of the following:

- authentication;
- sign-up/sign-in;
- user profiles;
- billing;
- admin dashboards;
- persistent database;
- production backend;
- queues;
- Kubernetes;
- Docker orchestration;
- cloud provisioning;
- GPU streaming infrastructure;
- real-time Omniverse server sessions;
- real PhysicsNeMo training;
- real VSS deployment;
- real Earth-2 inference;
- real Isaac Sim runtime in the browser.

This is a **web demonstration of the workflows and potential**.

## Truthfulness rule

Every feature shown in the UI must carry one of these statuses:

- `INTERACTIVE WEB` — the browser is actually computing or manipulating the feature.
- `PRECOMPUTED` — the browser is visualizing data/results produced ahead of time.
- `WORKFLOW DEMO` — the interaction demonstrates how the real NVIDIA workflow would operate, but no NVIDIA backend is running.

Never label precomputed or mocked output as live NVIDIA inference.

## Implementation philosophy

Prefer simple, deterministic and highly visual behavior over architecture complexity.

A visitor should understand each mode in 20–60 seconds.

Use the same scene and UI shell for all modules.

## Recommended technical direction

- Astro, static output.
- TypeScript.
- React island for the interactive experience.
- Three.js through React Three Fiber + Drei.
- Lightweight client state store.
- Static JSON assets for scenario data.
- GLB/glTF assets, Draco where useful, KTX2/WebP/AVIF textures.
- CSS/Tailwind or equivalent utility styling.
- Vitest for logic.
- Playwright for browser flows.

If an equivalent stack already exists in the target repository, adapt to it rather than introducing a second framework.

## Definition of success

A non-specialist engineer opens the URL, spends 3–5 minutes exploring, and can explain:

1. what Omniverse/OpenUSD are for;
2. what PhysicsNeMo can add to simulation;
3. how Metropolis/VSS can understand construction video;
4. how Earth-2 can feed weather-driven engineering workflows;
5. how cuOpt can optimize construction logistics;
6. how Isaac Sim fits robotics/Physical AI;
7. how all of this can converge in a digital twin.

Start by reading `docs/01_PRODUCT_SPEC.md`, then execute tickets in `docs/TICKETS.md` in dependency order.
