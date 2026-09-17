import { readFileSync } from "node:fs";
import path from "node:path";

import { createBimAdapter } from "@/lib/data/adapters/bim-adapter";
import { createFloodAdapter } from "@/lib/data/adapters/flood-adapter";
import { createLogisticsAdapter } from "@/lib/data/adapters/logistics-adapter";
import { createRobotMissionAdapter } from "@/lib/data/adapters/robotics-adapter";
import { createStructuralAdapter } from "@/lib/data/adapters/structural-adapter";
import { createTwinReplayAdapter } from "@/lib/data/adapters/twin-adapter";
import { createVideoEventAdapter } from "@/lib/data/adapters/video-adapter";
import { createWeatherAdapter } from "@/lib/data/adapters/weather-adapter";
import { createWindAdapter } from "@/lib/data/adapters/wind-adapter";
import {
  invalidBimFixture,
  invalidFloodFixture,
  invalidLogisticsFixture,
  invalidRobotMissionFixture,
  invalidStructuralFixture,
  invalidTwinReplayFixture,
  invalidVideoFixture,
  invalidWeatherFixture,
  invalidWindFixture,
} from "@/lib/data/fixtures/invalid";
import { bimDatasetSchema } from "@/lib/data/schemas/bim";
import { floodDatasetSchema } from "@/lib/data/schemas/flood";
import { logisticsDatasetSchema } from "@/lib/data/schemas/logistics";
import { robotMissionSchema } from "@/lib/data/schemas/robotics";
import { structuralDatasetSchema } from "@/lib/data/schemas/structural";
import { twinReplaySchema } from "@/lib/data/schemas/twin";
import { videoEventIndexSchema } from "@/lib/data/schemas/video";
import { weatherDatasetSchema } from "@/lib/data/schemas/weather";
import { windDatasetSchema, windManifestSchema } from "@/lib/data/schemas/wind";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");

function readPublicJson(relativePath: string): unknown {
  return JSON.parse(readFileSync(path.join(root, "public", relativePath), "utf8"));
}

describe("domain contracts", () => {
  it("accepts authored BIM, structural, wind, flood, weather, video, logistics, robot and twin fixtures", () => {
    expect(
      bimDatasetSchema.parse(readPublicJson("data/bim/elements.json")).elements.length,
    ).toBeGreaterThanOrEqual(60);
    expect(
      structuralDatasetSchema.parse(readPublicJson("data/structural/results.json")).loadCases,
    ).toHaveLength(3);
    expect(
      windManifestSchema.parse(readPublicJson("data/wind/manifest.json")).scenarios,
    ).toHaveLength(6);
    expect(
      floodDatasetSchema.parse(readPublicJson("data/flood/scenarios.json")).scenarios,
    ).toHaveLength(3);
    expect(
      weatherDatasetSchema.parse(readPublicJson("data/weather/scenarios.json")).scenarios,
    ).toHaveLength(3);
    expect(
      videoEventIndexSchema.parse(readPublicJson("data/video/events.json")).events[0].type,
    ).toBe("concrete_delivery");
    expect(
      logisticsDatasetSchema.parse(readPublicJson("data/logistics/scenario.json")).optimizedPlan
        .provenance,
    ).toMatch(/cuOpt/);
    expect(
      robotMissionSchema.parse(readPublicJson("data/robotics/mission.json")).inspectionTargets,
    ).toEqual(["STR-COL-L01-C01"]);
    expect(
      twinReplaySchema
        .parse(readPublicJson("data/twin/replay.json"))
        .events.map((event) => event.kind),
    ).toEqual(["progress", "weather", "equipment", "sensor", "camera", "alert"]);
  });

  it("rejects invalid fixtures for every domain schema", () => {
    expect(() => bimDatasetSchema.parse(invalidBimFixture)).toThrow();
    expect(() => structuralDatasetSchema.parse(invalidStructuralFixture)).toThrow();
    expect(() => windDatasetSchema.parse(invalidWindFixture)).toThrow();
    expect(() => floodDatasetSchema.parse(invalidFloodFixture)).toThrow();
    expect(() => weatherDatasetSchema.parse(invalidWeatherFixture)).toThrow();
    expect(() => videoEventIndexSchema.parse(invalidVideoFixture)).toThrow();
    expect(() => logisticsDatasetSchema.parse(invalidLogisticsFixture)).toThrow();
    expect(() => robotMissionSchema.parse(invalidRobotMissionFixture)).toThrow();
    expect(() => twinReplaySchema.parse(invalidTwinReplayFixture)).toThrow();
  });

  it("exposes schema-backed adapters for later module UI", () => {
    const bim = createBimAdapter();
    const structural = createStructuralAdapter();
    const wind = createWindAdapter();
    const flood = createFloodAdapter();
    const weather = createWeatherAdapter();
    const video = createVideoEventAdapter();
    const logistics = createLogisticsAdapter();
    const robot = createRobotMissionAdapter();
    const twin = createTwinReplayAdapter();

    expect(bim.validate(readPublicJson("data/bim/elements.json")).projectId).toBe(
      "urban-construction-demonstrator",
    );
    expect(
      structural.validate(readPublicJson("data/structural/results.json")).loadCases,
    ).toHaveLength(3);
    const windManifest = windManifestSchema.parse(readPublicJson("data/wind/manifest.json"));
    expect(windManifest.scenarios[0].id).toBe("low_0");
    expect(
      wind.validate({
        projectId: windManifest.projectId,
        scenarios: windManifest.scenarios.map((ref) => readPublicJson(`data/wind/${ref.file}`)),
      }).scenarios,
    ).toHaveLength(6);
    expect(
      flood
        .validate(readPublicJson("data/flood/scenarios.json"))
        .scenarios.map((scenario) => scenario.rainfallMmH),
    ).toEqual([20, 50, 100]);
    expect(
      weather
        .validate(readPublicJson("data/weather/scenarios.json"))
        .scenarios.map((item) => item.scenario),
    ).toEqual(["LightRainDemo", "DesignStormDemo", "SevereConvectiveDemo"]);
    expect(video.validate(readPublicJson("data/video/events.json")).videoId).toBe(
      "site-cam-01-demo",
    );
    expect(logistics.validate(readPublicJson("data/logistics/scenario.json")).fleet[0].id).toBe(
      "TRK-01",
    );
    expect(robot.validate(readPublicJson("data/robotics/mission.json")).id).toBe("inspect-l01-l02");
    expect(twin.validate(readPublicJson("data/twin/replay.json")).durationSeconds).toBe(240);

    expect(() => bim.validate(invalidBimFixture)).toThrow();
    expect(() => structural.validate(invalidStructuralFixture)).toThrow();
    expect(() => wind.validate(invalidWindFixture)).toThrow();
    expect(() => flood.validate(invalidFloodFixture)).toThrow();
    expect(() => weather.validate(invalidWeatherFixture)).toThrow();
    expect(() => video.validate(invalidVideoFixture)).toThrow();
    expect(() => logistics.validate(invalidLogisticsFixture)).toThrow();
    expect(() => robot.validate(invalidRobotMissionFixture)).toThrow();
    expect(() => twin.validate(invalidTwinReplayFixture)).toThrow();
  });
});
