import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../services/booking-service";

export function useGetBooking(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
}
