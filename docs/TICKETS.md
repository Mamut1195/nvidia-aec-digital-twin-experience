# Detailed Implementation Tickets

## Ticket conventions

Priority:
- P0 = blocks project.
- P1 = required MVP.
- P2 = important polish.
- P3 = optional.

Status is not tracked in this file. The implementation agent may copy tickets into its own tracker.

Each ticket must be completed with its acceptance criteria, not merely “code exists”.

---

# EPIC 0 — Foundation

## AECN-001 — Scaffold static web project
**Priority:** P0  
**Depends on:** none

### Goal
Create the project shell using Astro + TypeScript and the chosen interactive 3D island stack.

### Work
- Configure static output.
- Add TypeScript strict mode.
- Add formatting/linting.
- Add Vitest.
- Add Playwright.
- Add base page.
- Add `/experience` route or equivalent entry.
- Confirm production build requires no environment secrets.

### Acceptance
- `dev`, `build`, `test` commands documented.
- Production build completes.
- Built files can be served as static assets.
- No backend package/service is required.

---

## AECN-002 — Establish design tokens and app shell
**Priority:** P0  
**Depends on:** AECN-001

### Work
- typography;
- spacing;
- panel surfaces;
- status badges;
- buttons;
- mode rail;
- responsive breakpoints.

### Acceptance
- shell renders desktop/mobile;
- no final 3D required;
- status badge component supports INTERACTIVE WEB / PRECOMPUTED / WORKFLOW DEMO.

---

## AECN-003 — Define typed domain contracts
**Priority:** P0  
**Depends on:** AECN-001

### Work
Create schemas/types for:
- BIM elements;
- structural results;
- wind scenarios;
- flood scenarios;
- weather;
- video events;
- logistics;
- robot mission;
- twin replay.

Use runtime schema validation.

### Acceptance
- fixtures pass schemas;
- invalid fixtures fail unit tests;
- schemas are imported by module adapters.

---

## AECN-004 — Create global experience state and action bus
**Priority:** P0  
**Depends on:** AECN-001

### Work
State for:
- mode;
- selected element;
- quality;
- tour;
- camera preset;
- layers;
- scenario controls.

Add action bus consumed by UI and copilot.

### Acceptance
- mode changes without page navigation;
- reset restores deterministic defaults;
- actions can be invoked programmatically.

---

## AECN-005 — Asset attribution and content-disclaimer framework
**Priority:** P1  
**Depends on:** AECN-001

### Work
- `public/assets/ATTRIBUTION.md`;
- legal/footer component;
- engineering disclaimer component;
- independent-demo trademark note.

### Acceptance
- footer visible;
- asset attributions documented;
- engineering-result modes can display disclaimer consistently.

---

# EPIC 1 — Core 3D World

## AECN-010 — Build optimized base construction scene
**Priority:** P0  
**Depends on:** AECN-001

### Work
Create/import:
- building;
- structural frame;
- architectural envelope;
- minimal MEP;
- terrain;
- roads;
- site zones;
- crane;
- excavator;
- trucks;
- context buildings.

### Acceptance
- scene loads as one coherent project;
- object groups map to documented scene hierarchy;
- repeated assets use instancing where practical;
- acceptable FPS on target desktop.

---

## AECN-011 — Implement camera system and presets
**Priority:** P1  
**Depends on:** AECN-010

### Presets
- overview;
- building;
- street/flood;
- logistics;
- robot mission;
- camera marker.

### Acceptance
- smooth transition;
- reset camera;
- no camera clipping through core geometry in presets.

---

## AECN-012 — Implement discipline/layer visibility
**Priority:** P1  
**Depends on:** AECN-010, AECN-004

### Layers
- architecture;
- structure;
- MEP;
- terrain;
- temporary;
- equipment;
- people/context.

### Acceptance
- toggles update instantly;
- layer state persists between compatible modes;
- reset works.

---

## AECN-013 — Implement object picking and highlighting
**Priority:** P1  
**Depends on:** AECN-010, AECN-003

