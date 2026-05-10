import { ResponseData } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import { Property } from "../schemas/schema-property";
import { detailProperty } from "../services/property-service";

export function useFindProperty(id: string) {
  return useQuery<ResponseData<Property>>({
    queryKey: ["experience", id],
    queryFn: async () => await detailProperty(id),
    enabled: !!id, // hanya jalan kalau id ada
    retry: 2,
  });
}
