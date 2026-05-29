import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Hasil Pembayaran",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ status?: string; invoice?: string }>;
}

export default async function PaymentResultPage({ searchParams }: Props) {
  const { status, invoice } = await searchParams;

  const isSuccess = status === "success";
  const bookingId = invoice?.replace(/^INV-/, "");

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link href="/">
            <Image src="/logo2.png" alt="diengsid" width={110} height={30} priority />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-2xl border p-10 flex flex-col items-center text-center gap-6 max-w-md w-full">
          {isSuccess ? (
            <>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-zinc-900">Pembayaran berhasil!</h1>
                <p className="text-zinc-500 mt-2 text-sm">
                  Terima kasih. Pembayaran Anda telah diterima dan booking dikonfirmasi.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                <XCircle size={40} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-zinc-900">Pembayaran gagal</h1>
                <p className="text-zinc-500 mt-2 text-sm">
                  Pembayaran tidak berhasil diproses. Silakan coba lagi atau hubungi layanan pelanggan.
                </p>
              </div>
            </>
          )}

          {invoice && (
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-3 text-sm text-zinc-600 w-full">
              No. Invoice: <span className="font-mono font-semibold">{invoice}</span>
            </div>
          )}

          <div className="flex gap-3 w-full">
            {bookingId ? (
              <Link href={`/booking/konfirmasi/${bookingId}`} className="flex-1">
                <button className="w-full px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors">
                  Lihat booking
                </button>
              </Link>
            ) : (
              <Link href="/booking" className="flex-1">
                <button className="w-full px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors">
                  Riwayat booking
                </button>
              </Link>
            )}
            <Link href="/" className="flex-1">
              <button className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                Kembali ke beranda
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
