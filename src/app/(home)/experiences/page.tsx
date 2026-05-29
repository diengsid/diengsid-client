import { Footer } from "@/components/shared/footer/footer";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import { Clock } from "lucide-react";
import { cookies } from "next/headers";

export default async function ExperiencesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return (
    <>
      <Navbar token={token?.value} showCategoryTabs />
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Clock size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-800">Segera Hadir</h1>
          <p className="max-w-sm text-zinc-500">
            Fitur Pengalaman sedang kami siapkan. Nantikan pengalaman seru di
            sekitar Dieng yang akan segera tersedia.
          </p>
        </div>
      </main>
      <Footer />
      <div className="md:hidden">
        <MenuBar token={token?.value} />
      </div>
    </>
  );
}
