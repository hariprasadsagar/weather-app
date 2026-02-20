import { WeatherResponse } from "@/lib/weatherService";
import { Droplets, Wind, Eye, Gauge, Thermometer, Cloud, Sun } from "lucide-react";

interface Props {
  data: WeatherResponse;
}

const CurrentWeatherCard = ({ data }: Props) => {
  const { location, current } = data;

  const details = [
    { icon: Thermometer, label: "Feels Like", value: `${current.feelslike}°C` },
    { icon: Droplets, label: "Humidity", value: `${current.humidity}%` },
    { icon: Wind, label: "Wind", value: `${current.wind_speed} km/h ${current.wind_dir}` },
    { icon: Gauge, label: "Pressure", value: `${current.pressure} mb` },
    { icon: Eye, label: "Visibility", value: `${current.visibility} km` },
    { icon: Cloud, label: "Cloud Cover", value: `${current.cloudcover}%` },
    { icon: Droplets, label: "Precip", value: `${current.precip} mm` },
    { icon: Sun, label: "UV Index", value: `${current.uv_index}` },
  ];

  return (
    <div className="space-y-4">
      {/* Main temp display */}
      <div className="glass rounded-3xl p-6 text-center">
        <p className="text-muted-foreground text-sm">
          {location.name}, {location.country}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{location.localtime}</p>

        <div className="flex items-center justify-center gap-4 my-4">
          {current.weather_icons?.[0] && (
            <img
              src={current.weather_icons[0]}
              alt={current.weather_descriptions?.[0]}
              className="w-20 h-20 weather-icon"
            />
          )}
          <span className="text-7xl font-extralight text-foreground">
            {current.temperature}°
          </span>
        </div>

        <p className="text-foreground/80 text-lg font-medium">
          {current.weather_descriptions?.[0]}
        </p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {details.map((item) => (
          <div key={item.label} className="glass-subtle rounded-2xl p-3 flex items-center gap-3">
            <div className="glass rounded-xl p-2">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium text-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentWeatherCard;
