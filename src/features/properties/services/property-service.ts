import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/type";
import { Property, SearchPropertyRequest } from "../schemas/schema-property";

export const getProperties = async (
  search: SearchPropertyRequest,
): Promise<ResponseData<Property[]>> => {
  const { data } = await api.get("/properties", {
    params: {
      key: search.key || undefined,
      property_type: search.property_type || undefined,
      check_in: search.check_in || undefined,
      check_out: search.check_out || undefined,
      guest_count: search.guest_count || undefined,
      attraction_id: search.attraction_id || undefined,
      page: search.page,
      size: search.size,
    },
  });

  return data;
};

export const detailProperty = async (
  id: string,
): Promise<ResponseData<Property>> => {
  const response = await api.get(`properties/${id}`);

  if (response.status !== 200) {
    throw new Error(response.data.error || "Fetch property failed");
  }

  return { ...response.data, data: response.data.data };
};
