import { serverFetch } from "@/lib/server-fetch";
import { ResponseData } from "@/lib/type";
import { Property, SearchPropertyRequest } from "../schemas/schema-property";

function buildPropertyParams(search: SearchPropertyRequest): string {
  const p = new URLSearchParams();
  if (search.key) p.set("key", search.key);
  if (search.property_type) p.set("property_type", search.property_type);
  if (search.check_in) p.set("check_in", search.check_in);
  if (search.check_out) p.set("check_out", search.check_out);
  if (search.guest_count) p.set("guest_count", String(search.guest_count));
  if (search.attraction_id) p.set("attraction_id", search.attraction_id);
  if (search.page) p.set("page", String(search.page));
  if (search.size) p.set("size", String(search.size));
  return p.toString();
}

export async function serverGetProperties(
  search: SearchPropertyRequest,
): Promise<ResponseData<Property[]>> {
  const qs = buildPropertyParams(search);
  const data = await serverFetch<Property[]>(`/properties?${qs}`, { revalidate: 0 });
  return { success: true, message: "ok", data: Array.isArray(data) ? data : [] };
}

export async function serverDetailProperty(
  id: string,
): Promise<ResponseData<Property> | null> {
  const data = await serverFetch<Property>(`/properties/${id}`, { revalidate: 0 });
  if (!data) return null;
  return { success: true, message: "ok", data };
}
