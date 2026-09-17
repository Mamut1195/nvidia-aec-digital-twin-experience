import { Button } from "@/components/common/Button";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ResultLegend } from "@/components/engineering/ResultLegend";
import { PHYSICS_NEMO_TRUTH } from "@/content/engineering";
import {
  WIND_DIRECTION_LABELS,
  WIND_SPEED_LABELS,
  WIND_VIEW_LABELS,
} from "@/experience/engineering/labels";
import { selectWindScenario, windPressureRange } from "@/experience/engineering/selectors";
import { useEnsureWindDataset } from "@/experience/engineering/use-wind-dataset";
import {
  WIND_DIRECTIONS_DEG,
  WIND_SPEEDS,
  WIND_VIEWS,
  experienceActions,
  useExperienceStore,
} from "@/experience/state";
import { WIND_INFLOW_MS } from "@/lib/data/wind/demo-wind";
import { parseNumericUnion, parseUnion } from "@/lib/parse-union";

export function WindPanel() {
  const speed = useExperienceStore((state) => state.scenarioControls.windSpeed);
  const direction = useExperienceStore((state) => state.scenarioControls.windDirectionDeg);
  const view = useExperienceStore((state) => state.scenarioControls.windView);
  const pedestrian = useExperienceStore((state) => state.scenarioControls.windPedestrianOverlay);
  const { dataset, status, error } = useEnsureWindDataset();
  const scenario = selectWindScenario(dataset, speed, direction);
  const pressureRange = windPressureRange(scenario);

  return (
    <Panel title="Wind field">
      <div className="flex flex-col gap-3" data-testid="wind-panel">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status="PRECOMPUTED" />
          <span className="font-mono text-[11px] text-muted" data-testid="wind-scenario-id">
            {scenario.id}
          </span>
        </div>
        {status === "error" ? (
          <p className="text-xs text-alert">{error ?? "Wind dataset failed to load."}</p>
        ) : null}
        <p className="text-xs leading-relaxed text-muted">{PHYSICS_NEMO_TRUTH}</p>
        <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
          <span>Speed</span>
          <select
            className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
            value={speed}
            aria-label="Wind speed"
            data-testid="wind-speed"
            onChange={(event) =>
              experienceActions.setScenario({
                windSpeed: parseUnion(event.target.value, WIND_SPEEDS, "wind speed"),
              })
            }
          >
            {WIND_SPEEDS.map((id) => (
              <option key={id} value={id}>
                {WIND_SPEED_LABELS[id]} ({WIND_INFLOW_MS[id]} m/s)
              </option>
            ))}
          </select>
        </label>
        <p className="text-[11px] text-muted" data-testid="wind-inflow">
          Inflow {scenario.inflowSpeedMs} m/s
        </p>
        <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
          <span>Direction</span>
          <select
            className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
            value={String(direction)}
            aria-label="Wind direction"
            data-testid="wind-direction"
            onChange={(event) =>
              experienceActions.setScenario({
                windDirectionDeg: parseNumericUnion(
                  event.target.value,
                  WIND_DIRECTIONS_DEG,
                  "wind direction",
                ),
              })
            }
          >
            {WIND_DIRECTIONS_DEG.map((deg) => (
              <option key={deg} value={deg}>
                {WIND_DIRECTION_LABELS[deg]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
          <span>Visualization</span>
          <select
            className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
            value={view}
            aria-label="Wind visualization"
            data-testid="wind-view"
            onChange={(event) =>
              experienceActions.setScenario({
                windView: parseUnion(event.target.value, WIND_VIEWS, "wind view"),
              })
            }
          >
            {WIND_VIEWS.map((id) => (
              <option key={id} value={id}>
                {WIND_VIEW_LABELS[id]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
          <span>Pedestrian zones</span>
          <input
            type="checkbox"
            className="size-4 accent-accent"
            checked={pedestrian}
            aria-label="Pedestrian-zone overlay"
            data-testid="wind-pedestrian"
            onChange={(event) =>
              experienceActions.setScenario({ windPedestrianOverlay: event.target.checked })
            }
          />
        </label>
        {view === "facade" ? (
          <ResultLegend
            title="Facade pressure (illustrative)"
            min={pressureRange.min}
            max={pressureRange.max}
            unit=""
            testId="wind-pressure-legend"
          />
        ) : (
          <p className="text-xs text-muted">
            Particles and streamlines follow the precomputed sample field. Changing speed or
            direction swaps the scenario file.
          </p>
        )}
        <p className="text-[11px] leading-relaxed text-muted">{scenario.referenceSolver}</p>
        <Button
          variant="primary"
          className="w-full"
          data-testid="open-physicsnemo"
          onClick={() => experienceActions.setOpenPanel("physicsnemo")}
        >
          PhysicsNeMo workflow
        </Button>
      </div>
    </Panel>
  );
}
