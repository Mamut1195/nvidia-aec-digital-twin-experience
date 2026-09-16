import { z } from "zod";

import { truthStatusSchema } from "./common";

export const VIDEO_EVENT_TYPES = [
  "concrete_delivery",
  "excavator",
  "crane",
  "worker_equipment_proximity",
  "idle_interval",
  "general_delivery",
] as const;

export const videoEventSchema = z.object({
  id: z.string().min(1),
  start: z.number().nonnegative(),
  end: z.number().nonnegative(),
  type: z.enum(VIDEO_EVENT_TYPES),
  objects: z.array(z.string().min(1)).min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
});

export const videoEventIndexSchema = z
  .object({
    videoId: z.string().min(1),
    sourceType: z.literal("PRECOMPUTED").pipe(truthStatusSchema),
    provenance: z.string().min(1),
    events: z.array(videoEventSchema).min(1),
  })
  .refine((index) => index.events.every((event) => event.end >= event.start), {
    message: "Each video event end must be >= start",
  });

export type VideoEvent = z.infer<typeof videoEventSchema>;
export type VideoEventIndex = z.infer<typeof videoEventIndexSchema>;
