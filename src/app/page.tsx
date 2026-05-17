import Categories from "@/components/shared/categories/categories";
import { Footer } from "@/components/shared/footer/footer";
import { Hero } from "@/components/shared/hero/hero";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import { WhyChooseUs } from "@/components/shared/why-choose-us/why-choose-us";
import ExperienceList from "@/features/experiences/components/list";
import { SearchExperirenceRequest } from "@/features/experiences/schemas/experience-schema";
import { getExperiences } from "@/features/experiences/services/experience.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

type Props = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function Home({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const params = await searchParams;
  const category = params.category || "property";

  const queryClient = new QueryClient();

  const search: SearchExperirenceRequest = {
    type: category,
  };

  await queryClient.prefetchQuery({
    queryKey: ["experiences", search],
    queryFn: () => getExperiences(search),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <Navbar token={token?.value} />
      <Hero />
      <Categories />
      <main className="container mt-10 mx-auto bg-white">
        <HydrationBoundary state={dehydratedState}>
          <ExperienceList search={search} />
        </HydrationBoundary>
        <WhyChooseUs />
      </main>
      <Footer />
      <div className="md:hidden">
        <MenuBar token={token?.value} />
      </div>
    </>
  );
}
