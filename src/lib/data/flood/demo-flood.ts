import { FLOOD_GRID, FLOODABLE_BUILDINGS, ROAD_SEGMENTS } from "@/experience/scene/site-impact";
import type { FloodDataset, FloodScenario, FloodTimeStep } from "@/lib/data/schemas/flood";

const PROJECT_ID = "urban-construction-demonstrator";

const TIME_MINUTES = [0, 15, 30, 45, 60, 90, 120] as const;

const SCENARIOS = [
  { id: "rain-20", rainfallMmH: 20, weatherScenario: "LightRainDemo", file: "20mmh.json" },
  { id: "rain-50", rainfallMmH: 50, weatherScenario: "DesignStormDemo", file: "50mmh.json" },
  {
    id: "rain-100",
    rainfallMmH: 100,
    weatherScenario: "SevereConvectiveDemo",
    file: "100mmh.json",
  },
] as const;

function round(value: number, digits = 3): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function depthAt(x: number, z: number, timeMinutes: number, rainfallMmH: number): number {
  const progress = timeMinutes / 120;
  const intensity = rainfallMmH / 100;
  const basin = Math.hypot(x - 22, z - 32);
  const channel = Math.abs(z - 28) < 2.4 ? 0.18 : 0;
  const roadSouth = Math.abs(z - 40) < 5 && x > -20 && x < 70 ? 0.08 : 0;
  const roadEast = Math.abs(x - 50) < 5 && z > -20 && z < 55 ? 0.07 : 0;
  const peak = intensity * progress * 1.55;
  const depth =
    peak * Math.exp(-basin / 26) + (channel + roadSouth + roadEast) * peak - 0.04 * (1 - intensity);
  return round(Math.max(0, depth), 3);
}

function gridSamples(timeMinutes: number, rainfallMmH: number): FloodTimeStep["depths"] {
  const depths: FloodTimeStep["depths"] = [];
  for (let iz = 0; iz < FLOOD_GRID.nz; iz += 1) {
    for (let ix = 0; ix < FLOOD_GRID.nx; ix += 1) {
      const x = FLOOD_GRID.originX + ix * FLOOD_GRID.spacing;
      const z = FLOOD_GRID.originZ + iz * FLOOD_GRID.spacing;
      depths.push({
        x,
        y: z,
        depth: depthAt(x, z, timeMinutes, rainfallMmH),
      });
    }
  }
  return depths;
}

function affectedRoads(timeMinutes: number, rainfallMmH: number): string[] {
  return ROAD_SEGMENTS.filter((road) => {
    const depth = depthAt(road.position[0], road.position[2], timeMinutes, rainfallMmH);
    return depth >= 0.08;
  }).map((road) => road.id);
}

function exposedBuildings(timeMinutes: number, rainfallMmH: number): string[] {
  return FLOODABLE_BUILDINGS.filter((building) => {
    const depth = depthAt(building.footprint[0], building.footprint[1], timeMinutes, rainfallMmH);
    return depth >= 0.12;
  }).map((building) => building.id);
}

function timeStep(timeMinutes: number, rainfallMmH: number): FloodTimeStep {
  return {
    timeMinutes,
    depths: gridSamples(timeMinutes, rainfallMmH),
    affectedRoadIds: affectedRoads(timeMinutes, rainfallMmH),
    exposedBuildingIds: exposedBuildings(timeMinutes, rainfallMmH),
  };
}

export function createFloodScenario(spec: (typeof SCENARIOS)[number]): FloodScenario {
  return {
    id: spec.id,
    rainfallMmH: spec.rainfallMmH,
    weatherScenario: spec.weatherScenario,
    sourceType: "PRECOMPUTED",
    grid: { ...FLOOD_GRID },
    timeSteps: TIME_MINUTES.map((minute) => timeStep(minute, spec.rainfallMmH)),
  };
}

export const FLOOD_SCENARIO_FILES = SCENARIOS;

export function createDemoFloodDataset(): FloodDataset {
  return {
    projectId: PROJECT_ID,
    scenarios: SCENARIOS.map(createFloodScenario),
  };
}

export const DEMO_FLOOD_DATASET = createDemoFloodDataset();
