import { assertNever } from "@/lib/assert-never";
import type { TruthStatus } from "@/lib/data/schemas/common";

const STATUS_CLASS: Record<TruthStatus, string> = {
  "INTERACTIVE WEB": "border-interactive/40 bg-interactive/15 text-interactive",
  PRECOMPUTED: "border-precomputed/40 bg-precomputed/15 text-precomputed",
  "WORKFLOW DEMO": "border-workflow/40 bg-workflow/15 text-workflow",
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: TruthStatus;
  className?: string;
}) {
  let tone: string;
  switch (status) {
    case "INTERACTIVE WEB":
    case "PRECOMPUTED":
    case "WORKFLOW DEMO":
      tone = STATUS_CLASS[status];
      break;
    default:
      return assertNever(status, "truth status");
  }

  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] uppercase ${tone} ${className}`}
      data-status={status}
    >
      {status}
    </span>
  );
}
