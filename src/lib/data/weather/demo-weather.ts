import type { WeatherDataset } from "@/lib/data/schemas/weather";

const PROJECT_ID = "urban-construction-demonstrator";

export const WEATHER_EXPLANATION =
  "Illustrative weather input representing the kind of forecast data that can feed downstream engineering workflows. Earth-2 is not running in this browser demo and is not the hydraulic flood solver.";

export function createDemoWeatherDataset(): WeatherDataset {
  return {
    projectId: PROJECT_ID,
    scenarios: [
      {
        scenario: "LightRainDemo",
        rainfallMmH: 20,
        windMs: 6,
        sourceType: "WORKFLOW DEMO",
        explanation: WEATHER_EXPLANATION,
      },
      {
        scenario: "DesignStormDemo",
        rainfallMmH: 50,
        windMs: 11,
        sourceType: "WORKFLOW DEMO",
        explanation: WEATHER_EXPLANATION,
      },
      {
        scenario: "SevereConvectiveDemo",
        rainfallMmH: 100,
        windMs: 18,
        sourceType: "WORKFLOW DEMO",
        explanation: WEATHER_EXPLANATION,
      },
    ],
  };
}

export const DEMO_WEATHER_DATASET = createDemoWeatherDataset();
