import type { BimDataset, BimElement } from "@/lib/data/schemas/bim";
import {
  BAY_X_M,
  BAY_Z_M,
  BEAM_SECTION_M,
  BUILDING_HEIGHT_M,
  COLUMN_GRID_X,
  COLUMN_GRID_Z,
  COLUMN_SECTION_M,
  CRANE_POSITION,
  GRID_X_LABELS,
  GRID_Z_LABELS,
  SLAB_THICKNESS_M,
  STOREY_HEIGHT_M,
} from "@/experience/scene/coordinates";

export const DEMO_BIM_SOURCE = "Demo BIM dataset";
export const EXAMPLE_REVIT_SOURCE = "Example authoring source: Revit";

export interface BimElementRecord extends BimElement {
  position: [number, number, number];
  size: [number, number, number];
}

const PROJECT_ID = "urban-construction-demonstrator";

function levelId(level: number): string {
  return `L${String(level).padStart(2, "0")}`;
}

function gridLabel(xi: number, zi: number): string {
  return `${GRID_X_LABELS[xi]}${GRID_Z_LABELS[zi]}`;
}

function columnRecord(
  xi: number,
  zi: number,
  level: number,
  idOverride?: string,
): BimElementRecord {
  const label = gridLabel(xi, zi);
  const id = idOverride ?? `STR-COL-${levelId(level)}-${label}`;
  const y0 = (level - 1) * STOREY_HEIGHT_M;
  return {
    id,
    name: `Column ${label}`,
    category: "column",
    discipline: "structure",
    level: levelId(level),
    material: "Concrete 35 MPa",
    geometryNodeName: id.replaceAll("-", "_"),
    dimensions: "0.45 × 0.55 m",
    properties: {
      grid: `${GRID_X_LABELS[xi]}-${GRID_Z_LABELS[zi]}`,
      heightM: STOREY_HEIGHT_M,
    },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [COLUMN_GRID_X[xi], y0 + STOREY_HEIGHT_M / 2, COLUMN_GRID_Z[zi]],
    size: [COLUMN_SECTION_M.x + 0.12, STOREY_HEIGHT_M, COLUMN_SECTION_M.z + 0.12],
  };
}

function beamXRecord(
  xi: number,
  zi: number,
  level: number,
  id: string,
  name: string,
): BimElementRecord {
  const x0 = COLUMN_GRID_X[xi];
  const x1 = COLUMN_GRID_X[xi + 1];
  const y = level * STOREY_HEIGHT_M - SLAB_THICKNESS_M - BEAM_SECTION_M.depth / 2;
  return {
    id,
    name,
    category: "beam",
    discipline: "structure",
    level: levelId(level),
    material: "Steel S355",
    geometryNodeName: id.replaceAll("-", "_"),
    dimensions: `${BAY_X_M.toFixed(1)} × 0.30 × 0.50 m`,
    properties: {
      spanM: BAY_X_M,
      direction: "X",
      gridLine: GRID_Z_LABELS[zi],
    },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [(x0 + x1) / 2, y, COLUMN_GRID_Z[zi]],
    size: [BAY_X_M, 0.55, 0.42],
  };
}

function beamZRecord(
  xi: number,
  zi: number,
  level: number,
  id: string,
  name: string,
): BimElementRecord {
  const z0 = COLUMN_GRID_Z[zi];
  const z1 = COLUMN_GRID_Z[zi + 1];
  const y = level * STOREY_HEIGHT_M - SLAB_THICKNESS_M - BEAM_SECTION_M.depth / 2;
  return {
    id,
    name,
    category: "beam",
    discipline: "structure",
    level: levelId(level),
    material: "Steel S355",
    geometryNodeName: id.replaceAll("-", "_"),
    dimensions: `${BAY_Z_M.toFixed(1)} × 0.30 × 0.50 m`,
    properties: {
      spanM: BAY_Z_M,
      direction: "Z",
      gridLine: GRID_X_LABELS[xi],
    },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [COLUMN_GRID_X[xi], y, (z0 + z1) / 2],
    size: [0.42, 0.55, BAY_Z_M],
  };
}

