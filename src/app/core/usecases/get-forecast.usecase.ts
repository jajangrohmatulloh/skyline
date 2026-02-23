import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherRepository } from '../repositories/weather.repository';
import { ForecastDay } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class GetForecastUseCase {
    constructor(private repository: WeatherRepository) { }

    execute(lat: number, lon: number): Observable<ForecastDay[]> {
        return this.repository.getForecast(lat, lon);
    }
}
