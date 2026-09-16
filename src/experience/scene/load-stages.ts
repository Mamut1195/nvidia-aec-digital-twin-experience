export const LOAD_STAGE_IDS = ["geometry", "scenarios", "video-index", "result-fields"] as const;

export type LoadStageId = (typeof LOAD_STAGE_IDS)[number];

export type LoadStageStatus = "pending" | "loading" | "ok" | "skipped" | "failed";

export interface LoadStageDef {
  id: LoadStageId;
  label: string;
  optional: boolean;
  kind: "local" | "fetch";
  url?: string;
}

export interface LoadStageResult {
  id: LoadStageId;
  label: string;
  optional: boolean;
  status: Exclude<LoadStageStatus, "pending" | "loading">;
  detail?: string;
}

export interface LoadReport {
  results: LoadStageResult[];
  ready: boolean;
  failedRequired: boolean;
}

export const LOAD_STAGES: readonly LoadStageDef[] = [
  { id: "geometry", label: "Geometry", optional: false, kind: "local" },
  {
    id: "scenarios",
    label: "Scenarios",
    optional: true,
    kind: "fetch",
    url: "/data/bim/elements.json",
  },
  {
    id: "video-index",
    label: "Video index",
    optional: true,
    kind: "fetch",
    url: "/data/video/events.json",
  },
  {
    id: "result-fields",
    label: "Result fields",
    optional: true,
    kind: "fetch",
    url: "/models/optional-overlay.glb",
  },
];

export const OPTIONAL_OVERLAY_URL = "/models/optional-overlay.glb";

async function loadFetchStage(
  stage: LoadStageDef,
  fetchImpl: typeof fetch,
): Promise<LoadStageResult> {
  const url = stage.url;
  if (!url) {
    return {
      id: stage.id,
      label: stage.label,
      optional: stage.optional,
      status: stage.optional ? "skipped" : "failed",
      detail: "Missing URL for fetch stage",
    };
  }

  try {
    const response = await fetchImpl(url);
    if (!response.ok) {
      if (stage.optional) {
        return {
          id: stage.id,
          label: stage.label,
          optional: true,
          status: "skipped",
          detail: `Optional asset unavailable (${response.status})`,
        };
      }
      return {
        id: stage.id,
        label: stage.label,
        optional: false,
        status: "failed",
        detail: `Required asset failed (${response.status})`,
      };
    }

    return {
      id: stage.id,
      label: stage.label,
      optional: stage.optional,
      status: "ok",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown load error";
    if (stage.optional) {
      return {
        id: stage.id,
        label: stage.label,
        optional: true,
        status: "skipped",
        detail: message,
      };
    }
    return {
      id: stage.id,
      label: stage.label,
      optional: false,
      status: "failed",
      detail: message,
    };
  }
}

export async function runLoadPipeline(fetchImpl: typeof fetch): Promise<LoadReport> {
  const results: LoadStageResult[] = [];

  for (const stage of LOAD_STAGES) {
    if (stage.kind === "local") {
      results.push({
        id: stage.id,
        label: stage.label,
        optional: stage.optional,
        status: "ok",
      });
      continue;
    }

    results.push(await loadFetchStage(stage, fetchImpl));
  }

  return {
    results,
    failedRequired: results.some((result) => result.status === "failed" && !result.optional),
    ready: results.every((result) => result.status === "ok" || result.status === "skipped"),
  };
}

export function stageStatusById(report: LoadReport, id: LoadStageId): LoadStageResult | undefined {
  return report.results.find((result) => result.id === id);
}
