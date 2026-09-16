# 04 — Scene and Data Specification

## 1. Scene brief

Create a compact “urban construction demonstrator” rather than a full city.

### Required geometry

#### Main building
- approximately 8 storeys;
- structural grid visible;
- columns;
- beams;
- slabs;
- core/shear walls;
- partial facade;
- small MEP sample;
- roof plant.

#### Site
- tower crane;
- excavator;
- staging area;
- concrete/material delivery zone;
- temporary fencing;
- site office;
- storage zones;
- workers/icons.

#### Context
- 2–3 roads;
- intersection;
- sidewalks;
- several low-detail context buildings;
- terrain slope;
- low-lying floodable zone;
- drainage channel/inlet concept.

#### Smart/site systems
- 3 camera markers;
- 4–6 sensor markers;
- inspection robot route;
- drone waypoint path.

## 2. Asset sourcing

Preferred order:

1. Procedurally create simple geometry.
2. Use permissively licensed assets with recorded attribution.
3. Use original assets created specifically for the demo.

Do not copy proprietary Revit sample models or commercial assets without permission.

Add `public/assets/ATTRIBUTION.md`.

## 3. Coordinate conventions

Use:
- meters;
- Y-up or Three.js-native convention consistently;
- site origin near building center;
- coordinates documented in one file.

## 4. Semantic IDs

Every selectable engineering element needs a stable ID.

Example:

```json
{
  "id": "STR-COL-L04-C32",
  "category": "column",
  "discipline": "structure",
  "level": "L04",
  "material": "Concrete 35 MPa",
  "dimensions": "0.40 × 0.60 m",
  "source": "Demo BIM dataset"
}
```

Do not claim “Source: Revit” unless the demo asset actually came from Revit.
If illustrating a workflow, use:
`Example authoring source: Revit`.

## 5. BIM dataset

`public/data/bim/elements.json`

Minimum 60 selectable elements:
- 20 columns;
- 15 beams;
- 10 slabs;
- 4–8 walls/core elements;
- 5 architectural elements;
- 5 MEP objects.

Fields:
- id;
- name;
- category;
- discipline;
- level;
- material;
- geometry node name;
- properties;
- source label.

## 6. Structural dataset

`public/data/structural/`

Scenarios:
- gravity;
- lateral-x;
- lateral-y.

Per element:
- displacement scalar;
- utilization-like educational scalar;
- axial-force-like scalar.

Important:
These values are illustrative unless generated with a real solver.
UI copy must say:
`Illustrative structural-result field — not a design check.`

## 7. Wind dataset

Recommended MVP structure:

```text
wind/
├── manifest.json
├── low_0.json
├── low_90.json
├── design_0.json
├── design_90.json
├── extreme_0.json
└── extreme_90.json
```

Data can contain:
- sample points;
- velocity vectors;
- normalized pressure on facade panels;
- pedestrian comfort zones.

The field may be synthetic but must look physically plausible.

If a real OpenFOAM dataset is available later, replace static files without UI changes.

## 8. Flood dataset

Use a time series of water depths over a simplified ground grid.

```text
flood/
├── 20mmh.json
├── 50mmh.json
└── 100mmh.json
```

Each:
- time steps;
- depth grid or polygons;
- affected roads;
- exposed-building IDs.

Visualize:
- water plane/polygons;
- depth legend;
- road status;
- affected assets.

## 9. Weather/Earth-2 educational dataset

Do not pretend to run live Earth-2.

Create scenario metadata:

```json
{
  "scenario": "SevereConvectiveDemo",
  "rainfallMmH": 100,
  "windMs": 18,
  "sourceType": "WORKFLOW DEMO",
  "explanation": "Illustrative weather input representing the kind of forecast data that can feed downstream engineering workflows."
}
```

## 10. Video AI dataset

Use one short local construction video or original staged/stock-permitted video.

`events.json`:

```json
[
  {
    "id": "evt-001",
    "start": 12.4,
    "end": 24.8,
    "type": "concrete_delivery",
    "objects": ["truck"],
    "summary": "Concrete delivery truck enters the site.",
    "tags": ["concrete", "delivery", "truck"]
  }
]
```

Create at least:
- concrete delivery;
- excavator work;
- crane activity;
- worker-equipment proximity;
- idle-equipment interval;
- material delivery.

## 11. Logistics dataset

Site nodes:
- gate;
- batching/delivery point;
- excavation;
- storage;
- building zones A/B/C.

Create:
- baseline routes;
- optimized routes;
- tasks;
- vehicle capacities;
- time windows;
- KPI summaries.

Clearly label optimized solution as:
- `precomputed cuOpt-style demo`, if not generated with cuOpt;
or
- `generated with NVIDIA cuOpt`, only if actually produced with cuOpt.

## 12. Robotics dataset

Mission:
`Inspect columns on Levels 1–2 and return to charging point.`

Store:
- waypoints;
- timestamps;
- sensor events;
- obstacle insertion;
- rerouted path.

The robot simulation in browser is an animation of a mission, not Isaac Sim running in-browser.

## 13. Reality capture dataset

Preferred MVP options:

### Option A
Low-density point cloud rendered with Three.js.

### Option B
Small permissively licensed Gaussian-splat asset using a browser viewer if performance is acceptable.

### Option C
Stylized photo → point cloud → mesh transition using prebuilt assets.

Do not let this mode destabilize the main demo. If splat integration becomes fragile, use Option A.

## 14. Digital-twin replay data

Create a 3–5 minute replay loop:

- project progress;
- weather;
- equipment active/idle;
- sensor values;
- camera event;
- one alert.

All data is local.

## 15. Data validation

Use Zod or equivalent runtime schema validation for all static JSON.

Failure behavior:
- mode displays a readable error panel;
- global scene continues to work.
