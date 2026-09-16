import { create } from "zustand";

import { DEFAULT_EXPERIENCE_STATE } from "./defaults";
import { reduceExperience } from "./reduce";
import type {
  CameraPreset,
  ExperienceAction,
  ExperienceMode,
  ExperienceState,
  LayerId,
  QualityLevel,
  ScenarioControls,
} from "./types";

export type ActionListener = (action: ExperienceAction, state: ExperienceState) => void;

const listeners = new Set<ActionListener>();

export function subscribeActions(listener: ActionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

interface ExperienceStore extends ExperienceState {
  apply: (action: ExperienceAction) => void;
}

function toExperienceSnapshot(store: ExperienceStore): ExperienceState {
  const { apply: _apply, ...state } = store;
  return state;
}

export const useExperienceStore = create<ExperienceStore>((set, get) => ({
  ...DEFAULT_EXPERIENCE_STATE,
  layerVisibility: { ...DEFAULT_EXPERIENCE_STATE.layerVisibility },
  scenarioControls: { ...DEFAULT_EXPERIENCE_STATE.scenarioControls },
  apply: (action) => {
    set((state) => reduceExperience(state, action));
    const next = get();
    const snapshot = toExperienceSnapshot(next);
    for (const listener of listeners) {
      listener(action, snapshot);
    }
  },
}));

export function dispatch(action: ExperienceAction): ExperienceState {
  useExperienceStore.getState().apply(action);
  return getExperienceSnapshot();
}

export const experienceActions = {
  setMode(mode: ExperienceMode) {
    return dispatch({ type: "SET_MODE", mode });
  },
  selectElement(elementId: string | null) {
    return dispatch({ type: "SELECT_ELEMENT", elementId });
  },
  setQuality(quality: QualityLevel) {
    return dispatch({ type: "SET_QUALITY", quality });
  },
  setTour(active: boolean) {
    return dispatch({ type: "SET_TOUR", active });
  },
  setCameraPreset(preset: CameraPreset) {
    return dispatch({ type: "SET_CAMERA_PRESET", preset });
  },
  setLayer(layer: LayerId, visible: boolean) {
    return dispatch({ type: "SET_LAYER", layer, visible });
  },
  setScenario(patch: Partial<ScenarioControls>) {
    return dispatch({ type: "SET_SCENARIO", patch });
  },
  reset() {
    return dispatch({ type: "RESET" });
  },
};

export function getExperienceSnapshot(): ExperienceState {
  return toExperienceSnapshot(useExperienceStore.getState());
}

export function resetExperienceStoreForTests(): void {
  listeners.clear();
  useExperienceStore.setState({
    ...DEFAULT_EXPERIENCE_STATE,
    layerVisibility: { ...DEFAULT_EXPERIENCE_STATE.layerVisibility },
    scenarioControls: { ...DEFAULT_EXPERIENCE_STATE.scenarioControls },
  });
}
