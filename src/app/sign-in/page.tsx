import type { Metadata } from "next";
import { Footer } from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/navbar/navbar";
import SignInPage from "@/features/auth/components/sign-in-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Masuk ke Diengs.id",
  description:
    "Masuk ke akun Diengs.id untuk memesan penginapan dan layanan wisata di kawasan Dieng.",
  robots: { index: false, follow: false },
};

export default async function SignIn() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!!token && token?.value !== "") redirect("/");

  return (
    <>
      <Navbar />
      <SignInPage />
      <Footer />
    </>
  );
}
