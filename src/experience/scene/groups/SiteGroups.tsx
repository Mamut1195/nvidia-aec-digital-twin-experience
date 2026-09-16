import { Instance, Instances } from "@react-three/drei";

import { useDisciplineVisible } from "../use-discipline-visible";

import { getFencePosts, TRUCK_POSES } from "../building-layout";
import { SCENE_COLORS } from "../colors";
import {
  CRANE_POSITION,
  EXCAVATION_PIT_POSITION,
  EXCAVATOR_POSITION,
  FENCE_BOUNDS_M,
} from "../coordinates";
import { useSceneQuality } from "../quality-context";

export function TerrainGroup() {
  const visible = useDisciplineVisible("terrain");
  const { shadows } = useSceneQuality();

  if (!visible) {
    return null;
  }

  return (
    <group name="Terrain">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, 0, 0]} receiveShadow={shadows}>
        <planeGeometry args={[160, 140]} />
        <meshStandardMaterial color={SCENE_COLORS.terrain} roughness={1} metalness={0} />
      </mesh>
      <mesh position={[6, 1.8, -48]} rotation={[-0.18, 0, 0]} receiveShadow={shadows}>
        <boxGeometry args={[90, 0.6, 28]} />
        <meshStandardMaterial color={SCENE_COLORS.slope} roughness={1} />
      </mesh>
      <mesh position={[22, -0.18, 30]} receiveShadow={shadows}>
        <boxGeometry args={[40, 0.5, 26]} />
        <meshStandardMaterial color={SCENE_COLORS.terrainLow} roughness={1} />
      </mesh>
      <mesh position={[8, -0.35, 28]} receiveShadow={shadows}>
        <boxGeometry args={[48, 0.4, 2.2]} />
        <meshStandardMaterial color="#243038" roughness={0.95} />
      </mesh>
      <mesh position={[10, 0.06, 40]} receiveShadow={shadows}>
        <boxGeometry args={[130, 0.14, 8.5]} />
        <meshStandardMaterial color={SCENE_COLORS.asphalt} roughness={0.92} />
      </mesh>
      <mesh position={[50, 0.06, 4]} receiveShadow={shadows}>
        <boxGeometry args={[8.5, 0.14, 100]} />
        <meshStandardMaterial color={SCENE_COLORS.asphalt} roughness={0.92} />
      </mesh>
      <mesh position={[10, 0.08, 35.4]} receiveShadow={shadows}>
        <boxGeometry args={[130, 0.1, 1.6]} />
        <meshStandardMaterial color={SCENE_COLORS.sidewalk} roughness={0.95} />
      </mesh>
      <mesh position={[44.6, 0.08, 4]} receiveShadow={shadows}>
        <boxGeometry args={[1.6, 0.1, 100]} />
        <meshStandardMaterial color={SCENE_COLORS.sidewalk} roughness={0.95} />
      </mesh>
      <mesh position={EXCAVATION_PIT_POSITION} receiveShadow={shadows}>
        <boxGeometry args={[10, 2.4, 8]} />
        <meshStandardMaterial color="#4a4034" roughness={1} />
      </mesh>
    </group>
  );
}

export function TemporaryWorksGroup() {
  const visible = useDisciplineVisible("temporary");
  const { shadows } = useSceneQuality();
  const posts = getFencePosts();
  const { minX, maxX, minZ, maxZ } = FENCE_BOUNDS_M;

  if (!visible) {
    return null;
  }

  return (
    <group name="TemporaryWorksGroup">
      <Instances limit={posts.length} range={posts.length} castShadow={shadows}>
        <cylinderGeometry args={[0.055, 0.055, 2.3, 6]} />
        <meshStandardMaterial color={SCENE_COLORS.fencing} roughness={0.55} metalness={0.25} />
        {posts.map((post) => (
          <Instance key={post.key} position={post.position} />
        ))}
      </Instances>
      <mesh position={[(minX + maxX) / 2, 1.7, minZ]} castShadow={shadows}>
        <boxGeometry args={[maxX - minX, 0.06, 0.05]} />
        <meshStandardMaterial color={SCENE_COLORS.fencing} metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[(minX + maxX) / 2, 0.7, minZ]}>
        <boxGeometry args={[maxX - minX, 0.06, 0.05]} />
        <meshStandardMaterial color={SCENE_COLORS.fencing} metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[minX, 1.7, (minZ + maxZ) / 2]}>
        <boxGeometry args={[0.05, 0.06, maxZ - minZ]} />
        <meshStandardMaterial color={SCENE_COLORS.fencing} metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[maxX, 1.7, (minZ + maxZ) / 2]}>
        <boxGeometry args={[0.05, 0.06, maxZ - minZ]} />
        <meshStandardMaterial color={SCENE_COLORS.fencing} metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[-19, 1.7, maxZ]}>
        <boxGeometry args={[26, 0.06, 0.05]} />
        <meshStandardMaterial color={SCENE_COLORS.fencing} metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[17, 1.7, maxZ]}>
        <boxGeometry args={[22, 0.06, 0.05]} />
        <meshStandardMaterial color={SCENE_COLORS.fencing} metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[-28, 1.4, -22]} castShadow={shadows}>
        <boxGeometry args={[6.2, 2.8, 2.6]} />
        <meshStandardMaterial color={SCENE_COLORS.siteOffice} roughness={0.7} />
      </mesh>
      <mesh position={[-18, 0.12, -20]} receiveShadow={shadows}>
        <boxGeometry args={[14, 0.18, 10]} />
        <meshStandardMaterial color={SCENE_COLORS.gravel} roughness={1} />
      </mesh>
      <mesh position={[-16, 0.7, -22]} castShadow={shadows}>
        <boxGeometry args={[2.2, 1.2, 1.4]} />
        <meshStandardMaterial color="#8a6a45" roughness={0.85} />
      </mesh>
      <mesh position={[-13.5, 0.55, -21]} castShadow={shadows}>
        <boxGeometry args={[1.6, 0.9, 1.2]} />
        <meshStandardMaterial color="#7a5c3a" roughness={0.85} />
      </mesh>
      <mesh position={[12, 0.1, -22]} receiveShadow={shadows}>
        <boxGeometry args={[10, 0.16, 8]} />
        <meshStandardMaterial color="#5a584e" roughness={1} />
      </mesh>
    </group>
  );
}

