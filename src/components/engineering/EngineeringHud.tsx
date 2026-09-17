import { ResultLegend } from "@/components/engineering/ResultLegend";
import { STRUCTURAL_RESULT_LABELS, STRUCTURAL_RESULT_UNITS } from "@/experience/engineering/labels";
import {
  floodDepthRange,
  interpolateFloodStep,
  selectFloodScenario,
  selectStructuralLoadCase,
  selectWindScenario,
  structuralRange,
  windPressureRange,
} from "@/experience/engineering/selectors";
import { useEnsureFloodDataset } from "@/experience/engineering/use-flood-dataset";
import { useEnsureStructuralDataset } from "@/experience/engineering/use-structural-dataset";
import { useEnsureWindDataset } from "@/experience/engineering/use-wind-dataset";
import { useExperienceStore } from "@/experience/state";

export function EngineeringHud() {
  const mode = useExperienceStore((state) => state.mode);
  const scenario = useExperienceStore((state) => state.scenarioControls);
  const structural = useEnsureStructuralDataset();
  const wind = useEnsureWindDataset();
  const flood = useEnsureFloodDataset();

  if (mode === "structure") {
    const loadCase = selectStructuralLoadCase(structural.dataset, scenario.structuralLoadCase);
    const range = structuralRange(loadCase, scenario.structuralResultType);
    return (
      <div
        className="pointer-events-none absolute bottom-16 left-3 z-10 w-52 rounded-md border border-border bg-surface/80 p-3"
        data-testid="structural-hud"
        data-load-case={scenario.structuralLoadCase}
        data-result={scenario.structuralResultType}
      >
        <ResultLegend
          title={STRUCTURAL_RESULT_LABELS[scenario.structuralResultType]}
          min={range.min}
          max={range.max}
          unit={STRUCTURAL_RESULT_UNITS[scenario.structuralResultType]}
          testId="structural-hud-legend"
        />
      </div>
    );
  }

  if (mode === "wind") {
    const windScenario = selectWindScenario(
      wind.dataset,
      scenario.windSpeed,
      scenario.windDirectionDeg,
    );
    const range = windPressureRange(windScenario);
    return (
      <div
        className="pointer-events-none absolute bottom-16 left-3 z-10 w-52 rounded-md border border-border bg-surface/80 p-3"
        data-testid="wind-hud"
        data-scenario={windScenario.id}
      >
        {scenario.windView === "facade" ? (
          <ResultLegend
            title="Facade pressure"
            min={range.min}
            max={range.max}
            testId="wind-hud-legend"
          />
        ) : (
          <p className="text-[11px] tracking-[0.12em] text-muted uppercase">
            {windScenario.id} · {windScenario.inflowSpeedMs} m/s
          </p>
        )}
      </div>
    );
  }

  if (mode === "flood") {
    const floodScenario = selectFloodScenario(flood.dataset, scenario.floodRainfallMmH);
    const step = interpolateFloodStep(floodScenario, scenario.floodTimeMinutes);
    const range = floodDepthRange(step);
    return (
      <div
        className="pointer-events-none absolute bottom-16 left-3 z-10 w-52 rounded-md border border-border bg-surface/80 p-3"
        data-testid="flood-hud"
        data-rainfall={scenario.floodRainfallMmH}
        data-time={scenario.floodTimeMinutes}
      >
        <ResultLegend
          title="Water depth"
          min={range.min}
          max={range.max}
          unit="m"
          testId="flood-hud-legend"
        />
      </div>
    );
  }

  return null;
}
