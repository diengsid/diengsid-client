"use client";

import Button from "@/components/ui/button/button";
import clsx from "clsx";
import type React from "react";
import { useRef, useState } from "react";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 2)}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

interface Props {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  error?: string;
  isVerifying: boolean;
  isResending: boolean;
}

export default function AuthOtpStep({
  email,
  onVerify,
  onResend,
  onBack,
  error,
  isVerifying,
  isResending,
}: Props): React.ReactNode {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[i] = value.slice(-1);
    setOtp(next);
    if (value && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...pasted.split(""), ...Array(6).fill("")].slice(0, 6);
    setOtp(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = () => onVerify(otp.join(""));

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    onResend();
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-zinc-500 text-center">
        Kode OTP dikirim ke{" "}
        <span className="font-semibold text-zinc-800">{maskEmail(email)}</span>
      </p>

      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            autoFocus={i === 0}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={clsx(
              "w-12 h-14 rounded-xl border text-center text-xl font-semibold outline-none transition-all",
              digit ? "border-zinc-900" : "border-zinc-200",
              "focus:border-zinc-900",
            )}
          />
        ))}
      </div>

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      <Button
        className="w-full"
        onClick={handleSubmit}
        loading={isVerifying}
        disabled={isVerifying || isResending}
      >
        Konfirmasi
      </Button>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <button
          type="button"
          onClick={onBack}
          className="underline cursor-pointer hover:text-zinc-800"
        >
          Kembali
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || isVerifying}
          className="underline cursor-pointer hover:text-zinc-800 disabled:opacity-40"
        >
          {isResending ? "Mengirim..." : "Kirim ulang"}
        </button>
      </div>
    </div>
  );
}
