import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/type";
import {
  Experience,
  SearchExperirenceRequest,
} from "../schemas/experience-schema";

export const getExperiences = async (
  search: SearchExperirenceRequest,
): Promise<ResponseData<Experience[]>> => {
  const { data } = await api.get("/experiences", {
    params: {
      key: search.key,
      type: search.type,
      page: search.page,
      size: search.size,
    },
  });

  return data;
};
