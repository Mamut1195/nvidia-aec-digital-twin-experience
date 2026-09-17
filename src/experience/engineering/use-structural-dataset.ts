import { createStructuralAdapter } from "@/lib/data/adapters/structural-adapter";
import { DEMO_STRUCTURAL_DATASET } from "@/lib/data/structural/demo-results";

import { createDatasetCatalog } from "./create-catalog";

const catalog = createDatasetCatalog({
  initial: DEMO_STRUCTURAL_DATASET,
  load: () => createStructuralAdapter().load(),
  failedMessage: "Failed to load structural dataset",
});

export const useStructuralCatalog = catalog.useCatalog;
export const useEnsureStructuralDataset = catalog.useEnsureDataset;
