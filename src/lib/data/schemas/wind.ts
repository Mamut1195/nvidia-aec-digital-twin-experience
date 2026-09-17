import { z } from "zod";

import { truthStatusSchema, vec3Schema } from "./common";

export const WIND_SPEEDS = ["low", "design", "extreme"] as const;

export const windSamplePointSchema = z.object({
  position: vec3Schema,
  velocity: vec3Schema,
});

export const windFacadePressureSchema = z.object({
  panelId: z.string().min(1),
  pressure: z.number(),
});

export const WIND_COMFORT_LEVELS = ["comfortable", "tolerable", "uncomfortable"] as const;

export const windPedestrianZoneSchema = z.object({
  id: z.string().min(1),
  comfort: z.enum(WIND_COMFORT_LEVELS),
  center: vec3Schema,
  size: vec3Schema,
});

export const windScenarioSchema = z.object({
  id: z.string().min(1),
  speed: z.enum(WIND_SPEEDS),
  directionDeg: z.number().min(0).lt(360),
  inflowSpeedMs: z.number().positive(),
  sourceType: z.literal("PRECOMPUTED").pipe(truthStatusSchema),
  referenceSolver: z.string().min(1),
  samplePoints: z.array(windSamplePointSchema).min(1),
  facadePressures: z.array(windFacadePressureSchema).min(1),
  pedestrianZones: z.array(windPedestrianZoneSchema).default([]),
});

export const windScenarioRefSchema = z.object({
  id: z.string().min(1),
  file: z.string().min(1),
});

export const windManifestSchema = z.object({
  projectId: z.string().min(1),
  sourceType: z.literal("PRECOMPUTED").pipe(truthStatusSchema),
  scenarios: z.array(windScenarioRefSchema).min(1),
});

export const windDatasetSchema = z.object({
  projectId: z.string().min(1),
  scenarios: z.array(windScenarioSchema).min(1),
});

export type WindComfortLevel = (typeof WIND_COMFORT_LEVELS)[number];
export type WindScenario = z.infer<typeof windScenarioSchema>;
export type WindManifest = z.infer<typeof windManifestSchema>;
export type WindDataset = z.infer<typeof windDatasetSchema>;