function slabRecord(
  levelKey: string,
  name: string,
  y: number,
  thickness: number,
): BimElementRecord {
  return {
    id: `STR-SLAB-${levelKey}`,
    name,
    category: "slab",
    discipline: "structure",
    level: levelKey,
    material: "Concrete 35 MPa",
    geometryNodeName: `STR_SLAB_${levelKey}`,
    dimensions: `40.4 × ${thickness.toFixed(2)} × 30.4 m`,
    properties: {
      thicknessM: thickness,
      areaM2: 40.4 * 30.4,
    },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [0, y, 0],
    size: [40.4, thickness, 30.4],
  };
}

function coreWall(
  id: string,
  name: string,
  position: [number, number, number],
  size: [number, number, number],
): BimElementRecord {
  return {
    id,
    name,
    category: "core",
    discipline: "structure",
    level: "L01-L08",
    material: "Concrete 40 MPa",
    geometryNodeName: id.replaceAll("-", "_"),
    dimensions: `${size[0].toFixed(2)} × ${size[1].toFixed(1)} × ${size[2].toFixed(2)} m`,
    properties: {
      role: "shear-wall",
      thicknessM: Math.min(size[0], size[2]),
    },
    sourceLabel: DEMO_BIM_SOURCE,
    position,
    size,
  };
}

const COLUMN_SPECS: Array<[xi: number, zi: number, level: number, id?: string]> = [
  [0, 0, 1],
  [2, 0, 1, "STR-COL-L01-C01"],
  [5, 0, 1],
  [0, 4, 1],
  [5, 4, 1],
  [1, 1, 2],
  [3, 2, 2],
  [4, 3, 2],
  [0, 0, 3],
  [2, 2, 3],
  [5, 4, 3],
  [2, 2, 4],
  [0, 4, 4],
  [5, 0, 4],
  [1, 0, 5],
  [4, 4, 5],
  [3, 1, 6],
  [2, 3, 6],
  [0, 2, 7],
  [5, 2, 7],
];

const BEAMS: BimElementRecord[] = [
  beamXRecord(0, 0, 1, "STR-BEAM-L01-X-A1", "Beam A–B / L01"),
  beamZRecord(0, 0, 1, "STR-BEAM-L01-Z-A1", "Beam A 1–2 / L01"),
  beamXRecord(4, 0, 1, "STR-BEAM-L01-X-E1", "Beam E–F / L01"),
  beamXRecord(2, 2, 2, "STR-BEAM-L02-X-C3", "Beam C–D / L02"),
  beamZRecord(1, 0, 2, "STR-BEAM-L02-Z-B1", "Beam B 1–2 / L02"),
  beamXRecord(1, 1, 3, "STR-BEAM-L03-X-B2", "Beam B–C / L03"),
  beamZRecord(3, 2, 3, "STR-BEAM-L03-Z-D3", "Beam D 3–4 / L03"),
  beamXRecord(4, 4, 4, "STR-BEAM-L04-X-E5", "Beam E–F / L04"),
  beamZRecord(5, 1, 4, "STR-BEAM-L04-Z-F2", "Beam F 2–3 / L04"),
  beamXRecord(2, 1, 4, "STR-BEAM-L04-X-C2", "Beam C–D / L04"),
  beamXRecord(0, 3, 5, "STR-BEAM-L05-X-A4", "Beam A–B / L05"),
  beamZRecord(2, 3, 6, "STR-BEAM-L06-Z-C4", "Beam C 4–5 / L06"),
  beamXRecord(3, 0, 7, "STR-BEAM-L07-X-D1", "Beam D–E / L07"),
  beamXRecord(1, 2, 8, "STR-BEAM-L08-X-B3", "Beam B–C / L08"),
  beamZRecord(0, 1, 8, "STR-BEAM-L08-Z-A2", "Beam A 2–3 / L08"),
];

