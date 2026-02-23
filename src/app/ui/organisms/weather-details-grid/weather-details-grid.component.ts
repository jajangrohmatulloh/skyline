import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherStatRowComponent } from '../../molecules/weather-stat-row/weather-stat-row.component';
import { WeatherStore } from '../../../store/weather.store';

@Component({
    selector: 'app-weather-details-grid',
    standalone: true,
    imports: [CommonModule, WeatherStatRowComponent],
    template: `
    <div class="details-section" *ngIf="store.currentWeather() as weather">
      <h2 class="section-title">Weather Details</h2>
      <app-weather-stat-row [weather]="weather" />
    </div>
  `,
    styles: [`
    .details-section { margin-top: 1.5rem; }
    .section-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.5);
      margin: 0 0 0.85rem;
    }
  `]
})
export class WeatherDetailsGridComponent {
    store = inject(WeatherStore);
}