### Work
- raycast/select;
- hover;
- selected outline/material;
- selected metadata ID.

### Acceptance
- only intended selectable objects react;
- selection can be cleared;
- mobile tap works.

---

## AECN-014 — Add quality/performance controls
**Priority:** P1  
**Depends on:** AECN-010

### Work
High/Low/Auto:
- DPR;
- shadows;
- particles;
- optional effects;
- LOD/context.

### Acceptance
- user can force Low;
- low materially reduces GPU cost;
- mode functionality remains intact.

---

## AECN-015 — Add scene loading/failure boundaries
**Priority:** P1  
**Depends on:** AECN-010

### Acceptance
- loader shows deterministic stages;
- missing optional asset does not crash app;
- global error boundary offers reset.

---

# EPIC 2 — Entry Story and Education

## AECN-020 — Build landing hero
**Priority:** P1  
**Depends on:** AECN-002, AECN-010

### Acceptance
- clear title/subtitle;
- Enter button;
- Guided Tour button;
- ecosystem product strip;
- loads quickly before optional heavy assets.

---

## AECN-021 — Build mode rail/navigation
**Priority:** P0  
**Depends on:** AECN-002, AECN-004

### Acceptance
All required modes reachable without page reload.

---

## AECN-022 — Implement guided-tour engine
**Priority:** P1  
**Depends on:** AECN-011, AECN-021

### Work
Tour step model:
- target mode;
- camera preset;
- layer changes;
- scripted action;
- narration card.

### Acceptance
- next/back/exit;
- tour can resume from start;
- visitor can exit to free exploration at any time.

---

## AECN-023 — Implement “How NVIDIA Fits” ecosystem map
**Priority:** P1  
**Depends on:** AECN-002

### Acceptance
- Revit/Rhino/engineering tools visually separated from NVIDIA stack;
- each NVIDIA product opens a concise explanation;
- official link present;
- no “NVIDIA replaces Revit” implication.

---

# EPIC 3 — BIM / OpenUSD

## AECN-030 — Create BIM element dataset
**Priority:** P1  
**Depends on:** AECN-003, AECN-010

### Acceptance
- >=60 elements;
- valid stable IDs;
- >=3 disciplines;
- source labels truthful.

---

## AECN-031 — Build BIM inspector
**Priority:** P1  
**Depends on:** AECN-013, AECN-030

### Acceptance
Selected object shows:
- ID;
- category;
- discipline;
- level;
- material;
- dimensions/properties;
- source label.

---

## AECN-032 — Implement level/discipline isolation
**Priority:** P1  
**Depends on:** AECN-012, AECN-030

### Acceptance
- isolate one level;
- isolate one discipline;
- restore all.

---

## AECN-033 — Build OpenUSD composition explainer
**Priority:** P1  
**Depends on:** AECN-023

### Work
Interactive visual diagram of layers/references/composed stage.

### Acceptance
- user can toggle source layers;
- diagram explains composition without claiming the browser scene is parsed directly from USD unless it is.

---

# EPIC 4 — Structural + Physics

## AECN-040 — Create illustrative structural result dataset
**Priority:** P1  
**Depends on:** AECN-003, AECN-030

### Acceptance
- 3 load cases;
- per-element scalar values;
- displacement vectors/offsets;
- disclaimer metadata.

---

## AECN-041 — Implement structural result visualization
**Priority:** P1  
**Depends on:** AECN-040

### Work
- heatmap;
- legend;
- deformation scale;
- result selector;
- load-case selector.

### Acceptance
- result changes visually;
- values inspectable;
- “not a design check” disclaimer visible.

---

## AECN-042 — Create wind scenario datasets
**Priority:** P1  
**Depends on:** AECN-003

### Acceptance
At least:
- 3 speeds;
- 2 directions;
- vector/particle sample field;
- facade pressure scalar field.

---

## AECN-043 — Implement wind field visualization
**Priority:** P1  
**Depends on:** AECN-042, AECN-010

