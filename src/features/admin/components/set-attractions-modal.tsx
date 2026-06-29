"use client";

import {
  AttractionResponse,
  NearbyAttractionItem,
  getNearbyAttractions,
  getAttractions,
  setNearbyAttractions,
} from "@/features/admin/services/attraction-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MapPin, X } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type RowState = {
  checked: boolean;
  sort_order: number;
};

type Props = {
  propertyId: string;
  propertyTitle: string;
  onClose: () => void;
};

export function SetAttractionsModal({
  propertyId,
  propertyTitle,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const [overrides, setOverrides] = useState<Record<string, Partial<RowState>>>({});

  const { data: allData, isLoading: loadingAll } = useQuery({
    queryKey: ["attractions"],
    queryFn: getAttractions,
  });

  const { data: nearbyData, isLoading: loadingNearby } = useQuery({
    queryKey: ["nearby-attractions", propertyId],
    queryFn: () => getNearbyAttractions(propertyId),
  });

  const rows = useMemo<Record<string, RowState>>(() => {
    const all = Array.isArray(allData?.data) ? allData.data : [];
    const nearby = Array.isArray(nearbyData?.data) ? nearbyData.data : [];
    const result: Record<string, RowState> = {};
    all.forEach((a) => {
      const existing = nearby.find((n) => n.tourist_attraction_id === a.id);
      const base: RowState = {
        checked: !!existing,
        sort_order: existing?.sort_order ?? 0,
      };
      result[a.id] = { ...base, ...overrides[a.id] };
    });
    return result;
  }, [allData, nearbyData, overrides]);

  const mutation = useMutation({
    mutationFn: (items: NearbyAttractionItem[]) =>
      setNearbyAttractions(propertyId, items),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["nearby-attractions", propertyId],
      });
      toast.success("Atraksi berhasil disimpan");
      onClose();
    },
    onError: () => toast.error("Gagal menyimpan atraksi"),
  });

  const handleSave = () => {
    const items: NearbyAttractionItem[] = Object.entries(rows)
      .filter(([, r]) => r.checked)
      .map(([id, r], idx) => ({
        tourist_attraction_id: id,
        sort_order: r.sort_order || idx,
      }));
    mutation.mutate(items);
  };

  const toggle = (id: string) =>
    setOverrides((prev) => ({
      ...prev,
      [id]: { ...prev[id], checked: !rows[id]?.checked },
    }));

  const attractions: AttractionResponse[] = allData?.data ?? [];
  const isLoading = loadingAll || loadingNearby;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="font-semibold text-zinc-900">Set Atraksi Wisata</h2>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
              {propertyTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={24} className="animate-spin text-zinc-400" />
            </div>
          ) : attractions.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-400">
              Belum ada data atraksi wisata
            </p>
          ) : (
            attractions.map((a) => {
              const row = rows[a.id];
              if (!row) return null;
              return (
                <div
                  key={a.id}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-3"
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.checked}
                      onChange={() => toggle(a.id)}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-zinc-900">
                        {a.name}
                      </p>
                      {a.category && (
                        <span className="text-xs capitalize text-zinc-500">
                          {a.category}
                        </span>
                      )}
                      {a.address && (
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />
                          {a.address}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-zinc-100 px-6 py-4 shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 transition disabled:opacity-60"
          >
            {mutation.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
