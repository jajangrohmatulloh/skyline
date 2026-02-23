import { Observable } from 'rxjs';
import { CurrentWeather, ForecastDay } from '../models/weather.model';

export abstract class WeatherRepository {
    abstract getCurrentWeather(lat: number, lon: number): Observable<CurrentWeather>;
    abstract getForecast(lat: number, lon: number): Observable<ForecastDay[]>;
}
