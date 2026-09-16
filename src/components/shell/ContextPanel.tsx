import { EngineeringDisclaimer } from "@/components/common/EngineeringDisclaimer";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PHASE_0_NOTE } from "@/content/copy";
import { getModeDefinition } from "@/experience/modes/mode-catalog";
import { LAYER_IDS, experienceActions, useExperienceStore } from "@/experience/state";

export function ContextPanel({ className = "" }: { className?: string }) {
  const mode = useExperienceStore((state) => state.mode);
  const selectedElementId = useExperienceStore((state) => state.selectedElementId);
  const layerVisibility = useExperienceStore((state) => state.layerVisibility);
  const scenarioControls = useExperienceStore((state) => state.scenarioControls);
  const cameraPreset = useExperienceStore((state) => state.cameraPreset);
  const quality = useExperienceStore((state) => state.quality);
  const definition = getModeDefinition(mode);

  return (
    <aside
      className={`flex w-full shrink-0 flex-col gap-3 overflow-y-auto border-border bg-surface p-3 lg:w-[var(--panel-width)] lg:border-l ${className}`}
      data-testid="context-panel"
    >
      <Panel title="Context">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold">{definition.label}</h2>
            <StatusBadge status={definition.status} />
          </div>
          <p className="text-sm leading-relaxed text-muted">{definition.summary}</p>
          <p className="text-xs text-muted">{PHASE_0_NOTE}</p>
          {definition.showsEngineeringDisclaimer ? <EngineeringDisclaimer /> : null}
        </div>
      </Panel>
      <Panel title="Layers">
        <ul className="flex flex-col gap-2">
          {LAYER_IDS.map((layer) => (
            <li key={layer}>
              <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
                <span className="capitalize">{layer}</span>
                <input
                  type="checkbox"
                  className="size-4 accent-accent"
                  checked={layerVisibility[layer]}
                  onChange={(event) => experienceActions.setLayer(layer, event.target.checked)}
                />
              </label>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="State">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
          <dt className="text-muted">Selected</dt>
          <dd className="font-mono tabular">{selectedElementId ?? "none"}</dd>
          <dt className="text-muted">Quality</dt>
          <dd className="capitalize">{quality}</dd>
          <dt className="text-muted">Camera</dt>
          <dd className="font-mono">{cameraPreset}</dd>
          <dt className="text-muted">Wind</dt>
          <dd className="tabular">
            {scenarioControls.windSpeed} / {scenarioControls.windDirectionDeg}°
          </dd>
        </dl>
      </Panel>
    </aside>
  );
}
