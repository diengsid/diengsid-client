import SearchBar from "@/components/shared/search-bar/SearchBar";

export function Hero() {
  return (
    <section
      aria-label="Beranda Wisata Dieng Wonosobo"
      className="relative w-full overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50 pb-16 pt-36"
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

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 lg:px-12 text-center">
        {/* trust badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Platform Wisata Lokal #1 di Dieng Wonosobo
        </div>

        <h1 className="mt-5 text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
          Penginapan &amp; Wisata
          <br />
          <span className="text-emerald-600">Dieng Wonosobo</span>
        </h1>

        <p className="mt-4 text-base text-zinc-500 md:text-lg">
          Villa, homestay, jeep tour, dan paket wisata dari warga lokal. Harga
          jujur, pilihan terpercaya.
        </p>

        {/* search bar */}
        <div className="mt-8">
          <SearchBar />
        </div>

        {/* weather strip */}
        {/* <div className="mt-6 flex justify-center">
          <Suspense fallback={<WeatherHeroStripSkeleton />}>
            <WeatherHeroStrip />
          </Suspense>
        </div> */}
      </div>
    </section>
  );
}
