import { JsonLd } from "@/components/shared/json-ld";
import { Footer } from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/navbar/navbar";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  Clock,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Target,
  Telescope,
  Truck,
  Users,
  Wallet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Diengs.id adalah platform wisata Dieng yang dikelola oleh komunitas lokal Wonosobo. Kami menghubungkan wisatawan dengan penginapan, jeep tour, dan pengalaman autentik kawasan Dieng.",
  keywords: [
    "tentang diengs.id",
    "platform wisata dieng",
    "penginapan dieng wonosobo",
    "komunitas lokal dieng",
    "wisata dieng terpercaya",
  ],
  alternates: {
    canonical: "https://diengs.id/tentang-kami",
  },
  openGraph: {
    title: "Tentang Kami | Diengs.id",
    description:
      "Platform wisata Dieng yang dikelola komunitas lokal — menghubungkan wisatawan dengan penginapan, jeep tour, dan pengalaman autentik Dieng Wonosobo.",
    url: "https://diengs.id/tentang-kami",
    images: ["/og-image.jpg"],
  },
};

const stats = [
  { value: "100+", label: "Penginapan Terdaftar" },
  { value: "5.000+", label: "Wisatawan Dilayani" },
  { value: "50+", label: "Destinasi Wisata" },
  { value: "4.8★", label: "Rating Rata-rata" },
];

const values = [
  {
    icon: Wallet,
    title: "Harga Jujur",
    description:
      "Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar — tanpa markup, tanpa kejutan.",
  },
  {
    icon: Heart,
    title: "Dikelola Warga Lokal",
    description:
      "Setiap penginapan dan paket tour dikelola langsung oleh warga lokal Dieng yang ramah, jujur, dan berpengalaman.",
  },
  {
    icon: ShieldCheck,
    title: "Transaksi Aman",
    description:
      "Sistem pembayaran terenkripsi dengan berbagai pilihan metode — transfer bank, e-wallet, hingga kartu kredit.",
  },
  {
    icon: Clock,
    title: "Bantuan 24/7",
    description:
      "Tim support lokal siap membantu kapan pun Anda membutuhkan bantuan sebelum, selama, maupun setelah perjalanan.",
  },
];

const team = [
  {
    name: "Tim Penginapan",
    role: "Host & Pemilik Penginapan",
    desc: "Ratusan pemilik penginapan lokal yang siap menyambut Anda dengan kehangatan khas Dieng.",
    icon: Home,
  },
  {
    name: "Tim Tour",
    role: "Pemandu & Driver Jeep",
    desc: "Pemandu wisata berpengalaman yang hafal setiap sudut kawasan Dieng dan siap membawa Anda ke spot terbaik.",
    icon: Truck,
  },
  {
    name: "Tim Support",
    role: "Customer Service",
    desc: "Tim dukungan yang responsif dan siap memastikan perjalanan Anda berjalan lancar dari awal hingga akhir.",
    icon: MessageCircle,
  },
];

