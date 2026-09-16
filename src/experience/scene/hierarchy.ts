/**
 * Object-group names must match the documented ExperienceScene hierarchy
 * in docs/03_TECHNICAL_ARCHITECTURE.md and docs/04_SCENE_AND_DATA.md.
 */
export const SCENE_HIERARCHY = [
  "Environment",
  "Terrain",
  "ArchitectureGroup",
  "StructureGroup",
  "MEPGroup",
  "TemporaryWorksGroup",
  "EquipmentGroup",
  "VehicleGroup",
  "WorkerGroup",
  "CameraMarkers",
  "SensorMarkers",
  "RobotLayer",
  "ResultOverlay",
  "Effects",
] as const;

export type SceneGroupName = (typeof SCENE_HIERARCHY)[number];
