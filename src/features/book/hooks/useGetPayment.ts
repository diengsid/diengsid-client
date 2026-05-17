import { useQuery } from "@tanstack/react-query";
import { getPaymentByBooking } from "../services/booking-service";

export const useGetPayment = (bookingId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["booking-payment", bookingId],
    queryFn: () => getPaymentByBooking(bookingId),
    enabled,
    staleTime: 30_000,
    retry: false,
  });
};
