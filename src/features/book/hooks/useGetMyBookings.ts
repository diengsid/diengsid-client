import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "../services/booking-service";

export function useGetMyBookings() {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
    staleTime: 60 * 1000,
  });
}
