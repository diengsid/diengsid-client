"use client";

import { useGetExperience } from "../hooks/useGetExperience";
import {
  Experience,
  SearchExperirenceRequest,
} from "../schemas/experience-schema";
import { CardSkeleton } from "./card-skeleton";
import ItemCard from "./item-card";

interface Props {
  search: SearchExperirenceRequest;
}

export default function ExperienceList({ search }: Props) {
  const { data, isFetching } = useGetExperience(search);
  const skeletonCount = 10;
  return (
    <div className="grid grid-cols-2 px-6 lg:px-12  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 mt-6">
      {isFetching
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <CardSkeleton key={i} />
          ))
        : data?.data?.map((item: Experience) => (
            <ItemCard experience={item} key={item.id} />
          ))}
    </div>
  );
}
