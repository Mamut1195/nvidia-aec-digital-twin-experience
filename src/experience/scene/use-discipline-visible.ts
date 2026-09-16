import { useExperienceStore, type LayerId } from "@/experience/state";

export function useDisciplineVisible(layer: LayerId): boolean {
  const layerVisible = useExperienceStore((state) => state.layerVisibility[layer]);
  const isolatedDiscipline = useExperienceStore((state) => state.isolatedDiscipline);
  return layerVisible && (isolatedDiscipline === null || isolatedDiscipline === layer);
}

export function useIsolatedStorey(): number | null {
  const isolatedLevel = useExperienceStore((state) => state.isolatedLevel);
  if (!isolatedLevel) {
    return null;
  }
  const match = /^L(\d{2})$/.exec(isolatedLevel);
  return match ? Number.parseInt(match[1], 10) : null;
}
