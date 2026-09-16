import type { LayerId } from "@/experience/state/types";

import {
  BAY_X_M,
  BUILDING_HEIGHT_M,
  COLUMN_GRID_X,
  COLUMN_GRID_Z,
  COLUMN_SECTION_M,
  CRANE_POSITION,
  STOREY_HEIGHT_M,
} from "./coordinates";

export interface SelectableRecord {
  id: string;
  name: string;
  category: string;
  discipline: LayerId;
  level: string;
  position: [number, number, number];
  size: [number, number, number];
}

function columnSelectable(
  id: string,
  name: string,
  xi: number,
  zi: number,
  level: number,
): SelectableRecord {
  const y0 = (level - 1) * STOREY_HEIGHT_M;
  return {
    id,
    name,
    category: "column",
    discipline: "structure",
    level: `L${String(level).padStart(2, "0")}`,
    position: [COLUMN_GRID_X[xi], y0 + STOREY_HEIGHT_M / 2, COLUMN_GRID_Z[zi]],
    size: [COLUMN_SECTION_M.x + 0.12, STOREY_HEIGHT_M, COLUMN_SECTION_M.z + 0.12],
  };
}

export const SELECTABLES: SelectableRecord[] = [
  columnSelectable("STR-COL-L01-C01", "Column C01", 2, 0, 1),
  columnSelectable("STR-COL-L01-A1", "Column A1", 0, 0, 1),
  columnSelectable("STR-COL-L01-F5", "Column F5", 5, 4, 1),
  columnSelectable("STR-COL-L04-C3", "Column C3 / L04", 2, 2, 4),
  {
    id: "STR-BEAM-L03-X-B2",
    name: "Beam B–C / L03",
    category: "beam",
    discipline: "structure",
    level: "L03",
    position: [
      (COLUMN_GRID_X[1] + COLUMN_GRID_X[2]) / 2,
      3 * STOREY_HEIGHT_M - 0.5,
      COLUMN_GRID_Z[1],
    ],
    size: [BAY_X_M, 0.55, 0.42],
  },
  {
    id: "STR-SLAB-L02",
    name: "Slab L02",
    category: "slab",
    discipline: "structure",
    level: "L02",
    position: [0, 2 * STOREY_HEIGHT_M - 0.14, 0],
    size: [40.4, 0.32, 30.4],
  },
  {
    id: "STR-CORE-W-N",
    name: "North core wall",
    category: "core",
    discipline: "structure",
    level: "L01-L08",
    position: [0, BUILDING_HEIGHT_M / 2, -4],
    size: [8.4, BUILDING_HEIGHT_M, 0.4],
  },
  {
    id: "ARC-FAC-S-L03",
    name: "South facade panel L03",
    category: "facade",
    discipline: "architecture",
    level: "L03",
    position: [(COLUMN_GRID_X[2] + COLUMN_GRID_X[3]) / 2, 2.5 * STOREY_HEIGHT_M, 15.22],
    size: [BAY_X_M - 0.4, STOREY_HEIGHT_M - 0.3, 0.2],
  },
  {
    id: "MEP-DUCT-L03",
    name: "Supply duct L03",
    category: "duct",
    discipline: "mep",
    level: "L03",
    position: [6, 3 * STOREY_HEIGHT_M - 0.7, 8],
    size: [18, 0.6, 0.8],
  },
  {
    id: "MEP-AHU-R01",
    name: "Roof AHU-1",
    category: "equipment",
    discipline: "mep",
    level: "ROOF",
    position: [8, BUILDING_HEIGHT_M + 1.1, 4],
    size: [4.2, 1.8, 2.6],
  },
  {
    id: "EQP-CRANE-01",
    name: "Tower crane",
    category: "equipment",
    discipline: "equipment",
    level: "SITE",
    position: [CRANE_POSITION[0], 21, CRANE_POSITION[2]],
    size: [2.2, 42, 2.2],
  },
  {
    id: "EQP-TRUCK-01",
    name: "Delivery truck 01",
    category: "equipment",
    discipline: "equipment",
    level: "SITE",
    position: [-22, 1.4, -10],
    size: [2.4, 2.6, 6.4],
  },
  {
    id: "CAM-01",
    name: "Site camera 01",
    category: "other",
    discipline: "equipment",
    level: "SITE",
    position: [20, 3.2, -36],
    size: [0.5, 6.4, 0.5],
  },
];

const SELECTABLE_BY_ID = new Map(SELECTABLES.map((item) => [item.id, item]));

export function getSelectable(id: string): SelectableRecord | undefined {
  return SELECTABLE_BY_ID.get(id);
}

export function isSelectableId(id: string): boolean {
  return SELECTABLE_BY_ID.has(id);
}

export const SELECTABLE_IDS = SELECTABLES.map((item) => item.id);
