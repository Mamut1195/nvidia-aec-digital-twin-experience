import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

import { createDemoFloodDataset, FLOOD_SCENARIO_FILES } from "../src/lib/data/flood/demo-flood";
import { createDemoStructuralDataset } from "../src/lib/data/structural/demo-results";
import { createDemoWeatherDataset } from "../src/lib/data/weather/demo-weather";
import {
  createDemoWindDataset,
  createWindManifest,
  WIND_SCENARIO_SPECS,
} from "../src/lib/data/wind/demo-wind";

const root = path.resolve(import.meta.dirname, "..");

function writeJson(relativePath: string, data: unknown): void {
  const target = path.join(root, relativePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Wrote ${relativePath}`);
}

const structural = createDemoStructuralDataset();
writeJson("public/data/structural/results.json", structural);

const wind = createDemoWindDataset();
writeJson("public/data/wind/manifest.json", createWindManifest());
for (const spec of WIND_SCENARIO_SPECS) {
  const scenario = wind.scenarios.find((item) => item.id === spec.id);
  writeJson(`public/data/wind/${spec.file}`, scenario);
}

const flood = createDemoFloodDataset();
writeJson("public/data/flood/scenarios.json", flood);
for (const spec of FLOOD_SCENARIO_FILES) {
  const scenario = flood.scenarios.find((item) => item.id === spec.id);
  writeJson(`public/data/flood/${spec.file}`, scenario);
}

writeJson("public/data/weather/scenarios.json", createDemoWeatherDataset());
