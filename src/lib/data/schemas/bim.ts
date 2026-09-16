import { z } from "zod";

export const BIM_DISCIPLINES = [
  "architecture",
  "structure",
  "mep",
  "terrain",
  "temporary",
  "equipment",
] as const;

export const BIM_CATEGORIES = [
  "column",
  "beam",
  "slab",
  "wall",
  "core",
  "facade",
  "space",
  "duct",
  "pipe",
  "equipment",
  "other",
] as const;

export const bimElementSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(BIM_CATEGORIES),
  discipline: z.enum(BIM_DISCIPLINES),
  level: z.string().min(1),
  material: z.string().min(1),
  geometryNodeName: z.string().min(1),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  sourceLabel: z.string().min(1),
  dimensions: z.string().optional(),
});

export const bimDatasetSchema = z.object({
  projectId: z.string().min(1),
  units: z.literal("meters"),
  elements: z.array(bimElementSchema).min(1),
});

export type BimElement = z.infer<typeof bimElementSchema>;
export type BimDataset = z.infer<typeof bimDatasetSchema>;
