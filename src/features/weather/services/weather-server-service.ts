import type { WeatherData } from "../types";

const DIENG_LAT = -7.2052167;
const DIENG_LON = 109.9046361;

const TEMP_CORRECTION_C = -6;
const WEATHER_CODE_CORRECTION = -3;

function tc(raw: number): number {
  return Math.round(raw + TEMP_CORRECTION_C);
}

function wc(code: number): number {
  if (code >= 1 && code <= 3) return Math.max(0, code + WEATHER_CODE_CORRECTION);
  return code;
}

function buildWeatherUrl(): string {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(DIENG_LAT));
  url.searchParams.set("longitude", String(DIENG_LON));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_min,precipitation_sum,precipitation_probability_max,uv_index_max,wind_speed_10m_max,wind_speed_10m_min",
  );
  url.searchParams.set(
    "hourly",
    "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation_probability,relative_humidity_2m",
  );
  url.searchParams.set("timezone", "Asia/Jakarta");
  url.searchParams.set("forecast_days", "7");
  return url.toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseWeatherData(data: any): WeatherData {
  return {
    current: {
      temperature: tc(data.current.temperature_2m),
      feelsLike: tc(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      weatherCode: wc(data.current.weather_code),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      uvIndex: data.current.uv_index,
      isDay: data.current.is_day === 1,
      time: data.current.time,
    },
    daily: (data.daily.time as string[]).map((date: string, i: number) => ({
      date,
      weatherCode: wc(data.daily.weather_code[i]),
      tempMax: tc(data.daily.temperature_2m_max[i]),
      tempMin: tc(data.daily.temperature_2m_min[i]),
      tempApparentMin: tc(data.daily.apparent_temperature_min[i]),
      precipitationSum: data.daily.precipitation_sum[i],
      precipitationProbability: data.daily.precipitation_probability_max[i],
      uvIndexMax: data.daily.uv_index_max[i],
      windSpeedMax: Math.round(data.daily.wind_speed_10m_max[i]),
      windSpeedMin: Math.round(data.daily.wind_speed_10m_min[i]),
    })),
    earlyMorning: (data.daily.time as string[]).map((date: string, dayIndex: number) => ({
      date,
      hours: [3, 4, 5, 6].map((hour) => {
        const idx = dayIndex * 24 + hour;
        return {
          hour,
          temperature: tc(data.hourly.temperature_2m[idx]),
          feelsLike: tc(data.hourly.apparent_temperature[idx]),
          weatherCode: wc(data.hourly.weather_code[idx]),
          windSpeed: Math.round(data.hourly.wind_speed_10m[idx]),
          precipitationProbability: data.hourly.precipitation_probability[idx] ?? 0,
          humidity: data.hourly.relative_humidity_2m[idx],
        };
      }),
    })),
  };
}

/** Server-side fetch — uses Next.js ISR cache (revalidate 15 min). */
export async function getWeather(): Promise<WeatherData> {
  const res = await fetch(buildWeatherUrl(), {
    next: { revalidate: 900 },
  });
  if (!res.ok) throw new Error("Gagal mengambil data cuaca");
  return parseWeatherData(await res.json());
}

/** Client-side fetch — plain fetch, no Next.js cache directives. */
export async function getWeatherClient(): Promise<WeatherData> {
  const res = await fetch(buildWeatherUrl());
  if (!res.ok) throw new Error("Gagal mengambil data cuaca");
  return parseWeatherData(await res.json());
}
