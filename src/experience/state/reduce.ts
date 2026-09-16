import { assertNever } from "@/lib/assert-never";

import { DEFAULT_EXPERIENCE_STATE } from "./defaults";
import type { ExperienceAction, ExperienceState } from "./types";

export function reduceExperience(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SELECT_ELEMENT":
      return { ...state, selectedElementId: action.elementId };
    case "SET_QUALITY":
      return { ...state, quality: action.quality };
    case "SET_TOUR":
      return { ...state, guidedTourActive: action.active };
    case "SET_CAMERA_PRESET":
      return { ...state, cameraPreset: action.preset };
    case "SET_LAYER":
      return {
        ...state,
        layerVisibility: {
          ...state.layerVisibility,
          [action.layer]: action.visible,
        },
      };
    case "SET_SCENARIO":
      return {
        ...state,
        scenarioControls: {
          ...state.scenarioControls,
          ...action.patch,
        },
      };
    case "RESET":
      return {
        ...DEFAULT_EXPERIENCE_STATE,
        layerVisibility: { ...DEFAULT_EXPERIENCE_STATE.layerVisibility },
        scenarioControls: { ...DEFAULT_EXPERIENCE_STATE.scenarioControls },
      };
    default:
      return assertNever(action, "experience action");
  }
}
