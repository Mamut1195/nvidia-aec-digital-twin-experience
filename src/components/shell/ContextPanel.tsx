import { Button } from "@/components/common/Button";
import { EngineeringDisclaimer } from "@/components/common/EngineeringDisclaimer";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PHASE_NOTE } from "@/content/copy";
import { getModeDefinition } from "@/experience/modes/mode-catalog";
import type { LoadStageStatus } from "@/experience/scene/load-stages";
import { getSelectable } from "@/experience/scene/selectables";
import {
  CAMERA_PRESET_LABELS,
  CAMERA_PRESETS,
  LAYER_IDS,
  LAYER_LABELS,
  QUALITY_LEVELS,
  experienceActions,
  useExperienceStore,
} from "@/experience/state";
import { parseUnion } from "@/lib/parse-union";

export function ContextPanel({
  className = "",
  optionalOverlayStatus,
}: {
  className?: string;
  optionalOverlayStatus?: LoadStageStatus;
}) {
  const mode = useExperienceStore((state) => state.mode);
  const selectedElementId = useExperienceStore((state) => state.selectedElementId);
  const layerVisibility = useExperienceStore((state) => state.layerVisibility);
  const scenarioControls = useExperienceStore((state) => state.scenarioControls);
  const cameraPreset = useExperienceStore((state) => state.cameraPreset);
  const quality = useExperienceStore((state) => state.quality);
  const definition = getModeDefinition(mode);
  const selected = selectedElementId ? getSelectable(selectedElementId) : undefined;

  return (
    <aside
      className={`flex w-full min-h-0 shrink-0 flex-col gap-3 overflow-y-auto border-border bg-surface p-3 lg:w-[var(--panel-width)] lg:shrink-0 lg:border-l ${className}`}
      data-testid="context-panel"
    >
      <Panel title="Context">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold">{definition.label}</h2>
            <StatusBadge status={definition.status} />
          </div>
          <p className="text-sm leading-relaxed text-muted">{definition.summary}</p>
          <p className="text-xs text-muted">{PHASE_NOTE}</p>
          {definition.showsEngineeringDisclaimer ? <EngineeringDisclaimer /> : null}
        </div>
      </Panel>
      <Panel title="Selection" className="sm:block">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
          <dt className="text-muted">ID</dt>
          <dd className="font-mono tabular" data-testid="selected-element-id">
            {selectedElementId ?? "none"}
          </dd>
          <dt className="text-muted">Name</dt>
          <dd>{selected?.name ?? "—"}</dd>
          <dt className="text-muted">Category</dt>
          <dd className="capitalize">{selected?.category ?? "—"}</dd>
        </dl>
        <Button
          className="mt-3 w-full"
          variant="ghost"
          disabled={!selectedElementId}
          data-testid="clear-selection"
          onClick={() => experienceActions.selectElement(null)}
        >
          Clear selection
        </Button>
        <button
          type="button"
          className="sr-only"
          data-testid="select-sample"
          onClick={() => experienceActions.selectElement("STR-COL-L01-C01")}
        >
          Select sample column
        </button>
        <p className="mt-2 text-xs text-muted">Tap or click a highlighted object in the scene.</p>
      </Panel>
      <Panel title="View" className="lg:hidden">
        <div className="flex flex-col gap-3">
          <label className="flex min-h-10 items-center justify-between gap-3 text-sm sm:hidden">
            <span>Quality</span>
            <select
              className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
              value={quality}
              aria-label="Quality (compact)"
              data-testid="quality-select-compact"
              onChange={(event) =>
                experienceActions.setQuality(
                  parseUnion(event.target.value, QUALITY_LEVELS, "quality"),
                )
              }
            >
              {QUALITY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
            <span>Camera</span>
            <select
              className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
              value={cameraPreset}
              aria-label="Camera preset (compact)"
              data-testid="camera-preset-select-compact"
              onChange={(event) =>
                experienceActions.setCameraPreset(
                  parseUnion(event.target.value, CAMERA_PRESETS, "camera preset"),
                )
              }
            >
              {CAMERA_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {CAMERA_PRESET_LABELS[preset]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Panel>
      <Panel title="Layers">
        <ul className="flex flex-col gap-2">
          {LAYER_IDS.map((layer) => (
            <li key={layer}>
              <label className="flex min-h-10 items-center justify-between gap-3 text-sm">
                <span>{LAYER_LABELS[layer]}</span>
                <input
                  type="checkbox"
                  className="size-4 accent-accent"
                  checked={layerVisibility[layer]}
                  aria-label={LAYER_LABELS[layer]}
                  data-testid={`layer-${layer}`}
                  onChange={(event) => experienceActions.setLayer(layer, event.target.checked)}
                />
              </label>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="State">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
          <dt className="text-muted">Quality</dt>
          <dd className="capitalize" data-testid="quality-state">
            {quality}
          </dd>
          <dt className="text-muted">Camera</dt>
          <dd className="font-mono" data-testid="camera-state">
            {cameraPreset}
          </dd>
          <dt className="text-muted">Wind</dt>
          <dd className="tabular">
            {scenarioControls.windSpeed} / {scenarioControls.windDirectionDeg}°
          </dd>
          <dt className="text-muted">Overlay</dt>
          <dd data-testid="optional-overlay-status">{optionalOverlayStatus ?? "loading"}</dd>
        </dl>
      </Panel>
    </aside>
  );
}
