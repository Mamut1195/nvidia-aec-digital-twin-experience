import { createWeatherAdapter } from "@/lib/data/adapters/weather-adapter";

import { createDatasetCatalog } from "./create-catalog";

const catalog = createDatasetCatalog({
  load: () => createWeatherAdapter().load(),
  failedMessage: "Failed to load weather dataset",
});

export const useWeatherCatalog = catalog.useCatalog;
export const useEnsureWeatherDataset = catalog.useEnsureDataset;
