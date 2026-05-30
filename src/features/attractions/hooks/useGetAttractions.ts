import { ResponseData } from "@/lib/type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Attraction } from "../schemas/schema-attraction";
import { getAttractions } from "../services/attraction-service";

export function useGetAttractions() {
  return useQuery<ResponseData<Attraction[]>>({
    queryKey: ["attractions"],
    queryFn: getAttractions,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}
