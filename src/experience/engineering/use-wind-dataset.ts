import { createWindAdapter } from "@/lib/data/adapters/wind-adapter";
import { DEMO_WIND_DATASET } from "@/lib/data/wind/demo-wind";

import { createDatasetCatalog } from "./create-catalog";

const catalog = createDatasetCatalog({
  initial: DEMO_WIND_DATASET,
  load: () => createWindAdapter().load(),
  failedMessage: "Failed to load wind dataset",
});

export const useWindCatalog = catalog.useCatalog;
export const useEnsureWindDataset = catalog.useEnsureDataset;
