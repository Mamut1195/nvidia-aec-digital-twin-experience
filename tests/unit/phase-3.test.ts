import { readFileSync } from "node:fs";
import path from "node:path";

import { EARTH2_NOT_SOLVER, PHYSICS_NEMO_STEPS } from "@/content/engineering";
import {
  floodDepthRange,
  interpolateFloodStep,
  selectFloodScenario,
  selectStructuralLoadCase,
  selectWeatherScenario,
  selectWindScenario,
  structuralRange,
  structuralScalar,
} from "@/experience/engineering/selectors";
import { MODE_CATALOG } from "@/experience/modes/mode-catalog";
import {
  DEFAULT_EXPERIENCE_STATE,
  experienceActions,
  getExperienceSnapshot,
  resetExperienceStoreForTests,
} from "@/experience/state";
import { createDemoFloodDataset } from "@/lib/data/flood/demo-flood";
import { createDemoStructuralDataset } from "@/lib/data/structural/demo-results";
import { createDemoWeatherDataset } from "@/lib/data/weather/demo-weather";
import { createDemoWindDataset, createWindManifest } from "@/lib/data/wind/demo-wind";
import { floodDatasetSchema } from "@/lib/data/schemas/flood";
import { structuralDatasetSchema } from "@/lib/data/schemas/structural";
import { weatherDatasetSchema } from "@/lib/data/schemas/weather";
import { windDatasetSchema, windManifestSchema } from "@/lib/data/schemas/wind";
import { afterEach, describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");

function readPublicJson(relativePath: string): unknown {
  return JSON.parse(readFileSync(path.join(root, "public", relativePath), "utf8"));
}

afterEach(() => {
  resetExperienceStoreForTests();
});

describe("AECN-040 structural dataset", () => {
  it("publishes three load cases with per-element scalars, vectors, and disclaimer metadata", () => {
    const generated = createDemoStructuralDataset();
    const published = structuralDatasetSchema.parse(readPublicJson("data/structural/results.json"));
    expect(published).toEqual(generated);
    expect(published.loadCases.map((item) => item.loadCase)).toEqual([
      "gravity",
      "lateral-x",
      "lateral-y",
    ]);
    for (const loadCase of published.loadCases) {
      expect(loadCase.sourceType).toBe("PRECOMPUTED");
      expect(loadCase.disclaimer.toLowerCase()).toContain("not a design check");
      expect(loadCase.results.length).toBeGreaterThanOrEqual(20);
      expect(loadCase.results.every((result) => result.displacementVector?.length === 3)).toBe(
        true,
      );
    }
    expect(
      published.loadCases[0].results.some((result) => result.elementId === "STR-COL-L01-C01"),
    ).toBe(true);
  });
});

describe("AECN-042 / AECN-043 wind datasets", () => {
  it("covers three speeds, two directions, particles, and facade pressures", () => {
    const generated = createDemoWindDataset();
    const manifest = windManifestSchema.parse(readPublicJson("data/wind/manifest.json"));
    expect(manifest).toEqual(createWindManifest());
    const assembled = windDatasetSchema.parse({
      projectId: manifest.projectId,
      scenarios: manifest.scenarios.map((ref) => readPublicJson(`data/wind/${ref.file}`)),
    });
    expect(assembled).toEqual(generated);
    expect(new Set(assembled.scenarios.map((item) => item.speed)).size).toBe(3);
    expect(new Set(assembled.scenarios.map((item) => item.directionDeg))).toEqual(new Set([0, 90]));
    expect(assembled.scenarios).toHaveLength(6);
    for (const scenario of assembled.scenarios) {
      expect(scenario.sourceType).toBe("PRECOMPUTED");
      expect(scenario.samplePoints.length).toBeGreaterThan(40);
      expect(scenario.facadePressures.length).toBeGreaterThan(10);
      expect(scenario.pedestrianZones.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("AECN-050 / AECN-051 weather and flood", () => {
  it("authors three WORKFLOW DEMO weather scenarios and flood series with six-plus steps", () => {
    const weather = weatherDatasetSchema.parse(readPublicJson("data/weather/scenarios.json"));
    expect(weather).toEqual(createDemoWeatherDataset());
    expect(weather.scenarios).toHaveLength(3);
    expect(weather.scenarios.every((item) => item.sourceType === "WORKFLOW DEMO")).toBe(true);
    expect(weather.scenarios.map((item) => item.rainfallMmH).sort((a, b) => a - b)).toEqual([
      20, 50, 100,
    ]);

    const flood = floodDatasetSchema.parse(readPublicJson("data/flood/scenarios.json"));
    expect(flood).toEqual(createDemoFloodDataset());
    expect(flood.scenarios).toHaveLength(3);
    for (const scenario of flood.scenarios) {
      expect(scenario.sourceType).toBe("PRECOMPUTED");
      expect(scenario.timeSteps.length).toBeGreaterThanOrEqual(6);
      expect(
        scenario.timeSteps.some((step) => step.depths.some((sample) => sample.depth > 0)),
      ).toBe(true);
      const late = scenario.timeSteps[scenario.timeSteps.length - 1];
      expect(late.affectedRoadIds.length + late.exposedBuildingIds.length).toBeGreaterThan(0);
    }
  });
});

describe("AECN-041 / AECN-052 selectors and reset", () => {
  it("changes structural result ranges by load case and interpolates flood time", () => {
    const structural = createDemoStructuralDataset();
    const gravity = selectStructuralLoadCase(structural, "gravity");
    const lateral = selectStructuralLoadCase(structural, "lateral-x");
    const sample = gravity.results.find((result) => result.elementId === "STR-COL-L01-C01");
    expect(sample).toBeDefined();
    expect(structuralScalar(sample!, "displacement")).toBeGreaterThan(0);
    expect(structuralRange(gravity, "displacement").max).not.toEqual(
      structuralRange(lateral, "displacement").max,
    );

    const flood = createDemoFloodDataset();
    const scenario = selectFloodScenario(flood, 100);
    const early = interpolateFloodStep(scenario, 0);
    const late = interpolateFloodStep(scenario, 120);
    expect(floodDepthRange(early).max).toBeLessThanOrEqual(floodDepthRange(late).max + 0.001);
    expect(late.affectedRoadIds.length).toBeGreaterThan(0);

    const weather = selectWeatherScenario(createDemoWeatherDataset(), 100);
    expect(weather.scenario).toBe("SevereConvectiveDemo");
    expect(selectWindScenario(createDemoWindDataset(), "extreme", 90).id).toBe("extreme_90");
  });

  it("resets flood and structural scenario controls", () => {
    experienceActions.setScenario({
      floodRainfallMmH: 100,
      floodTimeMinutes: 90,
      structuralLoadCase: "lateral-y",
      structuralDeformationScale: 55,
      windSpeed: "extreme",
      windDirectionDeg: 90,
      windView: "facade",
    });
    experienceActions.reset();
    expect(getExperienceSnapshot()).toEqual(DEFAULT_EXPERIENCE_STATE);
  });
});

describe("AECN-044 / AECN-053 explainer copy", () => {
  it("distinguishes solver from surrogate and states Earth-2 is not the hydraulic solver", () => {
    expect(PHYSICS_NEMO_STEPS.map((step) => step.id)).toEqual([
      "solver",
      "training",
      "surrogate",
      "inference",
    ]);
    expect(PHYSICS_NEMO_STEPS.some((step) => /validat/i.test(step.body))).toBe(true);
    expect(EARTH2_NOT_SOLVER.toLowerCase()).toContain("not itself the hydraulic flood solver");
    expect(MODE_CATALOG.wind.status).toBe("PRECOMPUTED");
    expect(MODE_CATALOG.flood.status).toBe("PRECOMPUTED");
  });
});