export default async function TentangKamiPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": "https://diengs.id/tentang-kami",
          url: "https://diengs.id/tentang-kami",
          name: "Tentang Diengs.id",
          description:
            "Platform wisata Dieng yang dikelola oleh komunitas lokal Wonosobo.",
          isPartOf: { "@id": "https://diengs.id/#website" },
          about: { "@id": "https://diengs.id/#organization" },
        }}
      />

      <Navbar token={token?.value} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-700 via-teal-700 to-emerald-900 pb-24 pt-32">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            Tentang Kami
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-white md:text-5xl">
            Platform Wisata Dieng
            <br />
            <span className="text-emerald-200">dari & untuk Lokal</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-emerald-100">
            Diengs.id hadir untuk menghubungkan para wisatawan dengan
            penginapan, jeep tour, dan pengalaman autentik kawasan Dieng
            Wonosobo — dikelola langsung oleh komunitas lokal yang mencintai
            Dieng.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow transition hover:bg-emerald-50"
            >
              Cari Penginapan
            </Link>
            <Link
              href="/artikel"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Baca Panduan Wisata
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-zinc-100 bg-white py-14">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-emerald-600 md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cerita Kami ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Cerita Kami
              </span>
              <h2 className="mt-3 text-3xl font-bold text-zinc-900 md:text-4xl">
                Berawal dari Kecintaan
                <br />terhadap Dieng
              </h2>
              <p className="mt-5 leading-relaxed text-zinc-600">
                Dieng adalah permata tersembunyi di atas awan — dengan panorama
                kawah, hamparan pertanian kentang, dan kebudayaan yang kaya.
                Sayangnya, banyak wisatawan kesulitan menemukan penginapan dan
                tour berkualitas yang dikelola secara transparan.
              </p>
              <p className="mt-4 leading-relaxed text-zinc-600">
                Kami, warga lokal Dieng, membangun <strong>Diengs.id</strong>{" "}
                untuk mengubah itu. Sebuah platform yang menjembatani wisatawan
                dengan penyedia jasa lokal terpercaya — dengan harga jujur,
                informasi lengkap, dan pelayanan dari hati.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-700">
                <MapPin size={16} />
                <span>Dieng, Wonosobo, Jawa Tengah</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-emerald-50 p-6">
                  <Users size={28} className="text-emerald-600" />
                  <p className="mt-3 text-sm font-semibold text-zinc-800">
                    Komunitas Lokal
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Semua mitra kami adalah warga asli kawasan Dieng Wonosobo.
                  </p>
                </div>
                <div className="rounded-2xl bg-teal-50 p-6">
                  <Star size={28} className="text-teal-600" />
                  <p className="mt-3 text-sm font-semibold text-zinc-800">
                    Kualitas Terjamin
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Setiap penginapan dan tour dikurasi dan diverifikasi tim kami.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-8">
                <div className="rounded-2xl bg-zinc-50 p-6">
                  <ShieldCheck size={28} className="text-zinc-600" />
                  <p className="mt-3 text-sm font-semibold text-zinc-800">
                    Transaksi Aman
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Pembayaran terenkripsi dan dana dijamin hingga perjalanan selesai.
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-600 p-6 text-white">
                  <Heart size={28} />
                  <p className="mt-3 text-sm font-semibold">
                    Dengan Sepenuh Hati
                  </p>
                  <p className="mt-1 text-xs text-emerald-100">
                    Melayani wisatawan dengan kehangatan khas warga Dieng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visi & Misi ── */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Arah Kami
            </span>
            <h2 className="mt-3 text-3xl font-bold text-zinc-900">
              Visi & Misi
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-white p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Telescope size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Visi</h3>
              <p className="mt-3 leading-relaxed text-zinc-600">
                Menjadi platform wisata lokal terdepan di kawasan Dieng yang
                memberdayakan komunitas, meningkatkan ekonomi warga, dan
                menghadirkan pengalaman perjalanan yang autentik bagi setiap
                wisatawan.
              </p>
            </div>
            <div className="rounded-2xl border border-teal-100 bg-white p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Misi</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  Menghubungkan wisatawan dengan penyedia jasa lokal secara transparan dan terpercaya
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  Meningkatkan pendapatan dan kesejahteraan warga lokal Dieng
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  Melestarikan budaya dan alam Dieng melalui wisata yang bertanggung jawab
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  Memberikan kemudahan dan kenyamanan bagi wisatawan dari seluruh Indonesia
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nilai-Nilai ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-12 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Komitmen Kami
            </span>
            <h2 className="mt-3 text-3xl font-bold text-zinc-900 md:text-4xl">
              Mengapa Memilih Diengs.id?
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-zinc-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                  <v.icon size={22} />
                </div>
                <h3 className="font-semibold text-zinc-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tim ── */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Orang-Orang Kami
            </span>
            <h2 className="mt-3 text-3xl font-bold text-zinc-900">
              Siapa di Balik Diengs.id?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
              Kami adalah komunitas warga lokal yang berkolaborasi untuk
              menghadirkan wisata Dieng yang lebih mudah, nyaman, dan
              berkesan.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {team.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <t.icon size={32} />
                </div>
                <h3 className="mt-4 font-bold text-zinc-900">{t.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-emerald-600">
                  {t.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-linear-to-br from-emerald-600 to-teal-700 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Siap Jelajahi Dieng?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-emerald-100">
            Temukan penginapan terbaik, paket jeep tour seru, dan ratusan
            destinasi wisata di kawasan Dieng Wonosobo — semua dalam satu
            platform.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-xl bg-white px-8 py-3 font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
            >
              Cari Penginapan Sekarang
            </Link>
            <Link
              href="/artikel"
              className="rounded-xl border border-white/40 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Baca Panduan Wisata
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
