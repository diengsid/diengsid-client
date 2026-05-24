/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

// flies the map to the picked point
function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, Math.max(map.getZoom(), 15), { duration: 1 });
  }, [map, position]);
  return null;
}

// captures map click events
function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({
  value,
  onChange,
  loading,
  height = "280px",
}: {
  value: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
  loading?: boolean;
  height?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=id`,
        { headers: { "Accept-Language": "id" } },
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleQueryChange = (q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    debounceRef.current = setTimeout(() => search(q), 500);
  };

  const selectResult = (r: NominatimResult) => {
    onChange(parseFloat(r.lat), parseFloat(r.lon));
    setQuery(r.display_name);
    setShowResults(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  // close dropdown when clicking outside the search box
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handlePick = useCallback(
    (lat: number, lng: number) => onChange(lat, lng),
    [onChange],
  );

  const markerPos: [number, number] | null = value ? [value.lat, value.lng] : null;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200" style={{ height }}>

      {/* ── search box (floats over the map) ── */}
      <div ref={searchBoxRef} className="absolute left-3 right-3 top-3 z-[1000]">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Cari alamat atau tempat..."
            className="w-full rounded-xl border border-zinc-200 bg-white/95 py-2 pl-8 pr-8 text-sm shadow-md outline-none backdrop-blur focus:border-primary-700 focus:ring-1 focus:ring-primary-700/20"
          />
          {searching ? (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-zinc-400" />
          ) : query ? (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        {/* results dropdown */}
        {showResults && results.length > 0 && (
          <ul className="mt-1 max-h-52 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg">
            {results.map((r) => (
              <li key={r.place_id} className="border-b border-zinc-100 last:border-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectResult(r)}
                  className="w-full px-3 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 transition line-clamp-2"
                >
                  {r.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {showResults && !searching && results.length === 0 && query.trim() && (
          <div className="mt-1 rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-400 shadow-lg">
            Lokasi tidak ditemukan
          </div>
        )}
      </div>

      {/* ── map ── */}
      <MapContainer
        center={[-7.363, 109.9]}
        zoom={11}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={handlePick} />
        <FlyTo position={markerPos} />
        {markerPos && <Marker position={markerPos} />}
      </MapContainer>

      {/* geocoding loading badge */}
      {loading && (
        <div className="absolute bottom-3 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-white/95 px-3 py-1.5 text-xs text-zinc-600 shadow">
          Mengambil alamat...
        </div>
      )}

      {/* hint when nothing picked */}
      {!value && !loading && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-white/95 px-3 py-1.5 text-xs text-zinc-500 shadow">
          Klik pada peta untuk memilih lokasi
        </div>
      )}
    </div>
  );
}
