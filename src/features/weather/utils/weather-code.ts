import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";

export interface WeatherInfo {
  label: string;
  Icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export function getWeatherInfo(code: number, isDay = true): WeatherInfo {
  if (code === 0)
    return {
      label: isDay ? "Cerah" : "Cerah Malam",
      Icon: Sun,
      colorClass: "text-yellow-500",
      bgClass: "bg-yellow-50",
    };
  if (code <= 2)
    return {
      label: "Cerah Berawan",
      Icon: CloudSun,
      colorClass: "text-yellow-400",
      bgClass: "bg-yellow-50",
    };
  if (code === 3)
    return {
      label: "Mendung",
      Icon: Cloud,
      colorClass: "text-zinc-400",
      bgClass: "bg-zinc-50",
    };
  if (code <= 48)
    return {
      label: "Berkabut",
      Icon: Cloud,
      colorClass: "text-zinc-400",
      bgClass: "bg-zinc-50",
    };
  if (code <= 55)
    return {
      label: "Gerimis",
      Icon: CloudDrizzle,
      colorClass: "text-blue-400",
      bgClass: "bg-blue-50",
    };
  if (code <= 65)
    return {
      label: "Hujan",
      Icon: CloudRain,
      colorClass: "text-blue-500",
      bgClass: "bg-blue-50",
    };
  if (code <= 77)
    return {
      label: "Salju",
      Icon: CloudSnow,
      colorClass: "text-sky-300",
      bgClass: "bg-sky-50",
    };
  if (code <= 82)
    return {
      label: "Hujan Deras",
      Icon: CloudRain,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
    };
  return {
    label: "Badai Petir",
    Icon: CloudLightning,
    colorClass: "text-yellow-600",
    bgClass: "bg-yellow-50",
  };
}

export function windDirectionLabel(degrees: number): string {
  const dirs = ["U", "TL", "T", "TG", "S", "BD", "B", "BL"];
  return dirs[Math.round(degrees / 45) % 8];
}

export function uvIndexLabel(uv: number): { label: string; color: string } {
  if (uv < 3) return { label: "Rendah", color: "text-emerald-600" };
  if (uv < 6) return { label: "Sedang", color: "text-yellow-500" };
  if (uv < 8) return { label: "Tinggi", color: "text-orange-500" };
  if (uv < 11) return { label: "Sangat Tinggi", color: "text-red-500" };
  return { label: "Ekstrem", color: "text-purple-600" };
}
