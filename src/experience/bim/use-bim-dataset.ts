import { useEffect } from "react";
import { create } from "zustand";

import { createBimAdapter } from "@/lib/data/adapters/bim-adapter";
import { DEMO_BIM_DATASET } from "@/lib/data/bim/demo-elements";
import type { BimDataset, BimElement } from "@/lib/data/schemas/bim";

interface BimCatalogState {
  dataset: BimDataset;
  status: "idle" | "ready" | "error";
  error: string | null;
  load: () => Promise<void>;
}

export const useBimCatalog = create<BimCatalogState>((set, get) => ({
  dataset: DEMO_BIM_DATASET,
  status: "idle",
  error: null,
  async load() {
    if (get().status === "ready") {
      return;
    }
    try {
      const dataset = await createBimAdapter().load();
      set({ dataset, status: "ready", error: null });
    } catch (cause) {
      set({
        status: "error",
        error: cause instanceof Error ? cause.message : "Failed to load BIM dataset",
      });
    }
  },
}));

export function useEnsureBimDataset(): BimCatalogState {
  const catalog = useBimCatalog();

  useEffect(() => {
    void useBimCatalog.getState().load();
  }, []);

  return catalog;
}

export function getBimElement(
  id: string | null,
  dataset: BimDataset = useBimCatalog.getState().dataset,
): BimElement | undefined {
  if (!id) {
    return undefined;
  }
  return dataset.elements.find((element) => element.id === id);
}
