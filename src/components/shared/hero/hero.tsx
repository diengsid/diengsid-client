import { Home, MapPin, Star, Users } from "lucide-react";
import Link from "next/link";

const popularDestinations = [
  "Jeep Sunrise Sikunir",
  "Telaga Warna",
  "Candi Arjuna",
  "Kawah Sikidang",
  "Bukit Scuderia",
  "Dieng Plateau",
];

const stats = [
  { icon: Home, value: "100+", label: "Penginapan" },
  { icon: Users, value: "5rb+", label: "Wisatawan" },
  { icon: Star, value: "4.8", label: "Rating" },
  { icon: MapPin, value: "Dieng", label: "Wonosobo, Jateng" },
];

export function Hero() {
  return (
    <section
      aria-label="Beranda Wisata Dieng Wonosobo"
      className="relative w-full overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50 pb-16 pt-40"
    >
      {/* decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-130 w-130 rounded-full bg-emerald-100/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-teal-100/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* ── Left: copy ── */}
          <div className="max-w-2xl">
            {/* trust badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Platform Wisata Lokal #1 di Dieng Wonosobo
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-zinc-900 md:text-5xl lg:text-6xl">
              Penginapan &amp; Wisata
              <br />
              <span className="text-emerald-600">Dieng Wonosobo</span>
              <br />
              Terpercaya
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500 md:text-lg">
              Temukan penginapan terbaik — villa, homestay, dan hotel di kawasan
              Dieng. Pesan jeep tour, sunrise Sikunir, Telaga Warna, dan ratusan
              paket wisata Dieng langsung dari warga lokal dengan harga jujur.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#penginapan"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95"
              >
                <Home size={16} />
                Cari Penginapan
              </Link>
              <Link
                href="/wisata"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-7 py-3.5 text-sm font-semibold text-zinc-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <MapPin size={16} />
                Destinasi Wisata
              </Link>
            </div>

            {/* popular searches */}
            <div className="mt-7 hidden">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Populer di Dieng
              </p>
              <div className="flex flex-wrap gap-2">
                {popularDestinations.map((dest) => (
                  <span
                    key={dest}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm"
                  >
                    {dest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: stats ── */}
          <div className="md:grid grid-cols-2 gap-4 lg:w-72 lg:shrink-0 hidden">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col gap-1 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm"
              >
                <Icon size={20} className="text-emerald-500" />
                <p className="text-2xl font-bold text-zinc-900">{value}</p>
                <p className="text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
