import {
  getEastFacadePanels,
  getSouthFacadePanels,
  type SizedPose,
} from "@/experience/scene/building-layout";
import { BUILDING_AABB, BUILDING_HEIGHT_M } from "@/experience/scene/coordinates";
import { PEDESTRIAN_ZONE_LAYOUT, WIND_REFERENCE_SOLVER } from "@/experience/scene/site-impact";
import type {
  WindComfortLevel,
  WindDataset,
  WindManifest,
  WindScenario,
} from "@/lib/data/schemas/wind";
import { WIND_SPEEDS } from "@/lib/data/schemas/wind";

type WindSpeed = (typeof WIND_SPEEDS)[number];

const PROJECT_ID = "urban-construction-demonstrator";

export const WIND_INFLOW_MS: Record<WindSpeed, number> = {
  low: 6,
  design: 12,
  extreme: 22,
};

export const WIND_SCENARIO_SPECS = [
  { id: "low_0", speed: "low", directionDeg: 0, file: "low_0.json" },
  { id: "low_90", speed: "low", directionDeg: 90, file: "low_90.json" },
  { id: "design_0", speed: "design", directionDeg: 0, file: "design_0.json" },
  { id: "design_90", speed: "design", directionDeg: 90, file: "design_90.json" },
  { id: "extreme_0", speed: "extreme", directionDeg: 0, file: "extreme_0.json" },
  { id: "extreme_90", speed: "extreme", directionDeg: 90, file: "extreme_90.json" },
] as const;

function linspace(min: number, max: number, count: number): number[] {
  if (count <= 1) {
    return [min];
  }
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, index) => min + step * index);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 3): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function insideBuilding(x: number, y: number, z: number, margin = 0.6): boolean {
  return (
    x > BUILDING_AABB.min[0] + margin &&
    x < BUILDING_AABB.max[0] - margin &&
    z > BUILDING_AABB.min[2] + margin &&
    z < BUILDING_AABB.max[2] - margin &&
    y < BUILDING_HEIGHT_M - 0.4
  );
}

function windVector(
  x: number,
  y: number,
  z: number,
  directionDeg: number,
  speedMs: number,
): [number, number, number] {
  const theta = (directionDeg * Math.PI) / 180;
  const ux = Math.cos(theta);
  const uz = Math.sin(theta);
  const profile = (Math.max(y, 0.4) / 10) ** 0.22;
  const along = x * ux + z * uz;
  const across = -x * uz + z * ux;
  const halfAlong = 20.5 * Math.abs(ux) + 15.5 * Math.abs(uz);
  const halfAcross = 20.5 * Math.abs(uz) + 15.5 * Math.abs(ux);
  const inPlan =
    Math.abs(across) < halfAcross + 6 && along > -halfAlong - 8 && along < halfAlong + 28;
  const wake = along > halfAlong * 0.2 && Math.abs(across) < halfAcross + 4;
  const corner = Math.abs(Math.abs(across) - halfAcross) < 4 && Math.abs(along) < halfAlong + 6;
  const windward = along < -halfAlong * 0.15 && Math.abs(across) < halfAcross + 2;

  let speed = speedMs * profile;
  if (wake && inPlan) {
    speed *= 0.42 + clamp((along - halfAlong) / 30, 0, 1) * 0.4;
  }
  if (corner) {
    speed *= 1.28;
  }
  if (windward && y < BUILDING_HEIGHT_M) {
    speed *= 0.78;
  }

  const updraft = windward ? 0.18 * speedMs * (1 - y / (BUILDING_HEIGHT_M + 6)) : 0;
  const downdraft = wake ? -0.12 * speedMs * Math.exp(-Math.abs(across) / 12) : 0;
  const divert = corner
    ? 0.22 * speedMs * Math.sign(across || 1)
    : wake
      ? 0.08 * speedMs * Math.sign(across || 1)
      : 0;

  const vx = ux * speed + -uz * divert;
  const vz = uz * speed + ux * divert;
  const vy = updraft + downdraft;
  return [round(vx), round(vy), round(vz)];
}

