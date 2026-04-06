import type { CareType } from "@/services/care/care.schema";

/**
 * Retorna o título da notificação com base no tipo de cuidado
 * @param type Tipo do cuidado
 */
export const getNotificationTitle = (type: CareType): string => {
  switch (type) {
    case "water":
      return "Hora de regar";
    case "fertilizer":
      return "Hora de adubar";
    case "prune":
      return "Hora de podar";
    case "repot":
      return "Hora de replantar";
  }
};

/**
 * Retorna o corpo da notificação com base no tipo de cuidado
 * @param plantName Nome da planta
 * @param type Tipo do cuidado
 */
export const getNotificationBody = (plantName: string, type: CareType): string => {
  switch (type) {
    case "water":
      return `A planta ${plantName} precisa de água!`;
    case "fertilizer":
      return `Chegou a hora de adubar a planta ${plantName}`;
    case "prune":
      return `A planta ${plantName} precisa ser podada`;
    case "repot":
      return `A planta ${plantName} precisa ser replantada`;
  }
};
