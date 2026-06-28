import {
  frostRiskConfig,
  predictFrost,
} from "../utils/frost-prediction";
import { getWeather } from "../services/weather-server-service";
import { getWeatherInfo } from "../utils/weather-code";
import { ArrowRight, Droplets, Snowflake } from "lucide-react";
import Link from "next/link";

// ── Left-column strip (all screen sizes) ─────────────────────────────────────

export async function WeatherHeroStrip() {
  let weather;
  try {
    weather = await getWeather();
  } catch {
    return null;
  }

  const { current, daily } = weather;
  const info = getWeatherInfo(current.weatherCode, current.isDay);
  const Icon = info.Icon;
  const frost = predictFrost(daily[0]);
  const frostCfg = frostRiskConfig[frost.risk];

  return (
    <Link
      href="/cuaca"
      className="group mt-6 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm transition hover:border-emerald-300 hover:shadow-md sm:w-fit"
    >
      {/* current weather */}
      <div className="flex items-center gap-2">
        <div className={`rounded-xl p-1.5 ${info.bgClass}`}>
          <Icon size={17} className={info.colorClass} />
        </div>
        <div>
          <p className="text-[11px] leading-none text-zinc-400">
            Dieng sekarang <span className="text-zinc-300">(estimasi model)</span>
          </p>
          <p className="mt-0.5 text-sm font-bold text-zinc-900">
            {current.temperature}°C &middot; {info.label}
          </p>
        </div>
      </div>

      <div className="h-7 w-px bg-zinc-200" />

      {/* humidity */}
      <div className="flex items-center gap-1 text-xs text-zinc-500">
        <Droplets size={12} className="text-blue-400" />
        {current.humidity}%
      </div>

      <div className="h-7 w-px bg-zinc-200" />

      {/* frost risk */}
      <div className="flex items-center gap-1.5">
        <Snowflake size={13} className={frostCfg.color} />
        <span className={`text-xs font-semibold ${frostCfg.color}`}>
          Embun upas {frostCfg.labelShort}
        </span>
      </div>

      <ArrowRight
        size={13}
        className="ml-1 text-zinc-300 transition group-hover:text-emerald-500"
      />
    </Link>
  );
}

export function WeatherHeroStripSkeleton() {
  return (
    <div className="mt-6 flex w-72 animate-pulse items-center gap-3 rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3">
      <div className="h-8 w-8 rounded-xl bg-zinc-100" />
      <div className="space-y-1.5">
        <div className="h-2.5 w-20 rounded bg-zinc-100" />
        <div className="h-3.5 w-32 rounded bg-zinc-100" />
      </div>
      <div className="ml-auto h-3 w-16 rounded bg-zinc-100" />
    </div>
  );
}

// ── Right-grid card (desktop stats panel) ─────────────────────────────────────

export async function WeatherHeroCard() {
  let weather;
  try {
    weather = await getWeather();
  } catch {
    return null;
  }

  const { current } = weather;
  const info = getWeatherInfo(current.weatherCode, current.isDay);
  const Icon = info.Icon;

  return (
    <div className="col-span-2 flex items-center justify-between rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2 ${info.bgClass}`}>
          <Icon size={22} className={info.colorClass} />
        </div>
        <div>
          <p className="text-xs text-zinc-400">Cuaca Dieng Sekarang</p>
          <p className="text-lg font-bold text-zinc-900">
            {current.temperature}°C
            <span className="ml-1.5 text-sm font-normal text-zinc-500">
              {info.label}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <Droplets size={12} />
          <span>{current.humidity}%</span>
        </div>
        <Link
          href="/cuaca"
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Detail <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}

export function WeatherHeroCardSkeleton() {
  return (
    <div className="col-span-2 flex animate-pulse items-center justify-between rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-zinc-100" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 rounded bg-zinc-100" />
          <div className="h-5 w-20 rounded bg-zinc-100" />
        </div>
      </div>
      <div className="h-4 w-16 rounded bg-zinc-100" />
    </div>
  );
}
