import { weatherDatasetSchema, type WeatherDataset } from "@/lib/data/schemas/weather";

import { createStaticAdapter, type ScenarioAdapter } from "./types";

export const WEATHER_DATA_URL = "/data/weather/scenarios.json";

export function createWeatherAdapter(url = WEATHER_DATA_URL): ScenarioAdapter<WeatherDataset> {
  return createStaticAdapter(weatherDatasetSchema, url);
}