### Work
- particles/streamlines;
- direction/speed control;
- facade pressure mode;
- pedestrian-zone overlay.

### Acceptance
- scenario change updates field;
- FPS remains acceptable;
- status badge PRECOMPUTED.

---

## AECN-044 — Build PhysicsNeMo workflow explainer
**Priority:** P1  
**Depends on:** AECN-043

### Flow
`high-fidelity solver → training/reference data → PhysicsNeMo model → validated fast inference`

### Acceptance
- distinguishes solver from surrogate;
- mentions validation;
- official link included;
- no fake speedup claim.

---

# EPIC 5 — Weather + Flood

## AECN-050 — Create weather scenario data
**Priority:** P1  
**Depends on:** AECN-003

### Acceptance
- 3 rainfall scenarios;
- wind/weather metadata;
- explicit WORKFLOW DEMO source label.

---

## AECN-051 — Create flood time-series data
**Priority:** P1  
**Depends on:** AECN-050

### Acceptance
- 3 rainfall scenarios;
- >=6 time steps each;
- depths;
- affected road/building IDs.

---

## AECN-052 — Implement flood surface and timeline
**Priority:** P1  
**Depends on:** AECN-051, AECN-010

### Acceptance
- water extent changes over time;
- depth legend;
- road/building impact visible;
- reset works.

---

## AECN-053 — Build Earth-2 → engineering workflow explainer
**Priority:** P1  
**Depends on:** AECN-052

### Acceptance
Diagram:
`weather AI → hydrology → hydraulics → impact twin`

Must state that Earth-2 is not itself the hydraulic flood solver in this demo.

---

# EPIC 6 — Construction Video AI

## AECN-060 — Prepare construction demo video
**Priority:** P1  
**Depends on:** AECN-005

### Acceptance
- locally hostable;
- usage rights documented;
- short enough for web;
- optimized MP4/WebM;
- visible events map to index.

---

## AECN-061 — Build indexed video event dataset
**Priority:** P1  
**Depends on:** AECN-060, AECN-003

### Acceptance
Includes at least:
- concrete delivery;
- excavator;
- crane;
- worker/equipment proximity;
- idle interval;
- general delivery.

---

## AECN-062 — Build video intelligence panel
**Priority:** P1  
**Depends on:** AECN-061

### Work
- player;
- event timeline;
- event chips;
- event detail;
- jump-to-time.

### Acceptance
Selecting event seeks video to correct timestamp.

---

## AECN-063 — Implement local natural-language event search
**Priority:** P1  
**Depends on:** AECN-061, AECN-004

### Work
- keyword normalization;
- synonym map;
- basic time-of-day;
- summary command.

### Acceptance
Supported queries return deterministic relevant events.

---

## AECN-064 — Build Metropolis/VSS explainer
**Priority:** P1  
**Depends on:** AECN-062

### Acceptance
- explains real VSS capabilities;
- states demo uses pre-indexed events;
- official links.

---

# EPIC 7 — Logistics / cuOpt

## AECN-070 — Define construction logistics scenario
**Priority:** P1  
**Depends on:** AECN-003, AECN-010

### Acceptance
Contains:
- fleet;
- tasks;
- site nodes;
- capacities;
- time windows;
- baseline plan.

---

## AECN-071 — Produce optimized scenario dataset
**Priority:** P1  
**Depends on:** AECN-070

### Options
A. Generate once with real cuOpt if easily available during development.
B. Otherwise author a deterministic improved solution and label it as a cuOpt-style workflow demo.

### Acceptance
- optimized KPIs outperform baseline on defined objective;
- provenance field records how solution was generated.

---

## AECN-072 — Implement route visualization and playback
**Priority:** P1  
**Depends on:** AECN-071

### Acceptance
- baseline/optimized toggle;
- animated vehicles;
- routes visible;
- selected vehicle/task inspectable.

---

