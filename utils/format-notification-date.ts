import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";

// PLugins
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(customParseFormat);

// locale
dayjs.locale("pt-br");

type NotificationDate = {
  label: string;
  relative: string;
};

/** Formata uma data de notificação */
export const formatNotificationDate = (value: string): NotificationDate => {
  try {
    // Faz o parse do formato americano
    const date = dayjs(value);
    const now = dayjs();

    if (!date.isValid()) {
      return { label: value, relative: "" };
    }

    if (date.isToday()) {
      return {
        label: `Hoje às ${date.format("HH:mm")}`,
        relative: date.fromNow(),
      };
    }

    if (date.isYesterday()) {
      return {
        label: `Ontem às ${date.format("HH:mm")}`,
        relative: date.fromNow(),
      };
    }

    const diffDays = now.diff(date, "day");

    if (diffDays < 7) {
      return {
        label: `${date.format("dddd")} às ${date.format("HH:mm")}`,
        relative: date.fromNow(),
      };
    }

    return {
      label: date.format("DD/MM/YYYY HH:mm"),
      relative: date.fromNow(),
    };
  } catch {
    return { label: value, relative: "" };
  }
};
