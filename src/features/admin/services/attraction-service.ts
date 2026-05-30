import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/type";

export type AttractionResponse = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  image_url?: string;
  created_at: number;
  updated_at: number;
};

export type AttractionCreateRequest = {
  name: string;
  slug: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  image_url?: string;
};

export type NearbyAttractionItem = {
  tourist_attraction_id: string;
  distance_km?: number;
  duration_minutes?: number;
  sort_order: number;
};

export type NearbyAttractionResponse = {
  tourist_attraction_id: string;
  distance_km?: number;
  duration_minutes?: number;
  sort_order: number;
  attraction: AttractionResponse;
};

export const getAttractions = async (): Promise<
  ResponseData<AttractionResponse[]>
> => {
  const { data } = await api.get("/tourist-attractions");
  return data;
};

export const createAttraction = async (
  req: AttractionCreateRequest,
): Promise<ResponseData<AttractionResponse>> => {
  const { data } = await api.post("/tourist-attractions", req);
  return data;
};

export const getNearbyAttractions = async (
  propertyId: string,
): Promise<ResponseData<NearbyAttractionResponse[]>> => {
  const { data } = await api.get(
    `/properties/${propertyId}/nearby-attractions`,
  );
  return data;
};

export const setNearbyAttractions = async (
  propertyId: string,
  attractions: NearbyAttractionItem[],
): Promise<ResponseData<unknown>> => {
  const { data } = await api.put(
    `/properties/${propertyId}/nearby-attractions`,
    { attractions },
  );
  return data;
};
