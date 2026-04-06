import type { PlantSunlight } from "@/services/plant/plant.schema";

export function formatSunlightLabel(value: PlantSunlight) {
  switch (value) {
    case "low":
      return "Baixa";
    case "medium":
      return "Média";
    case "high":
      return "Alta";
  }
}
