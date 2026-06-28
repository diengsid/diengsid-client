import Image from "next/image";
import Link from "next/link";

const PAYMENT_METHODS = [
  {
    label: "Visa",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg",
    bg: "bg-white",
  },
  {
    label: "Mastercard",
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    bg: "bg-white",
  },
  {
    label: "BCA",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
    bg: "bg-white",
  },
  {
    label: "BNI",
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg",
    bg: "bg-white",
  },
  {
    label: "BRI",
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg",
    bg: "bg-white",
  },
  {
    label: "Mandiri",
    src: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg",
    bg: "bg-white",
  },
  {
    label: "Permata",
    src: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Permata_Bank_%282024%29.svg",
    bg: "bg-white",
  },
  {
    label: "OVO",
    src: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg",
    bg: "bg-white",
  },
  {
    label: "GoPay",
    src: "https://upload.wikimedia.org/wikipedia/commons/0/00/Logo_Gopay.svg",
    bg: "bg-white",
  },
  {
    label: "Dana",
    src: "https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg",
    bg: "bg-white",
  },
  {
    label: "ShopeePay",
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg",
    bg: "bg-white",
  },
  {
    label: "Alfamart",
    src: "https://upload.wikimedia.org/wikipedia/commons/8/86/Alfamart_logo.svg",
    bg: "bg-white",
  },
  {
    label: "Indomaret",
    src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Indomaret.svg",
    bg: "bg-white",
  },
] as const;

function PaymentLogo({
  label,
  src,
  bg,
}: {
  label: string;
  src: string;
  bg: string;
}) {
  return (
    <div
      className={`flex h-9 w-16 shrink-0 items-center justify-center rounded-lg border border-zinc-200 px-2 ${bg}`}
      title={label}
    >
      <Image
        src={src}
        alt={label}
        width={52}
        height={24}
        className="h-5 w-auto object-contain"
        unoptimized
      />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50 pt-10 pb-20 ">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image src="/logo2.png" alt="Diengs.id" width={110} height={28} />
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Platform wisata lokal Dieng Wonosobo — penginapan, jeep tour, dan
              pengalaman autentik dari komunitas setempat.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://instagram.com/diengs.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-800"
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://wa.me/6285174366013"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-800"
                aria-label="WhatsApp"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Jelajahi */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-zinc-900">
              Jelajahi
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li>
                <Link href="/" className="transition hover:text-zinc-800">
                  Penginapan
                </Link>
              </li>
              <li>
                <Link href="/wisata" className="transition hover:text-zinc-800">
                  Destinasi Wisata
                </Link>
              </li>
              <li>
                <Link
                  href="/artikel"
                  className="transition hover:text-zinc-800"
                >
                  Artikel Wisata
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang-kami"
                  className="transition hover:text-zinc-800"
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Mitra */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-zinc-900">
              Mitra Kami
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li>
                <Link href="#" className="transition hover:text-zinc-800">
                  Daftarkan Penginapan
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-zinc-800">
                  Daftarkan Jeep / Tour
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-zinc-800">
                  Panduan Mitra
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-zinc-800">
                  Komunitas Host
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-zinc-900">Kontak</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li>Dieng, Wonosobo</li>
              <li>Jawa Tengah, Indonesia</li>
              <li>
                <a
                  href="mailto:hello@diengs.id"
                  className="transition hover:text-zinc-800"
                >
                  hello@diengs.id
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6285174366013"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-zinc-800"
                >
                  +62 851-7436-6013
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-10 border-t border-zinc-100 pt-8">
          <p className="mb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
            Pembayaran Aman via DOKU
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENT_METHODS.map((p) => (
              <PaymentLogo key={p.label} {...p} />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-6 text-xs text-zinc-400 md:flex-row">
          <span>© 2026 Diengs.id · Dibuat dengan ❤️ dari Dieng, Wonosobo</span>
          <div className="flex gap-5">
            <Link href="#" className="transition hover:text-zinc-600">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="transition hover:text-zinc-600">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
