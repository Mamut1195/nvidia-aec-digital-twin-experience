import { z } from "zod";

import { truthStatusSchema } from "./common";

export const TWIN_EVENT_KINDS = [
  "weather",
  "progress",
  "equipment",
  "sensor",
  "camera",
  "alert",
] as const;

export const twinReplayEventSchema = z.object({
  timeSeconds: z.number().nonnegative(),
  kind: z.enum(TWIN_EVENT_KINDS),
  title: z.string().min(1),
  detail: z.string().min(1),
  relatedId: z.string().optional(),
});

export const twinReplaySchema = z.object({
  id: z.string().min(1),
  durationSeconds: z.number().positive(),
  sourceType: z.literal("WORKFLOW DEMO").pipe(truthStatusSchema),
  events: z.array(twinReplayEventSchema).min(1),
});

export type TwinReplay = z.infer<typeof twinReplaySchema>;
