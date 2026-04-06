import React from "react";

// Schema
import type { CareType } from "@/services/care/care.schema";

// Hooks
import type { PlantWithCares } from "./use-plants-with-cares";

// Days Js
import dayjs from "dayjs";

// Utils
import { toDateOnly } from "@/utils";

export type PendingCare = {
  plantId: number;
  plantName: string;
  type: CareType;
  next_due: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
};

export const usePendingCares = (plantsWithCares: PlantWithCares[]) => {
  return React.useMemo(() => {
    const today = toDateOnly(dayjs());
    const tomorrow = toDateOnly(dayjs().add(1, "day"));

    const result: PendingCare[] = [];

    plantsWithCares.forEach((plant) => {
      plant.cares.forEach((care) => {
        const due = care.next_due;

        const isToday = due === today;
        const isTomorrow = due === tomorrow;
        const isOverdue = due < today;

        if (isToday || isTomorrow || isOverdue) {
          result.push({
            plantId: plant.id,
            plantName: plant.name,
            type: care.type,
            next_due: care.next_due,
            isOverdue,
            isToday,
            isTomorrow,
          });
        }
      });
    });

    // Retorna ordenado
    return result.sort((a, b) => dayjs(a.next_due).diff(dayjs(b.next_due)));
  }, [plantsWithCares]);
};
