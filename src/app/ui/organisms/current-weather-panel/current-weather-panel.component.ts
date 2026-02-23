import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherIconComponent } from '../../atoms/weather-icon/weather-icon.component';
import { TemperatureDisplayComponent } from '../../atoms/temperature-display/temperature-display.component';
import { WeatherStore } from '../../../store/weather.store';

@Component({
    selector: 'app-current-weather-panel',
    standalone: true,
    imports: [CommonModule, WeatherIconComponent, TemperatureDisplayComponent],
    template: `
    <div class="current-weather" *ngIf="store.currentWeather() as weather">
      <div class="location">
        <span class="location-pin">📍</span>
        <div class="location-text">
          <h1 class="city-name">{{ weather.city }}</h1>
          <span class="country-name">{{ weather.country }}</span>
        </div>
      </div>

      <div class="main-display">
        <app-weather-icon [iconCode]="weather.iconCode" [size]="120" />
        <div class="temp-info">
          <app-temperature-display [temp]="weather.temp" [large]="true" />
          <p class="description">{{ weather.description }}</p>
          <p class="temp-range">H: {{ weather.tempMax }}°  ·  L: {{ weather.tempMin }}°</p>
        </div>
      </div>

      <p class="date-time">{{ now | date : 'EEEE, MMMM d, y · h:mm a' }}</p>
    </div>
  `,
    styles: [`
    .current-weather {
      text-align: center;
      padding: 1.5rem 1rem;
    }
    .location {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .location-pin { font-size: 1.25rem; }
    .location-text { display: flex; flex-direction: column; align-items: flex-start; }
    .city-name {
      font-size: 1.75rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
      line-height: 1.2;
    }
    .country-name {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.6);
      font-weight: 400;
    }
    .main-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .temp-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .description {
      font-size: 1.1rem;
      color: rgba(255,255,255,0.8);
      text-transform: capitalize;
      margin: 0.25rem 0 0;
      font-weight: 400;
    }
    .temp-range {
      font-size: 0.9rem;
      color: rgba(255,255,255,0.55);
      margin: 0.2rem 0 0;
    }
    .date-time {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.45);
      margin: 0;
    }
  `]
})
export class CurrentWeatherPanelComponent {
    store = inject(WeatherStore);
    now = new Date();
}
