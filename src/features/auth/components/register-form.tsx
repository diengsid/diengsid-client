"use client";

import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import { useZodForm } from "@/hooks/use-zod-form";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import type React from "react";
import { useRegister, useSendOtp, useVerifyOtp } from "../hooks/use-auth";
import {
  OtpSchema,
  RegisterPasswordSchema,
  RegisterSchema,
} from "../schemas/auth-schema";
import AuthOtpStep from "./auth-otp-step";

type Step = "register" | "otp" | "password";

interface Props {
  onSuccess?: () => void;
  onGoLogin?: () => void;
}

export default function RegisterForm({ onSuccess, onGoLogin }: Props): React.ReactNode {
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const register = useRegister();

  const [step, setStep] = useState<Step>("register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const registerForm = useZodForm(RegisterSchema);
  const passwordForm = useZodForm(RegisterPasswordSchema);

  const handleSendOtp = registerForm.handleSubmit((data) => {
    setName(data.name);
    setEmail(data.email);
    sendOtp.mutate(data.email, {
      onSuccess: () => setStep("otp"),
      onError: (e) =>
        registerForm.setError("email", {
          message: e instanceof Error ? e.message : "Gagal mengirim OTP.",
        }),
    });
  });

  const handleVerifyOtp = (code: string) => {
    const result = OtpSchema.safeParse({ otp: code });
    if (!result.success) { setOtpError(result.error.errors[0].message); return; }
    setOtpError("");
    verifyOtp.mutate(
      { email, otp: code },
      {
        onSuccess: () => setStep("password"),
        onError: (e) => setOtpError(e instanceof Error ? e.message : "OTP tidak valid."),
      },
    );
  };

  const handleRegister = passwordForm.handleSubmit((data) => {
    register.mutate(
      { name, email, password: data.password },
      {
        onSuccess,
        onError: (e) =>
          passwordForm.setError("password", {
            message: e instanceof Error ? e.message : "Registrasi gagal.",
          }),
      },
    );
  });

  // ── Step: Register info ────────────────────────────────────────────────────
  if (step === "register") {
    return (
      <form onSubmit={handleSendOtp} className="space-y-4">
        <Input
          label="Nama lengkap"
          type="text"
          autoFocus
          error={registerForm.formState.errors.name?.message}
          {...registerForm.register("name")}
        />
        <Input
          label="Email"
          type="email"
          error={registerForm.formState.errors.email?.message}
          {...registerForm.register("email")}
        />
        <p className="text-xs text-zinc-400">
          Kami akan mengirim kode OTP ke email Anda untuk verifikasi.
        </p>
        <Button className="w-full" type="submit" loading={sendOtp.isPending}>
          Lanjutkan
        </Button>

        {onGoLogin && (
          <p className="text-center text-sm text-zinc-500">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={onGoLogin}
              className="underline font-medium text-zinc-900 cursor-pointer"
            >
              Masuk di sini
            </button>
          </p>
        )}
      </form>
    );
  }

  // ── Step: OTP ──────────────────────────────────────────────────────────────
  if (step === "otp") {
    return (
      <AuthOtpStep
        email={email}
        onVerify={handleVerifyOtp}
        onResend={() => sendOtp.mutate(email, { onError: () => setOtpError("Gagal mengirim ulang.") })}
        onBack={() => setStep("register")}
        error={otpError}
        isVerifying={verifyOtp.isPending}
        isResending={sendOtp.isPending}
      />
    );
  }

  // ── Step: Set Password ─────────────────────────────────────────────────────
  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <p className="text-sm text-zinc-500 text-center">
        Buat password untuk akun <span className="font-medium">{name}</span>
      </p>
      <PasswordInput
        label="Password (min. 8 karakter)"
        show={showPassword}
        onToggle={() => setShowPassword((v) => !v)}
        error={passwordForm.formState.errors.password?.message}
        autoFocus
        {...passwordForm.register("password")}
      />
      <Button className="w-full" type="submit" loading={register.isPending}>
        Buat akun
      </Button>
      <button
        type="button"
        onClick={() => setStep("otp")}
        className="w-full text-center text-sm text-zinc-500 underline cursor-pointer"
      >
        Kembali
      </button>
    </form>
  );
}

const PasswordInput = forwardRef<
  HTMLInputElement,
  {
    label: string;
    show: boolean;
    onToggle: () => void;
    error?: string;
    autoFocus?: boolean;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(function PasswordInput({ label, show, onToggle, error, autoFocus, ...rest }, ref) {
  return (
    <div className="relative">
      <Input ref={ref} label={label} type={show ? "text" : "password"} error={error} autoFocus={autoFocus} {...rest} />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});
