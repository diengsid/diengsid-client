import { useMutation } from "@tanstack/react-query";
import { createBooking } from "../services/booking-service";

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBooking,
  });
}
