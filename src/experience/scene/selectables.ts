import { DEMO_BIM_ELEMENTS } from "@/lib/data/bim/demo-elements";
import type { LayerId } from "@/experience/state/types";

export interface SelectableRecord {
  id: string;
  name: string;
  category: string;
  discipline: LayerId;
  level: string;
  position: [number, number, number];
  size: [number, number, number];
}

const EXTRA_SELECTABLES: SelectableRecord[] = [
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

export const SELECTABLES: SelectableRecord[] = [
  ...DEMO_BIM_ELEMENTS.map((element) => ({
    id: element.id,
    name: element.name,
    category: element.category,
    discipline: element.discipline,
    level: element.level,
    position: element.position,
    size: element.size,
  })),
  ...EXTRA_SELECTABLES,
];

const SELECTABLE_BY_ID = new Map(SELECTABLES.map((item) => [item.id, item]));

export function getSelectable(id: string): SelectableRecord | undefined {
  return SELECTABLE_BY_ID.get(id);
}

export function isSelectableId(id: string): boolean {
  return SELECTABLE_BY_ID.has(id);
}

export const SELECTABLE_IDS = SELECTABLES.map((item) => item.id);
