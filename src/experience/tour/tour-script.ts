import { DEFAULT_LAYER_VISIBILITY } from "@/experience/state/defaults";
import type { CameraPreset, ExperienceMode, LayerId } from "@/experience/state/types";

export type TourScriptedAction =
  | { type: "none" }
  | { type: "select-element"; elementId: string }
  | { type: "isolate-level"; level: string }
  | { type: "isolate-discipline"; discipline: LayerId }
  | { type: "restore-isolation" }
  | { type: "open-panel"; panel: "ecosystem" | "usd" }
  | { type: "close-panel" };

export interface GuidedTourStep {
  id: string;
  title: string;
  narration: string;
  targetMode: ExperienceMode;
  cameraPreset: CameraPreset;
  layerVisibility: Record<LayerId, boolean>;
  scriptedAction: TourScriptedAction;
}

const designLayersOn: Record<LayerId, boolean> = {
  ...DEFAULT_LAYER_VISIBILITY,
};

export const PHASE_2_TOUR_STEPS: GuidedTourStep[] = [
  {
    id: "one-project",
    title: "One project, many disciplines",
    narration:
      "AEC data starts in specialized authoring and engineering tools. OpenUSD provides a composition model for bringing complex 3D worlds together.",
    targetMode: "overview",
    cameraPreset: "building",
    layerVisibility: designLayersOn,
    scriptedAction: { type: "none" },
  },
  {
    id: "bim-semantics",
    title: "BIM semantics in the twin",
    narration:
      "Select an element to inspect stable IDs, category, discipline, level, material and a truthful source label. This is a demo BIM dataset — not a live Revit session.",
    targetMode: "bim",
    cameraPreset: "building",
    layerVisibility: designLayersOn,
    scriptedAction: { type: "select-element", elementId: "STR-COL-L01-C01" },
  },
  {
    id: "isolate-level",
    title: "Isolate a level",
    narration:
      "Isolation hides everything that does not belong to the chosen storey or discipline. Restore all returns the composed project.",
    targetMode: "bim",
    cameraPreset: "building",
    layerVisibility: designLayersOn,
    scriptedAction: { type: "isolate-level", level: "L03" },
  },
  {
    id: "openusd",
    title: "OpenUSD composition",
    narration:
      "Layers and references compose one project stage. This diagram is educational: the browser scene is procedural Three.js, not a live USD parse.",
    targetMode: "bim",
    cameraPreset: "overview",
    layerVisibility: {
      ...designLayersOn,
      temporary: false,
      people: false,
    },
    scriptedAction: { type: "open-panel", panel: "usd" },
  },
  {
    id: "nvidia-fits",
    title: "How NVIDIA fits",
    narration:
      "Authoring and engineering tools stay on the left. The NVIDIA stack accelerates composition, simulation, video, optimization and robotics — it does not replace Revit.",
    targetMode: "overview",
    cameraPreset: "overview",
    layerVisibility: designLayersOn,
    scriptedAction: { type: "open-panel", panel: "ecosystem" },
  },
  {
    id: "later-physics",
    title: "Physics and operations come next",
    narration:
      "Wind, flood, video, logistics and robotics modes are already reachable so the story stays in one shell. Their full visualizations are later phases — no live NVIDIA inference runs here.",
    targetMode: "wind",
    cameraPreset: "street-flood",
    layerVisibility: designLayersOn,
    scriptedAction: { type: "close-panel" },
  },
  {
    id: "explore",
    title: "Explore freely",
    narration:
      "The value is not one isolated feature. It is the ability to connect design, simulation, field data and intelligent systems around a common digital world.",
    targetMode: "overview",
    cameraPreset: "overview",
    layerVisibility: designLayersOn,
    scriptedAction: { type: "restore-isolation" },
  },
];

export const GUIDED_TOUR_STEPS = PHASE_2_TOUR_STEPS;
