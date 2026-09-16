import { z } from "zod";

import { truthStatusSchema, vec3Schema } from "./common";

export const robotWaypointSchema = z.object({
  id: z.string().min(1),
  position: vec3Schema,
  timeSeconds: z.number().nonnegative(),
  kind: z.enum(["start", "inspect", "wait", "charge", "reroute"]),
  targetId: z.string().optional(),
});

export const robotObstacleSchema = z.object({
  id: z.string().min(1),
  appearsAtSeconds: z.number().nonnegative(),
  position: vec3Schema,
});

export const robotTimelineEventSchema = z.object({
  timeSeconds: z.number().nonnegative(),
  event: z.string().min(1),
});

export const robotMissionSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  sourceType: z.literal("WORKFLOW DEMO").pipe(truthStatusSchema),
  start: vec3Schema,
  waypoints: z.array(robotWaypointSchema).min(1),
  inspectionTargets: z.array(z.string().min(1)).min(1),
  obstacle: robotObstacleSchema.optional(),
  alternatePath: z.array(robotWaypointSchema).optional(),
  timeline: z.array(robotTimelineEventSchema).min(1),
});

export type RobotMission = z.infer<typeof robotMissionSchema>;
