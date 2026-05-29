import { ResponseData } from "@/lib/type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Property, SearchPropertyRequest } from "../schemas/schema-property";
import { getProperties } from "../services/property-service";

export function useGetProperties(search: SearchPropertyRequest) {
  return useQuery<ResponseData<Property[]>>({
    queryKey: ["properties", search],
    queryFn: () => getProperties(search),
    placeholderData: keepPreviousData,
    retry: 2,
  });
}
