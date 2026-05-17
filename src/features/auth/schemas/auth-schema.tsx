import { z } from "zod/v3";

export const AuthSchema = z.object({
  token: z.string(),
});

export const AuthWithGoogleSchema = z.object({
  token: z.string(),
});

export const EmailSchema = z.object({
  email: z.string().min(1, "Email harus diisi.").email("Format email tidak valid."),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "Nama harus diisi."),
  email: z.string().min(1, "Email harus diisi.").email("Format email tidak valid."),
});

export const OtpSchema = z.object({
  otp: z.string().length(6, "Masukkan 6 digit kode OTP."),
});

export const PasswordSchema = z.object({
  password: z.string().min(1, "Password harus diisi."),
});

export const RegisterPasswordSchema = z.object({
  password: z.string().min(8, "Password minimal 8 karakter."),
});

export type AuthGoogle = z.infer<typeof AuthWithGoogleSchema>;
export type Auth = z.infer<typeof AuthSchema>;
