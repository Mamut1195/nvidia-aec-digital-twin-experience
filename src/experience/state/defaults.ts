import type { ExperienceState, LayerId } from "./types";

const defaultLayers = {
  architecture: true,
  structure: true,
  mep: true,
  terrain: true,
  temporary: true,
  equipment: true,
  people: true,
} as const satisfies Record<LayerId, boolean>;

export const DEFAULT_EXPERIENCE_STATE: ExperienceState = {
  mode: "overview",
  selectedElementId: null,
  quality: "auto",
  guidedTourActive: false,
  cameraPreset: "overview",
  layerVisibility: { ...defaultLayers },
  scenarioControls: {
    windSpeed: "design",
    windDirectionDeg: 0,
    floodRainfallMmH: 50,
    floodTimeMinutes: 0,
    structuralLoadCase: "gravity",
    structuralResultType: "displacement",
    structuralDeformationScale: 1,
    logisticsPlan: "baseline",
    robotPlaying: false,
    twinTimeSeconds: 0,
  },
};
