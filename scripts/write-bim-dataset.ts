import { writeFileSync } from "node:fs";
import path from "node:path";

import { createDemoBimDataset } from "../src/lib/data/bim/demo-elements";

const dataset = createDemoBimDataset();
const target = path.resolve(import.meta.dirname, "../public/data/bim/elements.json");
writeFileSync(target, `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`Wrote ${dataset.elements.length} BIM elements to ${target}`);
