import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherIconComponent } from '../../atoms/weather-icon/weather-icon.component';
import { ForecastDay } from '../../../core/models/weather.model';

@Component({
    selector: 'app-forecast-card',
    standalone: true,
    imports: [CommonModule, WeatherIconComponent],
    template: `
    <div class="forecast-card">
      <span class="day-label">{{ dayLabel }}</span>
      <app-weather-icon [iconCode]="day.iconCode" [size]="48" />
      <span class="description">{{ day.description }}</span>
      <div class="temps">
        <span class="temp-max">{{ day.tempMax }}°</span>
        <span class="temp-separator">/</span>
        <span class="temp-min">{{ day.tempMin }}°</span>
      </div>
    </div>
  `,
    styles: [`
    .forecast-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 20px;
      padding: 1rem 1.25rem;
      min-width: 110px;
      backdrop-filter: blur(10px);
      transition: background 0.2s, transform 0.2s;
      cursor: default;
    }
    .forecast-card:hover {
      background: rgba(255,255,255,0.14);
      transform: translateY(-4px);
    }
    .day-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: rgba(255,255,255,0.6);
    }
    .description {
      font-size: 0.72rem;
      color: rgba(255,255,255,0.55);
      text-align: center;
      text-transform: capitalize;
      max-width: 90px;
    }
    .temps {
      display: flex;
      align-items: center;
      gap: 0.15rem;
      margin-top: 0.1rem;
    }
    .temp-max {
      font-size: 1.05rem;
      font-weight: 700;
      color: #fff;
    }
    .temp-separator {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.35);
    }
    .temp-min {
      font-size: 0.85rem;
      font-weight: 400;
      color: rgba(255,255,255,0.55);
    }
  `]
})
export class ForecastCardComponent {
    @Input({ required: true }) day!: ForecastDay;

    get dayLabel(): string {
        const date = new Date(this.day.date * 1000);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return 'Today';
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
}
