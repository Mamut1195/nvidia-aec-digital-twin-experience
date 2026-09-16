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
      return {
        ...state,
        guidedTourActive: action.active,
        guidedTourStepIndex: action.active ? 0 : state.guidedTourStepIndex,
        openPanel: action.active ? null : state.openPanel,
      };
    case "SET_TOUR_STEP":
      return { ...state, guidedTourStepIndex: action.index };
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
    case "SET_LAYER_VISIBILITY":
      return {
        ...state,
        layerVisibility: { ...action.visibility },
      };
    case "SET_ISOLATION":
      return {
        ...state,
        isolatedLevel: action.level === undefined ? state.isolatedLevel : action.level,
        isolatedDiscipline:
          action.discipline === undefined ? state.isolatedDiscipline : action.discipline,
      };
    case "RESTORE_ISOLATION":
      return {
        ...state,
        isolatedLevel: null,
        isolatedDiscipline: null,
      };
    case "SET_OPEN_PANEL":
      return { ...state, openPanel: action.panel };
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
