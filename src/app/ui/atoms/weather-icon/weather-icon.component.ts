import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-weather-icon',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="weather-icon-wrapper" [style.width.px]="size" [style.height.px]="size">
      <img
        [src]="iconUrl"
        [alt]="alt"
        [style.width.px]="size"
        [style.height.px]="size"
        class="weather-icon"
      />
    </div>
  `,
    styles: [`
    .weather-icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .weather-icon {
      object-fit: contain;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `]
})
export class WeatherIconComponent {
    @Input({ required: true }) iconCode!: string;
    @Input() size = 80;
    @Input() alt = 'Weather icon';

    get iconUrl(): string {
        return `https://openweathermap.org/img/wn/${this.iconCode}@2x.png`;
    }
}
