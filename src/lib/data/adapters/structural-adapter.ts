import { structuralDatasetSchema, type StructuralDataset } from "@/lib/data/schemas/structural";

import { createStaticAdapter, type ScenarioAdapter } from "./types";

export const STRUCTURAL_DATA_URL = "/data/structural/results.json";

export function createStructuralAdapter(
  url = STRUCTURAL_DATA_URL,
): ScenarioAdapter<StructuralDataset> {
  return createStaticAdapter(structuralDatasetSchema, url);
}
