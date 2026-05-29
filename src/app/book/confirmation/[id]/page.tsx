import { Footer } from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/navbar/navbar";
import BookingConfirmation from "@/features/book/components/booking-confirmation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ property_id?: string }>;
};

export default async function BookingConfirmationPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { property_id } = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token?.value) redirect("/sign-in");

  return (
    <>
      <Navbar token={token.value} />
      <BookingConfirmation bookingId={id} propertyId={property_id ?? ""} />
      <Footer />
    </>
  );
}
