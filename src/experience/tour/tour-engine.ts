import { assertNever } from "@/lib/assert-never";

import { experienceActions, getExperienceSnapshot } from "../state";
import { GUIDED_TOUR_STEPS, type GuidedTourStep, type TourScriptedAction } from "./tour-script";

export function getTourStep(index: number): GuidedTourStep | undefined {
  return GUIDED_TOUR_STEPS[index];
}

export function tourStepCount(): number {
  return GUIDED_TOUR_STEPS.length;
}

export function applyScriptedAction(action: TourScriptedAction): void {
  switch (action.type) {
    case "none":
      return;
    case "select-element":
      experienceActions.selectElement(action.elementId);
      return;
    case "isolate-level":
      experienceActions.setIsolation({ level: action.level, discipline: null });
      return;
    case "isolate-discipline":
      experienceActions.setIsolation({ discipline: action.discipline, level: null });
      return;
    case "restore-isolation":
      experienceActions.restoreIsolation();
      experienceActions.selectElement(null);
      return;
    case "open-panel":
      experienceActions.restoreIsolation();
      experienceActions.selectElement(null);
      experienceActions.setOpenPanel(action.panel);
      return;
    case "close-panel":
      experienceActions.setOpenPanel(null);
      return;
    default:
      assertNever(action, "tour scripted action");
  }
}

export function applyTourStep(step: GuidedTourStep): void {
  experienceActions.setMode(step.targetMode);
  experienceActions.setCameraPreset(step.cameraPreset);
  experienceActions.setLayerVisibility(step.layerVisibility);
  experienceActions.setOpenPanel(null);
  if (
    step.scriptedAction.type !== "isolate-level" &&
    step.scriptedAction.type !== "isolate-discipline"
  ) {
    experienceActions.restoreIsolation();
  }
  if (step.scriptedAction.type !== "select-element") {
    experienceActions.selectElement(null);
  }
  applyScriptedAction(step.scriptedAction);
}

export function startGuidedTour(): GuidedTourStep {
  experienceActions.setTour(true);
  experienceActions.setTourStep(0);
  const step = GUIDED_TOUR_STEPS[0];
  applyTourStep(step);
  return step;
}

export function restartGuidedTour(): GuidedTourStep {
  return startGuidedTour();
}

export function exitGuidedTour(): void {
  experienceActions.setTour(false);
  experienceActions.setOpenPanel(null);
}

export function goToTourStep(index: number): GuidedTourStep | null {
  if (index < 0 || index >= GUIDED_TOUR_STEPS.length) {
    return null;
  }
  experienceActions.setTour(true);
  experienceActions.setTourStep(index);
  const step = GUIDED_TOUR_STEPS[index];
  applyTourStep(step);
  return step;
}

export function nextTourStep(): GuidedTourStep | "exit" {
  const current = getExperienceSnapshot().guidedTourStepIndex;
  const next = current + 1;
  if (next >= GUIDED_TOUR_STEPS.length) {
    exitGuidedTour();
    return "exit";
  }
  const step = goToTourStep(next);
  return step ?? "exit";
}

export function prevTourStep(): GuidedTourStep | null {
  const current = getExperienceSnapshot().guidedTourStepIndex;
  if (current <= 0) {
    return GUIDED_TOUR_STEPS[0] ?? null;
  }
  return goToTourStep(current - 1);
}

export function isLastTourStep(index: number): boolean {
  return index >= GUIDED_TOUR_STEPS.length - 1;
}
