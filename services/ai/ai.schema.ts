import { z } from "zod";

// Schemas
import { plantSunlight } from "@/services/plant/plant.schema";

export const plantAISchema = z
  .object({
    sunlight: plantSunlight,
    minTemperature: z.coerce.number().min(0).max(50),
    maxTemperature: z.coerce.number().min(0).max(50),
    humidity: z.coerce.number().min(0).max(100),
  })
  .refine((data) => data.minTemperature <= data.maxTemperature, {
    message: "minTemperature must be less than or equal to maxTemperature",
    path: ["minTemperature"],
  });

export type PlantAI = z.infer<typeof plantAISchema>;
