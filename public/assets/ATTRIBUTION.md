# Asset attribution

This file records provenance for every media, model, texture, font and dataset used by the NVIDIA AEC Digital Twin Experience.

This repository is an **independent educational demonstration**. It is not an official NVIDIA product. NVIDIA product names and trademarks belong to NVIDIA Corporation.

## Phase 0

Phase 0 ships a blank but functional experience shell. There are no construction-site GLB models, videos, point clouds or proprietary BIM exports in this release.

| Asset | Location | License | Source | Notes |
| --- | --- | --- | --- | --- |
| IBM Plex Sans (variable) | npm `@fontsource-variable/ibm-plex-sans` | SIL Open Font License 1.1 | [IBM/plex](https://github.com/IBM/plex) | UI sans-serif |
| IBM Plex Mono | npm `@fontsource/ibm-plex-mono` | SIL Open Font License 1.1 | [IBM/plex](https://github.com/IBM/plex) | Reserved for IDs / tabular engineering values |
| Phase 0 schema fixtures | `public/data/**/*.json` | Apache-2.0 (this repo) | Original authored data | Minimal valid samples for contract tests. Not measured engineering results. |

## Later phases

When 3D models, video, or reality-capture assets are added, record:

- file path;
- license;
- original author/source URL;
- any modifications;
- whether the UI may describe the asset as coming from Revit, a solver, or NVIDIA software.

Do not label an asset as a Revit export, cuOpt solution, PhysicsNeMo inference, VSS analysis, Earth-2 forecast, or Isaac Sim run unless that is actually how it was produced.
