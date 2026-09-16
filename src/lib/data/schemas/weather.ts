import { z } from "zod";

import { truthStatusSchema } from "./common";

export const weatherScenarioSchema = z.object({
  scenario: z.string().min(1),
  rainfallMmH: z.number().nonnegative(),
  windMs: z.number().nonnegative(),
  sourceType: z.literal("WORKFLOW DEMO").pipe(truthStatusSchema),
  explanation: z.string().min(1),
});

export const weatherDatasetSchema = z.object({
  projectId: z.string().min(1),
  scenarios: z.array(weatherScenarioSchema).min(1),
});

export type WeatherScenario = z.infer<typeof weatherScenarioSchema>;
export type WeatherDataset = z.infer<typeof weatherDatasetSchema>;
