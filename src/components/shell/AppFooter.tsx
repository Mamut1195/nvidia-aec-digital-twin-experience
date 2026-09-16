import { TrademarkNote } from "@/components/legal/TrademarkNote";

export function AppFooter() {
  return (
    <footer
      className="border-t border-border bg-surface px-4 py-3 md:px-5"
      data-testid="app-footer"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <TrademarkNote />
        <a
          className="shrink-0 text-[11px] tracking-wide text-muted underline-offset-2 hover:text-ink hover:underline"
          href="/assets/ATTRIBUTION.md"
        >
          Asset attribution
        </a>
      </div>
    </footer>
  );
}
