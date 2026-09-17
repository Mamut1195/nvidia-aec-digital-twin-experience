import {
  BAY_X_M,
  BAY_Z_M,
  BEAM_SECTION_M,
  BUILDING_HEIGHT_M,
  COLUMN_GRID_X,
  COLUMN_GRID_Z,
  COLUMN_SECTION_M,
  FENCE_BOUNDS_M,
  GRID_X_LABELS,
  GRID_Z_LABELS,
  SLAB_THICKNESS_M,
  STOREY_COUNT,
  STOREY_HEIGHT_M,
} from "./coordinates";

export interface InstancePose {
  key: string;
  position: [number, number, number];
  storey?: number;
}

export interface SizedPose extends InstancePose {
  size: [number, number, number];
}

export function columnGridLabel(xi: number, zi: number): string {
  return `${GRID_X_LABELS[xi]}${GRID_Z_LABELS[zi]}`;
}

export function getColumnInstances(): InstancePose[] {
  const items: InstancePose[] = [];
  for (let xi = 0; xi < COLUMN_GRID_X.length; xi += 1) {
    for (let zi = 0; zi < COLUMN_GRID_Z.length; zi += 1) {
      items.push({
        key: `col-${columnGridLabel(xi, zi)}`,
        position: [COLUMN_GRID_X[xi], BUILDING_HEIGHT_M / 2, COLUMN_GRID_Z[zi]],
      });
    }
  }
  return items;
}

export function getBeamsX(): InstancePose[] {
  const items: InstancePose[] = [];
  for (let level = 1; level <= STOREY_COUNT; level += 1) {
    const y = level * STOREY_HEIGHT_M - SLAB_THICKNESS_M - BEAM_SECTION_M.depth / 2;
    for (let zi = 0; zi < COLUMN_GRID_Z.length; zi += 1) {
      for (let xi = 0; xi < COLUMN_GRID_X.length - 1; xi += 1) {
        const x0 = COLUMN_GRID_X[xi];
        const x1 = COLUMN_GRID_X[xi + 1];
        items.push({
          key: `bx-L${level}-${xi}-${zi}`,
          position: [(x0 + x1) / 2, y, COLUMN_GRID_Z[zi]],
          storey: level,
        });
      }
    }
  }
  return items;
}

export function getBeamsZ(): InstancePose[] {
  const items: InstancePose[] = [];
  for (let level = 1; level <= STOREY_COUNT; level += 1) {
    const y = level * STOREY_HEIGHT_M - SLAB_THICKNESS_M - BEAM_SECTION_M.depth / 2;
    for (let xi = 0; xi < COLUMN_GRID_X.length; xi += 1) {
      for (let zi = 0; zi < COLUMN_GRID_Z.length - 1; zi += 1) {
        const z0 = COLUMN_GRID_Z[zi];
        const z1 = COLUMN_GRID_Z[zi + 1];
        items.push({
          key: `bz-L${level}-${xi}-${zi}`,
          position: [COLUMN_GRID_X[xi], y, (z0 + z1) / 2],
          storey: level,
        });
      }
    }
  }
  return items;
}

export function getSlabs(): SizedPose[] {
  const items: SizedPose[] = [];
  for (let level = 1; level <= STOREY_COUNT; level += 1) {
    items.push({
      key: `slab-L${String(level).padStart(2, "0")}`,
      position: [0, level * STOREY_HEIGHT_M - SLAB_THICKNESS_M / 2, 0],
      size: [40.4, SLAB_THICKNESS_M, 30.4],
      storey: level,
    });
  }
  return items;
}

export function getCoreWalls(): SizedPose[] {
  const height = BUILDING_HEIGHT_M;
  const y = height / 2;
  return [
    { key: "core-n", position: [0, y, -4], size: [8.4, height, 0.32] },
    { key: "core-s", position: [0, y, 4], size: [8.4, height, 0.32] },
    { key: "core-w", position: [-4, y, 0], size: [0.32, height, 8] },
    { key: "core-e", position: [4, y, 0], size: [0.32, height, 8] },
  ];
}

export function getSouthFacadePanels(): SizedPose[] {
  const items: SizedPose[] = [];
  const z = 15.22;
  for (let level = 1; level <= 6; level += 1) {
    const y = (level - 0.5) * STOREY_HEIGHT_M;
    for (let xi = 0; xi < COLUMN_GRID_X.length - 1; xi += 1) {
      const x0 = COLUMN_GRID_X[xi];
      const x1 = COLUMN_GRID_X[xi + 1];
      items.push({
        key: `fac-s-L${level}-${xi}`,
        position: [(x0 + x1) / 2, y, z],
        size: [BAY_X_M - 0.55, STOREY_HEIGHT_M - 0.45, 0.12],
        storey: level,
      });
    }
  }
  return items;
}

export function getEastFacadePanels(): SizedPose[] {
  const items: SizedPose[] = [];
  const x = 20.22;
  for (let level = 1; level <= 6; level += 1) {
    const y = (level - 0.5) * STOREY_HEIGHT_M;
    for (let zi = 0; zi < COLUMN_GRID_Z.length - 1; zi += 1) {
      const z0 = COLUMN_GRID_Z[zi];
      const z1 = COLUMN_GRID_Z[zi + 1];
      items.push({
        key: `fac-e-L${level}-${zi}`,
        position: [x, y, (z0 + z1) / 2],
        size: [0.12, STOREY_HEIGHT_M - 0.45, BAY_Z_M - 0.55],
        storey: level,
      });
    }
  }
  return items;
}

