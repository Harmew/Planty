import dayjs from "dayjs";

// Schema
import type { Care } from "@/services/care/care.schema";

export const getCareStatus = (care: Care) => {
  const today = dayjs();
  const next = dayjs(care.next_due);

  if (next.isBefore(today, "day")) return "late";
  if (next.isSame(today, "day")) return "today";
  return "ok";
};
