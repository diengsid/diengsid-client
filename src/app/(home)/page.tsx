import Categories from "@/components/shared/categories/categories";
import { Footer } from "@/components/shared/footer/footer";
import ForbiddenToast from "@/components/shared/forbidden-toast/forbidden-toast";
import { Hero } from "@/components/shared/hero/hero";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import { WhyChooseUs } from "@/components/shared/why-choose-us/why-choose-us";
import PropertyList from "@/features/properties/components/list";
import { SearchPropertyRequest } from "@/features/properties/schemas/schema-property";
import { getProperties } from "@/features/properties/services/property-service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function Home({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const params = await searchParams;
  const category = params.category || "";

  const queryClient = new QueryClient();

  const search: SearchPropertyRequest = {
    property_type: category || undefined,
    page: 1,
    size: 20,
  };

  await queryClient.prefetchQuery({
    queryKey: ["properties", search],
    queryFn: () => getProperties(search),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <Suspense>
        <ForbiddenToast />
      </Suspense>
      <Navbar token={token?.value} showCategoryTabs />
      <Hero />
      <Categories />
      <main className="container mt-10 mx-auto bg-white">
        <HydrationBoundary state={dehydratedState}>
          <PropertyList search={search} />
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
