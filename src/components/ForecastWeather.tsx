import { useState } from "react";
import { fetchForecastWeather } from "@/lib/weatherService";
import { CloudSun, AlertTriangle, Loader2, Thermometer, Wind, Droplets } from "lucide-react";

interface Props {
  city: string;
}

const ForecastWeather = ({ city }: Props) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchForecastWeather(city);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-5">
        <h3 className="text-foreground font-medium mb-3 flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-primary" />
          7-Day Forecast
        </h3>
        <p className="text-muted-foreground text-xs mb-4">
          Get a 7-day forecast for <span className="text-foreground font-medium">{city || "a city"}</span>
        </p>

        <button
          onClick={handleFetch}
          disabled={!city || loading}
          className="glass rounded-xl px-5 py-2.5 text-sm font-medium text-foreground hover:bg-primary/20 transition-colors disabled:opacity-40 w-full"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Get Forecast"
          )}
        </button>
      </div>

      {error && (
        <div className="glass rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-foreground text-sm font-medium">Error</p>
            <p className="text-muted-foreground text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {data?.forecast && (
        <div className="glass rounded-3xl p-5 space-y-2">
          {Object.entries(data.forecast).map(([dateKey, dayData]: [string, any]) => (
            <div key={dateKey} className="glass-subtle rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium text-sm">{dateKey}</p>
                <p className="text-muted-foreground text-xs">{dayData.description}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-primary" />
                  {dayData.precip}mm
                </div>
                <div className="text-right">
                  <span className="text-foreground font-medium">{dayData.maxtemp}°</span>
                  <span className="mx-0.5">/</span>
                  <span>{dayData.mintemp}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForecastWeather;
