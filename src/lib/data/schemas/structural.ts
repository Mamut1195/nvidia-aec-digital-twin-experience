import { z } from "zod";

import { truthStatusSchema, vec3Schema } from "./common";

export const STRUCTURAL_LOAD_CASES = ["gravity", "lateral-x", "lateral-y"] as const;
export const STRUCTURAL_RESULT_TYPES = ["displacement", "utilization", "axial-force"] as const;

export const structuralElementResultSchema = z.object({
  elementId: z.string().min(1),
  displacement: z.number(),
  utilization: z.number(),
  axialForce: z.number(),
  displacementVector: vec3Schema.optional(),
});

export const structuralLoadCaseSchema = z.object({
  loadCase: z.enum(STRUCTURAL_LOAD_CASES),
  sourceType: z.literal("PRECOMPUTED").pipe(truthStatusSchema),
  disclaimer: z.string().min(1),
  results: z.array(structuralElementResultSchema).min(1),
});

export const structuralDatasetSchema = z.object({
  projectId: z.string().min(1),
  loadCases: z.array(structuralLoadCaseSchema).min(1),
});

export type StructuralElementResult = z.infer<typeof structuralElementResultSchema>;
export type StructuralLoadCase = z.infer<typeof structuralLoadCaseSchema>;
export type StructuralDataset = z.infer<typeof structuralDatasetSchema>;
