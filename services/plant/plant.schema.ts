import { z } from "zod";

// Expo Image Picker
import type { ImagePickerAsset } from "expo-image-picker";

export const plantSunlight = z.enum(["low", "medium", "high"]);

export const plantSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string().nullable().optional(),
  location: z.string(),
  sunlight: plantSunlight,
  temperature_min: z.string().nullable().optional(),
  temperature_max: z.string().nullable().optional(),
  humidity: z.string().nullable().optional(),
  created_at: z.string(),
});

export const plantsSchema = z.array(plantSchema);

export const createPlantSchema = z
  .object({
    image: z.custom<ImagePickerAsset>((value) => value != null, {
      message: "A imagem da planta é obrigatória",
    }),

    name: z.string().trim().min(1, {
      error: "O nome da planta é obrigatório",
    }),

    location: z.string().trim().min(1, {
      error: "A localização da planta é obrigatória",
    }),

    sunlight: plantSunlight,

    temperature_min: z.string().optional(),
    temperature_max: z.string().optional(),
    humidity: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.temperature_min || !data.temperature_max || Number(data.temperature_min) <= Number(data.temperature_max),
    {
      message: "Temperatura mínima não pode ser maior que a máxima",
      path: ["temperature_min"],
    },
  );

// Planta
export type Plant = z.infer<typeof plantSchema>;
export type Plants = z.infer<typeof plantsSchema>;
export type CreatePlant = z.infer<typeof createPlantSchema>;
export type PlantSunlight = z.infer<typeof plantSunlight>;
