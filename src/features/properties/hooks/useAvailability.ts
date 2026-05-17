import { useQuery } from "@tanstack/react-query";
import { addDays, startOfDay } from "date-fns";
import { useMemo } from "react";
import { getAvailability } from "../services/availability-service";

export function useAvailability(rentableId: string) {
  const checkIn = useMemo(() => startOfDay(new Date()), []);
  const checkOut = useMemo(() => addDays(checkIn, 90), [checkIn]);

  const { data, isLoading } = useQuery({
    queryKey: ["availability", rentableId],
    queryFn: () => getAvailability(rentableId, checkIn, checkOut),
    enabled: !!rentableId,
    staleTime: 1000 * 60 * 5,
  });

  const disabledDates = useMemo(() => {
    const set = new Set<string>();
    data?.data.forEach((item) => {
      if (!item.is_available) {
        set.add(item.date);
      }
    });
    return set;
  }, [data]);

  return { disabledDates, isLoading };
}
