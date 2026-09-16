import { logisticsDatasetSchema, type LogisticsDataset } from "@/lib/data/schemas/logistics";

import { createStaticAdapter, type ScenarioAdapter } from "./types";

export const LOGISTICS_DATA_URL = "/data/logistics/scenario.json";

export function createLogisticsAdapter(
  url = LOGISTICS_DATA_URL,
): ScenarioAdapter<LogisticsDataset> {
  return createStaticAdapter(logisticsDatasetSchema, url);
}
