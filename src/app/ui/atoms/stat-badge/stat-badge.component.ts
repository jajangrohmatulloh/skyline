import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-stat-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="stat-badge">
      <span class="stat-icon">{{ icon }}</span>
      <div class="stat-info">
        <span class="stat-label">{{ label }}</span>
        <span class="stat-value">{{ value }}<span class="stat-unit" *ngIf="unit"> {{ unit }}</span></span>
      </div>
    </div>
  `,
    styles: [`
    .stat-badge {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px;
      padding: 0.875rem 1rem;
      backdrop-filter: blur(8px);
      transition: background 0.2s, transform 0.2s;
    }
    .stat-badge:hover {
      background: rgba(255,255,255,0.14);
      transform: translateY(-2px);
    }
    .stat-icon {
      font-size: 1.5rem;
      line-height: 1;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255,255,255,0.55);
      font-weight: 500;
    }
    .stat-value {
      font-size: 1.05rem;
      font-weight: 600;
      color: #fff;
      margin-top: 2px;
    }
    .stat-unit {
      font-size: 0.8rem;
      font-weight: 400;
      color: rgba(255,255,255,0.7);
    }
  `]
})
export class StatBadgeComponent {
    @Input({ required: true }) label!: string;
    @Input({ required: true }) value!: string | number;
    @Input({ required: true }) icon!: string;
    @Input() unit = '';
}
