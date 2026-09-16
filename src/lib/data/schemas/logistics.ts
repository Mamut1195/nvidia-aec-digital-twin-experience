import { z } from "zod";

import { truthStatusSchema } from "./common";

export const logisticsNodeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(["gate", "delivery", "excavation", "storage", "building"]),
  x: z.number(),
  y: z.number(),
});

export const logisticsVehicleSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["truck", "loader", "excavator"]),
  capacity: z.number().nonnegative(),
});

export const logisticsTaskSchema = z.object({
  id: z.string().min(1),
  fromNodeId: z.string().min(1),
  toNodeId: z.string().min(1),
  demand: z.number().nonnegative(),
  windowStartMinutes: z.number().nonnegative(),
  windowEndMinutes: z.number().nonnegative(),
});

export const logisticsKpiSchema = z.object({
  distanceKm: z.number().nonnegative(),
  travelTimeMinutes: z.number().nonnegative(),
  waitTimeMinutes: z.number().nonnegative(),
  lateJobs: z.number().int().nonnegative(),
});

export const logisticsRouteStopSchema = z.object({
  nodeId: z.string().min(1),
  taskId: z.string().min(1).optional(),
  arriveMinutes: z.number().nonnegative(),
});

export const logisticsRouteSchema = z.object({
  vehicleId: z.string().min(1),
  stops: z.array(logisticsRouteStopSchema).min(1),
});

export const logisticsPlanSchema = z.object({
  label: z.enum(["baseline", "optimized"]),
  provenance: z.string().min(1),
  sourceType: z.enum(["PRECOMPUTED", "WORKFLOW DEMO"]).pipe(truthStatusSchema),
  routes: z.array(logisticsRouteSchema).min(1),
  kpis: logisticsKpiSchema,
});

export const logisticsDatasetSchema = z.object({
  projectId: z.string().min(1),
  nodes: z.array(logisticsNodeSchema).min(1),
  fleet: z.array(logisticsVehicleSchema).min(1),
  tasks: z.array(logisticsTaskSchema).min(1),
  baselinePlan: logisticsPlanSchema,
  optimizedPlan: logisticsPlanSchema,
});

export type LogisticsDataset = z.infer<typeof logisticsDatasetSchema>;
