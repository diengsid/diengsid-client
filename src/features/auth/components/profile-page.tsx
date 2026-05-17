"use client";

import { useCurrentUser, useLogout } from "@/features/auth/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Mail, Shield, UserCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";

interface Props {
  token?: string;
}

export default function ProfilePage({ token }: Props): React.ReactNode {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser(!!token);
  console.log(user);
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["current-user"] });
        router.push("/");
        router.refresh();
      },
    });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-zinc-500">
        <UserCircle size={64} className="text-zinc-300" />
        <p className="text-sm">Silakan masuk untuk melihat profil.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-6 py-12 space-y-6 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-zinc-200" />
          <div className="h-5 w-36 bg-zinc-200 rounded" />
          <div className="h-4 w-48 bg-zinc-100 rounded" />
        </div>
        <div className="space-y-3 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-zinc-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 mb-10">
        {user?.picture ? (
          <Image
            src={user.picture}
            alt={user?.name ?? ""}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-zinc-100"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-zinc-800 text-white flex items-center justify-center text-3xl font-bold ring-4 ring-zinc-100">
            {initials}
          </div>
        )}
        <div className="text-center">
          <h1 className="text-xl font-semibold">{user?.name}</h1>
          <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 capitalize">
            {user?.role ?? "user"}
          </span>
        </div>
      </div>

      {/* Info cards */}
      <div className="space-y-3">
        <InfoRow
          icon={<Mail size={18} className="text-zinc-500" />}
          label="Email"
          value={user?.email ?? "-"}
          verified={user?.email_verified}
        />
        <InfoRow
          icon={<Shield size={18} className="text-zinc-500" />}
          label="Role"
          value={user?.role ?? "-"}
        />
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={logout.isPending}
        className="mt-10 w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition disabled:opacity-50 cursor-pointer"
      >
        <LogOut size={16} />
        {logout.isPending ? "Keluar..." : "Keluar dari akun"}
      </button>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  verified,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  verified?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-100 px-4 py-3.5 bg-white">
      <span className="shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
      {verified !== undefined && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
            verified
              ? "bg-green-50 text-green-600"
              : "bg-yellow-50 text-yellow-600"
          }`}
        >
          {verified ? "Terverifikasi" : "Belum verifikasi"}
        </span>
      )}
    </div>
  );
}
