import { legendStops } from "@/lib/viz/colormap";

export function ResultLegend({
  title,
  min,
  max,
  unit,
  testId,
}: {
  title: string;
  min: number;
  max: number;
  unit?: string;
  testId: string;
}) {
  const stops = legendStops(min, max);
  const gradient = stops.map((stop) => `${stop.color} ${Math.round(stop.t * 100)}%`).join(", ");
  const format = (value: number) =>
    Math.abs(value) >= 10
      ? value.toFixed(1)
      : Math.abs(value) >= 1
        ? value.toFixed(2)
        : value.toFixed(3);

  return (
    <div className="flex flex-col gap-2" data-testid={testId}>
      <p className="text-[11px] tracking-[0.12em] text-muted uppercase">{title}</p>
      <div
        className="h-2 w-full rounded-sm border border-border"
        style={{ background: `linear-gradient(90deg, ${gradient})` }}
        aria-hidden
      />
      <div className="flex justify-between font-mono text-[11px] text-muted">
        <span>
          {format(min)}
          {unit ? ` ${unit}` : ""}
        </span>
        <span>
          {format(max)}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
    </div>
  );
}
