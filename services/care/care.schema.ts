import { z } from "zod";

// Util
const careInput = z
  .object({
    enabled: z.boolean(),
    interval_days: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.enabled) return;

    if (!data.interval_days || Number(data.interval_days) < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["interval_days"],
        message: "Informe a frequência",
      });
    }
  });

export const careType = z.enum(["water", "fertilizer", "prune", "repot"]);

export const careStatus = z.enum(["ok", "today", "late"]);

export const careSchema = z.object({
  id: z.number(),
  plant_id: z.number(),
  type: careType,
  interval_days: z.number().min(1),
  last_done: z.string().nullable().optional(),
  next_due: z.string(),
  created_at: z.string(),
});

export const caresSchema = z.array(careSchema);

export const createCaresSchema = z.object({
  water: careInput,
  fertilizer: careInput,
  prune: careInput,
  repot: careInput,
});

export type Care = z.infer<typeof careSchema>;
export type Cares = z.infer<typeof caresSchema>;
export type CreateCares = z.infer<typeof createCaresSchema>;
export type CareType = z.infer<typeof careType>;
export type CareStatus = z.infer<typeof careStatus>;
