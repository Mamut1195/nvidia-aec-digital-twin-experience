import { useEffect, useState } from "react";

import { LOAD_STAGES, runLoadPipeline, type LoadReport, type LoadStageStatus } from "./load-stages";

export interface SceneBootstrap {
  report: LoadReport | null;
  error: string | null;
  ready: boolean;
  retry: () => void;
}

export function useSceneBootstrap(): SceneBootstrap {
  const [report, setReport] = useState<LoadReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void runLoadPipeline(fetch)
      .then((next) => {
        if (cancelled) {
          return;
        }
        setReport(next);
        if (next.failedRequired) {
          setError("A required scene stage failed to load.");
        }
      })
      .catch((cause: unknown) => {
        if (cancelled) {
          return;
        }
        setError(cause instanceof Error ? cause.message : "Scene load failed.");
      });

    return () => {
      cancelled = true;
    };
  }, [generation]);

  return {
    report,
    error,
    ready: report?.ready === true && !error,
    retry: () => {
      setReport(null);
      setError(null);
      setGeneration((value) => value + 1);
    },
  };
}

function stageStatus(report: LoadReport | null, index: number): LoadStageStatus {
  if (!report) {
    return index === 0 ? "loading" : "pending";
  }
  return report.results[index]?.status ?? "pending";
}

export function SceneLoaderOverlay({
  report,
  error,
  onRetry,
}: {
  report: LoadReport | null;
  error: string | null;
  onRetry?: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-canvas px-6"
      data-testid="scene-loader"
    >
      <div className="w-full max-w-md rounded-md border border-border bg-surface p-5">
        <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Loading project world…</p>
        <ol className="mt-4 flex flex-col gap-2">
          {LOAD_STAGES.map((stage, index) => {
            const status = error && stage.id === "geometry" ? "failed" : stageStatus(report, index);
            return (
              <li
                key={stage.id}
                className="flex items-center justify-between gap-3 text-sm"
                data-testid={`load-stage-${stage.id}`}
                data-status={status}
              >
                <span>{stage.label}</span>
                <span className="font-mono text-xs tracking-wide text-muted uppercase">
                  {status}
                </span>
              </li>
            );
          })}
        </ol>
        {error ? (
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-alert">{error}</p>
            {onRetry ? (
              <button
                type="button"
                className="min-h-10 rounded-md border border-border bg-surface-elevated px-3 text-sm"
                onClick={onRetry}
              >
                Retry
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
