import { assertNever } from "@/lib/assert-never";

import type { ExperienceMode, ModeDefinition } from "../state/types";
import { EXPERIENCE_MODES } from "../state/types";

export const MODE_CATALOG: Record<ExperienceMode, ModeDefinition> = {
  overview: {
    id: "overview",
    label: "Overview",
    shortLabel: "Overview",
    status: "INTERACTIVE WEB",
    summary:
      "One construction project. Mode changes stay in this shell — no page reload. The 3D world is a Phase 0 placeholder.",
    showsEngineeringDisclaimer: false,
  },
  bim: {
    id: "bim",
    label: "BIM / OpenUSD",
    shortLabel: "BIM",
    status: "INTERACTIVE WEB",
    summary:
      "Discipline layers and object metadata will compose one project stage. This browser scene is not parsed from USD in Phase 0.",
    showsEngineeringDisclaimer: false,
  },
  structure: {
    id: "structure",
    label: "Structural",
    shortLabel: "Structure",
    status: "PRECOMPUTED",
    summary:
      "Illustrative structural-result visualization. A real workflow uses validated analysis models and applicable design codes.",
    showsEngineeringDisclaimer: true,
  },
  wind: {
    id: "wind",
    label: "Wind / Physics AI",
    shortLabel: "Wind",
    status: "PRECOMPUTED",
    summary:
      "Precomputed wind field for education. No live PhysicsNeMo inference runs in this demo.",
    showsEngineeringDisclaimer: true,
  },
  flood: {
    id: "flood",
    label: "Flood / Earth-2",
    shortLabel: "Flood",
    status: "PRECOMPUTED",
    summary:
      "Precomputed flood depths fed by a workflow-demo weather scenario. Earth-2 is not the hydraulic solver here.",
    showsEngineeringDisclaimer: true,
  },
  "video-ai": {
    id: "video-ai",
    label: "Video AI",
    shortLabel: "Video",
    status: "PRECOMPUTED",
    summary:
      "This browser demo will replay a pre-indexed event dataset. Metropolis/VSS is not analyzing video live.",
    showsEngineeringDisclaimer: false,
  },
  logistics: {
    id: "logistics",
    label: "Logistics / cuOpt",
    shortLabel: "Logistics",
    status: "WORKFLOW DEMO",
    summary:
      "Precomputed optimization scenario inspired by cuOpt routing workflows. cuOpt did not generate these Phase 0 fixtures.",
    showsEngineeringDisclaimer: false,
  },
  robotics: {
    id: "robotics",
    label: "Robotics / Isaac",
    shortLabel: "Robotics",
    status: "WORKFLOW DEMO",
    summary: "Browser mission animation only. Isaac Sim is not running in the browser.",
    showsEngineeringDisclaimer: false,
  },
  reality: {
    id: "reality",
    label: "Reality Capture",
    shortLabel: "Reality",
    status: "WORKFLOW DEMO",
    summary:
      "Capture → reconstruction → engineering overlay will be a later-phase visual sequence.",
    showsEngineeringDisclaimer: false,
  },
  twin: {
    id: "twin",
    label: "Digital Twin",
    shortLabel: "Twin",
    status: "WORKFLOW DEMO",
    summary: "Replay of authored operational state. This is not a real-time digital twin feed.",
    showsEngineeringDisclaimer: false,
  },
};

export function getModeDefinition(mode: ExperienceMode): ModeDefinition {
  switch (mode) {
    case "overview":
    case "bim":
    case "structure":
    case "wind":
    case "flood":
    case "video-ai":
    case "logistics":
    case "robotics":
    case "reality":
    case "twin":
      return MODE_CATALOG[mode];
    default:
      return assertNever(mode, "experience mode");
  }
}

export const MODE_LIST = EXPERIENCE_MODES.map((id) => MODE_CATALOG[id]);
