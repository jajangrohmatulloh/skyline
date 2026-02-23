export interface GeoLocation {
    lat: number;
    lon: number;
    city: string;
    country: string;
}

export interface CurrentWeather {
    city: string;
    country: string;
    temp: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDeg: number;
    visibility: number;
    description: string;
    iconCode: string;
    conditionId: number;
    dt: number;
    sunrise: number;
    sunset: number;
}

export interface ForecastDay {
    date: number;
    tempMin: number;
    tempMax: number;
    description: string;
    iconCode: string;
    humidity: number;
    windSpeed: number;
    conditionId: number;
}

export type WeatherCondition = 'clear' | 'clouds' | 'rain' | 'drizzle' | 'thunderstorm' | 'snow' | 'mist' | 'night';

export interface WeatherState {
    currentWeather: CurrentWeather | null;
    forecast: ForecastDay[];
    isLoading: boolean;
    error: string | null;
    condition: WeatherCondition;
}
