import { createWindAdapter } from "@/lib/data/adapters/wind-adapter";

import { createDatasetCatalog } from "./create-catalog";

const catalog = createDatasetCatalog({
  load: () => createWindAdapter().load(),
  failedMessage: "Failed to load wind dataset",
});

export const useWindCatalog = catalog.useCatalog;
export const useEnsureWindDataset = catalog.useEnsureDataset;
