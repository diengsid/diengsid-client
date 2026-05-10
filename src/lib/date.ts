import { format, isSameMonth, isSameYear } from "date-fns";
import { id } from "date-fns/locale";

export const parseLocalDate = (dateStr?: string) => {
  if (!dateStr) return null; // ⬅️ penting
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (date: Date | null) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export function formatDateRange(start?: Date | null, end?: Date | null) {
  if (!start || !end) return "";

  const sameMonth = isSameMonth(start, end);
  const sameYear = isSameYear(start, end);

  // 24 - 25 April
  if (sameMonth && sameYear) {
    return `${format(start, "d")} - ${format(end, "d MMMM", { locale: id })}`;
  }
}
