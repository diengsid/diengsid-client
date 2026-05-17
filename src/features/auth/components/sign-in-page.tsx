"use client";

import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import { useZodForm } from "@/hooks/use-zod-form";
import { GoogleLogin } from "@react-oauth/google";
import clsx from "clsx";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { forwardRef, useRef, useState } from "react";
import {
  useLogin,
  useRegister,
  useSendOtp,
  useVerifyOtp,
} from "../hooks/use-auth";
import { useAuthGoogle } from "../hooks/use-auth-google";
import {
  EmailSchema,
  OtpSchema,
  PasswordSchema,
  RegisterPasswordSchema,
  RegisterSchema,
} from "../schemas/auth-schema";

// login flow:    email → otp → password
// register flow: register → otp → register-password
type Step = "email" | "otp" | "password" | "register" | "register-password";
type Flow = "login" | "register";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 2)}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

export default function SignInPage(): React.ReactNode {
  const router = useRouter();
  const authGoogle = useAuthGoogle();

  const [step, setStep] = useState<Step>("email");
  const [flow, setFlow] = useState<Flow>("login");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const emailForm = useZodForm(EmailSchema);
  const registerForm = useZodForm(RegisterSchema);
  const passwordForm = useZodForm(PasswordSchema);
  const registerPasswordForm = useZodForm(RegisterPasswordSchema);

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const login = useLogin();
  const register = useRegister();

  const isPending =
    sendOtp.isPending ||
    verifyOtp.isPending ||
    login.isPending ||
    register.isPending;

  const handleSuccess = () => {
    router.push("/");
    router.refresh();
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

  // ── Handlers ───────────────────────────────────────────────────────────────

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

  const handleVerifyOtp = () => {
    const code = otp.join("");
    const result = OtpSchema.safeParse({ otp: code });
    if (!result.success) {
      setOtpError(result.error.errors[0].message);
      return;
    }
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

  const handleLogin = passwordForm.handleSubmit((data) => {
    login.mutate(
      { email, password: data.password },
      {
        onSuccess: handleSuccess,
        onError: (e) =>
          passwordForm.setError("password", {
            message:
              e instanceof Error ? e.message : "Email atau password salah.",
          }),
      },
    );
  });

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

  // ── OTP helpers ────────────────────────────────────────────────────────────

  const handleOtpChange = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[i] = value.slice(-1);
    setOtp(next);
    if (value && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...pasted.split(""), ...Array(6).fill("")].slice(0, 6);
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ── Back logic ─────────────────────────────────────────────────────────────

  const handleBack = () => {
    setOtpError("");
    if (step === "otp") setStep(flow === "register" ? "register" : "email");
    else if (step === "password") setStep("otp");
    else if (step === "register") {
      setFlow("login");
      setStep("email");
    } else if (step === "register-password") setStep("otp");
  };

  const showBack = step !== "email";

  const titles: Record<Step, string> = {
    email: "Masuk atau daftar",
    otp: "Cek email Anda",
    password: "Masukkan password",
    register: "Buat akun baru",
    "register-password": "Buat password",
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="dieng.id"
            width={48}
            height={48}
            className="w-12"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            {showBack ? (
              <button
                type="button"
                onClick={handleBack}
                className="p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer transition"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="w-8" />
            )}
            <h1 className="text-lg font-semibold">{titles[step]}</h1>
            <div className="w-8" />
          </div>

          <div className="px-6 py-7 space-y-5">
            {/* Sub-title */}
            <div className="text-center">
              {(step === "otp" ||
                step === "password" ||
                step === "register-password") && (
                <p className="text-sm text-zinc-500 mt-1">{maskEmail(email)}</p>
              )}
            </div>

            {/* ── Email ── */}
            {step === "email" && (
              <form onSubmit={handleSendOtpLogin} className="space-y-4">
                <Input
                  label="Email Anda"
                  type="email"
                  autoFocus
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
                      authGoogle.mutate({ token: cred.credential ?? "" })
                    }
                    onError={() =>
                      emailForm.setError("email", {
                        message: "Login Google gagal.",
                      })
                    }
                  />
                </div>
                <p className="text-center text-sm text-zinc-500">
                  Belum punya akun?{" "}
                  <TextButton onClick={goToRegister}>
                    Daftar sekarang
                  </TextButton>
                </p>
              </form>
            )}

            {/* ── Register info ── */}
            {step === "register" && (
              <form onSubmit={handleSendOtpRegister} className="space-y-4">
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

            {/* ── OTP ── */}
            {step === "otp" && (
              <div className="space-y-5">
                <p className="text-sm text-zinc-600 text-center">
                  Masukkan 6 digit kode yang dikirim ke{" "}
                  <span className="font-semibold">{maskEmail(email)}</span>
                </p>
                <div
                  className="flex gap-2 justify-center"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      autoFocus={i === 0}
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
                {otpError && (
                  <p className="text-xs text-red-500 text-center">{otpError}</p>
                )}
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
                  <TextButton
                    onClick={handleResendOtp}
                    disabled={sendOtp.isPending}
                  >
                    Kirim ulang
                  </TextButton>
                </p>
              </div>
            )}

            {/* ── Password (login) ── */}
            {step === "password" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <PasswordInput
                  label="Password"
                  show={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                  error={passwordForm.formState.errors.password?.message}
                  autoFocus
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
                  <TextButton onClick={goToRegister}>
                    Daftar sekarang
                  </TextButton>
                </p>
              </form>
            )}

            {/* ── Register password ── */}
            {step === "register-password" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <p className="text-sm text-zinc-500 text-center">
                  Buat password untuk akun{" "}
                  <span className="font-medium">{name}</span>
                </p>
                <PasswordInput
                  label="Password (min. 8 karakter)"
                  show={showRegPassword}
                  onToggle={() => setShowRegPassword((v) => !v)}
                  error={
                    registerPasswordForm.formState.errors.password?.message
                  }
                  autoFocus
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
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-zinc-200" />
      <span className="text-xs text-zinc-400">atau</span>
      <div className="flex-1 h-px bg-zinc-200" />
    </div>
  );
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
>(function PasswordInput(
  { label, show, onToggle, error, autoFocus, ...rest },
  ref,
) {
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
