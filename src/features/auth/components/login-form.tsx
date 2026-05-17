"use client";

import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import { useZodForm } from "@/hooks/use-zod-form";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import type React from "react";
import { useAuthGoogle } from "../hooks/use-auth-google";
import { useLogin, useSendOtp, useVerifyOtp } from "../hooks/use-auth";
import {
  EmailSchema,
  OtpSchema,
  PasswordSchema,
} from "../schemas/auth-schema";
import AuthOtpStep from "./auth-otp-step";

type Step = "email" | "otp" | "password";

interface Props {
  onSuccess?: () => void;
  onGoRegister?: () => void;
}

export default function LoginForm({ onSuccess, onGoRegister }: Props): React.ReactNode {
  const authGoogle = useAuthGoogle();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const login = useLogin();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailForm = useZodForm(EmailSchema);
  const passwordForm = useZodForm(PasswordSchema);

  const handleSendOtp = emailForm.handleSubmit((data) => {
    setEmail(data.email);
    sendOtp.mutate(data.email, {
      onSuccess: () => setStep("otp"),
      onError: (e) =>
        emailForm.setError("email", {
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

  const handleLogin = passwordForm.handleSubmit((data) => {
    login.mutate(
      { email, password: data.password },
      {
        onSuccess,
        onError: (e) =>
          passwordForm.setError("password", {
            message: e instanceof Error ? e.message : "Email atau password salah.",
          }),
      },
    );
  });

  // ── Step: Email ────────────────────────────────────────────────────────────
  if (step === "email") {
    return (
      <form onSubmit={handleSendOtp} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoFocus
          error={emailForm.formState.errors.email?.message}
          {...emailForm.register("email")}
        />
        <p className="text-xs text-zinc-400">
          Kami akan mengirim kode OTP ke email Anda.
        </p>
        <Button className="w-full" type="submit" loading={sendOtp.isPending}>
          Lanjutkan
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-xs text-zinc-400">atau</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(cred) => authGoogle.mutate({ token: cred.credential ?? "" })}
            onError={() =>
              emailForm.setError("email", { message: "Login Google gagal." })
            }
          />
        </div>

        {onGoRegister && (
          <p className="text-center text-sm text-zinc-500">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={onGoRegister}
              className="underline font-medium text-zinc-900 cursor-pointer"
            >
              Daftar sekarang
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
        onBack={() => setStep("email")}
        error={otpError}
        isVerifying={verifyOtp.isPending}
        isResending={sendOtp.isPending}
      />
    );
  }

  // ── Step: Password ─────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <p className="text-sm text-zinc-500 text-center">{email}</p>
      <PasswordInput
        label="Password"
        show={showPassword}
        onToggle={() => setShowPassword((v) => !v)}
        error={passwordForm.formState.errors.password?.message}
        autoFocus
        {...passwordForm.register("password")}
      />
      <Button className="w-full" type="submit" loading={login.isPending}>
        Masuk
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
