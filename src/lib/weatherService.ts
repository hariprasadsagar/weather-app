const API_KEY = "9723d2dd4ccb1124cca198977eef3dd0";
const BASE_URL = "http://api.weatherstack.com";

export interface WeatherLocation {
  name: string;
  country: string;
  region: string;
  lat: string;
  lon: string;
  localtime: string;
}

export interface CurrentWeather {
  temperature: number;
  weather_descriptions: string[];
  weather_icons: string[];
  wind_speed: number;
  wind_dir: string;
  pressure: number;
  humidity: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
  cloudcover: number;
  precip: number;
}

export interface WeatherResponse {
  request: { query: string; type: string };
  location: WeatherLocation;
  current: CurrentWeather;
}

export interface WeatherError {
  success: false;
  error: { code: number; type: string; info: string };
}

export async function fetchCurrentWeather(query: string): Promise<WeatherResponse> {
  const url = `${BASE_URL}/current?access_key=${API_KEY}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  
  if (data.success === false) {
    throw new Error(data.error?.info || "Failed to fetch weather data");
  }
  
  return data;
}

export async function fetchHistoricalWeather(query: string, date: string): Promise<any> {
  const url = `${BASE_URL}/historical?access_key=${API_KEY}&query=${encodeURIComponent(query)}&historical_date=${date}`;
  const res = await fetch(url);
  const data = await res.json();
  
  if (data.success === false) {
    throw new Error(data.error?.info || "Historical weather requires a paid plan. The free plan only supports current weather.");
  }
  
  return data;
}

export async function fetchForecastWeather(query: string): Promise<any> {
  const url = `${BASE_URL}/forecast?access_key=${API_KEY}&query=${encodeURIComponent(query)}&forecast_days=7`;
  const res = await fetch(url);
  const data = await res.json();
  
  if (data.success === false) {
    throw new Error(data.error?.info || "Forecast requires a paid plan. The free plan only supports current weather.");
  }
  
  return data;
}
