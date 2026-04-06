import dayjs from "dayjs";

export const toDateOnly = (date: dayjs.Dayjs) => date.format("YYYY-MM-DD");

export const fromDateOnly = (date: string) => dayjs(date, "YYYY-MM-DD");
