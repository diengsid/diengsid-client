import type { DailyForecast } from "../types";

export type FrostRisk = "tinggi" | "sedang" | "rendah" | "tidak";

export interface FrostPrediction {
  risk: FrostRisk;
  score: number;
  factors: {
    tempScore: number;
    skyScore: number;
    windScore: number;
  };
  estimatedMinTemp: number;
  peakHours: string;
  description: string;
  tipVisitor: string;
}

/**
 * Predicts embun upas (frost/rime) risk at Dieng Plateau (2,093 m asl).
 *
 * Frost forms when:
 * 1. Apparent min temp ≤ ~4°C (radiative cooling can push surface below 0°C)
 * 2. Clear sky at night — low precip probability = minimal cloud cover
 * 3. Low wind — calm air lets the surface cool rapidly via radiative loss
 *
 * Scoring (max 6):
 *   tempScore  0–3  (based on apparent minimum temp)
 *   skyScore   0–2  (based on precipitation probability)
 *   windScore  0–1  (based on minimum wind speed)
 */
export function predictFrost(day: DailyForecast): FrostPrediction {
  const t = day.tempApparentMin;
  const precip = day.precipitationProbability ?? 100;
  const wind = day.windSpeedMin;

  // Temperature score — below 0°C is rare in Open-Meteo output for Dieng
  // but apparent temp can reach -1 to 3°C on very clear cold nights
  let tempScore = 0;
  if (t <= 0) tempScore = 3;
  else if (t <= 2) tempScore = 2;
  else if (t <= 5) tempScore = 1;

  // Sky score — lower precip probability = clearer sky = more radiative cooling
  let skyScore = 0;
  if (precip <= 10) skyScore = 2;
  else if (precip <= 25) skyScore = 1;

  // Wind score — calm wind means cold air stays near the ground
  let windScore = 0;
  if (wind <= 8) windScore = 1;

  const score = tempScore + skyScore + windScore;

  let risk: FrostRisk;
  if (score >= 5) risk = "tinggi";
  else if (score >= 3) risk = "sedang";
  else if (score >= 1) risk = "rendah";
  else risk = "tidak";

  const descriptions: Record<FrostRisk, string> = {
    tinggi:
      "Kondisi sangat mendukung terbentuknya embun upas. Suhu sangat rendah, langit cerah, dan angin tenang memungkinkan permukaan tanah membeku dini hari.",
    sedang:
      "Kemungkinan embun beku tipis di dini hari. Kondisi cukup mendukung namun belum optimal — bergantung pada tutupan awan malam.",
    rendah:
      "Embun upas kecil kemungkinan terbentuk. Suhu masih terlalu hangat atau kondisi langit kurang mendukung.",
    tidak:
      "Tidak ada indikasi embun upas. Suhu minimum masih di atas ambang batas atau hujan/berawan akan mencegah pendinginan.",
  };

  const tips: Record<FrostRisk, string> = {
    tinggi:
      "Waktu terbaik melihat embun upas! Datang ke Telaga Cebong atau ladang kentang sekitar pukul 04:00–06:00 WIB. Bawa jaket tebal, sarung tangan, dan senter.",
    sedang:
      "Ada peluang melihat embun beku tipis. Datang sebelum matahari terbit sekitar pukul 05:00 WIB. Pakai pakaian berlapis.",
    rendah:
      "Kemungkinan kecil melihat embun upas. Tetap bawa jaket karena suhu dini hari tetap dingin.",
    tidak:
      "Hari ini tidak cocok untuk berburu embun upas. Pantau prakiraan hari berikutnya.",
  };

  return {
    risk,
    score,
    factors: { tempScore, skyScore, windScore },
    estimatedMinTemp: t,
    peakHours: "03:00 – 06:00 WIB",
    description: descriptions[risk],
    tipVisitor: tips[risk],
  };
}

export const frostRiskConfig: Record<
  FrostRisk,
  { label: string; labelShort: string; color: string; bg: string; border: string; dot: string }
> = {
  tinggi: {
    label: "Risiko Tinggi",
    labelShort: "Tinggi",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  sedang: {
    label: "Risiko Sedang",
    labelShort: "Sedang",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-400",
  },
  rendah: {
    label: "Risiko Rendah",
    labelShort: "Rendah",
    color: "text-zinc-500",
    bg: "bg-zinc-50",
    border: "border-zinc-200",
    dot: "bg-zinc-300",
  },
  tidak: {
    label: "Tidak Ada",
    labelShort: "Aman",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
};