function TowerCrane() {
  const { shadows } = useSceneQuality();
  const [x, , z] = CRANE_POSITION;

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.4, 0]} castShadow={shadows}>
        <boxGeometry args={[3.2, 0.8, 3.2]} />
        <meshStandardMaterial color={SCENE_COLORS.equipmentDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, 21, 0]} castShadow={shadows}>
        <boxGeometry args={[1.15, 42, 1.15]} />
        <meshStandardMaterial color={SCENE_COLORS.equipment} metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[10, 42.4, 0]} castShadow={shadows}>
        <boxGeometry args={[32, 0.55, 0.7]} />
        <meshStandardMaterial color={SCENE_COLORS.equipment} metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[-8, 42.3, 0]} castShadow={shadows}>
        <boxGeometry args={[10, 0.5, 0.7]} />
        <meshStandardMaterial color={SCENE_COLORS.equipment} metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[-12, 41.4, 0]} castShadow={shadows}>
        <boxGeometry args={[2.4, 1.4, 1.6]} />
        <meshStandardMaterial color={SCENE_COLORS.equipmentDark} roughness={0.6} />
      </mesh>
      <mesh position={[16, 40, 0]}>
        <boxGeometry args={[0.08, 4.6, 0.08]} />
        <meshStandardMaterial color="#c9ccd1" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[16, 37.5, 0]} castShadow={shadows}>
        <boxGeometry args={[0.7, 0.5, 0.7]} />
        <meshStandardMaterial color={SCENE_COLORS.equipmentDark} />
      </mesh>
    </group>
  );
}

function Excavator() {
  const { shadows } = useSceneQuality();
  const [x, , z] = EXCAVATOR_POSITION;

  return (
    <group position={[x, 0, z]} rotation={[0, 0.6, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow={shadows}>
        <boxGeometry args={[3.4, 0.5, 2.1]} />
        <meshStandardMaterial color={SCENE_COLORS.equipmentDark} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow={shadows}>
        <boxGeometry args={[2.4, 1.1, 1.8]} />
        <meshStandardMaterial color={SCENE_COLORS.equipment} metalness={0.25} roughness={0.5} />
      </mesh>
      <mesh position={[-0.4, 1.85, 0.2]} castShadow={shadows}>
        <boxGeometry args={[1.1, 0.8, 1.2]} />
        <meshStandardMaterial color={SCENE_COLORS.cabin} roughness={0.45} />
      </mesh>
      <mesh position={[1.8, 1.7, 0]} rotation={[0, 0, -0.5]} castShadow={shadows}>
        <boxGeometry args={[2.6, 0.28, 0.28]} />
        <meshStandardMaterial color={SCENE_COLORS.equipment} />
      </mesh>
      <mesh position={[3.4, 1.1, 0]} rotation={[0, 0, 0.6]} castShadow={shadows}>
        <boxGeometry args={[1.8, 0.24, 0.24]} />
        <meshStandardMaterial color={SCENE_COLORS.equipment} />
      </mesh>
      <mesh position={[4.2, 0.45, 0]} castShadow={shadows}>
        <boxGeometry args={[0.7, 0.5, 0.8]} />
        <meshStandardMaterial color={SCENE_COLORS.equipmentDark} />
      </mesh>
    </group>
  );
}

export function EquipmentGroup() {
  const visible = useDisciplineVisible("equipment");

  if (!visible) {
    return null;
  }

  return (
    <group name="EquipmentGroup">
      <TowerCrane />
      <Excavator />
    </group>
  );
}

function Truck({ position }: { position: [number, number, number] }) {
  const { shadows } = useSceneQuality();
  return (
    <group position={position}>
      <mesh position={[0, 1.15, 1.5]} castShadow={shadows}>
        <boxGeometry args={[2.2, 1.5, 2.2]} />
        <meshStandardMaterial color={SCENE_COLORS.cabin} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.2, -1.4]} castShadow={shadows}>
        <boxGeometry args={[2.3, 1.6, 3.6]} />
        <meshStandardMaterial color={SCENE_COLORS.equipment} roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh position={[-0.85, 0.38, 1.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.28, 10]} />
        <meshStandardMaterial color="#1a1c20" />
      </mesh>
      <mesh position={[0.85, 0.38, 1.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.28, 10]} />
        <meshStandardMaterial color="#1a1c20" />
      </mesh>
      <mesh position={[-0.85, 0.38, -2.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.28, 10]} />
        <meshStandardMaterial color="#1a1c20" />
      </mesh>
      <mesh position={[0.85, 0.38, -2.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.28, 10]} />
        <meshStandardMaterial color="#1a1c20" />
      </mesh>
    </group>
  );
}

export function VehicleGroup() {
  const visible = useDisciplineVisible("equipment");

  if (!visible) {
    return null;
  }

  return (
    <group name="VehicleGroup">
      {TRUCK_POSES.map((truck) => (
        <Truck key={truck.key} position={truck.position} />
      ))}
    </group>
  );
}
