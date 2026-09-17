import { Instance, Instances, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points } from "three";

import { useExperienceStore } from "@/experience/state";

import {
  CAMERA_MARKER_POSITIONS,
  CONTEXT_BUILDINGS_HIGH,
  CONTEXT_BUILDINGS_LOW,
  ROBOT_WAYPOINTS,
  SENSOR_MARKER_POSITIONS,
  WORKER_POSITIONS,
} from "../building-layout";
import { SCENE_COLORS } from "../colors";
import { EXCAVATION_PIT_POSITION } from "../coordinates";
import { FloodOverlay } from "../overlays/FloodOverlay";
import { StructuralOverlay } from "../overlays/StructuralOverlay";
import { WindOverlay } from "../overlays/WindOverlay";
import { useSceneQuality } from "../quality-context";
import { useDisciplineVisible } from "../use-discipline-visible";

function Worker({ position }: { position: [number, number, number] }) {
  const { shadows } = useSceneQuality();
  return (
    <group position={position}>
      <mesh position={[0, 1.05, 0]} castShadow={shadows}>
        <capsuleGeometry args={[0.18, 0.72, 4, 8]} />
        <meshStandardMaterial color={SCENE_COLORS.worker} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.68, 0]} castShadow={shadows}>
        <sphereGeometry args={[0.15, 10, 10]} />
        <meshStandardMaterial color={SCENE_COLORS.workerSkin} roughness={0.65} />
      </mesh>
    </group>
  );
}

export function WorkerGroup() {
  const visible = useDisciplineVisible("people");
  const { contextLod, shadows } = useSceneQuality();
  const buildings = contextLod === "high" ? CONTEXT_BUILDINGS_HIGH : CONTEXT_BUILDINGS_LOW;

  if (!visible) {
    return null;
  }

  return (
    <group name="WorkerGroup">
      {WORKER_POSITIONS.map((position) => (
        <Worker key={position.join(",")} position={position} />
      ))}
      <Instances
        limit={buildings.length}
        range={buildings.length}
        castShadow={shadows}
        receiveShadow={shadows}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={SCENE_COLORS.context} roughness={0.86} metalness={0.05} />
        {buildings.map((building) => (
          <Instance key={building.key} position={building.position} scale={building.size} />
        ))}
      </Instances>
      {contextLod === "high"
        ? buildings.map((building) => (
            <mesh
              key={`${building.key}-windows`}
              position={[
                building.position[0],
                building.position[1] + 0.2,
                building.position[2] + building.size[2] / 2 + 0.04,
              ]}
            >
              <boxGeometry args={[building.size[0] * 0.72, building.size[1] * 0.55, 0.06]} />
              <meshStandardMaterial
                color={SCENE_COLORS.contextWindow}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
          ))
        : null}
    </group>
  );
}

function MarkerPole({
  position,
  color,
  height,
}: {
  position: [number, number, number];
  color: string;
  height: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.07, height, 8]} />
        <meshStandardMaterial color="#9aa3ad" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, height + 0.18, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

export function CameraMarkers() {
  return (
    <group name="CameraMarkers">
      {CAMERA_MARKER_POSITIONS.map((marker) => (
        <MarkerPole
          key={marker.id}
          position={marker.position}
          color={SCENE_COLORS.markerCam}
          height={5.2}
        />
      ))}
    </group>
  );
}

export function SensorMarkers() {
  return (
    <group name="SensorMarkers">
      {SENSOR_MARKER_POSITIONS.map((marker) => (
        <mesh key={marker.id} position={marker.position}>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
          <meshStandardMaterial
            color={SCENE_COLORS.markerSensor}
            emissive={SCENE_COLORS.markerSensor}
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

export function RobotLayer() {
  const points = useMemo(
    () => ROBOT_WAYPOINTS.map((point) => [...point] as [number, number, number]),
    [],
  );

  return (
    <group name="RobotLayer">
      <Line points={points} color={SCENE_COLORS.robot} lineWidth={2} dashed dashScale={2} />
      {ROBOT_WAYPOINTS.map((point) => (
        <mesh key={point.join(",")} position={point}>
          <sphereGeometry args={[0.18, 10, 10]} />
          <meshStandardMaterial
            color={SCENE_COLORS.robot}
            emissive={SCENE_COLORS.robot}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      <mesh position={ROBOT_WAYPOINTS[0]} castShadow>
        <boxGeometry args={[0.7, 0.45, 0.9]} />
        <meshStandardMaterial color="#4d5a46" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

export function ResultOverlay() {
  return (
    <group name="ResultOverlay">
      <StructuralOverlay />
      <WindOverlay />
      <FloodOverlay />
    </group>
  );
}

function unitNoise(seed: number): number {
  const n = Math.sin(seed * 12.9898) * 43758.5453;
  return n - Math.floor(n);
}

export function EffectsGroup() {
  const mode = useExperienceStore((state) => state.mode);
  const { particles, particleCount } = useSceneQuality();
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(Math.max(particleCount, 1) * 3);
    for (let i = 0; i < particleCount; i += 1) {
      array[i * 3] = EXCAVATION_PIT_POSITION[0] + (unitNoise(i + 1) - 0.5) * 10;
      array[i * 3 + 1] = unitNoise(i + 101) * 7;
      array[i * 3 + 2] = EXCAVATION_PIT_POSITION[2] + (unitNoise(i + 202) - 0.5) * 8;
    }
    return array;
  }, [particleCount]);

  useFrame((_, delta) => {
    const node = points.current;
    if (!node || particleCount === 0) {
      return;
    }
    const attr = node.geometry.getAttribute("position");
    for (let i = 0; i < particleCount; i += 1) {
      const y = attr.getY(i) + delta * 0.45;
      attr.setY(i, y > 7 ? 0.1 : y);
    }
    attr.needsUpdate = true;
  });

  if (
    mode === "structure" ||
    mode === "wind" ||
    mode === "flood" ||
    !particles ||
    particleCount === 0
  ) {
    return <group name="Effects" />;
  }

  return (
    <group name="Effects">
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#c9c2b0" size={0.12} transparent opacity={0.45} depthWrite={false} />
      </points>
    </group>
  );
}
