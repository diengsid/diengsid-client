import { Footer } from "@/components/shared/footer/footer";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import ProfilePage from "@/features/auth/components/profile-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Profile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token?.value) redirect("/sign-in");

  return (
    <>
      <Navbar token={token.value} />
      <main className="pt-20  bg-zinc-50">
        <ProfilePage token={token.value} />
      </main>
      <div className="block md:hidden">
        <MenuBar token={token.value} />
      </div>
      <Footer />
    </>
  );
}
