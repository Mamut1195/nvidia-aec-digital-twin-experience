import { useEffect } from "react";
import { create } from "zustand";

interface CatalogState<T> {
  dataset: T;
  status: "idle" | "ready" | "error";
  error: string | null;
  load: () => Promise<void>;
}

export function createDatasetCatalog<T>(options: {
  initial: T;
  load: () => Promise<T>;
  failedMessage: string;
}) {
  const useCatalog = create<CatalogState<T>>((set, get) => ({
    dataset: options.initial,
    status: "idle",
    error: null,
    async load() {
      if (get().status === "ready") {
        return;
      }
      try {
        const dataset = await options.load();
        set({ dataset, status: "ready", error: null });
      } catch (cause) {
        set({
          status: "error",
          error: cause instanceof Error ? cause.message : options.failedMessage,
        });
      }
    },
  }));

  function useEnsureDataset(): CatalogState<T> {
    const catalog = useCatalog();
    useEffect(() => {
      void useCatalog.getState().load();
    }, []);
    return catalog;
  }

  return { useCatalog, useEnsureDataset };
}
