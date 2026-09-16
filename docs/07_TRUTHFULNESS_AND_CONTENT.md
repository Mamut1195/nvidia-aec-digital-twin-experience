# 07 — Truthfulness, Content and Technology Labels

## 1. Why this document exists

The demo is intentionally showing capabilities that, in a real system, would involve GPU services, engineering solvers or NVIDIA runtimes.

Because the MVP has no backend/infrastructure, the product must clearly distinguish:
- real browser interaction;
- precomputed results;
- conceptual workflow demonstrations.

## 2. Mandatory status labels

Every mode must show one:

### INTERACTIVE WEB
The browser is actually performing the shown interaction.

Examples:
- object selection;
- layer visibility;
- animation;
- local route playback;
- local query matching.

### PRECOMPUTED
Results were generated or authored in advance.

Examples:
- wind field;
- structural result;
- flood depth;
- route solution.

### WORKFLOW DEMO
The UI demonstrates how a real workflow would be orchestrated.

Examples:
- Earth-2 → hydrology → flood;
- Isaac Sim robot simulation;
- VSS analysis pipeline;
- Omniverse streaming architecture.

## 3. Forbidden claims

Do not write:
- “Live PhysicsNeMo simulation” unless it actually is.
- “Live Earth-2 forecast” unless it actually is.
- “VSS is analyzing this video now” unless it actually is.
- “Isaac Sim running in your browser” unless it actually is.
- “cuOpt optimized this route” unless cuOpt actually generated it.
- “Revit model” unless the asset came from Revit.
- “structurally safe” or “code compliant”.
- “real-time digital twin” for a replay-only dataset.

## 4. Preferred wording

Use:
- “This mode demonstrates…”
- “Precomputed result…”
- “Illustrative dataset…”
- “A production workflow could connect…”
- “NVIDIA PhysicsNeMo can be used to…”
- “A real VSS deployment would…”
- “This browser demo replays an indexed event dataset…”

## 5. Product positioning

### Revit / Rhino
Describe as authoring/design tools.

### OpenSees/OpenFOAM/HEC tools
Describe as domain engineering solvers/tools where appropriate.

### OpenUSD
Describe as a framework/file format/ecosystem for composing complex 3D scene data.

### Omniverse
Describe current NVIDIA Omniverse as libraries, APIs, SDKs and services used to build industrial digital-twin and Physical-AI applications.

### PhysicsNeMo
Describe as open-source Physics AI framework for building/training/inference of physics-ML models.

### Metropolis
Describe as NVIDIA stack for video analytics AI agents/applications from edge to cloud.

### VSS
Describe as NVIDIA blueprint for video search, summarization and interactive Q&A.

### Earth-2
Describe as NVIDIA family/platform of open weather/climate AI models, libraries and frameworks.

### cuOpt
Describe as open-source GPU-accelerated decision optimization engine.

### Isaac Sim
Describe as open-source reference framework built on Omniverse libraries for robotics simulation, testing and synthetic data.

### NIM
Describe as NVIDIA inference microservices used to deploy optimized AI models.

## 6. “What competes with what?” explainer

Use the following language:

- Omniverse does not primarily replace Revit or Rhino authoring.
- OpenUSD/Omniverse can sit downstream or alongside authoring and simulation tools.
- Bentley iTwin and Autodesk Tandem may overlap more directly in digital-twin territory, although architectures and focus differ.
- Twinmotion/Unreal overlap in visualization/real-time 3D, while Omniverse emphasizes industrial data composition, simulation and Physical AI.
- Engineering solvers remain authoritative for the analyses they implement; Physics AI can augment/accelerate selected workflows after validation.

## 7. Source links in UI

The “Learn from NVIDIA” drawer should link only to official documentation/resources.

See `10_REFERENCES.md`.

## 8. Legal/brand note

Footer:

> Independent educational demonstration. NVIDIA, Omniverse, CUDA, RTX, PhysicsNeMo, Metropolis, Earth-2, cuOpt, Isaac and related marks are trademarks and/or product names of NVIDIA Corporation. Other product names belong to their respective owners.

Do not use an NVIDIA logo unless usage rights are clear.
Text labels are sufficient.
