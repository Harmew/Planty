import { z } from "zod";

// Schemas
import { caresHistorySchema } from "@/services/care/care-history.schema";
import { caresSchema } from "@/services/care/care.schema";
import { notificationsSchema } from "@/services/notification/notification.schema";
import { plantsSchema } from "@/services/plant/plant.schema";

export const backupSchema = z.object({
  schema_version: z.number(),
  exported_at: z.string(),
  data: z.object({
    plants: plantsSchema,
    cares: caresSchema,
    history: caresHistorySchema,
    notifications: notificationsSchema,
  }),
  images: z.record(z.string(), z.string()),
});

export type Backup = z.infer<typeof backupSchema>;
