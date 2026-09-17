import { Button } from "@/components/common/Button";
import { Panel } from "@/components/common/Panel";
import { ResultLegend } from "@/components/engineering/ResultLegend";
import {
  formatEngineeringValue,
  STRUCTURAL_LOAD_CASE_LABELS,
  STRUCTURAL_RESULT_LABELS,
  STRUCTURAL_RESULT_UNITS,
} from "@/experience/engineering/labels";
import {
  findStructuralResult,
  selectStructuralLoadCase,
  structuralRange,
  structuralScalar,
} from "@/experience/engineering/selectors";
import { useEnsureStructuralDataset } from "@/experience/engineering/use-structural-dataset";
import {
  STRUCTURAL_LOAD_CASES,
  STRUCTURAL_RESULT_TYPES,
  experienceActions,
  useExperienceStore,
} from "@/experience/state";
import { parseUnion } from "@/lib/parse-union";

export function StructuralPanel() {
  const loadCaseId = useExperienceStore((state) => state.scenarioControls.structuralLoadCase);
  const resultType = useExperienceStore((state) => state.scenarioControls.structuralResultType);
  const deformationScale = useExperienceStore(
    (state) => state.scenarioControls.structuralDeformationScale,
  );
  const selectedElementId = useExperienceStore((state) => state.selectedElementId);
  const { dataset, status, error } = useEnsureStructuralDataset();
  if (!dataset) {
    return (
      <Panel title="Structural results">
        <div className="flex flex-col gap-3" data-testid="structural-panel">
          {status === "error" ? (
            <p className="text-xs text-alert">{error ?? "Structural dataset failed to load."}</p>
          ) : (
            <p className="text-xs text-muted">Loading precomputed structural field…</p>
          )}
        </div>
      </Panel>
    );
  }
  const loadCase = selectStructuralLoadCase(dataset, loadCaseId);
  const range = structuralRange(loadCase, resultType);
  const selected = findStructuralResult(loadCase, selectedElementId);

  return (
    <Panel title="Structural results">
      <div className="flex flex-col gap-3" data-testid="structural-panel">
        {status === "error" ? (
          <p className="text-xs text-alert">{error ?? "Structural dataset failed to load."}</p>
        ) : null}
        <p className="text-xs leading-relaxed text-muted" data-testid="structural-disclaimer">
          {loadCase.disclaimer} Illustrative — not a design check.
        </p>
        <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
          <span>Load case</span>
          <select
            className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
            value={loadCaseId}
            aria-label="Structural load case"
            data-testid="structural-load-case"
            onChange={(event) =>
              experienceActions.setScenario({
                structuralLoadCase: parseUnion(
                  event.target.value,
                  STRUCTURAL_LOAD_CASES,
                  "load case",
                ),
              })
            }
          >
            {STRUCTURAL_LOAD_CASES.map((id) => (
              <option key={id} value={id}>
                {STRUCTURAL_LOAD_CASE_LABELS[id]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
          <span>Result</span>
          <select
            className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
            value={resultType}
            aria-label="Structural result type"
            data-testid="structural-result-type"
            onChange={(event) =>
              experienceActions.setScenario({
                structuralResultType: parseUnion(
                  event.target.value,
                  STRUCTURAL_RESULT_TYPES,
                  "result type",
                ),
              })
            }
          >
            {STRUCTURAL_RESULT_TYPES.map((id) => (
              <option key={id} value={id}>
                {STRUCTURAL_RESULT_LABELS[id]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-10 flex-col gap-1 text-sm">
          <span className="flex justify-between">
            Deformation scale
            <span className="font-mono text-xs text-muted">{deformationScale.toFixed(0)}×</span>
          </span>
          <input
            type="range"
            min={1}
            max={80}
            step={1}
            value={deformationScale}
            aria-label="Deformation scale"
            data-testid="structural-deformation"
            onChange={(event) =>
              experienceActions.setScenario({
                structuralDeformationScale: Number(event.target.value),
              })
            }
          />
        </label>
        <ResultLegend
          title={STRUCTURAL_RESULT_LABELS[resultType]}
          min={range.min}
          max={range.max}
          unit={STRUCTURAL_RESULT_UNITS[resultType]}
          testId="structural-legend"
        />
        <dl
          className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs"
          data-testid="structural-inspect"
        >
          <dt className="text-muted">Element</dt>
          <dd className="font-mono">{selectedElementId ?? "none"}</dd>
          <dt className="text-muted">Value</dt>
          <dd data-testid="structural-value">
            {selected
              ? formatEngineeringValue(structuralScalar(selected, resultType), resultType)
              : "—"}
          </dd>
          <dt className="text-muted">Displacement</dt>
          <dd>{selected ? `${selected.displacement.toFixed(4)} m` : "—"}</dd>
          <dt className="text-muted">Utilization</dt>
          <dd>{selected ? selected.utilization.toFixed(3) : "—"}</dd>
          <dt className="text-muted">Axial force</dt>
          <dd>{selected ? `${selected.axialForce.toFixed(1)} kN` : "—"}</dd>
          <dt className="text-muted">Offset</dt>
          <dd className="font-mono">
            {selected?.displacementVector
              ? selected.displacementVector.map((value) => value.toFixed(4)).join(", ")
              : "—"}
          </dd>
        </dl>
        <p className="text-[11px] text-muted">
          Source: PRECOMPUTED illustrative field. Not measured, not code-checked.
        </p>
        <Button
          variant="ghost"
          className="w-full"
          data-testid="structural-reset"
          onClick={() =>
            experienceActions.setScenario({
              structuralLoadCase: "gravity",
              structuralResultType: "displacement",
              structuralDeformationScale: 20,
            })
          }
        >
          Reset structural view
        </Button>
      </div>
    </Panel>
  );
}
