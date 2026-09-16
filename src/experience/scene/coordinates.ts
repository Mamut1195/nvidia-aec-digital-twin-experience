/**
 * Scene coordinate system for the urban construction demonstrator.
 *
 * - Units: meters
 * - Up axis: +Y (Three.js native)
 * - Origin: centroid of the main building on the ground plane (y = 0)
 * - +X east, +Y up, +Z south (so −Z is the north / crane side)
 *
 * This module is the documented source of truth. A JSON snapshot lives at
 * `public/data/scene/coordinates.json` for non-code readers.
 */

export const SCENE_UNITS = "meters" as const;
export const SCENE_UP_AXIS = "y" as const;
export const SCENE_ORIGIN = "building-center" as const;

export const SCENE_AXES = {
  x: "east",
  y: "up",
  z: "south",
} as const;

export const STOREY_COUNT = 8;
export const STOREY_HEIGHT_M = 3.6;
export const BUILDING_SIZE_M = { x: 40, z: 30 } as const;
export const BUILDING_HEIGHT_M = STOREY_COUNT * STOREY_HEIGHT_M;

export const COLUMN_GRID_X = [-20, -12, -4, 4, 12, 20] as const;
export const COLUMN_GRID_Z = [-15, -7.5, 0, 7.5, 15] as const;
export const GRID_X_LABELS = ["A", "B", "C", "D", "E", "F"] as const;
export const GRID_Z_LABELS = ["1", "2", "3", "4", "5"] as const;

export const COLUMN_SECTION_M = { x: 0.45, z: 0.55 } as const;
export const BEAM_SECTION_M = { width: 0.3, depth: 0.5 } as const;
export const SLAB_THICKNESS_M = 0.28;
export const BAY_X_M = 8;
export const BAY_Z_M = 7.5;

export const BUILDING_AABB = {
  min: [-20.5, 0, -15.5] as [number, number, number],
  max: [20.5, BUILDING_HEIGHT_M + 2.8, 15.5] as [number, number, number],
};

export const SITE_EXTENTS_M = {
  x: [-50, 72],
  z: [-58, 58],
} as const;

export const FENCE_BOUNDS_M = {
  minX: -34,
  maxX: 30,
  minZ: -40,
  maxZ: 24,
} as const;

export const CRANE_POSITION: [number, number, number] = [4, 0, -32];
export const EXCAVATOR_POSITION: [number, number, number] = [-26, 0, 8];
export const EXCAVATION_PIT_POSITION: [number, number, number] = [-26, -1.1, 12];

export const SCENE_COORDINATES = {
  units: SCENE_UNITS,
  upAxis: SCENE_UP_AXIS,
  origin: SCENE_ORIGIN,
  axes: SCENE_AXES,
  storeyCount: STOREY_COUNT,
  storeyHeightM: STOREY_HEIGHT_M,
  buildingSizeM: BUILDING_SIZE_M,
  buildingHeightM: BUILDING_HEIGHT_M,
  columnGridXm: [...COLUMN_GRID_X],
  columnGridZm: [...COLUMN_GRID_Z],
  siteExtentsM: {
    x: [...SITE_EXTENTS_M.x],
    z: [...SITE_EXTENTS_M.z],
  },
  cranePositionM: [...CRANE_POSITION],
  excavatorPositionM: [...EXCAVATOR_POSITION],
} as const;

export function storeyElevationM(level: number): number {
  return level * STOREY_HEIGHT_M;
}

export function isOutsideAabb(
  point: readonly [number, number, number],
  min: readonly [number, number, number],
  max: readonly [number, number, number],
  margin = 0,
): boolean {
  return (
    point[0] < min[0] - margin ||
    point[0] > max[0] + margin ||
    point[1] < min[1] - margin ||
    point[1] > max[1] + margin ||
    point[2] < min[2] - margin ||
    point[2] > max[2] + margin
  );
}
