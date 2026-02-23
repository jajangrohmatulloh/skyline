import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin, switchMap } from 'rxjs';
import { CurrentWeather, ForecastDay, GeoLocation, WeatherCondition } from '../core/models/weather.model';
import { GetCurrentWeatherUseCase } from '../core/usecases/get-current-weather.usecase';
import { GetForecastUseCase } from '../core/usecases/get-forecast.usecase';
import { GeoService } from '../core/services/geo.service';

@Injectable({ providedIn: 'root' })
export class WeatherStore {
    private currentWeatherUseCase = inject(GetCurrentWeatherUseCase);
    private forecastUseCase = inject(GetForecastUseCase);
    private geoService = inject(GeoService);

    // State signals
    readonly currentWeather = signal<CurrentWeather | null>(null);
    readonly forecast = signal<ForecastDay[]>([]);
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    // Computed values
    readonly condition = computed<WeatherCondition>(() => {
        const weather = this.currentWeather();
        if (!weather) return 'clear';
        return this.resolveCondition(weather.conditionId, weather.dt, weather.sunrise, weather.sunset);
    });

    readonly isDaytime = computed(() => {
        const w = this.currentWeather();
        if (!w) return true;
        return w.dt >= w.sunrise && w.dt < w.sunset;
    });

    loadByLocation(): void {
        this.setLoading();
        this.geoService.getCurrentPosition().pipe(
            switchMap((geo: GeoLocation) =>
                forkJoin({
                    current: this.currentWeatherUseCase.execute(geo.lat, geo.lon),
                    forecast: this.forecastUseCase.execute(geo.lat, geo.lon),
                })
            )
        ).subscribe({
            next: ({ current, forecast }) => this.setData(current, forecast),
            error: (err: Error) => this.setError(err.message || 'Failed to get location weather.'),
        });
    }

    loadByCity(query: string): void {
        if (!query.trim()) return;
        this.setLoading();
        this.geoService.searchCity(query).pipe(
            switchMap((geo: GeoLocation) =>
                forkJoin({
                    current: this.currentWeatherUseCase.execute(geo.lat, geo.lon),
                    forecast: this.forecastUseCase.execute(geo.lat, geo.lon),
                })
            )
        ).subscribe({
            next: ({ current, forecast }) => this.setData(current, forecast),
            error: (err: Error) => this.setError(err.message || 'Failed to load city weather.'),
        });
    }

    private setLoading(): void {
        this.isLoading.set(true);
        this.error.set(null);
    }

    private setData(current: CurrentWeather, forecast: ForecastDay[]): void {
        this.currentWeather.set(current);
        this.forecast.set(forecast);
        this.isLoading.set(false);
        this.error.set(null);
    }

    private setError(message: string): void {
        this.error.set(message);
        this.isLoading.set(false);
    }

    private resolveCondition(id: number, dt: number, sunrise: number, sunset: number): WeatherCondition {
        const isNight = dt < sunrise || dt >= sunset;
        if (isNight) return 'night';
        if (id >= 200 && id < 300) return 'thunderstorm';
        if (id >= 300 && id < 400) return 'drizzle';
        if (id >= 500 && id < 600) return 'rain';
        if (id >= 600 && id < 700) return 'snow';
        if (id >= 700 && id < 800) return 'mist';
        if (id === 800) return 'clear';
        return 'clouds';
    }
}
