import { serverFetch } from "@/lib/server-fetch";
import { ResponseData } from "@/lib/type";
import { Attraction } from "../schemas/schema-attraction";

export async function serverGetAttractions(): Promise<ResponseData<Attraction[]>> {
  const data = await serverFetch<Attraction[]>("/tourist-attractions", { revalidate: 0 });
  return { success: true, message: "ok", data: Array.isArray(data) ? data : [] };
}
