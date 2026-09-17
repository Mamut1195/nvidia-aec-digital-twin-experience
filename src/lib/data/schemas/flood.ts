import { z } from "zod";

import { truthStatusSchema } from "./common";

export const floodDepthSampleSchema = z.object({
  x: z.number(),
  y: z.number(),
  depth: z.number().nonnegative(),
});

export const floodTimeStepSchema = z.object({
  timeMinutes: z.number().nonnegative(),
  depths: z.array(floodDepthSampleSchema).min(1),
  affectedRoadIds: z.array(z.string().min(1)),
  exposedBuildingIds: z.array(z.string().min(1)),
});

export const floodGridSchema = z.object({
  originX: z.number(),
  originZ: z.number(),
  spacing: z.number().positive(),
  nx: z.number().int().positive(),
  nz: z.number().int().positive(),
});

export const floodScenarioSchema = z.object({
  id: z.string().min(1),
  rainfallMmH: z.number().positive(),
  weatherScenario: z.string().min(1),
  sourceType: z.literal("PRECOMPUTED").pipe(truthStatusSchema),
  grid: floodGridSchema,
  timeSteps: z.array(floodTimeStepSchema).min(6),
});

export const floodDatasetSchema = z.object({
  projectId: z.string().min(1),
  scenarios: z.array(floodScenarioSchema).min(1),
});

export type FloodGrid = z.infer<typeof floodGridSchema>;
export type FloodTimeStep = z.infer<typeof floodTimeStepSchema>;
export type FloodScenario = z.infer<typeof floodScenarioSchema>;
export type FloodDataset = z.infer<typeof floodDatasetSchema>;
