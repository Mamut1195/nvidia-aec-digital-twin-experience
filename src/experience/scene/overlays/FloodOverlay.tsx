import { useLayoutEffect, useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, DoubleSide } from "three";

import {
  floodDepthRange,
  interpolateFloodStep,
  selectFloodScenario,
} from "@/experience/engineering/selectors";
import { useEnsureFloodDataset } from "@/experience/engineering/use-flood-dataset";
import { FLOODABLE_BUILDINGS, ROAD_SEGMENTS } from "@/experience/scene/site-impact";
import { useExperienceStore } from "@/experience/state";
import { scalarToRgb } from "@/lib/viz/colormap";
import type { FloodGrid, FloodTimeStep } from "@/lib/data/schemas/flood";

function applyFloodGeometry(geometry: BufferGeometry, grid: FloodGrid, step: FloodTimeStep): void {
  const count = grid.nx * grid.nz;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const range = floodDepthRange(step);
  for (let i = 0; i < step.depths.length && i < count; i += 1) {
    const sample = step.depths[i];
    positions[i * 3] = sample.x;
    positions[i * 3 + 1] = Math.max(sample.depth, 0.02);
    positions[i * 3 + 2] = sample.y;
    const color = scalarToRgb(sample.depth, range.min, range.max);
    colors[i * 3] = color.r / 255;
    colors[i * 3 + 1] = color.g / 255;
    colors[i * 3 + 2] = color.b / 255;
  }
  const indices: number[] = [];
  for (let iz = 0; iz < grid.nz - 1; iz += 1) {
    for (let ix = 0; ix < grid.nx - 1; ix += 1) {
      const a = iz * grid.nx + ix;
      const b = a + 1;
      const c = a + grid.nx;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
}

export function FloodOverlay() {
  const mode = useExperienceStore((state) => state.mode);
  const rainfall = useExperienceStore((state) => state.scenarioControls.floodRainfallMmH);
  const timeMinutes = useExperienceStore((state) => state.scenarioControls.floodTimeMinutes);
  const { dataset } = useEnsureFloodDataset();
  const scenario = dataset ? selectFloodScenario(dataset, rainfall) : null;
  const step = scenario ? interpolateFloodStep(scenario, timeMinutes) : null;
  const geometry = useMemo(() => new BufferGeometry(), []);
  const geometryRef = useRef(geometry);

  useLayoutEffect(() => {
    if (!scenario || !step) {
      return;
    }
    applyFloodGeometry(geometryRef.current, scenario.grid, step);
  }, [scenario, step]);

  if (mode !== "flood" || !scenario || !step) {
    return null;
  }

  const wet = step.depths.some((sample) => sample.depth > 0.02);

  return (
    <group name="FloodOverlay">
      {wet ? (
        <mesh
          key={`${scenario.id}-${Math.round(step.timeMinutes)}`}
          geometry={geometry}
          renderOrder={2}
        >
          <meshStandardMaterial
            vertexColors
            transparent
            opacity={0.62}
            roughness={0.18}
            metalness={0.04}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ) : null}
      {ROAD_SEGMENTS.map((road) => {
        const affected = step.affectedRoadIds.includes(road.id);
        return (
          <mesh key={road.id} position={road.position}>
            <boxGeometry args={road.size} />
            <meshStandardMaterial
              color={affected ? "#e07a3d" : "#2a2d32"}
              emissive={affected ? "#e07a3d" : "#000000"}
              emissiveIntensity={affected ? 0.35 : 0}
              transparent
              opacity={affected ? 0.7 : 0.0}
              depthWrite={false}
            />
          </mesh>
        );
      })}
      {FLOODABLE_BUILDINGS.map((building) => {
        const exposed = step.exposedBuildingIds.includes(building.id);
        if (!exposed) {
          return null;
        }
        return (
          <mesh
            key={building.id}
            position={[building.position[0], building.position[1], building.position[2]]}
          >
            <boxGeometry
              args={[building.size[0] * 1.06, building.size[1] * 1.06, building.size[2] * 1.06]}
            />
            <meshBasicMaterial color="#e07a3d" transparent opacity={0.22} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}
