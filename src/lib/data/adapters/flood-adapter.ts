import { floodDatasetSchema, type FloodDataset } from "@/lib/data/schemas/flood";

import { createStaticAdapter, type ScenarioAdapter } from "./types";

export const FLOOD_DATA_URL = "/data/flood/scenarios.json";

export function createFloodAdapter(url = FLOOD_DATA_URL): ScenarioAdapter<FloodDataset> {
  return createStaticAdapter(floodDatasetSchema, url);
}
