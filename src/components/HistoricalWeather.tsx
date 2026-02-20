import { useState } from "react";
import { fetchHistoricalWeather } from "@/lib/weatherService";
import { Calendar, AlertTriangle, Loader2, Thermometer, Wind, Droplets } from "lucide-react";

interface Props {
  city: string;
}

const HistoricalWeather = ({ city }: Props) => {
  const [date, setDate] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!date || !city) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchHistoricalWeather(city, date);
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
          <Calendar className="w-4 h-4 text-primary" />
          Historical Weather
        </h3>
        <p className="text-muted-foreground text-xs mb-4">
          Look up past weather for <span className="text-foreground font-medium">{city || "a city"}</span>
        </p>

        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="glass-subtle rounded-xl px-3 py-2 text-sm text-foreground bg-transparent outline-none flex-1"
          />
          <button
            onClick={handleFetch}
            disabled={!date || !city || loading}
            className="glass rounded-xl px-4 py-2 text-sm font-medium text-foreground hover:bg-primary/20 transition-colors disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
          </button>
        </div>
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

      {data?.historical && (
        <div className="glass rounded-3xl p-5 space-y-3">
          {Object.entries(data.historical).map(([dateKey, dayData]: [string, any]) => (
            <div key={dateKey} className="glass-subtle rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-foreground font-medium text-sm">{dateKey}</p>
                <span className="text-xs text-muted-foreground">{dayData.description}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Thermometer className="w-3 h-3 text-primary" />
                  <span>Avg: {dayData.avgtemp}°C</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>↓{dayData.mintemp}°</span>
                  <span>↑{dayData.maxtemp}°</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Droplets className="w-3 h-3 text-primary" />
                  <span>{dayData.precip}mm</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricalWeather;
