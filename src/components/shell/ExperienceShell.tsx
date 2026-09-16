import { AppFooter } from "@/components/shell/AppFooter";
import { AppHeader } from "@/components/shell/AppHeader";
import { ContextPanel } from "@/components/shell/ContextPanel";
import { MobileModeBar, ModeRail } from "@/components/shell/ModeRail";
import { ScenePlaceholder } from "@/experience/scene/ScenePlaceholder";

export function ExperienceShell() {
  return (
    <div className="flex h-dvh flex-col bg-canvas text-ink" data-testid="experience-shell">
      <AppHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <ModeRail />
        <div className="relative min-h-0 min-w-0 flex-1">
          <ScenePlaceholder />
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-3">
            <p className="pointer-events-auto rounded-md border border-border bg-surface/80 px-3 py-1 text-[11px] tracking-wide text-muted uppercase">
              Urban construction demonstrator · placeholder canvas
            </p>
          </div>
        </div>
        <ContextPanel className="hidden lg:flex" />
      </div>
      <ContextPanel className="max-h-[38vh] lg:hidden" />
      <MobileModeBar />
      <AppFooter />
    </div>
  );
}
