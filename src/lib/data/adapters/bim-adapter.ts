import { bimDatasetSchema, type BimDataset } from "@/lib/data/schemas/bim";

import { createStaticAdapter, type ScenarioAdapter } from "./types";

export const BIM_DATA_URL = "/data/bim/elements.json";

export function createBimAdapter(url = BIM_DATA_URL): ScenarioAdapter<BimDataset> {
  return createStaticAdapter(bimDatasetSchema, url);
}
