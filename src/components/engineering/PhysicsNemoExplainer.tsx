import { useState } from "react";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  PHYSICS_NEMO_OFFICIAL_LABEL,
  PHYSICS_NEMO_OFFICIAL_URL,
  PHYSICS_NEMO_STEPS,
  PHYSICS_NEMO_TRUTH,
} from "@/content/engineering";

export function PhysicsNemoExplainer({ className = "" }: { className?: string }) {
  const [activeId, setActiveId] = useState<(typeof PHYSICS_NEMO_STEPS)[number]["id"]>("solver");
  const active = PHYSICS_NEMO_STEPS.find((step) => step.id === activeId) ?? PHYSICS_NEMO_STEPS[0];

  return (
    <section className={`flex flex-col gap-4 ${className}`} data-testid="physicsnemo-explainer">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Physics AI workflow</p>
          <h2 className="mt-1 text-lg font-semibold">Solver first, surrogate after validation</h2>
        </div>
        <StatusBadge status="WORKFLOW DEMO" />
      </div>
      <p className="text-sm leading-relaxed text-muted">{PHYSICS_NEMO_TRUTH}</p>
      <ol className="grid gap-2 md:grid-cols-4">
        {PHYSICS_NEMO_STEPS.map((step, index) => (
          <li key={step.id}>
            <button
              type="button"
              data-testid={`physicsnemo-step-${step.id}`}
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
        high-fidelity solver → training/reference data → PhysicsNeMo model → validated fast
        inference
      </p>
      <div
        className="rounded-md border border-border bg-surface p-4"
        data-testid="physicsnemo-detail"
      >
        <h3 className="text-base font-semibold">{active.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{active.body}</p>
      </div>
      <p className="text-sm leading-relaxed text-muted">
        The high-fidelity solver and the PhysicsNeMo surrogate are different tools. The solver
        produces trusted reference data; the surrogate approximates selected behavior only after
        validation against that reference. This page does not claim a speedup or a benchmark.
      </p>
      <a
        className="text-interactive underline-offset-2 hover:underline"
        href={PHYSICS_NEMO_OFFICIAL_URL}
        target="_blank"
        rel="noreferrer"
        data-testid="physicsnemo-official-link"
      >
        Official: {PHYSICS_NEMO_OFFICIAL_LABEL}
      </a>
    </section>
  );
}