const SLABS: BimElementRecord[] = [
  slabRecord("L00", "Foundation slab L00", -0.4, 0.5),
  slabRecord("L01", "Slab L01", 1 * STOREY_HEIGHT_M - SLAB_THICKNESS_M / 2, SLAB_THICKNESS_M),
  slabRecord("L02", "Slab L02", 2 * STOREY_HEIGHT_M - SLAB_THICKNESS_M / 2, SLAB_THICKNESS_M),
  slabRecord("L03", "Slab L03", 3 * STOREY_HEIGHT_M - SLAB_THICKNESS_M / 2, SLAB_THICKNESS_M),
  slabRecord("L04", "Slab L04", 4 * STOREY_HEIGHT_M - SLAB_THICKNESS_M / 2, SLAB_THICKNESS_M),
  slabRecord("L05", "Slab L05", 5 * STOREY_HEIGHT_M - SLAB_THICKNESS_M / 2, SLAB_THICKNESS_M),
  slabRecord("L06", "Slab L06", 6 * STOREY_HEIGHT_M - SLAB_THICKNESS_M / 2, SLAB_THICKNESS_M),
  slabRecord("L07", "Slab L07", 7 * STOREY_HEIGHT_M - SLAB_THICKNESS_M / 2, SLAB_THICKNESS_M),
  slabRecord("L08", "Slab L08", 8 * STOREY_HEIGHT_M - SLAB_THICKNESS_M / 2, SLAB_THICKNESS_M),
  slabRecord("ROOF", "Roof slab", BUILDING_HEIGHT_M + 0.12, 0.24),
];

const WALLS: BimElementRecord[] = [
  coreWall(
    "STR-CORE-W-N",
    "North core wall",
    [0, BUILDING_HEIGHT_M / 2, -4],
    [8.4, BUILDING_HEIGHT_M, 0.4],
  ),
  coreWall(
    "STR-CORE-W-S",
    "South core wall",
    [0, BUILDING_HEIGHT_M / 2, 4],
    [8.4, BUILDING_HEIGHT_M, 0.4],
  ),
  coreWall(
    "STR-CORE-W-W",
    "West core wall",
    [-4, BUILDING_HEIGHT_M / 2, 0],
    [0.4, BUILDING_HEIGHT_M, 8],
  ),
  coreWall(
    "STR-CORE-W-E",
    "East core wall",
    [4, BUILDING_HEIGHT_M / 2, 0],
    [0.4, BUILDING_HEIGHT_M, 8],
  ),
  {
    id: "STR-WALL-L02-INT",
    name: "Interior partition L02",
    category: "wall",
    discipline: "structure",
    level: "L02",
    material: "Concrete 30 MPa",
    geometryNodeName: "STR_WALL_L02_INT",
    dimensions: "6.0 × 3.2 × 0.20 m",
    properties: { role: "partition", fireRating: "60 min" },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [10, 1.5 * STOREY_HEIGHT_M, 2],
    size: [6, 3.2, 0.2],
  },
  {
    id: "STR-WALL-L04-INT",
    name: "Interior partition L04",
    category: "wall",
    discipline: "structure",
    level: "L04",
    material: "Concrete 30 MPa",
    geometryNodeName: "STR_WALL_L04_INT",
    dimensions: "5.2 × 3.2 × 0.20 m",
    properties: { role: "partition", fireRating: "60 min" },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [-10, 3.5 * STOREY_HEIGHT_M, -2],
    size: [5.2, 3.2, 0.2],
  },
];

function facadeSouth(level: number, xi: number, id: string, name: string): BimElementRecord {
  const x0 = COLUMN_GRID_X[xi];
  const x1 = COLUMN_GRID_X[xi + 1];
  return {
    id,
    name,
    category: "facade",
    discipline: "architecture",
    level: levelId(level),
    material: "Curtain-wall glazing",
    geometryNodeName: id.replaceAll("-", "_"),
    dimensions: `${(BAY_X_M - 0.4).toFixed(2)} × ${(STOREY_HEIGHT_M - 0.3).toFixed(2)} × 0.12 m`,
    properties: { orientation: "south", uValue: 1.4 },
    sourceLabel: EXAMPLE_REVIT_SOURCE,
    position: [(x0 + x1) / 2, (level - 0.5) * STOREY_HEIGHT_M, 15.22],
    size: [BAY_X_M - 0.4, STOREY_HEIGHT_M - 0.3, 0.2],
  };
}

