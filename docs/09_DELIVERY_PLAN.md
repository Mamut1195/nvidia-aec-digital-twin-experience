# 09 — Delivery Plan

## 1. Delivery strategy

Build in vertical slices so the project becomes demonstrable early.

Do not build every data pipeline before creating the UI.

## 2. Phases

### Phase 0 — Foundation
- scaffold;
- global layout;
- scene contract;
- data contracts;
- design tokens;
- static build.

Exit:
blank but functional experience shell.

### Phase 1 — Core scene
- building;
- site;
- roads/terrain;
- equipment;
- camera presets;
- layer system;
- element picking.

Exit:
scene can support all later modules.

### Phase 2 — Story + BIM
- landing;
- guided tour framework;
- BIM mode;
- OpenUSD explainer;
- How NVIDIA Fits panel.

Exit:
already publishable as a basic “OpenUSD/Omniverse in AEC” demo.

### Phase 3 — Engineering
- structural;
- wind;
- flood/weather.

Exit:
design + simulation narrative complete.

### Phase 4 — Construction intelligence
- video AI;
- logistics.

Exit:
field operations story complete.

### Phase 5 — Physical AI
- robotics;
- reality capture.

Exit:
physical-world/robotics story complete.

### Phase 6 — Unified experience
- digital twin;
- local copilot;
- guided tour finalized.

Exit:
full story works end to end.

### Phase 7 — Hardening
- performance;
- mobile;
- accessibility;
- content audit;
- visual regression;
- static production build.

## 3. MVP cut line

If scope must be reduced, keep:

1. Overview.
2. BIM/OpenUSD.
3. Wind/PhysicsNeMo.
4. Flood/Earth-2.
5. Video AI.
6. Logistics.
7. Robotics.
8. Digital Twin.
9. Copilot.
10. How NVIDIA Fits.

Reality capture and structural mode can be simplified, but not removed unless unavoidable.

## 4. Implementation order

The ticket backlog in `TICKETS.md` is already dependency-aware.

An agent should not begin Phase 4 before the shared scene/data contracts from Phases 0–2 exist.

## 5. Completion artifacts

Agent must deliver:

- source code;
- static production build command;
- all local demo datasets;
- asset attribution file;
- README with local dev instructions;
- screenshots for every mode;
- tests;
- no secret/API requirements.

## 6. Handoff checklist

Before saying the project is finished:

- [ ] no authentication code;
- [ ] no database;
- [ ] no hidden cloud service dependency;
- [ ] no API key required;
- [ ] static build works;
- [ ] all official-source links included;
- [ ] all demo/precomputed labels correct;
- [ ] all modes documented;
- [ ] test suite runs;
- [ ] screenshots generated;
- [ ] asset licensing documented.
