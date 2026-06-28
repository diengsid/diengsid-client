import { Footer } from "@/components/shared/footer/footer";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import { getWeather } from "@/features/weather/services/weather-server-service";
import {
  frostRiskConfig,
  predictFrost,
} from "@/features/weather/utils/frost-prediction";
import {
  getWeatherInfo,
  uvIndexLabel,
  windDirectionLabel,
} from "@/features/weather/utils/weather-code";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Clock,
  Droplets,
  Gauge,
  MapPin,
  Moon,
  Snowflake,
  Thermometer,
  Wind,
} from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Cuaca Dieng Hari Ini | Prakiraan 7 Hari",
  description:
    "Informasi cuaca terkini dan prakiraan 7 hari di kawasan Dataran Tinggi Dieng Wonosobo. Rencanakan perjalanan wisatamu dengan data cuaca akurat.",
  keywords: [
    "cuaca dieng",
    "cuaca dieng hari ini",
    "prakiraan cuaca dieng",
    "cuaca wonosobo",
    "suhu dieng",
  ],
  openGraph: {
    title: "Cuaca Dieng Hari Ini | Prakiraan 7 Hari",
    description:
      "Informasi cuaca terkini dan prakiraan 7 hari di kawasan Dataran Tinggi Dieng Wonosobo.",
    url: "https://diengs.id/cuaca",
  },
  alternates: { canonical: "https://diengs.id/cuaca" },
};

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default async function CuacaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  let weather;
  try {
    weather = await getWeather();
  } catch {
    return (
      <>
        <Navbar token={token?.value} />
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-zinc-500">
            Gagal memuat data cuaca. Coba lagi nanti.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const { current, daily, earlyMorning } = weather;
  const info = getWeatherInfo(current.weatherCode, current.isDay);
  const Icon = info.Icon;
  const uvInfo = uvIndexLabel(current.uvIndex);

  const updatedAt = format(
    new Date(current.time.replace("T", " ")),
    "HH:mm, d MMMM yyyy",
    { locale: localeId },
  );

  const detailCards = [
    {
      label: "Terasa Seperti",
      value: `${current.feelsLike}°C`,
      Icon: Thermometer,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Kelembapan",
      value: `${current.humidity}%`,
      Icon: Droplets,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Kecepatan Angin",
      value: `${current.windSpeed} km/j`,
      Icon: Wind,
      color: "text-sky-500",
      bg: "bg-sky-50",
    },
    {
      label: "Arah Angin",
      value: windDirectionLabel(current.windDirection),
      Icon: Wind,
      color: "text-sky-400",
      bg: "bg-sky-50",
    },
    {
      label: "Indeks UV",
      value: `${current.uvIndex} — ${uvInfo.label}`,
      Icon: Gauge,
      color: uvInfo.color,
      bg: "bg-yellow-50",
    },
    {
      label: "Curah Hujan",
      value: `${current.precipitation} mm`,
      Icon: Droplets,
      color: "text-blue-400",
      bg: "bg-blue-50",
    },
  ];

  return (
    <>
      <Navbar token={token?.value} />

      {/* Hero */}
      <section
        className={`bg-linear-to-br ${current.isDay ? "from-sky-50 via-white to-emerald-50" : "from-indigo-950 via-slate-900 to-slate-800"} px-4 pb-12 pt-28`}
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur-sm">
            <MapPin size={11} className="text-emerald-500" />
            Dataran Tinggi Dieng, Wonosobo, Jawa Tengah
          </div>

          {/* main weather display */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className={`rounded-2xl p-5 ${info.bgClass}`}>
              <Icon size={52} className={info.colorClass} />
            </div>
            <p
              className={`text-8xl font-black tracking-tighter ${current.isDay ? "text-zinc-900" : "text-white"}`}
            >
              {current.temperature}°
            </p>
            <p
              className={`text-xl font-semibold ${current.isDay ? "text-zinc-700" : "text-slate-200"}`}
            >
              {info.label}
            </p>
            <p
              className={`text-sm ${current.isDay ? "text-zinc-400" : "text-slate-400"}`}
            >
              Suhu terasa seperti {current.feelsLike}°C
            </p>
          </div>

          <div className={`mt-4 space-y-1 text-center text-xs ${current.isDay ? "text-zinc-400" : "text-slate-400"}`}>
            <div className="flex items-center justify-center gap-1">
              <Clock size={11} />
              <span>Diperbarui: {updatedAt}</span>
            </div>
            <p className={current.isDay ? "text-zinc-300" : "text-slate-500"}>
              Data dari model numerik cuaca — kondisi aktual di lapangan dapat berbeda,
              terutama saat kabut atau pergantian cuaca cepat.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
        {/* ── Embun Upas Prediction ── */}
        <div className="mt-10">
          <div className="mb-1 flex items-center gap-2">
            <Snowflake size={16} className="text-blue-500" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Prediksi Embun Upas
            </h2>
          </div>
          <p className="mb-4 text-xs text-zinc-400">
            Embun upas (frost) terbentuk dini hari ketika suhu mendekati 0°C,
            langit cerah, dan angin tenang. Dieng berada di 2.093 mdpl —
            fenomena ini paling sering terjadi Juni–Agustus.
          </p>

          {/* 7-day frost risk cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {daily.slice(0, 7).map((day, i) => {
              const frost = predictFrost(day);
              const cfg = frostRiskConfig[frost.risk];
              const dateObj = parseISO(day.date);
              const dayName =
                i === 0
                  ? "Hari ini"
                  : i === 1
                    ? "Besok"
                    : DAY_NAMES[dateObj.getDay()];
              const dateStr = format(dateObj, "d MMM", { locale: localeId });

              return (
                <div
                  key={day.date}
                  className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-zinc-700">
                        {dayName}
                      </p>
                      <p className="text-xs text-zinc-400">{dateStr}</p>
                    </div>
                    <span
                      className={`inline-flex h-2 w-2 rounded-full ${cfg.dot}`}
                    />
                  </div>
                  <p className={`text-sm font-bold ${cfg.color}`}>
                    {cfg.labelShort}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Min {frost.estimatedMinTemp}°C
                  </p>
                  <div className="mt-2 flex gap-2 text-xs text-zinc-400">
                    <span title="Peluang hujan">
                      🌧 {day.precipitationProbability ?? 0}%
                    </span>
                    <span title="Angin minimum">💨 {day.windSpeedMin}km/j</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* detail for today */}
          {(() => {
            const todayFrost = predictFrost(daily[0]);
            const cfg = frostRiskConfig[todayFrost.risk];
            return (
              <div
                className={`mt-4 rounded-2xl border p-5 ${cfg.bg} ${cfg.border}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}
                  >
                    <Snowflake size={18} className={cfg.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold ${cfg.color}`}>
                        {cfg.label} — Hari Ini
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border}`}
                      >
                        Skor {todayFrost.score}/6
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                      {todayFrost.description}
                    </p>
                    <div className="mt-3 rounded-xl bg-white/70 px-4 py-3">
                      <p className="text-xs font-semibold text-zinc-700">
                        Tips untuk Wisatawan
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                        {todayFrost.tipVisitor}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        Jam puncak: {todayFrost.peakHours}
                      </span>
                      <span className="flex items-center gap-1">
                        <Thermometer size={11} />
                        Faktor suhu: {todayFrost.factors.tempScore}/3
                      </span>
                      <span className="flex items-center gap-1">
                        <Wind size={11} />
                        Faktor angin: {todayFrost.factors.windScore}/1
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets size={11} />
                        Faktor langit: {todayFrost.factors.skyScore}/2
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* detail grid */}
        <h2 className="my-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Detail Cuaca
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {detailCards.map(({ label, value, Icon: CardIcon, color, bg }) => (
            <div
              key={label}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
            >
              <div className={`w-fit rounded-xl p-2 ${bg}`}>
                <CardIcon size={18} className={color} />
              </div>
              <div>
                <p className="text-xs text-zinc-400">{label}</p>
                <p className="mt-0.5 text-base font-bold text-zinc-900">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 7-day forecast */}
        <h2 className="mb-4 mt-10 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Prakiraan 7 Hari
        </h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          {daily.map((day, i) => {
            const dayInfo = getWeatherInfo(day.weatherCode);
            const DayIcon = dayInfo.Icon;
            const dateObj = parseISO(day.date);
            const dayName =
              i === 0
                ? "Hari ini"
                : i === 1
                  ? "Besok"
                  : DAY_NAMES[dateObj.getDay()];
            const dateStr = format(dateObj, "d MMM", { locale: localeId });

            return (
              <div
                key={day.date}
                className="flex items-center justify-between border-b border-zinc-50 px-5 py-4 last:border-0"
              >
                <div className="w-20">
                  <p className="text-sm font-semibold text-zinc-800">
                    {dayName}
                  </p>
                  <p className="text-xs text-zinc-400">{dateStr}</p>
                </div>

                <div className="flex items-center gap-2">
                  <DayIcon size={18} className={dayInfo.colorClass} />
                  <span className="text-xs text-zinc-500">{dayInfo.label}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-blue-400">
                  <Droplets size={12} />
                  <span>{day.precipitationProbability ?? 0}%</span>
                </div>

                <div className="flex items-center gap-1 text-sm font-semibold text-zinc-800">
                  <span>{day.tempMax}°</span>
                  <span className="font-normal text-zinc-400">/</span>
                  <span className="font-normal text-zinc-400">
                    {day.tempMin}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Early Morning 03:00–06:00 ── */}
        <div className="mt-10">
          <div className="mb-1 flex items-center gap-2">
            <Moon size={16} className="text-indigo-400" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Prakiraan Dini Hari 03:00 – 06:00
            </h2>
          </div>
          <p className="mb-4 text-xs text-zinc-400">
            Jam terbaik untuk sunrise Sikunir, berburu embun upas di Telaga
            Cebong, dan jeep tour. Siapkan jaket tebal.
          </p>

          <div className="space-y-3">
            {earlyMorning.map((day, i) => {
              const dateObj = parseISO(day.date);
              const dayLabel =
                i === 0 ? "Hari ini" : i === 1 ? "Besok" : DAY_NAMES[dateObj.getDay()];
              const dateStr = format(dateObj, "d MMM", { locale: localeId });
              const isToday = i === 0;
              const lowestTemp = Math.min(...day.hours.map((h) => h.temperature));

              return (
                <div
                  key={day.date}
                  className={`overflow-hidden rounded-2xl border bg-white ${isToday ? "border-indigo-200 shadow-sm" : "border-zinc-100"}`}
                >
                  {/* day header */}
                  <div
                    className={`flex items-center justify-between px-4 py-2.5 ${isToday ? "bg-indigo-50" : "bg-zinc-50"}`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon size={13} className={isToday ? "text-indigo-400" : "text-zinc-300"} />
                      <span className={`text-sm font-semibold ${isToday ? "text-indigo-700" : "text-zinc-600"}`}>
                        {dayLabel}
                      </span>
                      <span className="text-xs text-zinc-400">{dateStr}</span>
                    </div>
                    <span className={`text-xs font-semibold ${lowestTemp <= 3 ? "text-blue-600" : lowestTemp <= 8 ? "text-sky-600" : "text-zinc-400"}`}>
                      Terendah {lowestTemp}°C
                    </span>
                  </div>

                  {/* hourly slots */}
                  <div className="grid grid-cols-4 divide-x divide-zinc-50">
                    {day.hours.map((h) => {
                      const hInfo = getWeatherInfo(h.weatherCode, false);
                      const HIcon = hInfo.Icon;
                      return (
                        <div key={h.hour} className="flex flex-col items-center gap-1.5 px-2 py-3">
                          <span className="text-xs font-semibold text-zinc-400">
                            {String(h.hour).padStart(2, "0")}:00
                          </span>
                          <HIcon size={18} className={hInfo.colorClass} />
                          <span className={`text-sm font-bold ${h.temperature <= 3 ? "text-blue-700" : h.temperature <= 8 ? "text-sky-600" : "text-zinc-800"}`}>
                            {h.temperature}°
                          </span>
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="flex items-center gap-0.5 text-[10px] text-zinc-400">
                              <Wind size={9} />
                              {h.windSpeed}km/j
                            </span>
                            {h.precipitationProbability > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-blue-400">
                                <Droplets size={9} />
                                {h.precipitationProbability}%
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* travel tips */}
        <div className="mt-10 rounded-2xl bg-emerald-50 p-6">
          <h2 className="mb-3 text-base font-bold text-emerald-800">
            Tips Wisata Berdasarkan Cuaca
          </h2>
          <ul className="space-y-2 text-sm text-emerald-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">•</span>
              Dieng berada di ketinggian 2.093 m dpl — suhu malam bisa turun
              hingga 0°C, selalu bawa jaket tebal.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">•</span>
              Musim kemarau (April–Oktober) adalah waktu terbaik untuk melihat
              sunrise di Sikunir dan bunga Edelweis.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">•</span>
              Kabut tebal sering muncul di pagi hari — bawa jas hujan tipis
              sebagai antisipasi.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">•</span>
              Jika hujan deras, hindari area Kawah Sikidang karena bau belerang
              lebih menyengat saat lembap.
            </li>
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Data cuaca bersumber dari{" "}
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-600"
          >
            Open-Meteo
          </a>{" "}
          · diperbarui setiap 15 menit
        </p>
      </main>

      <Footer />
      <div className="md:hidden">
        <MenuBar token={token?.value} />
      </div>
    </>
  );
}
