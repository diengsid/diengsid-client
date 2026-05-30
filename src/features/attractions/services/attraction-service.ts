import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/type";
import { Attraction, NearbyAttraction } from "../schemas/schema-attraction";

export const getAttractions = async (): Promise<ResponseData<Attraction[]>> => {
  const { data } = await api.get("/tourist-attractions");
  return data;
};

export const getNearbyAttractions = async (
  propertyId: string,
): Promise<ResponseData<NearbyAttraction[]>> => {
  const { data } = await api.get(`/properties/${propertyId}/nearby-attractions`);
  return data;
};
