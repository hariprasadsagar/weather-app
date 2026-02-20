import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const API_KEY = "9723d2dd4ccb1124cca198977eef3dd0";
const BASE_URL = "http://api.weatherstack.com";

async function geocode(query: string) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`);
  const data = await res.json();
  if (!data.results?.length) throw new Error("City not found");
  return data.results[0];
}

async function handleCurrent(query: string) {
  const url = `${BASE_URL}/current?access_key=${API_KEY}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  return await res.json();
}

async function handleForecast(query: string) {
  const geo = await geocode(query);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();

  const forecast: Record<string, any> = {};
  for (let i = 0; i < data.daily.time.length; i++) {
    forecast[data.daily.time[i]] = {
      maxtemp: data.daily.temperature_2m_max[i],
      mintemp: data.daily.temperature_2m_min[i],
      weathercode: data.daily.weathercode[i],
      precip: data.daily.precipitation_sum[i],
      wind_max: data.daily.windspeed_10m_max[i],
      description: weatherCodeToDescription(data.daily.weathercode[i]),
    };
  }

  return {
    location: { name: geo.name, country: geo.country, region: geo.admin1 || "" },
    forecast,
  };
}

async function handleHistorical(query: string, date: string) {
  const geo = await geocode(query);
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${geo.latitude}&longitude=${geo.longitude}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,weathercode,precipitation_sum,windspeed_10m_max&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) throw new Error(data.reason || "Failed to fetch historical data");

  const historical: Record<string, any> = {};
  for (let i = 0; i < data.daily.time.length; i++) {
    historical[data.daily.time[i]] = {
      maxtemp: data.daily.temperature_2m_max[i],
      mintemp: data.daily.temperature_2m_min[i],
      avgtemp: data.daily.temperature_2m_mean[i],
      weathercode: data.daily.weathercode[i],
      precip: data.daily.precipitation_sum[i],
      wind_max: data.daily.windspeed_10m_max[i],
      description: weatherCodeToDescription(data.daily.weathercode[i]),
    };
  }

  return {
    location: { name: geo.name, country: geo.country, region: geo.admin1 || "" },
    historical,
  };
}

function weatherCodeToDescription(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail",
  };
  return map[code] || "Unknown";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, query, date } = await req.json();
    let result;

    if (endpoint === "current") {
      result = await handleCurrent(query);
    } else if (endpoint === "forecast") {
      result = await handleForecast(query);
    } else if (endpoint === "historical") {
      result = await handleHistorical(query, date);
    } else {
      throw new Error("Invalid endpoint");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: { info: error.message } }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
