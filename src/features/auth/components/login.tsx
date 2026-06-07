"use client";

import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import { useZodForm } from "@/hooks/use-zod-form";
import { GoogleLogin } from "@react-oauth/google";
import clsx from "clsx";
import { ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { forwardRef, useRef, useState } from "react";
import { useAuthGoogle } from "../hooks/use-auth-google";
import { useLogin, useRegister, useSendOtp, useVerifyOtp } from "../hooks/use-auth";
import {
  EmailSchema,
  OtpSchema,
  PasswordSchema,
  RegisterPasswordSchema,
  RegisterSchema,
} from "../schemas/auth-schema";

// Steps:
// login flow:    email → otp → password
// register flow: register → otp → register-password
type Step = "email" | "otp" | "password" | "register" | "register-password";
type Flow = "login" | "register";

interface Props {
  onClose?: () => void;
  onSuccess?: () => void;
}

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

export default function Login({ onClose, onSuccess }: Props): React.ReactNode {
  const router = useRouter();
  const authGoogle = useAuthGoogle();

  const [step, setStep] = useState<Step>("email");
  const [flow, setFlow] = useState<Flow>("login");

  // Values persisted across steps
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // OTP stays as controlled state (custom multi-input)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Per-step forms
  const emailForm = useZodForm(EmailSchema);
  const registerForm = useZodForm(RegisterSchema);
  const passwordForm = useZodForm(PasswordSchema);
  const registerPasswordForm = useZodForm(RegisterPasswordSchema);

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const login = useLogin();
  const register = useRegister();

  const isPending =
    sendOtp.isPending || verifyOtp.isPending || login.isPending || register.isPending;

  const handleSuccess = () => {
    router.refresh();
    onSuccess?.();
    onClose?.();
  };

  const goToRegister = () => {
    setOtpError("");
    setFlow("register");
    setStep("register");
  };

  const goToLogin = () => {
    setOtpError("");
    setFlow("login");
    setStep("email");
  };

  // ── Step: Email (login) ────────────────────────────────────────────────────

  const handleSendOtpLogin = emailForm.handleSubmit((data) => {
    setEmail(data.email);
    sendOtp.mutate(data.email, {
      onSuccess: () => setStep("otp"),
      onError: (e) =>
        emailForm.setError("email", {
          message: e instanceof Error ? e.message : "Gagal mengirim OTP.",
        }),
    });
  });

  // ── Step: Register (name + email) ──────────────────────────────────────────

  const handleSendOtpRegister = registerForm.handleSubmit((data) => {
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

  // ── Step: OTP (shared) ─────────────────────────────────────────────────────

  const handleVerifyOtp = () => {
    const code = otp.join("");
    const result = OtpSchema.safeParse({ otp: code });
    if (!result.success) { setOtpError(result.error.errors[0].message); return; }
    setOtpError("");
    verifyOtp.mutate(
      { email, otp: code },
      {
        onSuccess: () =>
          setStep(flow === "register" ? "register-password" : "password"),
        onError: (e) =>
          setOtpError(e instanceof Error ? e.message : "OTP tidak valid."),
      },
    );
  };

  const handleResendOtp = () => {
    setOtpError("");
    setOtp(["", "", "", "", "", ""]);
    sendOtp.mutate(email, {
      onError: () => setOtpError("Gagal mengirim ulang OTP."),
    });
  };

  // ── Step: Password (login) ─────────────────────────────────────────────────

  const handleLogin = passwordForm.handleSubmit((data) => {
    login.mutate(
      { email, password: data.password },
      {
        onSuccess: handleSuccess,
        onError: (e) =>
          passwordForm.setError("password", {
            message: e instanceof Error ? e.message : "Email atau password salah.",
          }),
      },
    );
  });

  // ── Step: Register password ────────────────────────────────────────────────

  const handleRegister = registerPasswordForm.handleSubmit((data) => {
    register.mutate(
      { name, email, password: data.password },
      {
        onSuccess: handleSuccess,
        onError: (e) =>
          registerPasswordForm.setError("password", {
            message: e instanceof Error ? e.message : "Registrasi gagal.",
          }),
      },
    );
  });

  // ── OTP input helpers ──────────────────────────────────────────────────────

  const handleOtpChange = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[i] = value.slice(-1);
    setOtp(next);
    if (value && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...pasted.split(""), ...Array(6).fill("")].slice(0, 6);
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ── Back button logic ──────────────────────────────────────────────────────

  const handleBack = () => {
    setOtpError("");
    if (step === "otp") setStep(flow === "register" ? "register" : "email");
    else if (step === "password") setStep("otp");
    else if (step === "register") { setFlow("login"); setStep("email"); }
    else if (step === "register-password") setStep("otp");
    else onClose?.();
  };

  // ── Title map ──────────────────────────────────────────────────────────────

  const titles: Record<Step, string> = {
    email: "Masuk atau daftar",
    otp: "Cek email Anda",
    password: "Masukkan password",
    register: "Buat akun baru",
    "register-password": "Buat password",
  };

  return (
    <div className="w-full max-w-lg bg-white h-full md:h-fit md:rounded-2xl mt-10 md:mt-0 rounded-t-3xl py-3 px-5 flex flex-col overflow-y-auto max-h-[90dvh]">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b mb-1">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-zinc-100 cursor-pointer"
        >
          {step === "email" ? <X size={18} /> : <ArrowLeft size={18} />}
        </button>
        <span className="font-semibold text-sm">{titles[step]}</span>
        <div className="w-9" />
      </div>

      <div className="py-6 px-1 flex-1">
        {/* Logo + title */}
        <div className="flex flex-col items-center mb-6 gap-2">
          <Image width={40} height={40} src="/logo.png" alt="dieng.id" className="w-10" />
          <h1 className="text-xl font-semibold">{titles[step]}</h1>
          {(step === "otp" || step === "password" || step === "register-password") && (
            <p className="text-sm text-zinc-500">{maskEmail(email)}</p>
          )}
        </div>

        {/* ── Step: Email (login entry) ── */}
        {step === "email" && (
          <form onSubmit={handleSendOtpLogin} className="space-y-4">
            <Input
              label="Email Anda"
              type="email"
              error={emailForm.formState.errors.email?.message}
              {...emailForm.register("email")}
            />
            <p className="text-xs text-zinc-400">
              Kami akan mengirimkan kode OTP ke email Anda untuk verifikasi.
            </p>
            <Button
              className="w-full"
              type="submit"
              loading={sendOtp.isPending}
              disabled={isPending}
            >
              Lanjutkan
            </Button>

            <Divider />

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(cred) =>
                  authGoogle.mutate(
                    { token: cred.credential ?? "" },
                    { onSuccess: handleSuccess },
                  )
                }
                onError={() =>
                  emailForm.setError("email", { message: "Login Google gagal." })
                }
              />
            </div>

            <p className="text-center text-sm text-zinc-500 mt-4">
              Belum punya akun?{" "}
              <TextButton onClick={goToRegister}>Daftar sekarang</TextButton>
            </p>
          </form>
        )}

        {/* ── Step: Register info (name + email) ── */}
        {step === "register" && (
          <form onSubmit={handleSendOtpRegister} className="space-y-4">
            <Input
              label="Nama lengkap"
              type="text"
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
              Kami akan mengirimkan kode OTP ke email Anda untuk verifikasi.
            </p>
            <Button
              className="w-full"
              type="submit"
              loading={sendOtp.isPending}
              disabled={isPending}
            >
              Lanjutkan
            </Button>

            <p className="text-center text-sm text-zinc-500">
              Sudah punya akun?{" "}
              <TextButton onClick={goToLogin}>Masuk di sini</TextButton>
            </p>
          </form>
        )}

        {/* ── Step: OTP (shared) ── */}
        {step === "otp" && (
          <div className="space-y-5">
            <p className="text-sm text-zinc-600 text-center">
              Masukkan 6 digit kode yang dikirim ke{" "}
              <span className="font-semibold">{maskEmail(email)}</span>
            </p>

            <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={clsx(
                    "w-11 h-14 rounded-xl border text-center text-xl font-semibold outline-none transition-all",
                    digit ? "border-zinc-900" : "border-zinc-300",
                    "focus:border-zinc-900",
                  )}
                />
              ))}
            </div>

            {otpError && <ErrorText msg={otpError} className="text-center" />}

            <Button
              className="w-full"
              onClick={handleVerifyOtp}
              loading={verifyOtp.isPending}
              disabled={isPending}
            >
              Konfirmasi
            </Button>

            <p className="text-center text-sm text-zinc-500">
              Tidak menerima kode?{" "}
              <TextButton onClick={handleResendOtp} disabled={sendOtp.isPending}>
                Kirim ulang
              </TextButton>
            </p>
          </div>
        )}

        {/* ── Step: Password (login) ── */}
        {step === "password" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <PasswordInput
              label="Password"
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              error={passwordForm.formState.errors.password?.message}
              {...passwordForm.register("password")}
            />
            <Button
              className="w-full"
              type="submit"
              loading={login.isPending}
              disabled={isPending}
            >
              Masuk
            </Button>
            <p className="text-center text-sm text-zinc-500">
              Belum punya akun?{" "}
              <TextButton onClick={goToRegister}>Daftar sekarang</TextButton>
            </p>
          </form>
        )}

        {/* ── Step: Register password ── */}
        {step === "register-password" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <p className="text-sm text-zinc-500 text-center">
              Buat password untuk akun <span className="font-medium">{name}</span>
            </p>
            <PasswordInput
              label="Password (min. 8 karakter)"
              show={showRegPassword}
              onToggle={() => setShowRegPassword((v) => !v)}
              error={registerPasswordForm.formState.errors.password?.message}
              {...registerPasswordForm.register("password")}
            />
            <Button
              className="w-full"
              type="submit"
              loading={register.isPending}
              disabled={isPending}
            >
              Buat akun
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-zinc-200" />
      <span className="text-xs text-zinc-400">atau</span>
      <div className="flex-1 h-px bg-zinc-200" />
    </div>
  );
}

function ErrorText({ msg, className }: { msg: string; className?: string }) {
  return <p className={clsx("text-xs text-red-500", className)}>{msg}</p>;
}

function TextButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="underline font-medium text-zinc-900 cursor-pointer disabled:opacity-50"
    >
      {children}
    </button>
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
      <Input
        ref={ref}
        label={label}
        type={show ? "text" : "password"}
        error={error}
        autoFocus={autoFocus}
        {...rest}
      />
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
