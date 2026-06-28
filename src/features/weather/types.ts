export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  isDay: boolean;
  time: string;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  tempApparentMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  uvIndexMax: number;
  windSpeedMax: number;
  windSpeedMin: number;
}

export interface EarlyMorningHour {
  hour: number;
  temperature: number;
  feelsLike: number;
  weatherCode: number;
  windSpeed: number;
  precipitationProbability: number;
  humidity: number;
}

export interface EarlyMorningForecast {
  date: string;
  hours: EarlyMorningHour[];
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  earlyMorning: EarlyMorningForecast[];
}
