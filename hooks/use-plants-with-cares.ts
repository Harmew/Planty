// Schemas
import type { Cares } from "@/services/care/care.schema";
import type { Plant } from "@/services/plant/plant.schema";

// Stores
import { useCareStore } from "@/stores/use-care-store";
import { usePlantStore } from "@/stores/use-plant-store";

export type PlantWithCares = Plant & {
  cares: Cares;
};

export const usePlantsWithCares = (): PlantWithCares[] => {
  const plants = usePlantStore((state) => state.plants);
  const caresByPlant = useCareStore((state) => state.caresByPlant);

  return plants.map((plant) => ({
    ...plant,
    cares: caresByPlant[plant.id] ?? [],
  }));
};