## AECN-073 — Build KPI comparison panel
**Priority:** P1  
**Depends on:** AECN-071

### Acceptance
Show:
- distance;
- travel time;
- wait;
- late jobs;
with internally consistent calculations.

---

## AECN-074 — Build cuOpt explainer
**Priority:** P1  
**Depends on:** AECN-072

### Acceptance
- explains decision optimization;
- official docs link;
- generation provenance label shown.

---

# EPIC 8 — Robotics / Physical AI

## AECN-080 — Create robot/drone mission dataset
**Priority:** P1  
**Depends on:** AECN-003, AECN-010

### Acceptance
- start;
- waypoints;
- inspection targets;
- obstacle;
- alternate path;
- timeline.

---

## AECN-081 — Implement robot mission animation
**Priority:** P1  
**Depends on:** AECN-080

### Acceptance
- start/pause/reset;
- follows path;
- visits inspection targets;
- handles scripted obstacle event.

---

## AECN-082 — Add sensor visualization
**Priority:** P2  
**Depends on:** AECN-081

### Work
- camera frustum;
- LiDAR-style rays/point effect;
- optional sensor panel.

### Acceptance
Can toggle sensor views without major FPS loss.

---

## AECN-083 — Build Isaac Sim explainer
**Priority:** P1  
**Depends on:** AECN-081

### Acceptance
- explains simulation/testing/synthetic data;
- states browser mission is a workflow animation, not Isaac Sim;
- official link.

---

# EPIC 9 — Reality Capture

## AECN-090 — Choose and prepare reality-capture representation
**Priority:** P2  
**Depends on:** AECN-005

### Decision
Prefer point cloud if splat viewer is unstable/heavy.

### Acceptance
- asset licensed;
- optimized;
- loads lazily;
- documented fallback.

---

## AECN-091 — Implement capture-to-model visual sequence
**Priority:** P2  
**Depends on:** AECN-090

### Sequence
capture → points/splat → reconstructed surface → engineering overlay

### Acceptance
Sequence can be scrubbed or stepped manually.

---

## AECN-092 — Add plan-vs-capture comparison
**Priority:** P2  
**Depends on:** AECN-091

### Acceptance
- planned model opacity control;
- captured representation opacity control;
- clear educational explanation.

---

# EPIC 10 — Unified Digital Twin

## AECN-100 — Create digital-twin replay dataset
**Priority:** P1  
**Depends on:** AECN-003

### Acceptance
Replay contains:
- weather change;
- progress change;
- equipment states;
- sensor values;
- camera event;
- alert.

---

## AECN-101 — Build twin operations dashboard
**Priority:** P1  
**Depends on:** AECN-100, AECN-010

### Acceptance
- timeline/play;
- state cards;
- corresponding scene changes;
- alert focus action.

---

## AECN-102 — Add cross-mode deep links from twin
**Priority:** P2  
**Depends on:** AECN-101

### Examples
- click flood alert → flood mode/time;
- click camera alert → video timestamp;
- click equipment → logistics/robotics context.

### Acceptance
Transitions preserve relevant context.

---

# EPIC 11 — Local AI Copilot

## AECN-110 — Define copilot intent registry
**Priority:** P1  
**Depends on:** AECN-004

### Acceptance
Registry covers:
- mode navigation;
- layer visibility;
- wind;
- flood;
- video events;
- logistics;
- robotics;
- explanations;
- reset.

---

## AECN-111 — Implement deterministic command parser
**Priority:** P1  
**Depends on:** AECN-110

### Acceptance
- synonyms;
- normalized text;
- >30 test utterances;
- unsupported-command fallback.

---

## AECN-112 — Build copilot panel
**Priority:** P1  
**Depends on:** AECN-111

### Acceptance
- input;
- suggested commands;
- response;
- invoked action visible;
- mobile bottom sheet;
- info tooltip says no external LLM is required.

---

## AECN-113 — Add technology explanation intents
**Priority:** P1  
**Depends on:** AECN-111, AECN-023

