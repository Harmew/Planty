import { z } from "zod";

export const permissionStatus = z.enum(["granted", "denied", "undetermined"]);

export const permissionsSchema = z.object({
  notifications: permissionStatus,
  camera: permissionStatus,
  gallery: permissionStatus,
});

export type Permissions = z.infer<typeof permissionsSchema>;
export type PermissionStatus = z.infer<typeof permissionStatus>;
