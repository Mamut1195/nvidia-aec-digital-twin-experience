import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Camera } from "three";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { getExperienceSnapshot, subscribeActions } from "@/experience/state";
import { getDeviceHints } from "@/lib/performance/quality";

import {
  CAMERA_PRESET_VIEWS,
  CAMERA_TRANSITION_SECONDS,
  easeInOutCubic,
  getCameraView,
} from "./camera-presets";

interface CameraAnimation {
  fromPos: Vector3;
  fromTarget: Vector3;
  toPos: Vector3;
  toTarget: Vector3;
  t: number;
  duration: number;
}

export function CameraRig() {
  const initialized = useRef(false);
  const animation = useRef<CameraAnimation | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    return subscribeActions((action) => {
      if (action.type !== "RESET" && action.type !== "SET_CAMERA_PRESET") {
        return;
      }
      const orbit = controlsRef.current;
      const camera = cameraRef.current;
      if (!orbit || !camera) {
        return;
      }
      const view = getCameraView(getExperienceSnapshot().cameraPreset);
      const reduced = getDeviceHints().prefersReducedMotion === true;
      animation.current = {
        fromPos: camera.position.clone(),
        fromTarget: orbit.target.clone(),
        toPos: new Vector3(...view.position),
        toTarget: new Vector3(...view.target),
        t: 0,
        duration: reduced ? 0.05 : CAMERA_TRANSITION_SECONDS,
      };
      orbit.enabled = false;
    });
  }, []);

  useFrame((state, delta) => {
    const orbit = state.controls as OrbitControlsImpl | undefined;
    if (!orbit) {
      return;
    }
    controlsRef.current = orbit;
    cameraRef.current = state.camera;

    if (!initialized.current) {
      const view = CAMERA_PRESET_VIEWS.overview;
      state.camera.position.set(...view.position);
      orbit.target.set(...view.target);
      orbit.update();
      initialized.current = true;
    }

    const current = animation.current;
    if (!current) {
      return;
    }
    current.t = Math.min(1, current.t + delta / current.duration);
    const eased = easeInOutCubic(current.t);
    state.camera.position.lerpVectors(current.fromPos, current.toPos, eased);
    orbit.target.lerpVectors(current.fromTarget, current.toTarget, eased);
    orbit.update();
    if (current.t >= 1) {
      orbit.enabled = true;
      animation.current = null;
    }
  });

  return null;
}
