import { Footer } from "@/components/shared/footer/footer";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import BookingHistory from "@/features/book/components/booking-history";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function BookingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token?.value) redirect("/sign-in");

  return (
    <>
      <Navbar token={token.value} />
      <main className="pt-20 min-h-screen bg-zinc-50">
        <div className="max-w-xl mx-auto px-4 py-8">
          <h1 className="text-xl font-semibold mb-6">Riwayat Booking</h1>
          <BookingHistory />
        </div>
      </main>
      <div className="block md:hidden">
        <MenuBar token={token.value} />
      </div>
      <Footer />
    </>
  );
}
