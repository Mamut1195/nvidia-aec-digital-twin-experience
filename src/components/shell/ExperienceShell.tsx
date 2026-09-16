import { AppFooter } from "@/components/shell/AppFooter";
import { AppHeader } from "@/components/shell/AppHeader";
import { ContextPanel } from "@/components/shell/ContextPanel";
import { MobileModeBar, ModeRail } from "@/components/shell/ModeRail";
import { ExperienceScene } from "@/experience/scene/ExperienceScene";
import { stageStatusById } from "@/experience/scene/load-stages";
import { useSceneBootstrap } from "@/experience/scene/use-scene-bootstrap";

export function ExperienceShell() {
  const bootstrap = useSceneBootstrap();
  const optionalOverlay = bootstrap.report
    ? stageStatusById(bootstrap.report, "result-fields")?.status
    : undefined;

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden bg-canvas text-ink"
      data-testid="experience-shell"
    >
      <AppHeader />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <ModeRail />
        <div className="relative min-h-0 min-w-0 flex-1">
          <ExperienceScene bootstrap={bootstrap} />
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-3">
            <p className="pointer-events-auto rounded-md border border-border bg-surface/80 px-3 py-1 text-[11px] tracking-wide text-muted uppercase">
              Urban construction demonstrator · procedural scene
            </p>
          </div>
        </div>
        <MobileModeBar />
        <ContextPanel
          className="min-h-0 max-h-[32vh] lg:max-h-none"
          optionalOverlayStatus={optionalOverlay}
        />
      </div>
      <AppFooter />
    </div>
  );
}