const ARCHITECTURE: BimElementRecord[] = [
  facadeSouth(1, 1, "ARC-FAC-S-L01", "South facade panel L01"),
  facadeSouth(3, 2, "ARC-FAC-S-L03", "South facade panel L03"),
  facadeSouth(5, 3, "ARC-FAC-S-L05", "South facade panel L05"),
  {
    id: "ARC-FAC-E-L02",
    name: "East facade panel L02",
    category: "facade",
    discipline: "architecture",
    level: "L02",
    material: "Curtain-wall glazing",
    geometryNodeName: "ARC_FAC_E_L02",
    dimensions: `${(BAY_Z_M - 0.4).toFixed(2)} × ${(STOREY_HEIGHT_M - 0.3).toFixed(2)} × 0.12 m`,
    properties: { orientation: "east", uValue: 1.4 },
    sourceLabel: EXAMPLE_REVIT_SOURCE,
    position: [20.22, 1.5 * STOREY_HEIGHT_M, (COLUMN_GRID_Z[1] + COLUMN_GRID_Z[2]) / 2],
    size: [0.2, STOREY_HEIGHT_M - 0.3, BAY_Z_M - 0.4],
  },
  {
    id: "ARC-SPACE-L01-LOBBY",
    name: "Lobby space L01",
    category: "space",
    discipline: "architecture",
    level: "L01",
    material: "Architectural space",
    geometryNodeName: "ARC_SPACE_L01_LOBBY",
    dimensions: "16.0 × 3.6 × 12.0 m",
    properties: { occupancy: "lobby", areaM2: 192 },
    sourceLabel: EXAMPLE_REVIT_SOURCE,
    position: [0, STOREY_HEIGHT_M / 2, 8],
    size: [16, 3.4, 12],
  },
  {
    id: "ARC-PARAPET-ROOF",
    name: "Roof parapet",
    category: "other",
    discipline: "architecture",
    level: "ROOF",
    material: "Architectural concrete",
    geometryNodeName: "ARC_PARAPET_ROOF",
    dimensions: "40.8 × 0.70 × 0.18 m",
    properties: { role: "parapet" },
    sourceLabel: EXAMPLE_REVIT_SOURCE,
    position: [0, BUILDING_HEIGHT_M + 0.35, 15.15],
    size: [40.8, 0.7, 0.18],
  },
];