function samplePoints(directionDeg: number, speedMs: number): WindScenario["samplePoints"] {
  const xs = linspace(-42, 50, 12);
  const ys = [1.5, 4, 8, 14, 22, 32];
  const zs = linspace(-38, 42, 10);
  const points: WindScenario["samplePoints"] = [];
  for (const x of xs) {
    for (const y of ys) {
      for (const z of zs) {
        if (insideBuilding(x, y, z)) {
          continue;
        }
        points.push({
          position: [round(x, 2), round(y, 2), round(z, 2)],
          velocity: windVector(x, y, z, directionDeg, speedMs),
        });
      }
    }
  }
  return points;
}

function panelPressure(panel: SizedPose, directionDeg: number, speedMs: number): number {
  const [x, y, z] = panel.position;
  const theta = (directionDeg * Math.PI) / 180;
  const ux = Math.cos(theta);
  const uz = Math.sin(theta);
  const south = panel.key.startsWith("fac-s");
  const nx = south ? 0 : 1;
  const nz = south ? 1 : 0;
  const facing = nx * ux + nz * uz;
  const q = 0.5 * 1.225 * speedMs * speedMs;
  const heightBoost = 0.75 + (y / BUILDING_HEIGHT_M) * 0.35;
  const edge = south ? Math.abs(x) / 20 : Math.abs(z) / 15;
  let cp = 0.15;
  if (facing > 0.35) {
    cp = 0.62 + edge * 0.12;
  } else if (facing < -0.35) {
    cp = -0.48 - edge * 0.08;
  } else {
    cp = -0.55 - edge * 0.22;
  }
  return round((cp * q * heightBoost) / 300, 3);
}

function pedestrianZones(directionDeg: number, speedMs: number): WindScenario["pedestrianZones"] {
  return PEDESTRIAN_ZONE_LAYOUT.map((zone) => {
    const [vx, , vz] = windVector(zone.center[0], 1.5, zone.center[2], directionDeg, speedMs);
    const mag = Math.hypot(vx, vz);
    let comfort: WindComfortLevel = "comfortable";
    if (mag >= 8) {
      comfort = "uncomfortable";
    } else if (mag >= 5) {
      comfort = "tolerable";
    }
    return {
      id: zone.id,
      comfort,
      center: [...zone.center],
      size: [...zone.size],
    };
  });
}

export function createWindScenario(spec: (typeof WIND_SCENARIO_SPECS)[number]): WindScenario {
  const inflowSpeedMs = WIND_INFLOW_MS[spec.speed];
  const south = getSouthFacadePanels();
  const east = getEastFacadePanels();
  return {
    id: spec.id,
    speed: spec.speed,
    directionDeg: spec.directionDeg,
    inflowSpeedMs,
    sourceType: "PRECOMPUTED",
    referenceSolver: WIND_REFERENCE_SOLVER,
    samplePoints: samplePoints(spec.directionDeg, inflowSpeedMs),
    facadePressures: [...south, ...east].map((panel) => ({
      panelId: panel.key,
      pressure: panelPressure(panel, spec.directionDeg, inflowSpeedMs),
    })),
    pedestrianZones: pedestrianZones(spec.directionDeg, inflowSpeedMs),
  };
}

export function createDemoWindDataset(): WindDataset {
  return {
    projectId: PROJECT_ID,
    scenarios: WIND_SCENARIO_SPECS.map(createWindScenario),
  };
}

export function createWindManifest(): WindManifest {
  return {
    projectId: PROJECT_ID,
    sourceType: "PRECOMPUTED",
    scenarios: WIND_SCENARIO_SPECS.map((spec) => ({ id: spec.id, file: spec.file })),
  };
}

export const DEMO_WIND_DATASET = createDemoWindDataset();
export const DEMO_WIND_MANIFEST = createWindManifest();
