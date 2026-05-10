import { Search } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pb-20 w-full overflow-hidden pt-40 bg-gray-50">
      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <div className="max-w-2xl">
            {/* Heading */}
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Jelajahi Keindahan
              <br />
              Dieng dengan Mudah
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-md font-light text-gray-400">
              Booking jeep, paket wisata, dan pengalaman terbaik langsung dari
              warga lokal Dieng.
            </p>

            {/* Search Box */}
            <div className="mt-8 flex items-center gap-2 rounded-full bg-white p-2 shadow-custom">
              <input
                type="text"
                placeholder="Cari destinasi atau paket wisata..."
                className="flex-1 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none"
              />
              <button className="flex items-center gap-2 rounded-full bg-primary p-4 text-sm font-medium transition hover:bg-primary-600 text-white">
                <Search size={18} />
              </button>
            </div>

            {/* CTA Secondary */}
            <div className="mt-4 text-sm text-gray-400">
              Populer: Jeep Sunrise • Telaga Warna • Sikunir
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
