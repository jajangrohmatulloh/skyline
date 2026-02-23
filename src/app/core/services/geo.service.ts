import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, switchMap, map, of } from 'rxjs';
import { GeoLocation } from '../models/weather.model';
import { environment } from '../../../environments/environment';

interface OWMGeoResponse {
    name: string;
    country: string;
    lat: number;
    lon: number;
}

@Injectable({ providedIn: 'root' })
export class GeoService {
    private readonly geocodeUrl = 'https://api.openweathermap.org/geo/1.0';
    private readonly apiKey = environment.weatherApiKey;

    constructor(private http: HttpClient) { }

    getCurrentPosition(): Observable<GeoLocation> {
        return from(
            new Promise<GeolocationPosition>((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
            )
        ).pipe(
            map((pos) => ({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                city: '',
                country: '',
            }))
        );
    }

    searchCity(query: string): Observable<GeoLocation> {
        return this.http
            .get<OWMGeoResponse[]>(`${this.geocodeUrl}/direct`, {
                params: { q: query, limit: 1, appid: this.apiKey },
            })
            .pipe(
                switchMap((results) => {
                    if (!results || results.length === 0) {
                        throw new Error('City not found. Please try another location.');
                    }
                    const result = results[0];
                    return [{ lat: result.lat, lon: result.lon, city: result.name, country: result.country }];
                })
            );
    }

    suggestCities(query: string): Observable<GeoLocation[]> {
        const trimmed = query.trim();
        if (!trimmed) return of([]);

        // Using Open-Meteo's free geocoding API for vastly superior autocomplete and "contains" search 
        // e.g., "tok" -> "Tokyo"
        return this.http
            .get<any>(`https://geocoding-api.open-meteo.com/v1/search`, {
                params: { name: trimmed, count: 20, language: 'en', format: 'json' }, // fetch more so major cities don't get truncated
            })
            .pipe(
                map((response) => {
                    if (!response || !response.results) return [];

                    // Deduplicate by city and country
                    const unique = response.results.filter((value: any, index: number, self: any[]) =>
                        index === self.findIndex((t: any) => (
                            t.name === value.name && t.country_code === value.country_code
                        ))
                    );

                    // Ensure the query matches somewhere in the result (contains)
                    const queryLower = trimmed.toLowerCase();
                    const filtered = unique.filter(
                        (r: any) => r.name.toLowerCase().includes(queryLower) ||
                            (r.country && r.country.toLowerCase().includes(queryLower)) ||
                            (r.admin1 && r.admin1.toLowerCase().includes(queryLower))
                    );

                    // Map to our domain format (return all available results, up to the 20 requested)
                    return filtered
                        .map((r: any) => ({ lat: r.latitude, lon: r.longitude, city: r.name, country: r.country }));
                })
            );
    }
}
