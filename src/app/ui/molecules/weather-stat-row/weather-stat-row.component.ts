import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatBadgeComponent } from '../../atoms/stat-badge/stat-badge.component';
import { CurrentWeather } from '../../../core/models/weather.model';

@Component({
    selector: 'app-weather-stat-row',
    standalone: true,
    imports: [CommonModule, StatBadgeComponent],
    template: `
    <div class="stat-grid">
      <app-stat-badge icon="💧" label="Humidity" [value]="weather.humidity" unit="%" />
      <app-stat-badge icon="🌬️" label="Wind" [value]="weather.windSpeed" unit="km/h" />
      <app-stat-badge icon="📊" label="Pressure" [value]="weather.pressure" unit="hPa" />
      <app-stat-badge icon="👁️" label="Visibility" [value]="weather.visibility" unit="km" />
      <app-stat-badge icon="🌡️" label="Feels Like" [value]="weather.feelsLike + '°'" />
      <app-stat-badge icon="🌅" label="Sunrise" [value]="formatTime(weather.sunrise)" />
    </div>
  `,
    styles: [`
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 0.75rem;
    }
  `]
})
export class WeatherStatRowComponent {
    @Input({ required: true }) weather!: CurrentWeather;

    formatTime(unix: number): string {
        return new Date(unix * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
}
