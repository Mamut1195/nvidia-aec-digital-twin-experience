import type { TruthStatus } from "@/lib/data/schemas/common";

export const EXPERIENCE_MODES = [
  "overview",
  "bim",
  "structure",
  "wind",
  "flood",
  "video-ai",
  "logistics",
  "robotics",
  "reality",
  "twin",
] as const;

export type ExperienceMode = (typeof EXPERIENCE_MODES)[number];

export const QUALITY_LEVELS = ["auto", "high", "low"] as const;
export type QualityLevel = (typeof QUALITY_LEVELS)[number];

export const CAMERA_PRESETS = [
  "overview",
  "building",
  "street-flood",
  "logistics",
  "robot-mission",
  "camera-marker",
] as const;
export type CameraPreset = (typeof CAMERA_PRESETS)[number];

export const LAYER_IDS = [
  "architecture",
  "structure",
  "mep",
  "terrain",
  "temporary",
  "equipment",
  "people",
] as const;
export type LayerId = (typeof LAYER_IDS)[number];

export const LAYER_LABELS: Record<LayerId, string> = {
  architecture: "Architecture",
  structure: "Structure",
  mep: "MEP",
  terrain: "Terrain",
  temporary: "Temporary",
  equipment: "Equipment",
  people: "People / context",
};

export const CAMERA_PRESET_LABELS: Record<CameraPreset, string> = {
  overview: "Overview",
  building: "Building",
  "street-flood": "Street / flood",
  logistics: "Logistics",
  "robot-mission": "Robot mission",
  "camera-marker": "Camera marker",
};

export const WIND_SPEEDS = ["low", "design", "extreme"] as const;
export type WindSpeed = (typeof WIND_SPEEDS)[number];

export const WIND_DIRECTIONS_DEG = [0, 90] as const;
export type WindDirectionDeg = (typeof WIND_DIRECTIONS_DEG)[number];

export const WIND_VIEWS = ["particles", "streamlines", "facade"] as const;
export type WindView = (typeof WIND_VIEWS)[number];

export const STRUCTURAL_LOAD_CASES = ["gravity", "lateral-x", "lateral-y"] as const;
export type StructuralLoadCaseId = (typeof STRUCTURAL_LOAD_CASES)[number];

export const STRUCTURAL_RESULT_TYPES = ["displacement", "utilization", "axial-force"] as const;
export type StructuralResultType = (typeof STRUCTURAL_RESULT_TYPES)[number];

export const LOGISTICS_PLANS = ["baseline", "optimized"] as const;
export type LogisticsPlanId = (typeof LOGISTICS_PLANS)[number];

export const FLOOD_RAINFALL_MMH = [20, 50, 100] as const;
export type FloodRainfallMmH = (typeof FLOOD_RAINFALL_MMH)[number];

export interface ScenarioControls {
  windSpeed: WindSpeed;
  windDirectionDeg: WindDirectionDeg;
  windView: WindView;
  windPedestrianOverlay: boolean;
  floodRainfallMmH: FloodRainfallMmH;
  floodTimeMinutes: number;
  structuralLoadCase: StructuralLoadCaseId;
  structuralResultType: StructuralResultType;
  structuralDeformationScale: number;
  logisticsPlan: LogisticsPlanId;
  robotPlaying: boolean;
  twinTimeSeconds: number;
}

export const OPEN_PANELS = ["ecosystem", "usd", "physicsnemo", "earth2"] as const;
export type OpenPanelId = (typeof OPEN_PANELS)[number];
export type OpenPanel = OpenPanelId | null;

export const USD_SOURCE_LAYERS = [
  "architecture",
  "structure",
  "mep",
  "terrain",
  "equipment",
] as const;
export type UsdSourceLayer = (typeof USD_SOURCE_LAYERS)[number];

export interface ExperienceState {
  mode: ExperienceMode;
  selectedElementId: string | null;
  quality: QualityLevel;
  guidedTourActive: boolean;
  guidedTourStepIndex: number;
  cameraPreset: CameraPreset;
  layerVisibility: Record<LayerId, boolean>;
  isolatedLevel: string | null;
  isolatedDiscipline: LayerId | null;
  openPanel: OpenPanel;
  scenarioControls: ScenarioControls;
}

export type ExperienceAction =
  | { type: "SET_MODE"; mode: ExperienceMode }
  | { type: "SELECT_ELEMENT"; elementId: string | null }
  | { type: "SET_QUALITY"; quality: QualityLevel }
  | { type: "SET_TOUR"; active: boolean }
  | { type: "SET_TOUR_STEP"; index: number }
  | { type: "SET_CAMERA_PRESET"; preset: CameraPreset }
  | { type: "SET_LAYER"; layer: LayerId; visible: boolean }
  | { type: "SET_LAYER_VISIBILITY"; visibility: Record<LayerId, boolean> }
  | { type: "SET_ISOLATION"; level?: string | null; discipline?: LayerId | null }
  | { type: "RESTORE_ISOLATION" }
  | { type: "SET_OPEN_PANEL"; panel: OpenPanel }
  | { type: "SET_SCENARIO"; patch: Partial<ScenarioControls> }
  | { type: "RESET" };

export interface ModeDefinition {
  id: ExperienceMode;
  label: string;
  shortLabel: string;
  status: TruthStatus;
  summary: string;
  showsEngineeringDisclaimer: boolean;
  availability: "ready" | "later";
}
