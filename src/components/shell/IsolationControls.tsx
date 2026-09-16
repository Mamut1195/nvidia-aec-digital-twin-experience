import { Button } from "@/components/common/Button";
import { Panel } from "@/components/common/Panel";
import { LAYER_IDS, LAYER_LABELS, experienceActions, useExperienceStore } from "@/experience/state";
import { uniqueBimLevels } from "@/lib/data/bim/demo-elements";
import { parseUnion } from "@/lib/parse-union";

const ISOLATABLE_DISCIPLINES = LAYER_IDS;

export function IsolationControls() {
  const isolatedLevel = useExperienceStore((state) => state.isolatedLevel);
  const isolatedDiscipline = useExperienceStore((state) => state.isolatedDiscipline);
  const levels = uniqueBimLevels();

  return (
    <Panel title="Isolate">
      <div className="flex flex-col gap-3" data-testid="isolation-controls">
        <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
          <span>Level</span>
          <select
            className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
            value={isolatedLevel ?? ""}
            aria-label="Isolate level"
            data-testid="isolate-level"
            onChange={(event) =>
              experienceActions.setIsolation({
                level: event.target.value === "" ? null : event.target.value,
              })
            }
          >
            <option value="">All levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
          <span>Discipline</span>
          <select
            className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
            value={isolatedDiscipline ?? ""}
            aria-label="Isolate discipline"
            data-testid="isolate-discipline"
            onChange={(event) =>
              experienceActions.setIsolation({
                discipline:
                  event.target.value === ""
                    ? null
                    : parseUnion(event.target.value, ISOLATABLE_DISCIPLINES, "discipline"),
              })
            }
          >
            <option value="">All disciplines</option>
            {ISOLATABLE_DISCIPLINES.map((discipline) => (
              <option key={discipline} value={discipline}>
                {LAYER_LABELS[discipline]}
              </option>
            ))}
          </select>
        </label>
        <Button
          variant="ghost"
          className="w-full"
          data-testid="restore-isolation"
          onClick={() => experienceActions.restoreIsolation()}
        >
          Restore all
        </Button>
        <p className="text-xs text-muted" data-testid="isolation-state">
          {isolatedLevel || isolatedDiscipline
            ? `Isolating ${[isolatedLevel, isolatedDiscipline].filter(Boolean).join(" · ")}`
            : "Showing the composed project"}
        </p>
      </div>
    </Panel>
  );
}
