import { readFileSync } from "node:fs";
import path from "node:path";

import { matchesIsolation } from "@/experience/bim/isolation";
import { MODE_CATALOG } from "@/experience/modes/mode-catalog";
import { SELECTABLE_IDS } from "@/experience/scene/selectables";
import {
  DEFAULT_EXPERIENCE_STATE,
  EXPERIENCE_MODES,
  experienceActions,
  getExperienceSnapshot,
  resetExperienceStoreForTests,
} from "@/experience/state";
import {
  applyTourStep,
  exitGuidedTour,
  goToTourStep,
  nextTourStep,
  prevTourStep,
  restartGuidedTour,
  startGuidedTour,
  tourStepCount,
} from "@/experience/tour/tour-engine";
import { GUIDED_TOUR_STEPS } from "@/experience/tour/tour-script";
import { ALL_ECOSYSTEM_PRODUCTS, NVIDIA_PRODUCTS } from "@/content/nvidia-ecosystem";
import {
  createDemoBimDataset,
  DEMO_BIM_DATASET,
  DEMO_BIM_SOURCE,
  EXAMPLE_REVIT_SOURCE,
  uniqueBimDisciplines,
} from "@/lib/data/bim/demo-elements";
import { bimDatasetSchema } from "@/lib/data/schemas/bim";
import { afterEach, describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");

afterEach(() => {
  resetExperienceStoreForTests();
});

describe("AECN-030 BIM dataset", () => {
  it("publishes at least 60 stable elements across three or more disciplines", () => {
    const published = bimDatasetSchema.parse(
      JSON.parse(readFileSync(path.join(root, "public/data/bim/elements.json"), "utf8")),
    );
    const generated = createDemoBimDataset();
    expect(published).toEqual(generated);
    expect(published.elements.length).toBeGreaterThanOrEqual(60);
    expect(uniqueBimDisciplines(published.elements).length).toBeGreaterThanOrEqual(3);

    const ids = published.elements.map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("STR-COL-L01-C01");

    const counts = {
      column: published.elements.filter((element) => element.category === "column").length,
      beam: published.elements.filter((element) => element.category === "beam").length,
      slab: published.elements.filter((element) => element.category === "slab").length,
      wallLike: published.elements.filter((element) => ["wall", "core"].includes(element.category))
        .length,
      architecture: published.elements.filter((element) => element.discipline === "architecture")
        .length,
      mep: published.elements.filter((element) => element.discipline === "mep").length,
    };
    expect(counts.column).toBeGreaterThanOrEqual(20);
    expect(counts.beam).toBeGreaterThanOrEqual(15);
    expect(counts.slab).toBeGreaterThanOrEqual(10);
    expect(counts.wallLike).toBeGreaterThanOrEqual(4);
    expect(counts.architecture).toBeGreaterThanOrEqual(5);
    expect(counts.mep).toBeGreaterThanOrEqual(5);

    for (const element of published.elements) {
      expect(element.sourceLabel === "Source: Revit").toBe(false);
      expect([DEMO_BIM_SOURCE, EXAMPLE_REVIT_SOURCE]).toContain(element.sourceLabel);
    }
    expect(published.elements.some((element) => element.sourceLabel === EXAMPLE_REVIT_SOURCE)).toBe(
      true,
    );
    expect(SELECTABLE_IDS).toEqual(expect.arrayContaining(ids));
  });
});

describe("AECN-032 isolation", () => {
  it("matches a storey inside a spanning core wall and restores all", () => {
    expect(matchesIsolation({ level: "L03", discipline: "structure" }, "L03", "structure")).toBe(
      true,
    );
    expect(matchesIsolation({ level: "L01-L08", discipline: "structure" }, "L03", null)).toBe(true);
    expect(matchesIsolation({ level: "L02", discipline: "architecture" }, "L03", null)).toBe(false);
    expect(matchesIsolation({ level: "L03", discipline: "mep" }, null, "structure")).toBe(false);

    experienceActions.setIsolation({ level: "L03", discipline: "structure" });
    expect(getExperienceSnapshot().isolatedLevel).toBe("L03");
    experienceActions.restoreIsolation();
    expect(getExperienceSnapshot().isolatedLevel).toBeNull();
    expect(getExperienceSnapshot().isolatedDiscipline).toBeNull();
  });
});

describe("AECN-022 guided tour engine", () => {
  it("walks next/back, restarts from the first step, and exits to free exploration", () => {
    startGuidedTour();
    const first = GUIDED_TOUR_STEPS[0];
    expect(getExperienceSnapshot().guidedTourActive).toBe(true);
    expect(getExperienceSnapshot().guidedTourStepIndex).toBe(0);
    expect(getExperienceSnapshot().mode).toBe(first.targetMode);
    expect(getExperienceSnapshot().cameraPreset).toBe(first.cameraPreset);

    nextTourStep();
    expect(getExperienceSnapshot().guidedTourStepIndex).toBe(1);
    expect(getExperienceSnapshot().selectedElementId).toBe("STR-COL-L01-C01");

    nextTourStep();
    expect(getExperienceSnapshot().isolatedLevel).toBe("L03");

    prevTourStep();
    expect(getExperienceSnapshot().guidedTourStepIndex).toBe(1);

    restartGuidedTour();
    expect(getExperienceSnapshot().guidedTourStepIndex).toBe(0);
    expect(getExperienceSnapshot().mode).toBe(first.targetMode);

    exitGuidedTour();
    expect(getExperienceSnapshot().guidedTourActive).toBe(false);
    expect(getExperienceSnapshot().mode).toBe(first.targetMode);

    goToTourStep(tourStepCount() - 1);
    applyTourStep(GUIDED_TOUR_STEPS[tourStepCount() - 1]);
    expect(nextTourStep()).toBe("exit");
    expect(getExperienceSnapshot().guidedTourActive).toBe(false);
  });
});

describe("AECN-021 / AECN-023 catalog", () => {
  it("keeps every mode reachable and later modes stubbed", () => {
    expect(EXPERIENCE_MODES).toHaveLength(10);
    expect(MODE_CATALOG.overview.availability).toBe("ready");
    expect(MODE_CATALOG.bim.availability).toBe("ready");
    expect(MODE_CATALOG.structure.availability).toBe("ready");
    expect(MODE_CATALOG.wind.availability).toBe("ready");
    expect(MODE_CATALOG.flood.availability).toBe("ready");
    expect(MODE_CATALOG["video-ai"].availability).toBe("later");
    experienceActions.setMode("robotics");
    expect(getExperienceSnapshot().mode).toBe("robotics");
    experienceActions.reset();
    expect(getExperienceSnapshot()).toEqual(DEFAULT_EXPERIENCE_STATE);
  });

  it("separates authoring tools from the NVIDIA stack with official links", () => {
    expect(ALL_ECOSYSTEM_PRODUCTS.some((product) => product.id === "revit")).toBe(true);
    for (const product of NVIDIA_PRODUCTS) {
      expect(product.officialUrl.startsWith("https://")).toBe(true);
      expect(product.whatItIs.length).toBeGreaterThan(20);
    }
    expect(DEMO_BIM_DATASET.projectId).toBe("urban-construction-demonstrator");
  });
});
