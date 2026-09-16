# 01 — Product Specification

## 1. Product name

Working name:

**NVIDIA AEC Digital Twin Experience**

Optional public subtitle:

**From BIM to Physical AI**

Do not imply the experience is an official NVIDIA product. Include a small footer note:

> Independent educational AEC demo. NVIDIA product names and trademarks belong to NVIDIA Corporation.

## 2. Product goal

Create one public interactive web experience that demonstrates the most important ways the NVIDIA ecosystem can be applied to AEC.

The goal is educational clarity and visual impact, not production engineering accuracy.

## 3. Primary audience

- Civil engineers.
- Structural engineers.
- Architects.
- BIM professionals.
- Construction managers.
- AEC software developers.
- Students and technical decision-makers.

Assume many visitors know Revit, Rhino, Civil 3D, ETABS, OpenSees or GIS, but do not understand how NVIDIA fits into that ecosystem.

## 4. Core product question

The demo must answer:

> “What could NVIDIA actually do in an AEC workflow, and how is that different from Revit, Rhino or engineering solvers?”

## 5. Core message

NVIDIA should be presented as an enabling stack rather than as a BIM authoring replacement.

Simplified mental model:

```text
AUTHORING / ENGINEERING
Revit · Rhino · Civil 3D · GIS · OpenSees · OpenFOAM · HEC tools
                         ↓
                DATA / WORLD MODEL
                   OpenUSD concept
                         ↓
              NVIDIA-ACCELERATED LAYER
 Visualization · Physics AI · Video AI · Optimization · Robotics
                         ↓
                  DIGITAL TWIN UX
                         ↓
                        WEB
```

## 6. Single-scene strategy

Do not create separate mini-apps.

Create one cohesive scene:

### “Urban Construction Demonstrator”

It contains:

- an 8-storey mixed-use building;
- visible structural frame;
- partial facade/architectural envelope;
- a small MEP subset;
- a tower crane;
- excavator;
- 6–12 trucks/vehicles;
- temporary construction zones;
- workers represented by low-detail figures or icons;
- 2–3 site cameras;
- a robot inspection route;
- adjacent roads;
- a sloped terrain area;
- drainage/low point for flood visualization;
- a small completed building or adjacent context;
- staging/material areas.

The same geometry should support all demonstration modes.

## 7. Required modes

### 7.1 Overview
Explains the project and lets the visitor start a guided tour or explore freely.

### 7.2 BIM / OpenUSD
Shows discipline layers and object metadata.

### 7.3 Structural
Shows structural elements, load-path concept, deformation/result heatmaps.

### 7.4 Wind / Physics AI
Shows precomputed or synthetic wind fields and explains solver → surrogate workflow.

### 7.5 Flood / Earth-2 Workflow
Shows rain/weather scenario → hydrology/hydraulics → flood impact.

### 7.6 Construction Video AI
Shows archived site video, event timeline, natural-language-style search and incident/event retrieval.

### 7.7 Logistics / cuOpt
Shows trucks, tasks, routes, resource assignment and optimized-vs-baseline KPIs.

### 7.8 Robotics / Isaac
Shows an inspection robot/drone path, sensors and autonomy/simulation concepts.

### 7.9 Reality Capture
Shows a point cloud / scan / Gaussian-splat-like representation transitioning into an engineering scene.

### 7.10 Digital Twin
Combines live-looking—but clearly labeled demo—sensor/state overlays in one operational view.

### 7.11 AI Copilot
A deterministic local command interface that controls existing demo actions.

### 7.12 How NVIDIA Fits
An explainer panel mapping each capability to the NVIDIA product and the conventional AEC tool it complements.

## 8. Explicit non-goals

This MVP is not:

- a real BIM editor;
- a Revit replacement;
- a production digital-twin platform;
- a structural solver;
- a CFD solver;
- a weather forecasting system;
- a safety certification tool;
- a live CCTV analytics system;
- a fleet dispatch system;
- a robotics simulator;
- an LLM product;
- an infrastructure deployment.

## 9. Visitor journey

### Fast path — 90 seconds

1. Landing/hero.
2. Enter experience.
3. Guided tour highlights:
   - BIM layers.
   - wind.
   - video AI.
   - logistics.
   - robot.
4. End on unified digital twin.
5. Display architecture map.

### Exploration path — 5–10 minutes

Visitor freely switches modes, manipulates scenario controls and uses the local copilot.

## 10. Success metrics for the demo itself

No analytics infrastructure is required. Judge success through product behavior:

- First meaningful interaction < 5 seconds after scene loads.
- Every mode has at least one obvious interactive control.
- Every mode has a “Why NVIDIA?” explanation.
- No mode requires technical setup.
- No mode shows an empty state.
- No mode falsely represents mocked computation as live.
- Desktop experience is excellent.
- Tablet is usable.
- Mobile has a simplified but functional fallback.

## 11. Definition of done

The project is complete when:

- all required modes are implemented;
- guided tour works end to end;
- free exploration works;
- the same scene is reused;
- local assets load reliably;
- there is no authentication/backend dependency;
- static production build succeeds;
- all truth-status labels are visible;
- performance budgets in QA doc are met or documented;
- official NVIDIA technology references are linked from the explainer panel.
