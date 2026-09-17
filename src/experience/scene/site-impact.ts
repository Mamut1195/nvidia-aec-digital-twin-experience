import { CONTEXT_BUILDINGS_HIGH } from "./building-layout";

export const ROAD_SEGMENTS = [
  {
    id: "ROAD-SOUTH",
    name: "South collector",
    position: [10, 0.09, 40] as [number, number, number],
    size: [130, 0.16, 8.5] as [number, number, number],
  },
  {
    id: "ROAD-EAST",
    name: "East arterial",
    position: [50, 0.09, 4] as [number, number, number],
    size: [8.5, 0.16, 100] as [number, number, number],
  },
  {
    id: "ROAD-INTERSECTION",
    name: "South-east intersection",
    position: [50, 0.11, 40] as [number, number, number],
    size: [14, 0.18, 14] as [number, number, number],
  },
] as const;

export const FLOODABLE_BUILDINGS = CONTEXT_BUILDINGS_HIGH.map((building, index) => ({
  id: `CTX-${index + 1}`,
  key: building.key,
  name: `Context building ${index + 1}`,
  position: building.position,
  size: building.size,
  footprint: [building.position[0], building.position[2]] as [number, number],
}));

export const PEDESTRIAN_ZONE_LAYOUT = [
  {
    id: "PED-GATE",
    name: "Site gate",
    center: [0, 0.06, 24] as [number, number, number],
    size: [8, 0.08, 6] as [number, number, number],
  },
  {
    id: "PED-STREET-S",
    name: "South sidewalk",
    center: [8, 0.06, 35.4] as [number, number, number],
    size: [18, 0.08, 2.4] as [number, number, number],
  },
  {
    id: "PED-STREET-E",
    name: "East sidewalk",
    center: [44.6, 0.06, 8] as [number, number, number],
    size: [2.4, 0.08, 18] as [number, number, number],
  },
  {
    id: "PED-STAGING",
    name: "Staging yard",
    center: [-18, 0.06, -20] as [number, number, number],
    size: [10, 0.08, 8] as [number, number, number],
  },
  {
    id: "PED-PLAZA",
    name: "Low plaza",
    center: [22, 0.06, 28] as [number, number, number],
    size: [14, 0.08, 12] as [number, number, number],
  },
] as const;

export const FLOOD_GRID = {
  originX: -12,
  originZ: 14,
  spacing: 4,
  nx: 20,
  nz: 12,
} as const;

export const STRUCTURAL_DISCLAIMER = "Illustrative structural-result field — not a design check.";

export const WIND_REFERENCE_SOLVER =
  "Illustrative CFD-style field authored for education. Not an OpenFOAM run and not live PhysicsNeMo inference.";
