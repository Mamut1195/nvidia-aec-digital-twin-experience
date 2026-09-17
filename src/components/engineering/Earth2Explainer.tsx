import { useState } from "react";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  EARTH2_NOT_SOLVER,
  EARTH2_OFFICIAL_LABEL,
  EARTH2_OFFICIAL_URL,
  EARTH2_STEPS,
} from "@/content/engineering";

export function Earth2Explainer({ className = "" }: { className?: string }) {
  const [activeId, setActiveId] = useState<(typeof EARTH2_STEPS)[number]["id"]>("weather");
  const active = EARTH2_STEPS.find((step) => step.id === activeId) ?? EARTH2_STEPS[0];

  return (
    <section className={`flex flex-col gap-4 ${className}`} data-testid="earth2-explainer">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
            Weather to engineering
          </p>
          <h2 className="mt-1 text-lg font-semibold">
            Earth-2 informs the chain. It does not flood the site.
          </h2>
        </div>
        <StatusBadge status="WORKFLOW DEMO" />
      </div>
      <p className="text-sm leading-relaxed text-muted" data-testid="earth2-not-solver">
        {EARTH2_NOT_SOLVER}
      </p>
      <ol className="grid gap-2 md:grid-cols-4">
        {EARTH2_STEPS.map((step, index) => (
          <li key={step.id}>
            <button
              type="button"
              data-testid={`earth2-step-${step.id}`}
              aria-pressed={step.id === activeId}
              className={`flex min-h-16 w-full flex-col rounded-md border px-3 py-2 text-left text-sm ${
                step.id === activeId
                  ? "border-accent/50 bg-accent/15 text-ink"
                  : "border-border text-muted hover:bg-surface-elevated"
              }`}
              onClick={() => setActiveId(step.id)}
            >
              <span className="text-[10px] tracking-[0.14em] uppercase">
                {index + 1}. {step.title}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="text-center text-xs tracking-[0.08em] text-muted uppercase">
        weather AI → hydrology → hydraulics → impact twin
      </p>
      <div className="rounded-md border border-border bg-surface p-4" data-testid="earth2-detail">
        <h3 className="text-base font-semibold">{active.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{active.body}</p>
      </div>
      <a
        className="text-interactive underline-offset-2 hover:underline"
        href={EARTH2_OFFICIAL_URL}
        target="_blank"
        rel="noreferrer"
        data-testid="earth2-official-link"
      >
        Official: {EARTH2_OFFICIAL_LABEL}
      </a>
    </section>
  );
}
