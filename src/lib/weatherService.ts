import { supabase } from "@/integrations/supabase/client";

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

async function callWeatherProxy(endpoint: string, query: string, date?: string) {
  const { data, error } = await supabase.functions.invoke('weather-proxy', {
    body: { endpoint, query, date },
  });

  if (error) {
    throw new Error(error.message || "Failed to fetch weather data");
  }

  if (data.success === false) {
    throw new Error(data.error?.info || "Failed to fetch weather data");
  }

  return data;
}

export async function fetchCurrentWeather(query: string): Promise<WeatherResponse> {
  return callWeatherProxy("current", query);
}

export async function fetchHistoricalWeather(query: string, date: string): Promise<any> {
  return callWeatherProxy("historical", query, date);
}

export async function fetchForecastWeather(query: string): Promise<any> {
  return callWeatherProxy("forecast", query);
}
