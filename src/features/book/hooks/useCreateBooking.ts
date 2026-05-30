import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { createBooking } from "../services/booking-service";

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBooking,
    onError: (err) => {
      const msg =
        err instanceof AxiosError
          ? (err.response?.data?.message ?? "Terjadi kesalahan, coba lagi.")
          : "Terjadi kesalahan, coba lagi.";
      toast.error(msg);
    },
  });
}