### Examples
- explain PhysicsNeMo
- what is cuOpt
- does Omniverse replace Revit
- explain VSS
- explain Isaac Sim

### Acceptance
Responses use approved copy from content docs and link official references.

---

# EPIC 12 — Guided Narrative

## AECN-120 — Author final guided-tour script
**Priority:** P1  
**Depends on:** AECN-033, AECN-044, AECN-053, AECN-064, AECN-074, AECN-083

### Acceptance
Tour <= ~2 minutes when read/viewed continuously and touches all primary themes.

---

## AECN-121 — Connect tour steps to scene actions
**Priority:** P1  
**Depends on:** AECN-120, AECN-022

### Acceptance
Each stop:
- switches mode;
- sets camera;
- applies scenario;
- displays narration;
- can be skipped.

---

## AECN-122 — Add end-of-tour architecture reveal
**Priority:** P1  
**Depends on:** AECN-121, AECN-023

### Acceptance
Ends on unified diagram and “Explore freely”.

---

# EPIC 13 — Responsive, Accessibility, Performance

## AECN-130 — Mobile interaction pass
**Priority:** P1  
**Depends on:** primary modes complete

### Acceptance
- bottom-sheet navigation;
- tap targets;
- guided tour usable;
- low-quality default when necessary.

---

## AECN-131 — Accessibility pass
**Priority:** P1  
**Depends on:** primary modes complete

### Acceptance
- keyboard navigation;
- ARIA;
- focus;
- contrast;
- reduced motion;
- text alternatives.

---

## AECN-132 — Performance profiling and optimization
**Priority:** P1  
**Depends on:** primary modes complete

### Work
- bundle;
- asset sizes;
- draw calls;
- FPS;
- lazy loading;
- particle budgets.

### Acceptance
Performance report recorded in README or docs.

---

## AECN-133 — Progressive loading
**Priority:** P1  
**Depends on:** AECN-132

### Acceptance
- core scene first;
- video only when needed;
- reality capture only when needed;
- heavy result data only when mode opened.

---

# EPIC 14 — QA and Release

## AECN-140 — Unit test coverage for data and command logic
**Priority:** P1  
**Depends on:** data modules, copilot

### Acceptance
Tests cover schemas, parser, KPIs and scenario selection.

---

## AECN-141 — Playwright end-to-end suite
**Priority:** P1  
**Depends on:** all P1 modes

### Acceptance
Automates:
- enter;
- guided tour;
- one action each mode;
- copilot command;
- reset.

---

## AECN-142 — Visual regression screenshots
**Priority:** P2  
**Depends on:** all visual modes

### Acceptance
Deterministic screenshots for major modes.

---

## AECN-143 — Truthfulness/content audit
**Priority:** P0  
**Depends on:** all content

### Checklist
- no false live claims;
- all status badges;
- all engineering disclaimers;
- official links;
- correct product roles;
- route-data provenance;
- asset provenance.

### Acceptance
Signed checklist committed in docs.

---

## AECN-144 — Static production build and handoff
**Priority:** P0  
**Depends on:** AECN-140, AECN-141, AECN-143

### Acceptance
- clean install works;
- static build works;
- no secret env vars;
- no server required;
- README complete;
- all local assets included;
- screenshots included;
- known limitations documented.

---

# Suggested execution batches

## Batch 1
AECN-001 → 005

## Batch 2
AECN-010 → 015 + 020 → 023

## Batch 3
AECN-030 → 033

## Batch 4
AECN-040 → 053

## Batch 5
AECN-060 → 074

## Batch 6
AECN-080 → 092

## Batch 7
AECN-100 → 113

## Batch 8
AECN-120 → 133

## Batch 9
AECN-140 → 144

# Final instruction to implementation agent

Do not silently expand the project into a production platform.

When choosing between:
- a complex architecture that is technically “more real”, and
- a simple static interaction that communicates the NVIDIA AEC workflow accurately,

choose the simple static interaction for this project.
