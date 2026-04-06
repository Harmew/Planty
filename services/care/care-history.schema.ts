import { z } from "zod";

// Schema
import { careType } from "./care.schema";

export const careHistorySchema = z.object({
  id: z.number(),
  plant_id: z.number(),
  care_schedule_id: z.number().nullable().optional(),
  type: careType,
  interval_days: z.number(),
  done_at: z.string(),
});

export const caresHistorySchema = z.array(careHistorySchema);

export const createCareHistorySchema = z.object({
  plant_id: z.number(),
  care_schedule_id: z.number().nullable().optional(),
  type: careType,
  interval_days: z.number(),
  done_at: z.string(),
});

export type CareHistory = z.infer<typeof careHistorySchema>;
export type CaresHistory = z.infer<typeof caresHistorySchema>;
export type CreateCareHistory = z.infer<typeof createCareHistorySchema>;
