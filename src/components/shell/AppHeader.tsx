import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PRODUCT_NAME, PRODUCT_SUBTITLE } from "@/content/copy";
import { getModeDefinition } from "@/experience/modes/mode-catalog";
import {
  CAMERA_PRESET_LABELS,
  CAMERA_PRESETS,
  QUALITY_LEVELS,
  experienceActions,
  useExperienceStore,
} from "@/experience/state";
import { exitGuidedTour, startGuidedTour } from "@/experience/tour/tour-engine";
import { parseUnion } from "@/lib/parse-union";

export function AppHeader() {
  const mode = useExperienceStore((state) => state.mode);
  const quality = useExperienceStore((state) => state.quality);
  const cameraPreset = useExperienceStore((state) => state.cameraPreset);
  const guidedTourActive = useExperienceStore((state) => state.guidedTourActive);
  const definition = getModeDefinition(mode);

  return (
    <header className="flex min-h-[var(--header-height)] items-center gap-3 border-b border-border bg-surface px-3 py-2 md:px-5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] tracking-[0.16em] text-muted uppercase">
          {PRODUCT_NAME}
        </p>
        <h1 className="truncate text-sm font-semibold text-ink md:text-base">{PRODUCT_SUBTITLE}</h1>
      </div>
      <StatusBadge status={definition.status} />
      <label className="hidden items-center gap-2 text-[11px] tracking-wide text-muted uppercase sm:flex">
        Quality
        <select
          className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
          value={quality}
          aria-label="Quality"
          data-testid="quality-select"
          onChange={(event) =>
            experienceActions.setQuality(parseUnion(event.target.value, QUALITY_LEVELS, "quality"))
          }
        >
          {QUALITY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>
      <label className="hidden items-center gap-2 text-[11px] tracking-wide text-muted uppercase lg:flex">
        Camera
        <select
          className="min-h-10 rounded-md border border-border bg-surface-elevated px-2 text-xs text-ink"
          value={cameraPreset}
          aria-label="Camera preset"
          data-testid="camera-preset-select"
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
      <Button
        variant="quiet"
        data-testid="how-nvidia-fits-button"
        onClick={() => experienceActions.setOpenPanel("ecosystem")}
      >
        <span className="sm:hidden">Fits</span>
        <span className="hidden sm:inline">How NVIDIA Fits</span>
      </Button>
      <Button
        variant="quiet"
        aria-pressed={guidedTourActive}
        data-testid="header-tour"
        onClick={() => {
          if (guidedTourActive) {
            exitGuidedTour();
            return;
          }
          startGuidedTour();
        }}
      >
        {guidedTourActive ? "Exit tour" : "Tour"}
      </Button>
      <Button
        variant="ghost"
        data-testid="reset-experience"
        onClick={() => experienceActions.reset()}
      >
        Reset
      </Button>
    </header>
  );
}
