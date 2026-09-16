import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "quiet";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "border-accent/40 bg-accent/15 text-ink hover:bg-accent/25",
  ghost: "border-border bg-surface-elevated text-ink hover:border-muted/40 hover:bg-surface",
  quiet: "border-transparent bg-transparent text-muted hover:text-ink hover:bg-surface-elevated",
};

export function Button({
  children,
  variant = "ghost",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-10 items-center justify-center rounded-md border px-3 text-sm transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
