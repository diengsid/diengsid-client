import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCurrentUser,
  loginWithPassword,
  logout,
  registerUser,
  sendOtp,
  verifyOtp,
} from "../services/auth-service";

export const useSendOtp = () =>
  useMutation({ mutationFn: (email: string) => sendOtp(email) });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtp(email, otp),
  });

export const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginWithPassword(email, password),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => registerUser(name, email, password),
  });

export const useCurrentUser = (enabled: boolean) =>
  useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

export const useLogout = () =>
  useMutation({
    mutationFn: logout,
  });
