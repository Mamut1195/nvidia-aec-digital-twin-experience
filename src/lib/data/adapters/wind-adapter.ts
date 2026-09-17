import { windDatasetSchema, windManifestSchema, type WindDataset } from "@/lib/data/schemas/wind";

import { createStaticAdapter, type ScenarioAdapter } from "./types";

export const WIND_DATA_URL = "/data/wind/manifest.json";

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load scenario data from ${url} (${response.status})`);
  }
  return response.json();
}

export function assembleWindDataset(projectId: string, scenarios: unknown): WindDataset {
  return windDatasetSchema.parse({ projectId, scenarios });
}

export function createWindAdapter(url = WIND_DATA_URL): ScenarioAdapter<WindDataset> {
  return {
    url,
    async load() {
      const manifest = windManifestSchema.parse(await fetchJson(url));
      const base = url.replace(/[^/]+$/, "");
      const scenarios = await Promise.all(
        manifest.scenarios.map(async (ref) => fetchJson(`${base}${ref.file}`)),
      );
      return assembleWindDataset(manifest.projectId, scenarios);
    },
    validate(data: unknown) {
      return windDatasetSchema.parse(data);
    },
  };
}

export function createWindManifestAdapter(url = WIND_DATA_URL) {
  return createStaticAdapter(windManifestSchema, url);
}
