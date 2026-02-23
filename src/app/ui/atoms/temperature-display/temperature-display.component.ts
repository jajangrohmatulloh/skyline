import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-temperature-display',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="temp-container" [class.large]="large">
      <span class="temp-value">{{ temp }}</span>
      <span class="temp-unit">°{{ unit }}</span>
    </div>
  `,
    styles: [`
    .temp-container {
      display: inline-flex;
      align-items: flex-start;
      line-height: 1;
    }
    .temp-value {
      font-size: 4rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -2px;
    }
    .temp-unit {
      font-size: 1.5rem;
      font-weight: 400;
      color: rgba(255,255,255,0.8);
      margin-top: 0.5rem;
    }
    .large .temp-value {
      font-size: 6rem;
    }
    .large .temp-unit {
      font-size: 2rem;
      margin-top: 0.75rem;
    }
  `]
})
export class TemperatureDisplayComponent {
    @Input({ required: true }) temp!: number;
    @Input() unit: 'C' | 'F' = 'C';
    @Input() large = false;
}
