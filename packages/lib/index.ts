import dayjs from "dayjs";

export function fribbit(timestamp: number) {
  return dayjs(timestamp).toISOString();
}
