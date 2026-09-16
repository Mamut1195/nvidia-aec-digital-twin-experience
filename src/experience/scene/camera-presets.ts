import type { CameraPreset } from "@/experience/state/types";
import { assertNever } from "@/lib/assert-never";

import { BUILDING_AABB, isOutsideAabb } from "./coordinates";

export interface CameraView {
  position: [number, number, number];
  target: [number, number, number];
}

export const CAMERA_TRANSITION_SECONDS = 1.1;

export const CAMERA_PRESET_VIEWS: Record<CameraPreset, CameraView> = {
  overview: { position: [64, 46, 60], target: [0, 10, 0] },
  building: { position: [38, 20, 12], target: [0, 14, 0] },
  "street-flood": { position: [20, 8, 64], target: [16, 0.4, 30] },
  logistics: { position: [-50, 20, -16], target: [-20, 2.5, -10] },
  "robot-mission": { position: [22, 6.5, 22], target: [3, 1.5, 3] },
  "camera-marker": { position: [26, 12, -44], target: [4, 10, -8] },
};

export function getCameraView(preset: CameraPreset): CameraView {
  switch (preset) {
    case "overview":
    case "building":
    case "street-flood":
    case "logistics":
    case "robot-mission":
    case "camera-marker":
      return CAMERA_PRESET_VIEWS[preset];
    default:
      return assertNever(preset, "camera preset");
  }
}

export function cameraPresetClearsBuilding(preset: CameraPreset, margin = 1): boolean {
  const view = getCameraView(preset);
  return isOutsideAabb(view.position, BUILDING_AABB.min, BUILDING_AABB.max, margin);
}

export function easeInOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
