import { Clock, Heart, ShieldCheck, Wallet } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: Wallet,
      title: "Harga Jujur",
      description:
        "Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar.",
    },
    {
      icon: Heart,
      title: "Warga Lokal",
      description:
        "Dikelola langsung oleh komunitas lokal Dieng yang ramah dan berpengalaman.",
    },
    {
      icon: ShieldCheck,
      title: "Transaksi Aman",
      description:
        "Sistem pembayaran aman dengan berbagai pilihan metode pembayaran.",
    },
    {
      icon: Clock,
      title: "Bantuan 24/7",
      description:
        "Tim support siap membantu kapan pun Anda membutuhkan bantuan.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">
            Mengapa dieng.id?
          </h2>
          <p className="mt-4 text-gray-500">
            Kami memberikan pengalaman liburan terbaik di Dieng dengan pelayanan
            profesional dan sepenuh hati.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <feature.icon size={22} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
