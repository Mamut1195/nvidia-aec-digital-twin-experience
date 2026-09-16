import { useState } from "react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { NVIDIA_DOES_NOT_REPLACE_REVIT } from "@/content/copy";
import {
  AUTHORING_PRODUCTS,
  ENGINEERING_PRODUCTS,
  NVIDIA_PRODUCTS,
  type EcosystemProduct,
} from "@/content/nvidia-ecosystem";

function ProductButton({
  product,
  active,
  onSelect,
}: {
  product: EcosystemProduct;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const laneClass =
    product.lane === "nvidia"
      ? "border-accent/40 hover:bg-accent/10"
      : "border-border hover:bg-surface-elevated";

  return (
    <button
      type="button"
      data-product={product.id}
      data-lane={product.lane}
      aria-pressed={active}
      className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
        active ? "bg-accent/15 text-ink" : `text-muted ${laneClass}`
      }`}
      onClick={() => onSelect(product.id)}
    >
      {product.name}
    </button>
  );
}

function ProductDetail({ product }: { product: EcosystemProduct }) {
  return (
    <div className="flex flex-col gap-2 text-sm" data-testid="ecosystem-detail">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold">{product.name}</h3>
        <StatusBadge status={product.lane === "nvidia" ? "WORKFLOW DEMO" : "INTERACTIVE WEB"} />
      </div>
      <p>
        <span className="text-muted">What it is. </span>
        {product.whatItIs}
      </p>
      <p>
        <span className="text-muted">AEC use. </span>
        {product.aecUse}
      </p>
      <p>
        <span className="text-muted">What it complements. </span>
        {product.complements}
      </p>
      <p>
        <span className="text-muted">What this demo shows. </span>
        {product.demoShows}
      </p>
      <a
        className="text-interactive underline-offset-2 hover:underline"
        href={product.officialUrl}
        target="_blank"
        rel="noreferrer"
        data-testid="ecosystem-official-link"
      >
        Official: {product.officialLabel}
      </a>
    </div>
  );
}

export function HowNvidiaFits({ className = "" }: { className?: string }) {
  const [selectedId, setSelectedId] = useState("omniverse");
  const selected =
    [...AUTHORING_PRODUCTS, ...ENGINEERING_PRODUCTS, ...NVIDIA_PRODUCTS].find(
      (product) => product.id === selectedId,
    ) ?? NVIDIA_PRODUCTS[0];

  return (
    <section className={`flex flex-col gap-4 ${className}`} data-testid="how-nvidia-fits">
      <div>
        <p className="text-[11px] tracking-[0.16em] text-muted uppercase">How NVIDIA fits</p>
        <h2 className="mt-1 text-lg font-semibold">Authoring stays authoring</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{NVIDIA_DOES_NOT_REPLACE_REVIT}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border bg-surface-elevated/50 p-3">
          <p className="mb-2 text-[11px] tracking-[0.14em] text-muted uppercase">Create / author</p>
          <div className="flex flex-col gap-2">
            {AUTHORING_PRODUCTS.map((product) => (
              <ProductButton
                key={product.id}
                product={product}
                active={product.id === selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>
          <p className="mt-4 mb-2 text-[11px] tracking-[0.14em] text-muted uppercase">
            Analyze / engineer
          </p>
          <div className="flex flex-col gap-2">
            {ENGINEERING_PRODUCTS.map((product) => (
              <ProductButton
                key={product.id}
                product={product}
                active={product.id === selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </div>
        <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
          <p className="mb-2 text-[11px] tracking-[0.14em] text-accent uppercase">NVIDIA stack</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {NVIDIA_PRODUCTS.map((product) => (
              <ProductButton
                key={product.id}
                product={product}
                active={product.id === selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-md border border-border bg-surface p-4">
        <ProductDetail product={selected} />
      </div>
    </section>
  );
}
