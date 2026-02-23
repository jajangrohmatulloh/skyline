import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WeatherRepository } from '../repositories/weather.repository';
import { CurrentWeather, ForecastDay } from '../models/weather.model';

interface OWMCurrentResponse {
    name: string;
    sys: { country: string; sunrise: number; sunset: number };
    main: { temp: number; feels_like: number; temp_min: number; temp_max: number; humidity: number; pressure: number };
    weather: Array<{ id: number; description: string; icon: string }>;
    wind: { speed: number; deg: number };
    visibility: number;
    dt: number;
}

interface OWMForecastEntry {
    dt: number;
    main: { temp_min: number; temp_max: number; humidity: number };
    weather: Array<{ id: number; description: string; icon: string }>;
    wind: { speed: number };
}

interface OWMForecastResponse {
    list: OWMForecastEntry[];
}

@Injectable({ providedIn: 'root' })
export class OpenWeatherMapService implements WeatherRepository {
    private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';
    private readonly apiKey = environment.weatherApiKey;
    private readonly units = 'metric';

    constructor(private http: HttpClient) { }

    getCurrentWeather(lat: number, lon: number): Observable<CurrentWeather> {
        const url = `${this.baseUrl}/weather`;
        return this.http
            .get<OWMCurrentResponse>(url, {
                params: { lat, lon, appid: this.apiKey, units: this.units },
            })
            .pipe(
                map((r) => this.mapCurrentWeather(r)),
                catchError(this.handleError)
            );
    }

    getForecast(lat: number, lon: number): Observable<ForecastDay[]> {
        const url = `${this.baseUrl}/forecast`;
        return this.http
            .get<OWMForecastResponse>(url, {
                params: { lat, lon, appid: this.apiKey, units: this.units, cnt: 40 },
            })
            .pipe(
                map((r) => this.aggregateForecast(r.list)),
                catchError(this.handleError)
            );
    }

    private mapCurrentWeather(r: OWMCurrentResponse): CurrentWeather {
        return {
            city: r.name,
            country: r.sys.country,
            temp: Math.round(r.main.temp),
            feelsLike: Math.round(r.main.feels_like),
            tempMin: Math.round(r.main.temp_min),
            tempMax: Math.round(r.main.temp_max),
            humidity: r.main.humidity,
            pressure: r.main.pressure,
            windSpeed: Math.round(r.wind.speed * 3.6), // m/s → km/h
            windDeg: r.wind.deg,
            visibility: Math.round(r.visibility / 1000), // m → km
            description: r.weather[0].description,
            iconCode: r.weather[0].icon,
            conditionId: r.weather[0].id,
            dt: r.dt,
            sunrise: r.sys.sunrise,
            sunset: r.sys.sunset,
        };
    }

    private aggregateForecast(list: OWMForecastEntry[]): ForecastDay[] {
        const byDay = new Map<string, OWMForecastEntry[]>();
        list.forEach((entry) => {
            const day = new Date(entry.dt * 1000).toDateString();
            if (!byDay.has(day)) byDay.set(day, []);
            byDay.get(day)!.push(entry);
        });

        return Array.from(byDay.entries())
            .slice(0, 5)
            .map(([, entries]) => {
                const temps = entries.map((e) => e.main.temp_min);
                const maxTemps = entries.map((e) => e.main.temp_max);
                const midday = entries[Math.floor(entries.length / 2)];
                return {
                    date: midday.dt,
                    tempMin: Math.round(Math.min(...temps)),
                    tempMax: Math.round(Math.max(...maxTemps)),
                    description: midday.weather[0].description,
                    iconCode: midday.weather[0].icon,
                    humidity: midday.main.humidity,
                    windSpeed: Math.round(midday.wind.speed * 3.6),
                    conditionId: midday.weather[0].id,
                };
            });
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        let message = 'An unexpected error occurred.';
        if (err.status === 404) message = 'City not found. Please try another location.';
        else if (err.status === 401) message = 'Invalid API key. Please check your configuration.';
        else if (err.status === 429) message = 'Too many requests. Please try again later.';
        else if (!navigator.onLine) message = 'No internet connection.';
        return throwError(() => new Error(message));
    }
}
