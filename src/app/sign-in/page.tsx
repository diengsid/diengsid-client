import Login from "@/features/auth/components/login";

export default function SignIn() {
  return (
    <div
      className={`w-full h-full ${true ? "flex" : "hidden"} items-center justify-center fixed top-0 left-0 bg-zinc-900/40 z-10 transition-all duration-1000`}
    >
      <Login />
    </div>
  );
}
