import { Canvas } from "@react-three/fiber";

import { useExperienceStore } from "@/experience/state";
import { getDeviceHints, resolveQuality } from "@/lib/performance/quality";

import { CAMERA_PRESET_VIEWS } from "./camera-presets";
import { stageStatusById } from "./load-stages";
import { SceneQualityContext } from "./quality-context";
import { SceneWorld } from "./SceneWorld";
import { SceneLoaderOverlay, type SceneBootstrap } from "./use-scene-bootstrap";

export function ExperienceScene({ bootstrap }: { bootstrap: SceneBootstrap }) {
  const quality = useExperienceStore((state) => state.quality);
  const settings = resolveQuality(quality, getDeviceHints());
  const optionalStatus = bootstrap.report
    ? stageStatusById(bootstrap.report, "result-fields")?.status
    : undefined;

  return (
    <div className="absolute inset-0 bg-canvas touch-none" data-testid="scene-canvas">
      {bootstrap.ready ? (
        <>
          <Canvas
            camera={{
              position: CAMERA_PRESET_VIEWS.overview.position,
              fov: 42,
              near: 0.45,
              far: 480,
            }}
            dpr={settings.dpr}
            shadows={settings.shadows}
            gl={{ antialias: settings.antialias, powerPreference: "high-performance" }}
          >
            <SceneQualityContext.Provider value={settings}>
              <SceneWorld />
            </SceneQualityContext.Provider>
          </Canvas>
          <div
            className="sr-only"
            data-testid="scene-ready"
            data-load-result-fields={optionalStatus}
          >
            Scene ready
          </div>
        </>
      ) : (
        <SceneLoaderOverlay
          report={bootstrap.report}
          error={bootstrap.error}
          onRetry={bootstrap.retry}
        />
      )}
    </div>
  );
}
