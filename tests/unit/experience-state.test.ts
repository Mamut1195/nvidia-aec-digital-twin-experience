import { MODE_CATALOG } from "@/experience/modes/mode-catalog";
import {
  DEFAULT_EXPERIENCE_STATE,
  dispatch,
  experienceActions,
  getExperienceSnapshot,
  resetExperienceStoreForTests,
  subscribeActions,
} from "@/experience/state";
import { TRUTH_STATUSES } from "@/lib/data/schemas/common";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => {
  resetExperienceStoreForTests();
});

describe("experience action bus", () => {
  it("changes mode without implying navigation state", () => {
    const next = experienceActions.setMode("wind");
    expect(next.mode).toBe("wind");
    expect(getExperienceSnapshot().mode).toBe("wind");
  });

  it("records programmatic actions for UI and future copilot use", () => {
    const seen: string[] = [];
    const unsubscribe = subscribeActions((action) => {
      seen.push(action.type);
    });

    dispatch({ type: "SELECT_ELEMENT", elementId: "STR-COL-L01-C01" });
    dispatch({ type: "SET_QUALITY", quality: "low" });
    dispatch({ type: "SET_CAMERA_PRESET", preset: "logistics" });
    dispatch({ type: "SET_LAYER", layer: "architecture", visible: false });
    dispatch({ type: "SET_SCENARIO", patch: { windSpeed: "extreme", windDirectionDeg: 90 } });
    dispatch({ type: "SET_TOUR", active: true });

    unsubscribe();

    const snapshot = getExperienceSnapshot();
    expect(seen).toEqual([
      "SELECT_ELEMENT",
      "SET_QUALITY",
      "SET_CAMERA_PRESET",
      "SET_LAYER",
      "SET_SCENARIO",
      "SET_TOUR",
    ]);
    expect(snapshot.selectedElementId).toBe("STR-COL-L01-C01");
    expect(snapshot.quality).toBe("low");
    expect(snapshot.cameraPreset).toBe("logistics");
    expect(snapshot.layerVisibility.architecture).toBe(false);
    expect(snapshot.scenarioControls.windSpeed).toBe("extreme");
    expect(snapshot.guidedTourActive).toBe(true);
  });

  it("resets to deterministic defaults", () => {
    experienceActions.setMode("flood");
    experienceActions.selectElement("STR-COL-L01-C01");
    experienceActions.setQuality("high");
    experienceActions.setLayer("mep", false);
    experienceActions.setScenario({ floodTimeMinutes: 60 });

    const reset = experienceActions.reset();
    expect(reset).toEqual(DEFAULT_EXPERIENCE_STATE);
    expect(getExperienceSnapshot()).toEqual(DEFAULT_EXPERIENCE_STATE);
  });

  it("labels every mode with an allowed truth status", () => {
    for (const definition of Object.values(MODE_CATALOG)) {
      expect(TRUTH_STATUSES).toContain(definition.status);
    }
  });
});
