import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  exitGuidedTour,
  isLastTourStep,
  nextTourStep,
  prevTourStep,
  restartGuidedTour,
  tourStepCount,
} from "@/experience/tour/tour-engine";
import { GUIDED_TOUR_STEPS } from "@/experience/tour/tour-script";
import { useExperienceStore } from "@/experience/state";

export function TourNarration() {
  const active = useExperienceStore((state) => state.guidedTourActive);
  const index = useExperienceStore((state) => state.guidedTourStepIndex);
  const step = GUIDED_TOUR_STEPS[index];

  if (!active || !step) {
    return null;
  }

  const last = isLastTourStep(index);

  return (
    <aside
      className="pointer-events-auto w-full max-w-xl rounded-md border border-border bg-surface/95 p-4 shadow-lg backdrop-blur"
      data-testid="tour-narration"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.14em] text-muted uppercase">
            Guided tour · {index + 1} / {tourStepCount()}
          </p>
          <h2 className="mt-1 text-base font-semibold">{step.title}</h2>
        </div>
        <StatusBadge status="INTERACTIVE WEB" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink">{step.narration}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          data-testid="tour-back"
          disabled={index === 0}
          onClick={() => {
            prevTourStep();
          }}
        >
          Back
        </Button>
        <Button
          variant="primary"
          data-testid="tour-next"
          onClick={() => {
            if (last) {
              exitGuidedTour();
              return;
            }
            nextTourStep();
          }}
        >
          {last ? "Explore freely" : "Next"}
        </Button>
        <Button
          variant="quiet"
          data-testid="tour-restart"
          onClick={() => {
            restartGuidedTour();
          }}
        >
          Resume from start
        </Button>
        <Button
          variant="quiet"
          data-testid="tour-exit"
          onClick={() => {
            exitGuidedTour();
          }}
        >
          Exit tour
        </Button>
      </div>
    </aside>
  );
}
