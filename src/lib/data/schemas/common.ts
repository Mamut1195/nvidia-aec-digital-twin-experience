import { z } from "zod";

export const TRUTH_STATUSES = ["INTERACTIVE WEB", "PRECOMPUTED", "WORKFLOW DEMO"] as const;

export type TruthStatus = (typeof TRUTH_STATUSES)[number];

export const truthStatusSchema = z.enum(TRUTH_STATUSES);

export const vec3Schema = z.tuple([z.number(), z.number(), z.number()]);

export type Vec3 = z.infer<typeof vec3Schema>;

export const COORDINATE_CONVENTION = {
  units: "meters",
  upAxis: "y",
  origin: "building-center",
} as const;
