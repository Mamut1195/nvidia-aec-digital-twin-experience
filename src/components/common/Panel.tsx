import type { ReactNode } from "react";

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-md border border-border bg-surface/90 backdrop-blur-sm ${className}`}
    >
      {title ? (
        <header className="border-b border-border px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
          {title}
        </header>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}
