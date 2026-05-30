"use client";

import { SyncLoader } from "react-spinners";

export default function PageLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <SyncLoader color="#10b981" size={12} speedMultiplier={0.8} />
    </div>
  );
}
