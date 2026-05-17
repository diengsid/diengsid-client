import { api } from "@/lib/axios";

export type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: string;
  email_verified: boolean;
  created_at: number;
  updated_at: number;
};

export const sendOtp = async (email: string): Promise<void> => {
  const res = await api.post("auth/send-otp", { email });
  if (!res.data.success)
    throw new Error(res.data.message || "Gagal mengirim OTP");
};

export const verifyOtp = async (email: string, otp: string): Promise<void> => {
  const res = await api.post("auth/verify-otp", { email, otp });
  if (!res.data.success) throw new Error(res.data.message || "OTP tidak valid");
};

export const loginWithPassword = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await api.post("auth/login", { email, password });
  if (!res.data.success) throw new Error(res.data.message || "Login gagal");
  return res.data.data as AuthResponse;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await api.post("auth/register", { name, email, password });
  if (!res.data.success)
    throw new Error(res.data.message || "Registrasi gagal");
  return res.data.data as AuthResponse;
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const res = await api.get("auth/_current");
  if (res.status !== 200)
    throw new Error(res.data.message || "Gagal mengambil data user");
  return res.data.data as CurrentUser;
};

export const logout = async (): Promise<void> => {
  const res = await api.delete("auth/_logout");
  if (!res.data.success) throw new Error(res.data.message || "Gagal logout");
};
