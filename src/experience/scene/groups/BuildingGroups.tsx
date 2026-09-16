import { Instance, Instances } from "@react-three/drei";

import { useExperienceStore } from "@/experience/state";

import {
  BEAM_X_SIZE,
  BEAM_Z_SIZE,
  COLUMN_INSTANCE_SIZE,
  getBeamsX,
  getBeamsZ,
  getColumnInstances,
  getCoreWalls,
  getEastFacadePanels,
  getSlabs,
  getSouthFacadePanels,
} from "../building-layout";
import { SCENE_COLORS } from "../colors";
import { BUILDING_HEIGHT_M } from "../coordinates";
import { useSceneQuality } from "../quality-context";

export function StructureGroup() {
  const visible = useExperienceStore((state) => state.layerVisibility.structure);
  const { shadows } = useSceneQuality();
  const columns = getColumnInstances();
  const beamsX = getBeamsX();
  const beamsZ = getBeamsZ();
  const slabs = getSlabs();
  const core = getCoreWalls();

  if (!visible) {
    return null;
  }

  return (
    <group name="StructureGroup">
      <Instances
        limit={columns.length}
        range={columns.length}
        castShadow={shadows}
        receiveShadow={shadows}
      >
        <boxGeometry args={COLUMN_INSTANCE_SIZE} />
        <meshStandardMaterial color={SCENE_COLORS.concrete} roughness={0.88} metalness={0.04} />
        {columns.map((column) => (
          <Instance key={column.key} position={column.position} />
        ))}
      </Instances>
      <Instances
        limit={beamsX.length}
        range={beamsX.length}
        castShadow={shadows}
        receiveShadow={shadows}
      >
        <boxGeometry args={BEAM_X_SIZE} />
        <meshStandardMaterial color={SCENE_COLORS.steel} roughness={0.42} metalness={0.55} />
        {beamsX.map((beam) => (
          <Instance key={beam.key} position={beam.position} />
        ))}
      </Instances>
      <Instances
        limit={beamsZ.length}
        range={beamsZ.length}
        castShadow={shadows}
        receiveShadow={shadows}
      >
        <boxGeometry args={BEAM_Z_SIZE} />
        <meshStandardMaterial color={SCENE_COLORS.steel} roughness={0.42} metalness={0.55} />
        {beamsZ.map((beam) => (
          <Instance key={beam.key} position={beam.position} />
        ))}
      </Instances>
      {slabs.map((slab) => (
        <mesh key={slab.key} position={slab.position} castShadow={shadows} receiveShadow={shadows}>
          <boxGeometry args={slab.size} />
          <meshStandardMaterial color={SCENE_COLORS.concrete} roughness={0.9} metalness={0.03} />
        </mesh>
      ))}
      {core.map((wall) => (
        <mesh key={wall.key} position={wall.position} castShadow={shadows} receiveShadow={shadows}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial
            color={SCENE_COLORS.concreteCore}
            roughness={0.86}
            metalness={0.04}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ArchitectureGroup() {
  const visible = useExperienceStore((state) => state.layerVisibility.architecture);
  const { shadows } = useSceneQuality();
  const south = getSouthFacadePanels();
  const east = getEastFacadePanels();

  if (!visible) {
    return null;
  }

  return (
    <group name="ArchitectureGroup">
      <Instances limit={south.length} range={south.length} castShadow={shadows}>
        <boxGeometry args={south[0]?.size ?? [1, 1, 1]} />
        <meshStandardMaterial
          color={SCENE_COLORS.glass}
          roughness={0.12}
          metalness={0.35}
          transparent
          opacity={0.42}
        />
        {south.map((panel) => (
          <Instance key={panel.key} position={panel.position} />
        ))}
      </Instances>
      {east.map((panel) => (
        <mesh key={panel.key} position={panel.position} castShadow={shadows}>
          <boxGeometry args={panel.size} />
          <meshStandardMaterial
            color={SCENE_COLORS.glass}
            roughness={0.12}
            metalness={0.35}
            transparent
            opacity={0.42}
          />
        </mesh>
      ))}
      <mesh position={[0, BUILDING_HEIGHT_M + 0.35, 15.15]} castShadow={shadows}>
        <boxGeometry args={[40.8, 0.7, 0.18]} />
        <meshStandardMaterial color={SCENE_COLORS.concreteCore} roughness={0.8} />
      </mesh>
      <mesh position={[20.15, BUILDING_HEIGHT_M + 0.35, 0]} castShadow={shadows}>
        <boxGeometry args={[0.18, 0.7, 30.8]} />
        <meshStandardMaterial color={SCENE_COLORS.concreteCore} roughness={0.8} />
      </mesh>
    </group>
  );
}

export function MEPGroup() {
  const visible = useExperienceStore((state) => state.layerVisibility.mep);
  const { shadows } = useSceneQuality();

  if (!visible) {
    return null;
  }

  return (
    <group name="MEPGroup">
      <mesh position={[5.6, 12, 0]} castShadow={shadows}>
        <boxGeometry args={[0.7, 22, 0.7]} />
        <meshStandardMaterial color="#4f7d86" roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[6, 10.1, 8]} castShadow={shadows}>
        <boxGeometry args={[18, 0.5, 0.72]} />
        <meshStandardMaterial color="#5b8a92" roughness={0.4} metalness={0.25} />
      </mesh>
      <mesh position={[6, 17.3, 8]} castShadow={shadows}>
        <boxGeometry args={[18, 0.5, 0.72]} />
        <meshStandardMaterial color="#5b8a92" roughness={0.4} metalness={0.25} />
      </mesh>
      <mesh position={[-8, 10.05, -6]} rotation={[0, 0, Math.PI / 2]} castShadow={shadows}>
        <cylinderGeometry args={[0.12, 0.12, 16, 8]} />
        <meshStandardMaterial color="#8a5a3c" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[8, BUILDING_HEIGHT_M + 1.1, 4]} castShadow={shadows}>
        <boxGeometry args={[4.2, 1.8, 2.6]} />
        <meshStandardMaterial color="#6d757c" roughness={0.5} metalness={0.35} />
      </mesh>
      <mesh position={[-7, BUILDING_HEIGHT_M + 1.0, -4]} castShadow={shadows}>
        <boxGeometry args={[3.4, 1.5, 2.2]} />
        <meshStandardMaterial color="#667078" roughness={0.48} metalness={0.4} />
      </mesh>
      <mesh position={[0, BUILDING_HEIGHT_M + 1.6, -6]} castShadow={shadows}>
        <cylinderGeometry args={[0.9, 1.1, 2.4, 10]} />
        <meshStandardMaterial color="#7a8288" roughness={0.55} metalness={0.3} />
      </mesh>
    </group>
  );
}
