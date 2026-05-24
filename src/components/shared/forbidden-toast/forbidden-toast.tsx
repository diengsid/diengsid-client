"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ForbiddenToast() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (params.get("forbidden") === "1") {
      toast.error("Akses ditolak. Halaman ini hanya untuk Admin.");
      // bersihkan query string tanpa reload penuh
      const url = new URL(window.location.href);
      url.searchParams.delete("forbidden");
      router.replace(url.pathname + url.search);
    }
  }, [params, router]);

  return null;
}