export function getFencePosts(): InstancePose[] {
  const { minX, maxX, minZ, maxZ } = FENCE_BOUNDS_M;
  const spacing = 3;
  const posts: InstancePose[] = [];
  let index = 0;

  for (let x = minX; x <= maxX + 0.01; x += spacing) {
    const skipGate = maxZ && x > -4 && x < 4;
    posts.push({ key: `fp-n-${index}`, position: [x, 1.15, minZ] });
    index += 1;
    if (!skipGate) {
      posts.push({ key: `fp-s-${index}`, position: [x, 1.15, maxZ] });
      index += 1;
    }
  }

  for (let z = minZ + spacing; z <= maxZ - spacing + 0.01; z += spacing) {
    posts.push({ key: `fp-w-${index}`, position: [minX, 1.15, z] });
    index += 1;
    posts.push({ key: `fp-e-${index}`, position: [maxX, 1.15, z] });
    index += 1;
  }

  return posts;
}

export const CONTEXT_BUILDINGS_HIGH: SizedPose[] = [
  { key: "ctx-1", position: [50, 8, -22], size: [16, 16, 12] },
  { key: "ctx-2", position: [54, 6, 10], size: [14, 12, 18] },
  { key: "ctx-3", position: [48, 10, 34], size: [18, 20, 14] },
  { key: "ctx-4", position: [-6, 7, 50], size: [22, 14, 12] },
  { key: "ctx-5", position: [20, 5, 52], size: [14, 10, 10] },
  { key: "ctx-6", position: [66, 9, -6], size: [12, 18, 12] },
];

export const CONTEXT_BUILDINGS_LOW: SizedPose[] = CONTEXT_BUILDINGS_HIGH.slice(0, 3);

export const TRUCK_POSES: InstancePose[] = [
  { key: "trk-1", position: [-22, 0, -10] },
  { key: "trk-2", position: [-18, 0, -14] },
];

export const WORKER_POSITIONS: [number, number, number][] = [
  [-16, 0, -6],
  [-12, 0, 4],
  [10, 0, 18],
  [-8, 0, 16],
  [16, 0, -18],
];

export const CAMERA_MARKER_POSITIONS: { id: string; position: [number, number, number] }[] = [
  { id: "CAM-01", position: [20, 0, -36] },
  { id: "CAM-02", position: [-30, 0, 6] },
  { id: "CAM-03", position: [10, 0, 22] },
];

export const SENSOR_MARKER_POSITIONS: { id: string; position: [number, number, number] }[] = [
  { id: "SNS-01", position: [8, 1.2, 18] },
  { id: "SNS-02", position: [-12, 1.2, -12] },
  { id: "SNS-03", position: [18, 4.2, 0] },
  { id: "SNS-04", position: [-22, 1.2, 14] },
  { id: "SNS-05", position: [0, 29.4, 0] },
];

export const ROBOT_WAYPOINTS: [number, number, number][] = [
  [12, 0.35, 12],
  [12, 0.35, -10],
  [-10, 0.35, -10],
  [-10, 0.35, 12],
  [6, 0.35, 8],
];

export function getColumnInstancesForStorey(storey: number): InstancePose[] {
  const y = (storey - 0.5) * STOREY_HEIGHT_M;
  const items: InstancePose[] = [];
  for (let xi = 0; xi < COLUMN_GRID_X.length; xi += 1) {
    for (let zi = 0; zi < COLUMN_GRID_Z.length; zi += 1) {
      items.push({
        key: `col-${columnGridLabel(xi, zi)}-L${storey}`,
        position: [COLUMN_GRID_X[xi], y, COLUMN_GRID_Z[zi]],
        storey,
      });
    }
  }
  return items;
}

export function getCoreWallsForStorey(storey: number): SizedPose[] {
  const y = (storey - 0.5) * STOREY_HEIGHT_M;
  const height = STOREY_HEIGHT_M - 0.08;
  return [
    { key: `core-n-L${storey}`, position: [0, y, -4], size: [8.4, height, 0.32], storey },
    { key: `core-s-L${storey}`, position: [0, y, 4], size: [8.4, height, 0.32], storey },
    { key: `core-w-L${storey}`, position: [-4, y, 0], size: [0.32, height, 8], storey },
    { key: `core-e-L${storey}`, position: [4, y, 0], size: [0.32, height, 8], storey },
  ];
}

export function filterByStorey<T extends { storey?: number }>(
  items: T[],
  storey: number | null,
): T[] {
  if (storey === null) {
    return items;
  }
  return items.filter((item) => item.storey === storey);
}

export const COLUMN_INSTANCE_SIZE: [number, number, number] = [
  COLUMN_SECTION_M.x,
  BUILDING_HEIGHT_M,
  COLUMN_SECTION_M.z,
];

export const COLUMN_STOREY_SIZE: [number, number, number] = [
  COLUMN_SECTION_M.x,
  STOREY_HEIGHT_M,
  COLUMN_SECTION_M.z,
];

export const BEAM_X_SIZE: [number, number, number] = [
  BAY_X_M,
  BEAM_SECTION_M.depth,
  BEAM_SECTION_M.width,
];
export const BEAM_Z_SIZE: [number, number, number] = [
  BEAM_SECTION_M.width,
  BEAM_SECTION_M.depth,
  BAY_Z_M,
];
export const FENCE_POST_HEIGHT = 2.3;
