import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherRepository } from '../repositories/weather.repository';
import { CurrentWeather } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class GetCurrentWeatherUseCase {
    constructor(private repository: WeatherRepository) { }

    execute(lat: number, lon: number): Observable<CurrentWeather> {
        return this.repository.getCurrentWeather(lat, lon);
    }
}
