import { createStructuralAdapter } from "@/lib/data/adapters/structural-adapter";

import { createDatasetCatalog } from "./create-catalog";

const catalog = createDatasetCatalog({
  load: () => createStructuralAdapter().load(),
  failedMessage: "Failed to load structural dataset",
});

export const useStructuralCatalog = catalog.useCatalog;
export const useEnsureStructuralDataset = catalog.useEnsureDataset;
