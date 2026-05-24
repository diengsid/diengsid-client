import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/type";
import { Property } from "../schemas/schema-property";

export const detailProperty = async (
  id: string,
): Promise<ResponseData<Property>> => {
  // Simulate an API call to authenticate the user
  const response = await api.get(`properties/${id}`);

  if (response.status !== 200) {
    throw new Error(response.data.error || "Fetch property failed");
  }

  const propertyData = response.data.data; // Validate the response data against the schema

  return { ...response.data, data: propertyData }; // Return the validated data
};
