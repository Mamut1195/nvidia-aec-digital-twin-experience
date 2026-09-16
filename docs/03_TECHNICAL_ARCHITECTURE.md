# 03 — Technical Architecture

## 1. Architecture goal

A static web application with no required backend.

```text
Static web host
      │
      ├── HTML/CSS/JS
      ├── GLB/KTX2/WebP assets
      ├── JSON scenario data
      ├── MP4/WebM demo footage
      └── precomputed result fields
             │
             ▼
          Browser
             │
      ┌──────┼─────────┐
      ▼      ▼         ▼
     UI   Three.js   Local logic
```

## 2. Recommended stack

Use the existing project stack if one already exists.

For a greenfield implementation:

- Astro with static output.
- TypeScript in strict mode.
- React for interactive islands.
- React Three Fiber.
- Drei utilities.
- Three.js.
- Small client-state library such as Zustand.
- Tailwind CSS or a similarly light styling system.
- Vitest.
- Playwright.

Avoid a global app framework/backend when Astro static is sufficient.

## 3. Why static

The user explicitly does not want infrastructure.

Static implementation gives:

- simple deployment;
- no secrets;
- no server lifecycle;
- no database;
- no authentication;
- easy embedding;
- predictable demo behavior.

## 4. Project tree

```text
/
├── src/
│   ├── components/
│   │   ├── shell/
│   │   ├── panels/
│   │   ├── tour/
│   │   └── common/
│   ├── experience/
│   │   ├── scene/
│   │   ├── controls/
│   │   ├── modes/
│   │   │   ├── overview/
│   │   │   ├── bim/
│   │   │   ├── structure/
│   │   │   ├── wind/
│   │   │   ├── flood/
│   │   │   ├── video-ai/
│   │   │   ├── logistics/
│   │   │   ├── robotics/
│   │   │   ├── reality/
│   │   │   └── twin/
│   │   ├── copilot/
│   │   └── state/
│   ├── content/
│   ├── lib/
│   │   ├── data/
│   │   ├── interpolation/
│   │   ├── query/
│   │   └── performance/
│   └── pages/
├── public/
│   ├── models/
│   ├── textures/
│   ├── data/
│   │   ├── bim/
│   │   ├── structural/
│   │   ├── wind/
│   │   ├── flood/
│   │   ├── weather/
│   │   ├── video/
│   │   ├── logistics/
│   │   ├── robotics/
│   │   └── reality/
│   └── media/
└── tests/
```

## 5. Global state

Suggested state:

```ts
type Mode =
  | "overview"
  | "bim"
  | "structure"
  | "wind"
  | "flood"
  | "video-ai"
  | "logistics"
  | "robotics"
  | "reality"
  | "twin";

interface ExperienceState {
  mode: Mode;
  selectedElementId?: string;
  quality: "auto" | "high" | "low";
  guidedTourActive: boolean;
  layerVisibility: Record<string, boolean>;
  scenarioState: Record<string, unknown>;
}
```

Keep mode data isolated rather than creating one giant store.

## 6. Scene architecture

Use one root scene.

```text
ExperienceScene
├── Environment
├── Terrain
├── ArchitectureGroup
├── StructureGroup
├── MEPGroup
├── TemporaryWorksGroup
├── EquipmentGroup
├── VehicleGroup
├── WorkerGroup
├── CameraMarkers
├── SensorMarkers
├── RobotLayer
├── ResultOverlay
└── Effects
```

Modes change:
- visibility;
- materials;
- overlays;
- animation state;
- camera focus.

Do not reload the entire scene between modes.

## 7. Asset policy

Prefer:
- GLB;
- Draco-compressed mesh where beneficial;
- KTX2 for large textures;
- WebP/AVIF for UI images;
- limited texture resolution;
- instancing for repeated objects.

Avoid:
- giant BIM exports;
- highly detailed bolts/rebar;
- 4K textures on minor assets;
- unnecessary photorealism.

The demo should feel clean and technical, not like an architectural-render benchmark.

## 8. Data adapters

Every module must read through a typed adapter.

Example:

```ts
interface ScenarioAdapter<T> {
  load(): Promise<T>;
  validate(data: unknown): T;
}
```

Reason:
future replacement of static demo data with a real backend or NVIDIA service should not require rewriting UI logic.

## 9. NVIDIA integration boundaries

### MVP
Do not require:
- Omniverse server;
- WebRTC Kit stream;
- NIM endpoint;
- cuOpt endpoint;
- PhysicsNeMo endpoint;
- VSS endpoint;
- Earth-2 endpoint;
- Isaac Sim runtime.

### Future adapters
Create interface boundaries only:

```text
WindDataProvider
  ├── StaticWindProvider   ← MVP
  └── PhysicsNeMoProvider  ← future

VideoInsightProvider
  ├── StaticEventProvider  ← MVP
  └── VSSProvider          ← future

OptimizationProvider
  ├── StaticRouteProvider  ← MVP
  └── CuOptProvider        ← future
```

Do not implement future providers unless they can be added without infrastructure.

## 10. Omniverse Web SDK

The real Omniverse Web SDK is relevant to a future streamed version because it manages WebRTC streams from Omniverse Kit applications.

It is **not required in the static MVP**.

The MVP should include an explainer showing the future architecture:

```text
Browser UI
   │
   │ WebRTC
   ▼
Omniverse Kit / GPU session
```

This separation is deliberate: the current demo remains easy to deploy while accurately explaining the path to a true streamed Omniverse experience.

## 11. Copilot architecture

No LLM needed.

```text
Text input
   ↓
normalize
   ↓
intent matcher
   ↓
action bus
   ↓
mode actions
```

Use:
- keywords;
- simple patterns;
- synonyms;
- deterministic response templates.

Supported intents should be documented in a JSON/TS registry.

## 12. Performance tiers

### High
- full shadows;
- higher particle count;
- post-processing if stable;
- detailed scene.

### Low
- reduced pixel ratio;
- no expensive post effects;
- reduced particles;
- simplified shadows;
- lower LOD.

### Auto
Select based on:
- device memory hints if available;
- viewport size;
- FPS sampling after load.

## 13. Error handling

Every data-driven mode must have:
- loading state;
- recoverable fallback;
- missing-data message;
- reset state.

The global experience must not crash because one scenario fails to load.
