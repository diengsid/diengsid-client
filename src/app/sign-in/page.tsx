import { Footer } from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/navbar/navbar";
import SignInPage from "@/features/auth/components/sign-in-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
