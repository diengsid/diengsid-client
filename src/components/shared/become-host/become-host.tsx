import Image from "next/image";
import Link from "next/link";

export default function BecomeHost() {
  return (
    <section className="px-4 py-6 md:px-12 lg:px-20">
      <div className="flex overflow-hidden rounded-3xl border border-zinc-200">
        {/* left — text content */}
        <div className="flex flex-1 flex-col justify-center gap-6 px-8 py-10 md:px-12 md:py-14">
          <h2 className="text-3xl font-bold leading-tight text-zinc-900 md:text-4xl">
            Mulai Menjadi Tuan Rumah
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
            Daftarkan properti atau layanan wisata Anda sekarang dan biarkan
            lebih banyak wisatawan menemukan bisnis Anda melalui Diengs.id.
          </p>
          <div className="space-x-2 space-y-2">
            <Link
              href="/tentang-kami"
              className="inline-block rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
            >
              Pelajari Selengkapnya
            </Link>
            <Link
              target="_blank"
              href="https://wa.link/xeebxl"
              className="inline-block rounded-full border bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-50 hover:text-black"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>

        {/* right — image */}
        <div className="relative hidden w-[45%] shrink-0 md:block">
          <Image
            fill
            src="https://images.unsplash.com/photo-1609349093648-51d2ceb5a72a?fm=jpg&q=80&w=800&auto=format&fit=crop"
            alt="Rumah di pegunungan Dieng"
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
