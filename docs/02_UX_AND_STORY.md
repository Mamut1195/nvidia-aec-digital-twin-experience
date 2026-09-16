# 02 — UX and Story

## 1. Design principle

The experience should feel like a **future construction control room**, not like a documentation website.

The 3D world is the primary canvas.

Text explains only what the visitor is currently seeing.

## 2. Main layout

Desktop:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ NVIDIA AEC EXPERIENCE              MODE                         ?        │
├──────────────┬──────────────────────────────────────┬────────────────────┤
│              │                                      │                    │
│ MODE RAIL    │              3D WORLD                │ CONTEXT / COPILOT  │
│              │                                      │                    │
│ Overview     │                                      │                    │
│ BIM          │                                      │                    │
│ Structure    │                                      │                    │
│ Wind         │                                      │                    │
│ Flood        │                                      │                    │
│ Video AI     │                                      │                    │
│ Logistics    │                                      │                    │
│ Robotics     │                                      │                    │
│ Reality      │                                      │                    │
│ Twin         │                                      │                    │
│              │                                      │                    │
└──────────────┴──────────────────────────────────────┴────────────────────┘
```

The right panel changes by mode.

## 3. Global UI

Persistent:

- product title;
- mode rail;
- 3D viewport;
- reset camera;
- guided tour button;
- performance quality selector: Auto / High / Low;
- truth-status badge;
- “How this works” button.

Optional:

- fullscreen;
- audio off by default.

## 4. Landing

Hero copy:

**NVIDIA × AEC**
**From BIM to Physical AI**

Short text:

> Explore how digital twins, Physics AI, video intelligence, optimization and robotics can converge around one construction project.

Primary CTA:

**Enter the Digital Twin**

Secondary:

**Take the 90-second guided tour**

Below hero, show a short ecosystem strip:

`OpenUSD · Omniverse · PhysicsNeMo · Metropolis · Earth-2 · cuOpt · Isaac`

## 5. Guided tour

The guided tour is a deterministic sequence.

### Stop 1 — One project, many disciplines
Camera orbits building.
Architecture, structure and MEP layers toggle.

Message:
> AEC data starts in specialized authoring and engineering tools. OpenUSD provides a composition model for bringing complex 3D worlds together.

### Stop 2 — Physics
Switch to wind mode.
Particles/streamlines animate.

Message:
> Traditional solvers can generate high-fidelity training/reference data. Physics AI can learn surrogate behavior for rapid exploration.

### Stop 3 — Weather and flooding
Rain intensity changes and flood surface advances.

Message:
> Weather AI can inform downstream hydrology and hydraulic workflows; the digital twin becomes the place where impact is visualized.

### Stop 4 — Construction video
Open camera panel and retrieve an event.

Message:
> Video AI agents can search, summarize and reason about construction footage.

### Stop 5 — Optimization
Baseline vehicle routes become optimized routes.

Message:
> GPU-accelerated optimization can help explore routing and resource-allocation problems.

### Stop 6 — Physical AI
Robot inspection path runs.

Message:
> Simulation environments let teams test robots, sensors and autonomy before deployment.

### Stop 7 — Unified twin
All relevant operational layers return.

Message:
> The value is not one isolated feature. It is the ability to connect design, simulation, field data and intelligent systems around a common digital world.

End CTA:
**Explore freely**

## 6. Mode-specific UX

### BIM
Controls:
- Architecture.
- Structure.
- MEP.
- Terrain.
- Temporary works.
- Equipment.

Click an element to inspect:
- name;
- category;
- level;
- material;
- dimensions;
- source application;
- stable demo ID.

Include:
**OpenUSD composition view** button.

### Structure
Controls:
- Load case.
- Deformation scale.
- Result type: displacement / utilization concept / axial-force concept.

Do not represent engineering values as code-compliant design results.
Use clear “illustrative/precomputed” label.

### Wind
Controls:
- direction: 0/90/180/270 or continuous knob;
- velocity scenario: Low / Design / Extreme;
- visualization: streamlines / facade pressure / pedestrian zone.

Show:
- source/reference solver;
- PhysicsNeMo conceptual surrogate;
- current result status.

### Flood
Controls:
- rainfall: 20 / 50 / 100 mm/h scenario;
- time slider;
- show roads;
- show buildings at risk;
- show drainage.

Weather card:
- precipitation;
- wind;
- short scenario description.

### Video AI
Layout:
- local video player;
- event timeline;
- query field;
- suggested questions;
- result cards with timestamps.

Example prompts:
- “Show concrete deliveries.”
- “When was the excavator active?”
- “Show worker–equipment proximity events.”
- “Summarize the morning.”

The query engine can be deterministic and local.

### Logistics
Controls:
- baseline / optimized;
- task filter;
- play dispatch animation.

KPIs:
- total distance;
- estimated travel time;
- waiting time;
- number of vehicles.

Values may be synthetic but internally consistent.

### Robotics
Controls:
- inspection mission;
- sensor view;
- show planned path;
- introduce obstacle;
- replay reroute.

Use an animated robot or drone proxy.

### Reality Capture
Controls:
- photo/scan;
- points/splat;
- mesh;
- engineering overlay.

Tell a visual story:
`REALITY → RECONSTRUCTION → ENGINEERING CONTEXT`

### Digital Twin
Combine:
- progress;
- weather;
- selected sensors;
- active equipment;
- alerts;
- schedule/progress indicator.

All data is static/replayed unless otherwise stated.

### AI Copilot
The copilot does not require an LLM.

It parses supported intents and triggers actions.

Examples:
- “show structure”
- “hide architecture”
- “set wind to extreme”
- “show flood at 60 minutes”
- “optimize routes”
- “show concrete deliveries”
- “start robot inspection”
- “explain PhysicsNeMo”

When unsupported:
> This demo copilot supports commands related to the current interactive scenarios. Try one of these…

## 7. Mobile

Do not attempt desktop parity.

Mobile:
- 3D viewport.
- bottom-sheet mode selector.
- simplified controls.
- no persistent right rail.
- guided tour prioritized.
- lower geometry/particles.

## 8. Accessibility

- Keyboard mode switching.
- Focus-visible controls.
- ARIA labels.
- Never communicate result status using color alone.
- Reduced-motion mode.
- Text alternative for important 3D-only insights.
