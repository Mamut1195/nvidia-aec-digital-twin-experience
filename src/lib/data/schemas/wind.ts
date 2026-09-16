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

export const windPedestrianZoneSchema = z.object({
  id: z.string().min(1),
  comfort: z.enum(["comfortable", "tolerable", "uncomfortable"]),
});

export const windScenarioSchema = z.object({
  id: z.string().min(1),
  speed: z.enum(WIND_SPEEDS),
  directionDeg: z.number().min(0).lt(360),
  sourceType: z.literal("PRECOMPUTED").pipe(truthStatusSchema),
  referenceSolver: z.string().min(1),
  samplePoints: z.array(windSamplePointSchema).min(1),
  facadePressures: z.array(windFacadePressureSchema),
  pedestrianZones: z.array(windPedestrianZoneSchema).default([]),
});

export const windDatasetSchema = z.object({
  projectId: z.string().min(1),
  scenarios: z.array(windScenarioSchema).min(1),
});

export type WindScenario = z.infer<typeof windScenarioSchema>;
export type WindDataset = z.infer<typeof windDatasetSchema>;
