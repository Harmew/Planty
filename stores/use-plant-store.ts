import { create } from "zustand";

// Schemas
import type { Plant, Plants } from "@/services/plant/plant.schema";

// Utils para sorted
const sortPlants = (plants: Plants) => {
  return [...plants].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

type PlantStore = {
  /**
   * Plantas cadastradas
   */
  plants: Plants;
  /**
   * Define as plantas cadastradas (ex: load inicial)
   */
  setPlants: (plants: Plants) => void;
  /**
   * Adiciona uma nova planta
   */
  addPlant: (plant: Plant) => void;
  /**
   * Atualiza uma planta existente
   */
  updatePlant: (plant: Plant) => void;
  /**
   * Remove uma planta existente
   */
  removePlant: (id: number) => void;
};

export const usePlantStore = create<PlantStore>((set) => ({
  plants: [],

  setPlants: (plants) =>
    set({
      plants: sortPlants(plants),
    }),

  addPlant: (plant) =>
    set((state) => ({
      plants: sortPlants([plant, ...state.plants]),
    })),

  updatePlant: (plant) =>
    set((state) => ({
      plants: state.plants.map((p) => (p.id === plant.id ? plant : p)),
    })),

  removePlant: (id) =>
    set((state) => ({
      plants: state.plants.filter((p) => p.id !== id),
    })),
}));
