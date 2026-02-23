import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastCardComponent } from '../../molecules/forecast-card/forecast-card.component';
import { WeatherStore } from '../../../store/weather.store';

@Component({
    selector: 'app-forecast-section',
    standalone: true,
    imports: [CommonModule, ForecastCardComponent],
    template: `
    <div class="forecast-section" *ngIf="store.forecast().length > 0">
      <h2 class="section-title">5-Day Forecast</h2>
      <div class="forecast-scroll">
        <app-forecast-card *ngFor="let day of store.forecast()" [day]="day" />
      </div>
    </div>
  `,
    styles: [`
    .forecast-section { margin-top: 1.5rem; }
    .section-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.5);
      margin: 0 0 0.85rem;
    }
    .forecast-scroll {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .forecast-scroll::-webkit-scrollbar { height: 4px; }
    .forecast-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 2px; }
    .forecast-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
    app-forecast-card { scroll-snap-align: start; flex-shrink: 0; }
  `]
})
export class ForecastSectionComponent {
    store = inject(WeatherStore);
}
