import { createWeatherAdapter } from "@/lib/data/adapters/weather-adapter";
import { DEMO_WEATHER_DATASET } from "@/lib/data/weather/demo-weather";

import { createDatasetCatalog } from "./create-catalog";

const catalog = createDatasetCatalog({
  initial: DEMO_WEATHER_DATASET,
  load: () => createWeatherAdapter().load(),
  failedMessage: "Failed to load weather dataset",
});

export const useWeatherCatalog = catalog.useCatalog;
export const useEnsureWeatherDataset = catalog.useEnsureDataset;
