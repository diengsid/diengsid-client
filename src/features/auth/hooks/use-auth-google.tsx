/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLocalStorage } from "react-use";
import z from "zod/v3";
import { Auth, AuthWithGoogleSchema } from "../schemas/auth-schema";

export const useAuthGoogle = () => {
  const [, setToken] = useLocalStorage("token", "");
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: z.infer<typeof AuthWithGoogleSchema>) =>
      await api.post("/auth/google", data),
    onSuccess: async (response) => {
      if (response.status === 200) {
        const data: ResponseData<Auth> = response.data;
        const token = data.data.token;
        setToken(token);
        toast.success(data.message);
        await router.refresh();
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
};
