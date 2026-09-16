import { ContactShadows, OrbitControls } from "@react-three/drei";

import { experienceActions } from "@/experience/state";

import { CameraRig } from "./CameraRig";
import { ArchitectureGroup, MEPGroup, StructureGroup } from "./groups/BuildingGroups";
import {
  CameraMarkers,
  EffectsGroup,
  ResultOverlay,
  RobotLayer,
  SensorMarkers,
  WorkerGroup,
} from "./groups/PeopleMarkers";
import {
  EquipmentGroup,
  TemporaryWorksGroup,
  TerrainGroup,
  VehicleGroup,
} from "./groups/SiteGroups";
import { useSceneQuality } from "./quality-context";
import { SelectionSystem } from "./SelectionSystem";

export function SceneWorld() {
  const settings = useSceneQuality();

  return (
    <>
      <color attach="background" args={["#0b0e14"]} />
      <group name="Environment">
        <hemisphereLight color="#d5dde6" groundColor="#3a4038" intensity={0.55} />
        <directionalLight
          position={[48, 70, 28]}
          intensity={settings.shadows ? 1.35 : 1.05}
          castShadow={settings.shadows}
          shadow-mapSize-width={settings.shadowMapSize}
          shadow-mapSize-height={settings.shadowMapSize}
          shadow-camera-near={2}
          shadow-camera-far={180}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />
        {settings.contactShadows ? (
          <ContactShadows opacity={0.32} scale={140} far={18} blur={2.2} />
        ) : null}
      </group>
      <group
        onClick={() => {
          experienceActions.selectElement(null);
        }}
      >
        <TerrainGroup />
        <ArchitectureGroup />
        <StructureGroup />
        <MEPGroup />
        <TemporaryWorksGroup />
        <EquipmentGroup />
        <VehicleGroup />
        <WorkerGroup />
      </group>
      <CameraMarkers />
      <SensorMarkers />
      <RobotLayer />
      <ResultOverlay />
      <EffectsGroup />
      <SelectionSystem />
      <CameraRig />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2 - 0.06}
        minDistance={6}
        maxDistance={160}
      />
    </>
  );
}
