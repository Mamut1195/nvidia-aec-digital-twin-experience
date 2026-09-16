import { StatusBadge } from "@/components/common/StatusBadge";
import { USD_TRUTH_NOTE } from "@/content/copy";
import { experienceActions, USD_SOURCE_LAYERS, useExperienceStore } from "@/experience/state";

const LAYER_FILES: Record<(typeof USD_SOURCE_LAYERS)[number], string> = {
  architecture: "architecture.usd",
  structure: "structure.usd",
  mep: "mep.usd",
  terrain: "terrain.usd",
  equipment: "equipment.usd",
};

function usdaSnippet(enabled: Record<string, boolean>): string {
  const references = USD_SOURCE_LAYERS.filter((layer) => enabled[layer])
    .map((layer) => `    references = @./${LAYER_FILES[layer]}@`)
    .join("\n");
  return `#usda 1.0
def Xform "ProjectStage" (
${references || "    # no source layers enabled"}
)
{
    # composed stage — educational snippet, not a live parse
}`;
}

export function OpenUsdExplainer({ className = "" }: { className?: string }) {
  const layerVisibility = useExperienceStore((state) => state.layerVisibility);

  return (
    <section className={`flex flex-col gap-4 ${className}`} data-testid="openusd-explainer">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">OpenUSD composition</p>
          <h2 className="mt-1 text-lg font-semibold">Layers → references → composed stage</h2>
        </div>
        <StatusBadge status="INTERACTIVE WEB" />
      </div>
      <p className="text-sm leading-relaxed text-muted">{USD_TRUTH_NOTE}</p>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <ul className="flex flex-col gap-2">
          {USD_SOURCE_LAYERS.map((layer) => {
            const enabled = layerVisibility[layer];
            return (
              <li key={layer}>
                <label className="flex min-h-10 items-center justify-between gap-3 rounded-md border border-border bg-surface-elevated px-3 text-sm">
                  <span className="font-mono text-xs">{LAYER_FILES[layer]}</span>
                  <input
                    type="checkbox"
                    className="size-4 accent-accent"
                    checked={enabled}
                    aria-label={`Toggle ${LAYER_FILES[layer]}`}
                    data-testid={`usd-layer-${layer}`}
                    onChange={(event) => experienceActions.setLayer(layer, event.target.checked)}
                  />
                </label>
              </li>
            );
          })}
        </ul>
        <p className="text-center text-2xl text-accent" aria-hidden>
          →
        </p>
        <div
          className="rounded-md border border-accent/40 bg-accent/10 p-4 text-sm"
          data-testid="usd-composed-stage"
        >
          <p className="text-[11px] tracking-[0.14em] text-accent uppercase">
            Composed project stage
          </p>
          <p className="mt-2 text-ink">
            {USD_SOURCE_LAYERS.filter((layer) => layerVisibility[layer])
              .map((layer) => LAYER_FILES[layer])
              .join(" + ") || "No source layers enabled"}
          </p>
        </div>
      </div>
      <pre
        className="overflow-x-auto rounded-md border border-border bg-canvas p-3 font-mono text-[11px] leading-relaxed text-muted"
        data-testid="usd-snippet"
      >
        {usdaSnippet(layerVisibility)}
      </pre>
      <p className="text-xs text-muted">
        Toggling a source layer updates the educational diagram and the matching Three.js discipline
        group. That is composition as a teaching model, not a USD runtime.
      </p>
    </section>
  );
}
