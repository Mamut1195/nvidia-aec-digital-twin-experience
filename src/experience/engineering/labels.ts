import type { StructuralResultType } from "@/experience/state/types";
import { assertNever } from "@/lib/assert-never";

export const STRUCTURAL_LOAD_CASE_LABELS = {
  gravity: "Gravity",
  "lateral-x": "Lateral X",
  "lateral-y": "Lateral Y",
} as const;

export const STRUCTURAL_RESULT_LABELS: Record<StructuralResultType, string> = {
  displacement: "Displacement",
  utilization: "Utilization (illustrative)",
  "axial-force": "Axial force (illustrative)",
};

export const STRUCTURAL_RESULT_UNITS: Record<StructuralResultType, string> = {
  displacement: "m",
  utilization: "",
  "axial-force": "kN",
};

export const WIND_SPEED_LABELS = {
  low: "Low",
  design: "Design",
  extreme: "Extreme",
} as const;

export const WIND_VIEW_LABELS = {
  particles: "Particles",
  streamlines: "Streamlines",
  facade: "Facade pressure",
} as const;

export const WIND_DIRECTION_LABELS = {
  0: "0° east",
  90: "90° south",
} as const;

export const FLOOD_RAINFALL_LABELS = {
  20: "20 mm/h",
  50: "50 mm/h",
  100: "100 mm/h",
} as const;

export const PEDESTRIAN_COMFORT_COLORS = {
  comfortable: "#76b900",
  tolerable: "#d4a017",
  uncomfortable: "#e07a3d",
} as const;

export function formatEngineeringValue(value: number, type: StructuralResultType): string {
  switch (type) {
    case "displacement":
      return `${value.toFixed(4)} m`;
    case "utilization":
      return value.toFixed(3);
    case "axial-force":
      return `${value.toFixed(1)} kN`;
    default:
      return assertNever(type, "structural result type");
  }
}
