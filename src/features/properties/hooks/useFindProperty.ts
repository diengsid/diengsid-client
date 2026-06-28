import { ResponseData } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import { Property } from "../schemas/schema-property";
import { detailProperty, detailPropertyBySlug } from "../services/property-service";

export function useFindProperty(id: string) {
  return useQuery<ResponseData<Property>>({
    queryKey: ["property", id],
    queryFn: async () => await detailProperty(id),
    enabled: !!id,
    retry: 2,
  });
}

export function useFindPropertyBySlug(slug: string) {
  return useQuery<ResponseData<Property>>({
    queryKey: ["property-slug", slug],
    queryFn: async () => await detailPropertyBySlug(slug),
    enabled: !!slug,
    retry: 2,
  });
}
