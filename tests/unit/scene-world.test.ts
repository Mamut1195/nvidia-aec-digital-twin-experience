import { readFileSync } from "node:fs";
import path from "node:path";

import {
  cameraPresetClearsBuilding,
  CAMERA_PRESET_VIEWS,
  easeInOutCubic,
} from "@/experience/scene/camera-presets";
import {
  getBeamsX,
  getBeamsZ,
  getColumnInstances,
  getCoreWalls,
  getFencePosts,
  getSlabs,
} from "@/experience/scene/building-layout";
import { SCENE_COORDINATES, STOREY_COUNT } from "@/experience/scene/coordinates";
import { SCENE_HIERARCHY } from "@/experience/scene/hierarchy";
import { LOAD_STAGES, runLoadPipeline, stageStatusById } from "@/experience/scene/load-stages";
import { isSelectableId, SELECTABLE_IDS } from "@/experience/scene/selectables";
import {
  CAMERA_PRESETS,
  DEFAULT_EXPERIENCE_STATE,
  experienceActions,
  getExperienceSnapshot,
  LAYER_IDS,
  resetExperienceStoreForTests,
} from "@/experience/state";
import {
  pickAutoTier,
  QUALITY_PRESETS,
  qualityReducesGpuCost,
  resolveQuality,
} from "@/lib/performance/quality";
import { afterEach, describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");

afterEach(() => {
  resetExperienceStoreForTests();
});

describe("scene coordinates", () => {
  it("matches the documented public JSON snapshot", () => {
    const published = JSON.parse(
      readFileSync(path.join(root, "public/data/scene/coordinates.json"), "utf8"),
    ) as typeof SCENE_COORDINATES;
    expect(published).toEqual(SCENE_COORDINATES);
    expect(published.units).toBe("meters");
    expect(published.upAxis).toBe("y");
    expect(published.origin).toBe("building-center");
    expect(published.storeyCount).toBe(8);
  });
});

describe("AECN-010 layout", () => {
  it("builds an 8-storey structural grid with instanced repeats", () => {
    expect(STOREY_COUNT).toBe(8);
    expect(getColumnInstances()).toHaveLength(6 * 5);
    expect(getBeamsX().length).toBeGreaterThan(100);
    expect(getBeamsZ().length).toBeGreaterThan(100);
    expect(getSlabs()).toHaveLength(8);
    expect(getCoreWalls()).toHaveLength(4);
    expect(getFencePosts().length).toBeGreaterThan(40);
  });

  it("uses the documented object-group names", () => {
    expect(SCENE_HIERARCHY).toEqual([
      "Environment",
      "Terrain",
      "ArchitectureGroup",
      "StructureGroup",
      "MEPGroup",
      "TemporaryWorksGroup",
      "EquipmentGroup",
      "VehicleGroup",
      "WorkerGroup",
      "CameraMarkers",
      "SensorMarkers",
      "RobotLayer",
      "ResultOverlay",
      "Effects",
    ]);
  });
});

describe("AECN-011 camera presets", () => {
  it("places every preset camera outside the building AABB", () => {
    for (const preset of CAMERA_PRESETS) {
      expect(cameraPresetClearsBuilding(preset), preset).toBe(true);
      expect(CAMERA_PRESET_VIEWS[preset].position[1]).toBeGreaterThan(1.5);
    }
  });

  it("eases transitions in 0–1", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBe(0.5);
  });
});

describe("AECN-012 layers", () => {
  it("persists layer visibility across mode changes and restores on reset", () => {
    experienceActions.setLayer("architecture", false);
    experienceActions.setLayer("mep", false);
    experienceActions.setMode("wind");
    experienceActions.setMode("logistics");
    expect(getExperienceSnapshot().layerVisibility.architecture).toBe(false);
    expect(getExperienceSnapshot().layerVisibility.mep).toBe(false);
    expect(LAYER_IDS.every((layer) => layer in getExperienceSnapshot().layerVisibility)).toBe(true);

    experienceActions.reset();
    expect(getExperienceSnapshot().layerVisibility).toEqual(
      DEFAULT_EXPERIENCE_STATE.layerVisibility,
    );
  });
});

describe("AECN-013 selectables", () => {
  it("exposes only intended IDs including the Phase 0 sample column", () => {
    expect(SELECTABLE_IDS).toContain("STR-COL-L01-C01");
    expect(isSelectableId("STR-COL-L01-C01")).toBe(true);
    expect(isSelectableId("terrain-ground")).toBe(false);
    expect(SELECTABLE_IDS.length).toBeGreaterThanOrEqual(10);
  });
});

describe("AECN-014 quality", () => {
  it("makes Low materially cheaper than High", () => {
    expect(qualityReducesGpuCost(QUALITY_PRESETS.low, QUALITY_PRESETS.high)).toBe(true);
    expect(resolveQuality("low").shadows).toBe(false);
    expect(resolveQuality("high").shadows).toBe(true);
    expect(resolveQuality("low").dpr).toBeLessThan(resolveQuality("high").dpr);
    expect(resolveQuality("low").particleCount).toBe(0);
    expect(resolveQuality("high").contextLod).toBe("high");
  });

  it("maps Auto from device hints", () => {
    expect(pickAutoTier({ deviceMemoryGb: 4 })).toBe("low");
    expect(pickAutoTier({ saveData: true })).toBe("low");
    expect(pickAutoTier({ isCoarsePointer: true })).toBe("low");
    expect(pickAutoTier({ deviceMemoryGb: 16, hardwareConcurrency: 12 })).toBe("high");
    expect(resolveQuality("auto", { deviceMemoryGb: 2 }).tier).toBe("low");
  });
});

describe("AECN-015 loader", () => {
  it("runs deterministic stages and skips a missing optional asset", async () => {
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      if (url.includes("optional-overlay")) {
        return new Response(null, { status: 404 });
      }
      if (url.endsWith(".json")) {
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }
      return new Response(null, { status: 500 });
    };

    const report = await runLoadPipeline(fetchImpl);
    expect(LOAD_STAGES.map((stage) => stage.id)).toEqual([
      "geometry",
      "scenarios",
      "video-index",
      "result-fields",
    ]);
    expect(report.ready).toBe(true);
    expect(report.failedRequired).toBe(false);
    expect(stageStatusById(report, "geometry")?.status).toBe("ok");
    expect(stageStatusById(report, "result-fields")?.status).toBe("skipped");
  });

  it("does not throw when an optional fetch rejects", async () => {
    const fetchImpl: typeof fetch = async () => {
      throw new Error("network down");
    };
    const report = await runLoadPipeline(fetchImpl);
    expect(report.ready).toBe(true);
    expect(report.results.every((result) => result.optional || result.status === "ok")).toBe(true);
  });
});
