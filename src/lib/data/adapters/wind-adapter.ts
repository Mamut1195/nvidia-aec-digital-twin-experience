import { windDatasetSchema, type WindDataset } from "@/lib/data/schemas/wind";

import { createStaticAdapter, type ScenarioAdapter } from "./types";

export const WIND_DATA_URL = "/data/wind/manifest.json";

export function createWindAdapter(url = WIND_DATA_URL): ScenarioAdapter<WindDataset> {
  return createStaticAdapter(windDatasetSchema, url);
}
