# 05 — Feature Modules

## Module A — Overview

### Purpose
Orient the visitor and explain that all modes operate on one project.

### Required interactions
- orbit scene;
- click Start Guided Tour;
- select any mode;
- open ecosystem map.

### Acceptance
Visitor understands the project in <30 seconds.

---

## Module B — BIM / OpenUSD

### Purpose
Demonstrate multidisciplinary composition and object semantics.

### Features
- layer toggles;
- element picking;
- property inspector;
- level isolation;
- discipline isolation;
- OpenUSD composition explainer.

### OpenUSD explainer
Animate:

```text
architecture.usd ─┐
structure.usd    ─┤
mep.usd          ─┼─> composed project stage
terrain.usd      ─┤
equipment.usd    ─┘
```

Explain:
- layers;
- references;
- non-destructive composition;
- one project stage.

The browser does not need to parse USD in the MVP.

---

## Module C — Structural Results

### Purpose
Show that a digital twin can carry engineering result fields in addition to geometry.

### Features
- load-case selector;
- deformation animation;
- result heatmap;
- legend;
- click result to inspect value.

### Safety/content rule
Never say the demo proves structural safety.

Copy:
> Illustrative/precomputed result visualization. A real engineering workflow must use validated analysis models and applicable design codes.

---

## Module D — Wind / PhysicsNeMo

### Purpose
Explain solver + Physics AI surrogate workflow.

### Features
- wind-speed selector;
- direction selector;
- particle/streamline animation;
- facade pressure heatmap;
- pedestrian comfort overlay;
- “solver vs surrogate” diagram.

### Story
1. High-fidelity CFD produces trusted reference data.
2. PhysicsNeMo can be used to build/train Physics AI models.
3. Surrogate inference can make design exploration more responsive.
4. Validation against the reference solver remains necessary.

### Truth status
Default: `PRECOMPUTED`.

---

## Module E — Flood / Earth-2

### Purpose
Explain weather → engineering impact chain.

### Features
- rainfall scenario selector;
- time slider;
- flood-depth visualization;
- affected-road highlighting;
- affected-building list;
- weather card.

### Architecture explainer
```text
Earth-2 / weather forecast
            ↓
hydrology
            ↓
hydraulics
            ↓
flood depth + velocity
            ↓
digital twin impact view
```

The demo may use synthetic weather/hydraulic outputs.

---

## Module F — Construction Video AI / Metropolis VSS

### Purpose
Demonstrate natural-language access to construction footage.

### Features
- local video player;
- event chips;
- timestamp jumps;
- search;
- morning summary;
- event count;
- selected result preview.

### Supported queries
Use deterministic tags/synonyms.

Examples:
- concrete truck;
- delivery;
- excavator;
- crane;
- worker near equipment;
- idle;
- morning summary.

### NVIDIA explanation
Explain that real VSS uses video ingestion, VLM/LLM components, search/summarization and agent workflows; this browser demo uses a pre-indexed local event dataset.

---

## Module G — Logistics / cuOpt

### Purpose
Show decision optimization in a construction setting.

### Scenario
- 6 trucks;
- 2 loaders;
- 1 excavator;
- 3 delivery/work fronts;
- time windows;
- capacity constraints.

### Features
- baseline routes;
- optimized routes;
- side-by-side KPIs;
- animated vehicles;
- route/task inspection.

### KPI examples
- total distance;
- travel time;
- waiting;
- late tasks.

### Truth rule
Only call a route “cuOpt-generated” if it really was produced by cuOpt.
Otherwise:
`Precomputed optimization scenario inspired by cuOpt routing workflows.`

---

## Module H — Robotics / Isaac Sim

### Purpose
Explain Physical AI and construction robotics.

### Scenario
Inspection robot moves through site.

### Features
- mission start;
- waypoints;
- sensor cones;
- obstacle;
- reroute;
- camera/LiDAR-style visualization toggle;
- mission status timeline.

### Explainer
Real Isaac Sim:
- builds OpenUSD-based virtual environments;
- simulates robots/sensors;
- supports synthetic data and testing;
- can connect with robot-learning workflows.

MVP:
browser animation only.

---

## Module I — Reality Capture

### Purpose
Connect physical site capture to the digital world.

### Features
A visual morph/transition:
1. photo/capture;
2. points/splat;
3. reconstructed surface;
4. engineering overlay;
5. comparison against planned model.

### Use cases
- progress capture;
- existing conditions;
- inspection;
- as-built context;
- site reconstruction.

---

## Module J — Digital Twin

### Purpose
Combine design, field, operations and simulation layers.

### Features
- status cards;
- project progress;
- weather;
- equipment state;
- sensors;
- camera alerts;
- mode overlays;
- timeline replay.

### Key message
A digital twin is not simply a 3D model; it connects the spatial model with changing state/data and engineering context.

---

## Module K — Local AI Copilot

### Purpose
Show how an agent/harness can orchestrate the experience.

### No external model required

Supported commands trigger local actions.

Suggested intent registry:

```text
SHOW_LAYER
HIDE_LAYER
ISOLATE_LEVEL
SET_WIND
SET_FLOOD_TIME
SHOW_VIDEO_EVENT
OPTIMIZE_ROUTES
START_ROBOT
GO_TO_MODE
EXPLAIN_TECH
RESET
```

### Sample commands

- show only structure
- go to wind mode
- set extreme wind
- show flood at 60 minutes
- find concrete deliveries
- optimize routes
- start robot inspection
- explain Isaac Sim
- reset scene

### UI
Show:
- user command;
- concise response;
- action chips;
- “Demo command engine — no external LLM” in info tooltip.

---

## Module L — How NVIDIA Fits

### Purpose
Resolve “Does this replace Revit/Rhino?” confusion.

### Interactive map

```text
CREATE                    ANALYZE
Revit / Rhino / GIS       OpenSees / OpenFOAM / HEC
       \                     /
        \                   /
         ───── PROJECT DATA ─────
                    │
                 OpenUSD
                    │
               Omniverse layer
                    │
     ┌──────────────┼────────────────┐
     │              │                │
 PhysicsNeMo   Metropolis/VSS      Isaac
 Earth-2          cuOpt             NIM
     │              │                │
     └──────────────┼────────────────┘
                    │
             Digital Twin UX
                    │
                   Web
```

For every product include:
- what it is;
- AEC use;
- what it complements;
- what the current demo is showing;
- link to official documentation.
