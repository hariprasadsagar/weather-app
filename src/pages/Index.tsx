import { useState } from "react";
import { fetchCurrentWeather, WeatherResponse } from "@/lib/weatherService";
import SearchBar from "@/components/SearchBar";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import HistoricalWeather from "@/components/HistoricalWeather";
import ForecastWeather from "@/components/ForecastWeather";
import weatherBg from "@/assets/weather-bg.jpg";
import { CloudRain, Clock, CloudSun } from "lucide-react";

type Tab = "current" | "history" | "forecast";

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("current");
  const [city, setCity] = useState("");

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setCity(query);
    try {
      const data = await fetchCurrentWeather(query);
      setWeatherData(data);
      setActiveTab("current");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: typeof CloudRain }[] = [
    { key: "current", label: "Current", icon: CloudRain },
    { key: "history", label: "History", icon: Clock },
    { key: "forecast", label: "Forecast", icon: CloudSun },
  ];

  return (
    <div
      className="min-h-screen flex items-start sm:items-center justify-center bg-background bg-cover bg-center"
      style={{ backgroundImage: `url(${weatherBg})` }}
    >
      <div className="phone-frame bg-background/30 backdrop-blur-sm overflow-y-auto">
        <div className="p-5 space-y-4 pb-8">
          {/* Header */}
          <div className="text-center pt-2 pb-1">
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              WeatherStack
            </h1>
            <p className="text-xs text-muted-foreground">Powered by Weatherstack API</p>
          </div>

          {/* Search */}
          <SearchBar onSearch={handleSearch} isLoading={loading} />

          {/* Tabs */}
          {weatherData && (
            <div className="glass-subtle rounded-2xl p-1 flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeTab === tab.key
                      ? "tab-active text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-accent text-sm">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="glass rounded-3xl p-12 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Content */}
          {!loading && weatherData && activeTab === "current" && (
            <CurrentWeatherCard data={weatherData} />
          )}
          {!loading && activeTab === "history" && (
            <HistoricalWeather city={city} />
          )}
          {!loading && activeTab === "forecast" && (
            <ForecastWeather city={city} />
          )}

          {/* Empty state */}
          {!weatherData && !loading && !error && (
            <div className="glass rounded-3xl p-10 text-center">
              <CloudRain className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground text-sm">Search for a city to see weather</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
