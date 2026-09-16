import { StatusBadge } from "@/components/common/StatusBadge";
import { MODE_LIST } from "@/experience/modes/mode-catalog";
import { experienceActions, useExperienceStore } from "@/experience/state";

function ModeButton({
  mode,
  active,
  compact,
}: {
  mode: (typeof MODE_LIST)[number];
  active: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      data-mode={mode.id}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-10 items-center justify-between gap-2 rounded-md border px-3 text-left text-sm transition-colors duration-300 ${
        active
          ? "border-accent/50 bg-accent/15 text-ink"
          : "border-transparent text-muted hover:border-border hover:bg-surface-elevated hover:text-ink"
      }`}
      onClick={() => experienceActions.setMode(mode.id)}
    >
      <span className="min-w-0 leading-tight">{compact ? mode.shortLabel : mode.label}</span>
      {compact ? null : <StatusBadge status={mode.status} className="shrink-0" />}
    </button>
  );
}

export function ModeRail() {
  const activeMode = useExperienceStore((state) => state.mode);

  return (
    <nav
      aria-label="Experience modes"
      className="hidden w-[var(--rail-width)] shrink-0 flex-col gap-1 overflow-y-auto border-r border-border bg-surface p-3 lg:flex"
      data-testid="mode-rail"
    >
      {MODE_LIST.map((mode) => (
        <ModeButton key={mode.id} mode={mode} active={mode.id === activeMode} />
      ))}
    </nav>
  );
}

export function MobileModeBar() {
  const activeMode = useExperienceStore((state) => state.mode);

  return (
    <nav
      aria-label="Experience modes"
      className="relative z-20 flex shrink-0 gap-2 overflow-x-auto border-t border-border bg-surface p-2 lg:hidden"
      data-testid="mobile-mode-bar"
    >
      {MODE_LIST.map((mode) => (
        <div key={mode.id} className="shrink-0">
          <ModeButton mode={mode} active={mode.id === activeMode} compact />
        </div>
      ))}
    </nav>
  );
}
