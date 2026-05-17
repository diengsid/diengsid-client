import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/type";
import { format } from "date-fns";

export type AvailabilityResponse = {
  date: string;
  available_count: number;
  price_override?: number;
  is_available: boolean;
};

export const getAvailability = async (
  rentableId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<ResponseData<AvailabilityResponse[]>> => {
  const response = await api.get(`rentables/${rentableId}/availability`, {
    params: {
      check_in: format(checkIn, "yyyy-MM-dd"),
      check_out: format(checkOut, "yyyy-MM-dd"),
    },
  });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Fetch availability failed");
  }

  return response.data;
};
