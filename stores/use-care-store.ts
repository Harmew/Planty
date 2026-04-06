import { create } from "zustand";

// Schemas
import type { Care } from "@/services/care/care.schema";

type CareState = {
  /**
   * Record de cuidados por planta
   */
  caresByPlant: Record<number, Care[]>;
  /**
   * Define todos os cuidados da planta (ex: load inicial)
   */
  setCares: (plantId: number, cares: Care[]) => void;
  /**
   * Cria ou atualiza um cuidado
   */
  upsertCare: (plantId: number, care: Care) => void;
  /**
   * Remove um cuidado
   */
  removeCare: (plantId: number, careId: number) => void;
  /**
   * Limpa todos os cuidados de uma planta
   */
  removeCaresByPlant: (plantId: number) => void;
};

export const useCareStore = create<CareState>((set, get) => ({
  caresByPlant: {},

  setCares: (plantId, cares) =>
    set((state) => ({
      caresByPlant: {
        ...state.caresByPlant,
        [plantId]: cares,
      },
    })),

  upsertCare: (plantId, updatedCare) =>
    set((state) => {
      const current = state.caresByPlant[plantId] ?? [];

      const exists = current.some((c) => c.id === updatedCare.id);

      return {
        caresByPlant: {
          ...state.caresByPlant,
          [plantId]: exists
            ? current.map((c) => (c.id === updatedCare.id ? updatedCare : c))
            : [...current, updatedCare],
        },
      };
    }),

  removeCare: (plantId, careId) =>
    set((state) => {
      const current = state.caresByPlant[plantId] ?? [];

      return {
        caresByPlant: {
          ...state.caresByPlant,
          [plantId]: current.filter((c) => c.id !== careId),
        },
      };
    }),

  removeCaresByPlant: (plantId) =>
    set((state) => {
      const copy = { ...state.caresByPlant };
      delete copy[plantId];
      return { caresByPlant: copy };
    }),
}));
