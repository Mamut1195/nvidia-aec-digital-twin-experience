import { createContext, useContext } from "react";

import { QUALITY_PRESETS, type QualitySettings } from "@/lib/performance/quality";

export const SceneQualityContext = createContext<QualitySettings>(QUALITY_PRESETS.high);

export function useSceneQuality(): QualitySettings {
  return useContext(SceneQualityContext);
}
