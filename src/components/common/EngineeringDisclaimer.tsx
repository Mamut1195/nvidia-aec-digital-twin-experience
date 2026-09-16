import { ENGINEERING_DISCLAIMER } from "@/content/copy";

export function EngineeringDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`border-l-2 border-alert/70 pl-3 text-xs leading-relaxed text-muted ${className}`}
      data-testid="engineering-disclaimer"
    >
      {ENGINEERING_DISCLAIMER}
    </p>
  );
}
