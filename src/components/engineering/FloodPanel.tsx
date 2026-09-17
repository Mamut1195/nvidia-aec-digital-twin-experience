import { Button } from "@/components/common/Button";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ResultLegend } from "@/components/engineering/ResultLegend";
import { EARTH2_NOT_SOLVER } from "@/content/engineering";
import { FLOOD_RAINFALL_LABELS } from "@/experience/engineering/labels";
import {
  floodDepthRange,
  floodMaxTime,
  interpolateFloodStep,
  selectFloodScenario,
  selectWeatherScenario,
} from "@/experience/engineering/selectors";
import { useEnsureFloodDataset } from "@/experience/engineering/use-flood-dataset";
import { useEnsureWeatherDataset } from "@/experience/engineering/use-weather-dataset";
import {
  DEFAULT_EXPERIENCE_STATE,
  FLOOD_RAINFALL_MMH,
  experienceActions,
  useExperienceStore,
} from "@/experience/state";
import { parseNumericUnion } from "@/lib/parse-union";

export function FloodPanel() {
  const rainfall = useExperienceStore((state) => state.scenarioControls.floodRainfallMmH);
  const timeMinutes = useExperienceStore((state) => state.scenarioControls.floodTimeMinutes);
  const { dataset, status, error } = useEnsureFloodDataset();
  const weather = useEnsureWeatherDataset();
  if (!dataset || !weather.dataset) {
    return (
      <Panel title="Flood timeline">
        <div className="flex flex-col gap-3" data-testid="flood-panel">
          <StatusBadge status="PRECOMPUTED" />
          {status === "error" || weather.status === "error" ? (
            <p className="text-xs text-alert">
              {error ?? weather.error ?? "Flood dataset failed to load."}
            </p>
          ) : (
            <p className="text-xs text-muted">Loading precomputed flood surface…</p>
          )}
        </div>
      </Panel>
    );
  }
  const scenario = selectFloodScenario(dataset, rainfall);
  const weatherCard = selectWeatherScenario(weather.dataset, rainfall);
  const maxTime = floodMaxTime(scenario);
  const step = interpolateFloodStep(scenario, timeMinutes);
  const range = floodDepthRange(step);

  return (
    <Panel title="Flood timeline">
      <div className="flex flex-col gap-3" data-testid="flood-panel">
        <StatusBadge status="PRECOMPUTED" />
        {status === "error" ? (
          <p className="text-xs text-alert">{error ?? "Flood dataset failed to load."}</p>
        ) : null}
        <p className="text-xs leading-relaxed text-muted">{EARTH2_NOT_SOLVER}</p>
        <div
          className="rounded-md border border-border bg-surface-elevated/60 p-3"
          data-testid="flood-weather"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] tracking-[0.12em] text-muted uppercase">Weather input</p>
            <StatusBadge status="WORKFLOW DEMO" />
          </div>
          <p className="text-sm font-medium" data-testid="weather-scenario-name">
            {weatherCard.scenario}
          </p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
            <dt className="text-muted">Rainfall</dt>
            <dd>{weatherCard.rainfallMmH} mm/h</dd>
            <dt className="text-muted">Wind</dt>
            <dd>{weatherCard.windMs} m/s</dd>
            <dt className="text-muted">Source</dt>
            <dd data-testid="weather-source">{weatherCard.sourceType}</dd>
          </dl>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">{weatherCard.explanation}</p>
        </div>
        <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
          <span>Rainfall</span>
          <select
            className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
            value={String(rainfall)}
            aria-label="Rainfall scenario"
            data-testid="flood-rainfall"
            onChange={(event) =>
              experienceActions.setScenario({
                floodRainfallMmH: parseNumericUnion(
                  event.target.value,
                  FLOOD_RAINFALL_MMH,
                  "rainfall",
                ),
              })
            }
          >
            {FLOOD_RAINFALL_MMH.map((value) => (
              <option key={value} value={value}>
                {FLOOD_RAINFALL_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-10 flex-col gap-1 text-sm">
          <span className="flex justify-between">
            Time
            <span className="font-mono text-xs text-muted" data-testid="flood-time-value">
              {timeMinutes} min
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={maxTime}
            step={5}
            value={Math.min(timeMinutes, maxTime)}
            aria-label="Flood time"
            data-testid="flood-time"
            onChange={(event) =>
              experienceActions.setScenario({ floodTimeMinutes: Number(event.target.value) })
            }
          />
        </label>
        <ResultLegend
          title="Water depth"
          min={range.min}
          max={range.max}
          unit="m"
          testId="flood-legend"
        />
        <div data-testid="flood-impact">
          <p className="text-[11px] tracking-[0.12em] text-muted uppercase">Impact</p>
          <p className="mt-1 text-xs">
            Roads:{" "}
            {step.affectedRoadIds.length > 0 ? step.affectedRoadIds.join(", ") : "none affected"}
          </p>
          <p className="mt-1 text-xs">
            Buildings:{" "}
            {step.exposedBuildingIds.length > 0
              ? step.exposedBuildingIds.join(", ")
              : "none exposed"}
          </p>
        </div>
        <Button
          variant="ghost"
          className="w-full"
          data-testid="flood-reset"
          onClick={() =>
            experienceActions.setScenario({
              floodRainfallMmH: DEFAULT_EXPERIENCE_STATE.scenarioControls.floodRainfallMmH,
              floodTimeMinutes: DEFAULT_EXPERIENCE_STATE.scenarioControls.floodTimeMinutes,
            })
          }
        >
          Reset flood timeline
        </Button>
        <Button
          variant="primary"
          className="w-full"
          data-testid="open-earth2"
          onClick={() => experienceActions.setOpenPanel("earth2")}
        >
          Earth-2 → engineering
        </Button>
      </div>
    </Panel>
  );
}
