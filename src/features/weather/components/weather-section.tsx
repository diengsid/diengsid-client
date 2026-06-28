import {
  frostRiskConfig,
  predictFrost,
} from "@/features/weather/utils/frost-prediction";
import {
  getWeatherInfo,
  windDirectionLabel,
} from "@/features/weather/utils/weather-code";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ArrowRight, Droplets, Snowflake, Wind } from "lucide-react";
import Link from "next/link";
import { getWeather } from "../services/weather-server-service";

const DAY_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default async function WeatherSection() {
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
  const next5 = daily.slice(0, 5);

  return (
    <section className="px-4 py-6 md:px-12 lg:px-20">
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Cuaca Dieng</h2>
        <Link
          href="/cuaca"
          className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 transition"
        >
          Lihat detail <ArrowRight size={14} />
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
        {/* current weather */}
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          {/* temp + condition */}
          <div className="flex items-center gap-4">
            <div className={`rounded-2xl p-3 ${info.bgClass}`}>
              <Icon size={36} className={info.colorClass} />
            </div>
            <div>
              <p className="text-4xl font-bold text-zinc-900">
                {current.temperature}°C
              </p>
              <p className="text-sm text-zinc-500">{info.label}</p>
              <p className="mt-0.5 text-xs text-zinc-400">
                Terasa {current.feelsLike}°C · Dieng Wonosobo
              </p>
            </div>
          </div>

          {/* stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 text-sm text-zinc-600">
              <Droplets size={15} className="text-blue-400" />
              <span>{current.humidity}%</span>
              <span className="text-xs text-zinc-400">Kelembaban</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-zinc-600">
              <Wind size={15} className="text-zinc-400" />
              <span>{current.windSpeed} km/j</span>
              <span className="text-xs text-zinc-400">
                {windDirectionLabel(current.windDirection)}
              </span>
            </div>
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${frostCfg.bg} ${frostCfg.border} border`}
            >
              <Snowflake size={14} className={frostCfg.color} />
              <span className={frostCfg.color}>
                Embun upas {frostCfg.labelShort}
              </span>
            </div>
          </div>
        </div>

        {/* 5-day forecast */}
        <div className="grid grid-cols-5 border-t border-zinc-100">
          {next5.map((day) => {
            const d = parseISO(day.date);
            const dayName = DAY_SHORT[d.getDay()];
            const dateStr = format(d, "d MMM", { locale: localeId });
            const dayInfo = getWeatherInfo(day.weatherCode, true);
            const DayIcon = dayInfo.Icon;

            return (
              <div
                key={day.date}
                className="flex flex-col items-center gap-1.5 border-r border-zinc-100 py-4 last:border-r-0"
              >
                <p className="text-xs font-semibold text-zinc-500">{dayName}</p>
                <p className="text-[10px] text-zinc-400">{dateStr}</p>
                <div className={`rounded-xl p-1.5 ${dayInfo.bgClass}`}>
                  <DayIcon size={16} className={dayInfo.colorClass} />
                </div>
                <p className="text-xs font-bold text-zinc-800">
                  {day.tempMax}°
                </p>
                <p className="text-[10px] text-zinc-400">{day.tempMin}°</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
