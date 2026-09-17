import { createFloodAdapter } from "@/lib/data/adapters/flood-adapter";
import { DEMO_FLOOD_DATASET } from "@/lib/data/flood/demo-flood";

import { createDatasetCatalog } from "./create-catalog";

const catalog = createDatasetCatalog({
  initial: DEMO_FLOOD_DATASET,
  load: () => createFloodAdapter().load(),
  failedMessage: "Failed to load flood dataset",
});

export const useFloodCatalog = catalog.useCatalog;
export const useEnsureFloodDataset = catalog.useEnsureDataset;
