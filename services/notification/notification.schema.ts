import { z } from "zod";

// Schemas
import { careType } from "@/services/care/care.schema";

export const notificationSchema = z.object({
  id: z.number(),
  plant_id: z.number().nullable().optional(),
  care_schedule_id: z.number().nullable().optional(),
  title: z.string(),
  body: z.string(),
  type: careType,
  read: z.number().int().min(0).max(1),
  scheduled_for: z.string(),
  expo_notification_id: z.string().nullable().optional(),
  created_at: z.string(),
});

export const notificationsSchema = z.array(notificationSchema);

export const createNotificationSchema = z.object({
  plant_id: z.number(),

  care_schedule_id: z.number(),

  title: z.string().trim().min(1, {
    error: "O título é obrigatório",
  }),

  body: z.string().min(1, {
    error: "O corpo é obrigatório",
  }),

  type: careType,

  scheduled_for: z.string(),
});

export type Notification = z.infer<typeof notificationSchema>;
export type Notifications = z.infer<typeof notificationsSchema>;
export type CreateNotification = z.infer<typeof createNotificationSchema>;
