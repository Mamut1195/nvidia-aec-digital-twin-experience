import { createFloodAdapter } from "@/lib/data/adapters/flood-adapter";

import { createDatasetCatalog } from "./create-catalog";

const catalog = createDatasetCatalog({
  load: () => createFloodAdapter().load(),
  failedMessage: "Failed to load flood dataset",
});

export const useFloodCatalog = catalog.useCatalog;
export const useEnsureFloodDataset = catalog.useEnsureDataset;
