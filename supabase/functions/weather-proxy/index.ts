import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const API_KEY = "9723d2dd4ccb1124cca198977eef3dd0";
const BASE_URL = "http://api.weatherstack.com";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, query, date } = await req.json();

    let url = `${BASE_URL}/${endpoint}?access_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    
    if (endpoint === "historical" && date) {
      url += `&historical_date=${date}`;
    }
    if (endpoint === "forecast") {
      url += `&forecast_days=7`;
    }

    const response = await fetch(url);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: { info: error.message } }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
