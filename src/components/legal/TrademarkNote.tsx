import { INDEPENDENT_DEMO_NOTE, TRADEMARK_NOTE } from "@/content/copy";

export function TrademarkNote({ compact = false }: { compact?: boolean }) {
  return (
    <p className="text-[11px] leading-relaxed text-muted" data-testid="trademark-note">
      {compact ? INDEPENDENT_DEMO_NOTE : TRADEMARK_NOTE}
    </p>
  );
}
