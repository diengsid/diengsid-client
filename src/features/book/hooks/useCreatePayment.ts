import { useMutation } from "@tanstack/react-query";
import { createPayment } from "../services/booking-service";

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: (bookingId: string) => createPayment(bookingId),
  });
};
