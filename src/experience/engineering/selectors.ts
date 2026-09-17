import { assertNever } from "@/lib/assert-never";
import type { FloodDataset, FloodScenario, FloodTimeStep } from "@/lib/data/schemas/flood";
import type {
  StructuralDataset,
  StructuralElementResult,
  StructuralLoadCase,
} from "@/lib/data/schemas/structural";
import type { WeatherDataset, WeatherScenario } from "@/lib/data/schemas/weather";
import type { WindDataset, WindScenario } from "@/lib/data/schemas/wind";
import type {
  FloodRainfallMmH,
  StructuralLoadCaseId,
  StructuralResultType,
  WindDirectionDeg,
  WindSpeed,
} from "@/experience/state/types";

export function structuralScalar(
  result: StructuralElementResult,
  type: StructuralResultType,
): number {
  switch (type) {
    case "displacement":
      return result.displacement;
    case "utilization":
      return result.utilization;
    case "axial-force":
      return result.axialForce;
    default:
      return assertNever(type, "structural result type");
  }
}

export function selectStructuralLoadCase(
  dataset: StructuralDataset,
  loadCase: StructuralLoadCaseId,
): StructuralLoadCase {
  return dataset.loadCases.find((item) => item.loadCase === loadCase) ?? dataset.loadCases[0];
}

export function findStructuralResult(
  loadCase: StructuralLoadCase,
  elementId: string | null,
): StructuralElementResult | undefined {
  if (!elementId) {
    return undefined;
  }
  return loadCase.results.find((result) => result.elementId === elementId);
}

export function structuralRange(
  loadCase: StructuralLoadCase,
  type: StructuralResultType,
): { min: number; max: number } {
  const values = loadCase.results.map((result) => structuralScalar(result, type));
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

export function selectWindScenario(
  dataset: WindDataset,
  speed: WindSpeed,
  directionDeg: WindDirectionDeg,
): WindScenario {
  return (
    dataset.scenarios.find((item) => item.speed === speed && item.directionDeg === directionDeg) ??
    dataset.scenarios.find((item) => item.speed === speed) ??
    dataset.scenarios[0]
  );
}

export function windPressureRange(scenario: WindScenario): { min: number; max: number } {
  const values = scenario.facadePressures.map((panel) => panel.pressure);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

export function selectFloodScenario(
  dataset: FloodDataset,
  rainfallMmH: FloodRainfallMmH,
): FloodScenario {
  return dataset.scenarios.find((item) => item.rainfallMmH === rainfallMmH) ?? dataset.scenarios[0];
}

export function floodMaxTime(scenario: FloodScenario): number {
  return Math.max(...scenario.timeSteps.map((step) => step.timeMinutes));
}

export function interpolateFloodStep(scenario: FloodScenario, timeMinutes: number): FloodTimeStep {
  const steps = [...scenario.timeSteps].sort((a, b) => a.timeMinutes - b.timeMinutes);
  const first = steps[0];
  const last = steps[steps.length - 1];
  if (timeMinutes <= first.timeMinutes) {
    return first;
  }
  if (timeMinutes >= last.timeMinutes) {
    return last;
  }
  let laterIndex = 1;
  while (laterIndex < steps.length && steps[laterIndex].timeMinutes < timeMinutes) {
    laterIndex += 1;
  }
  const later = steps[laterIndex];
  const earlier = steps[laterIndex - 1];
  const span = later.timeMinutes - earlier.timeMinutes;
  const t = span === 0 ? 0 : (timeMinutes - earlier.timeMinutes) / span;
  return {
    timeMinutes,
    depths: earlier.depths.map((sample, index) => {
      const laterDepth = later.depths[index]?.depth ?? sample.depth;
      return {
        x: sample.x,
        y: sample.y,
        depth: sample.depth + (laterDepth - sample.depth) * t,
      };
    }),
    affectedRoadIds: t < 0.5 ? earlier.affectedRoadIds : later.affectedRoadIds,
    exposedBuildingIds: t < 0.5 ? earlier.exposedBuildingIds : later.exposedBuildingIds,
  };
}

export function floodDepthRange(step: FloodTimeStep): { min: number; max: number } {
  const values = step.depths.map((sample) => sample.depth);
  return {
    min: 0,
    max: Math.max(0.25, ...values),
  };
}

export function selectWeatherScenario(
  dataset: WeatherDataset,
  rainfallMmH: FloodRainfallMmH,
): WeatherScenario {
  return dataset.scenarios.find((item) => item.rainfallMmH === rainfallMmH) ?? dataset.scenarios[0];
}
