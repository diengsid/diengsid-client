import { ResponseData } from "@/lib/type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Experience,
  SearchExperirenceRequest,
} from "../schemas/experience-schema";
import { getExperiences } from "../services/experience.service";

export function useGetExperience(search: SearchExperirenceRequest) {
  return useQuery<ResponseData<Experience[]>>({
    queryKey: ["experiences", search],
    queryFn: () => getExperiences(search),
    enabled: !!search.type,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}
