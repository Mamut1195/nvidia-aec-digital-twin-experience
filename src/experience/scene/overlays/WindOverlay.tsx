import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, Color, Points } from "three";

import { getEastFacadePanels, getSouthFacadePanels } from "@/experience/scene/building-layout";
import { PEDESTRIAN_COMFORT_COLORS } from "@/experience/engineering/labels";
import { selectWindScenario, windPressureRange } from "@/experience/engineering/selectors";
import { useEnsureWindDataset } from "@/experience/engineering/use-wind-dataset";
import { useExperienceStore } from "@/experience/state";
import { useSceneQuality } from "@/experience/scene/quality-context";
import { scalarToHex } from "@/lib/viz/colormap";
import type { WindScenario } from "@/lib/data/schemas/wind";

const BOUNDS = { minX: -48, maxX: 56, minY: 0.4, maxY: 36, minZ: -44, maxZ: 48 };

function nearestVelocity(
  scenario: WindScenario,
  x: number,
  y: number,
  z: number,
): [number, number, number] {
  let best = scenario.samplePoints[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const sample of scenario.samplePoints) {
    const dx = sample.position[0] - x;
    const dy = sample.position[1] - y;
    const dz = sample.position[2] - z;
    const dist = dx * dx + dy * dy + dz * dz;
    if (dist < bestDist) {
      bestDist = dist;
      best = sample;
    }
  }
  return best.velocity;
}

function buildStreamlines(scenario: WindScenario): [number, number, number][][] {
  const theta = (scenario.directionDeg * Math.PI) / 180;
  const ux = Math.cos(theta);
  const uz = Math.sin(theta);
  const lines: [number, number, number][][] = [];
  const acrossCount = 8;
  const heights = [3, 9, 16, 24];
  for (const height of heights) {
    for (let i = 0; i < acrossCount; i += 1) {
      const across = -24 + (i / (acrossCount - 1)) * 48;
      const x0 = -ux * 36 + -uz * across;
      const z0 = -uz * 36 + ux * across;
      const points: [number, number, number][] = [[x0, height, z0]];
      for (let step = 0; step < 16; step += 1) {
        const current = points[points.length - 1];
        const velocity = nearestVelocity(scenario, current[0], current[1], current[2]);
        const speed = Math.hypot(velocity[0], velocity[1], velocity[2]) || 1;
        points.push([
          current[0] + (velocity[0] / speed) * 3.2,
          Math.max(0.6, current[1] + (velocity[1] / speed) * 3.2),
          current[2] + (velocity[2] / speed) * 3.2,
        ]);
      }
      lines.push(points);
    }
  }
  return lines;
}

function WindParticles({ scenario, count }: { scenario: WindScenario; count: number }) {
  const pointsRef = useRef<Points>(null);
  const { geometry, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const sample = scenario.samplePoints[i % scenario.samplePoints.length];
      positions[i * 3] = sample.position[0];
      positions[i * 3 + 1] = sample.position[1];
      positions[i * 3 + 2] = sample.position[2];
      vels[i * 3] = sample.velocity[0];
      vels[i * 3 + 1] = sample.velocity[1];
      vels[i * 3 + 2] = sample.velocity[2];
    }
    const next = new BufferGeometry();
    next.setAttribute("position", new BufferAttribute(positions, 3));
    return { geometry: next, velocities: vels };
  }, [count, scenario]);

  useFrame((_, delta) => {
    const node = pointsRef.current;
    if (!node) {
      return;
    }
    const attr = node.geometry.getAttribute("position");
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < count; i += 1) {
      let x = attr.getX(i) + velocities[i * 3] * dt;
      let y = attr.getY(i) + velocities[i * 3 + 1] * dt;
      let z = attr.getZ(i) + velocities[i * 3 + 2] * dt;
      if (
        x < BOUNDS.minX ||
        x > BOUNDS.maxX ||
        y < BOUNDS.minY ||
        y > BOUNDS.maxY ||
        z < BOUNDS.minZ ||
        z > BOUNDS.maxZ
      ) {
        const sample = scenario.samplePoints[i % scenario.samplePoints.length];
        x = sample.position[0];
        y = sample.position[1];
        z = sample.position[2];
      }
      attr.setXYZ(i, x, y, z);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#9fd4ff"
        size={0.28}
        transparent
        opacity={0.85}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function WindOverlay() {
  const mode = useExperienceStore((state) => state.mode);
  const speed = useExperienceStore((state) => state.scenarioControls.windSpeed);
  const direction = useExperienceStore((state) => state.scenarioControls.windDirectionDeg);
  const view = useExperienceStore((state) => state.scenarioControls.windView);
  const pedestrian = useExperienceStore((state) => state.scenarioControls.windPedestrianOverlay);
  const { dataset } = useEnsureWindDataset();
  const quality = useSceneQuality();
  const scenario = selectWindScenario(dataset, speed, direction);
  const streamlines = useMemo(() => buildStreamlines(scenario), [scenario]);
  const range = windPressureRange(scenario);
  const panels = useMemo(() => [...getSouthFacadePanels(), ...getEastFacadePanels()], []);
  const pressureById = useMemo(() => {
    const map = new Map(scenario.facadePressures.map((panel) => [panel.panelId, panel.pressure]));
    return map;
  }, [scenario]);

  if (mode !== "wind") {
    return null;
  }

  const showParticles = view === "particles" && quality.particles && quality.particleCount > 0;
  const showStreamlines = view === "streamlines" || (view === "particles" && !showParticles);
  const showFacade = view === "facade";
  const particleCount = Math.min(quality.particleCount, scenario.samplePoints.length);

  return (
    <group name="WindOverlay">
      {showParticles ? <WindParticles scenario={scenario} count={particleCount} /> : null}
      {showStreamlines
        ? streamlines.map((points, index) => (
            <Line
              key={`sl-${scenario.id}-${index}`}
              points={points}
              color={new Color("#7eb8e8")}
              lineWidth={1.4}
              transparent
              opacity={0.55}
            />
          ))
        : null}
      {showFacade
        ? panels.map((panel) => {
            const pressure = pressureById.get(panel.key) ?? 0;
            const outward: [number, number, number] = panel.key.startsWith("fac-s")
              ? [panel.position[0], panel.position[1], panel.position[2] + 0.08]
              : [panel.position[0] + 0.08, panel.position[1], panel.position[2]];
            return (
              <mesh key={panel.key} position={outward}>
                <boxGeometry args={panel.size} />
                <meshStandardMaterial
                  color={scalarToHex(pressure, range.min, range.max)}
                  emissive={scalarToHex(pressure, range.min, range.max)}
                  emissiveIntensity={0.28}
                  roughness={0.35}
                  metalness={0.12}
                />
              </mesh>
            );
          })
        : null}
      {pedestrian
        ? scenario.pedestrianZones.map((zone) => (
            <mesh key={zone.id} position={zone.center}>
              <boxGeometry args={zone.size} />
              <meshStandardMaterial
                color={PEDESTRIAN_COMFORT_COLORS[zone.comfort]}
                emissive={PEDESTRIAN_COMFORT_COLORS[zone.comfort]}
                emissiveIntensity={0.35}
                transparent
                opacity={0.55}
                depthWrite={false}
              />
            </mesh>
          ))
        : null}
    </group>
  );
}