const MEP: BimElementRecord[] = [
  {
    id: "MEP-DUCT-L03",
    name: "Supply duct L03",
    category: "duct",
    discipline: "mep",
    level: "L03",
    material: "Galvanized steel",
    geometryNodeName: "MEP_DUCT_L03",
    dimensions: "18.0 × 0.50 × 0.72 m",
    properties: { system: "supply-air", airflowLs: 1800 },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [6, 3 * STOREY_HEIGHT_M - 0.7, 8],
    size: [18, 0.6, 0.8],
  },
  {
    id: "MEP-DUCT-L05",
    name: "Supply duct L05",
    category: "duct",
    discipline: "mep",
    level: "L05",
    material: "Galvanized steel",
    geometryNodeName: "MEP_DUCT_L05",
    dimensions: "18.0 × 0.50 × 0.72 m",
    properties: { system: "supply-air", airflowLs: 1600 },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [6, 5 * STOREY_HEIGHT_M - 0.7, 8],
    size: [18, 0.6, 0.8],
  },
  {
    id: "MEP-PIPE-L03",
    name: "Hydronic pipe L03",
    category: "pipe",
    discipline: "mep",
    level: "L03",
    material: "Steel pipe",
    geometryNodeName: "MEP_PIPE_L03",
    dimensions: "Ø 0.24 × 16.0 m",
    properties: { system: "chw", diameterMm: 240 },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [-8, 3 * STOREY_HEIGHT_M - 0.75, -6],
    size: [16, 0.28, 0.28],
  },
  {
    id: "MEP-AHU-R01",
    name: "Roof AHU-1",
    category: "equipment",
    discipline: "mep",
    level: "ROOF",
    material: "Packaged AHU",
    geometryNodeName: "MEP_AHU_R01",
    dimensions: "4.2 × 1.8 × 2.6 m",
    properties: { duty: "AHU-1", airflowLs: 4200 },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [8, BUILDING_HEIGHT_M + 1.1, 4],
    size: [4.2, 1.8, 2.6],
  },
  {
    id: "MEP-AHU-R02",
    name: "Roof AHU-2",
    category: "equipment",
    discipline: "mep",
    level: "ROOF",
    material: "Packaged AHU",
    geometryNodeName: "MEP_AHU_R02",
    dimensions: "3.4 × 1.5 × 2.2 m",
    properties: { duty: "AHU-2", airflowLs: 2800 },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [-7, BUILDING_HEIGHT_M + 1.0, -4],
    size: [3.4, 1.5, 2.2],
  },
  {
    id: "MEP-RISER-01",
    name: "Services riser",
    category: "other",
    discipline: "mep",
    level: "L01-L08",
    material: "Mixed services",
    geometryNodeName: "MEP_RISER_01",
    dimensions: "0.70 × 22.0 × 0.70 m",
    properties: { systems: "power-data-wet" },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [5.6, 12, 0],
    size: [0.7, 22, 0.7],
  },
];

const SITE_EQUIPMENT: BimElementRecord[] = [
  {
    id: "EQP-CRANE-01",
    name: "Tower crane",
    category: "equipment",
    discipline: "equipment",
    level: "SITE",
    material: "Construction plant",
    geometryNodeName: "EQP_CRANE_01",
    dimensions: "2.2 × 42.0 × 2.2 m",
    properties: { role: "tower-crane" },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [CRANE_POSITION[0], 21, CRANE_POSITION[2]],
    size: [2.2, 42, 2.2],
  },
  {
    id: "EQP-TRUCK-01",
    name: "Delivery truck 01",
    category: "equipment",
    discipline: "equipment",
    level: "SITE",
    material: "Construction plant",
    geometryNodeName: "EQP_TRUCK_01",
    dimensions: "2.4 × 2.6 × 6.4 m",
    properties: { role: "delivery" },
    sourceLabel: DEMO_BIM_SOURCE,
    position: [-22, 1.4, -10],
    size: [2.4, 2.6, 6.4],
  },
];

export const DEMO_BIM_ELEMENTS: BimElementRecord[] = [
  ...COLUMN_SPECS.map(([xi, zi, level, id]) => columnRecord(xi, zi, level, id)),
  ...BEAMS,
  ...SLABS,
  ...WALLS,
  ...ARCHITECTURE,
  ...MEP,
  ...SITE_EQUIPMENT,
];

function withoutGeometry(element: BimElementRecord): BimElement {
  const { position: _position, size: _size, ...published } = element;
  return published;
}

export function createDemoBimDataset(): BimDataset {
  return {
    projectId: PROJECT_ID,
    units: "meters",
    elements: DEMO_BIM_ELEMENTS.map(withoutGeometry),
  };
}

export const DEMO_BIM_DATASET = createDemoBimDataset();

export function getBimElementRecord(id: string): BimElementRecord | undefined {
  return DEMO_BIM_ELEMENTS.find((element) => element.id === id);
}

export function uniqueBimLevels(
  elements: readonly BimElement[] = DEMO_BIM_DATASET.elements,
): string[] {
  return [...new Set(elements.map((element) => element.level))].sort((a, b) => a.localeCompare(b));
}

export function uniqueBimDisciplines(
  elements: readonly BimElement[] = DEMO_BIM_DATASET.elements,
): string[] {
  return [...new Set(elements.map((element) => element.discipline))];
}
