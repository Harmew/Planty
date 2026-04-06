import { create } from "zustand";

// Schemas
import { CareHistory, CaresHistory } from "@/services/care/care-history.schema";

/**
 * Ordena histórico por data (mais recente primeiro)
 */
const sortHistory = (history: CaresHistory) =>
  [...history].sort((a, b) => new Date(b.done_at).getTime() - new Date(a.done_at).getTime());

type CareHistoryState = {
  /**
   * Histórico de cuidados por planta
   */
  historyByPlant: Record<number, CaresHistory>;
  /**
   * Define todo histórico da planta (ex: load inicial)
   */
  setHistory: (plantId: number, history: CaresHistory) => void;
  /**
   * Adiciona um novo item no histórico (append otimista)
   */
  addHistory: (plantId: number, history: CareHistory) => void;
  /**
   * Remove um item específico do histórico
   */
  removeHistory: (plantId: number, historyId: number) => void;
  /**
   * Limpa histórico da planta
   */
  clearHistory: (plantId: number) => void;
};

export const useCareHistoryStore = create<CareHistoryState>((set, get) => ({
  /**
   * Objetos de histórico de cuidados por planta
   */
  historyByPlant: {},

  /**
   * SET completo (replace)
   */
  setHistory: (plantId, history) =>
    set((state) => ({
      historyByPlant: {
        ...state.historyByPlant,
        [plantId]: sortHistory(history),
      },
    })),

  /**
   * ADD (append no topo)
   */
  addHistory: (plantId, newHistory) =>
    set((state) => {
      const current = state.historyByPlant[plantId] ?? [];

      return {
        historyByPlant: {
          ...state.historyByPlant,
          [plantId]: sortHistory([newHistory, ...current]),
        },
      };
    }),

  /**
   * REMOVE
   */
  removeHistory: (plantId, historyId) =>
    set((state) => {
      const current = state.historyByPlant[plantId] ?? [];

      return {
        historyByPlant: {
          ...state.historyByPlant,
          [plantId]: current.filter((h) => h.id !== historyId),
        },
      };
    }),

  /**
   * CLEAR
   */
  clearHistory: (plantId) =>
    set((state) => {
      const copy = { ...state.historyByPlant };
      delete copy[plantId];
      return { historyByPlant: copy };
    }),
}));
