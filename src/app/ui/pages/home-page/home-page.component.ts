import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { SearchBarComponent } from '../../molecules/search-bar/search-bar.component';
import { CurrentWeatherPanelComponent } from '../../organisms/current-weather-panel/current-weather-panel.component';
import { ForecastSectionComponent } from '../../organisms/forecast-section/forecast-section.component';
import { WeatherDetailsGridComponent } from '../../organisms/weather-details-grid/weather-details-grid.component';
import { WeatherStore } from '../../../store/weather.store';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [
        CommonModule,
        SearchBarComponent,
        CurrentWeatherPanelComponent,
        ForecastSectionComponent,
        WeatherDetailsGridComponent,
    ],
    template: `
    <div class="page-wrapper" [attr.data-condition]="store.condition()">
      <div class="bg-gradient"></div>
      <div class="bg-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <div class="page-content">
        <!-- Header -->
        <header class="app-header">
          <div class="brand">
            <span class="brand-icon">🌤️</span>
            <span class="brand-name">Skyline</span>
          </div>
          <button class="locate-btn" (click)="locateMe()" title="Use my location" aria-label="Use my location">
            🎯 My Location
          </button>
        </header>

        <!-- Search -->
        <div class="search-section">
          <app-search-bar (search)="onSearch($event)" />
        </div>

        <!-- Loading State -->
        <div class="loading-state" *ngIf="store.isLoading()">
          <div class="spinner"></div>
          <p class="loading-text">Fetching weather data...</p>
        </div>

        <!-- Error State -->
        <div class="error-state" *ngIf="store.error() && !store.isLoading()">
          <span class="error-icon">⚠️</span>
          <p class="error-text">{{ store.error() }}</p>
          <button class="retry-btn" (click)="locateMe()">Try My Location</button>
        </div>

        <!-- Weather Content -->
        <div class="weather-content" *ngIf="store.currentWeather() && !store.isLoading()">
          <div class="glass-card hero-card">
            <app-current-weather-panel />
          </div>

          <div class="glass-card details-card">
            <app-forecast-section />
            <div class="divider"></div>
            <app-weather-details-grid />
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!store.currentWeather() && !store.isLoading() && !store.error()">
          <span class="empty-icon">🌍</span>
          <p class="empty-title">Discover Your Weather</p>
          <p class="empty-sub">Allow location access or search for a city to get started.</p>
        </div>

        <footer class="app-footer">
          Powered by OpenWeatherMap
        </footer>
      </div>
    </div>
  `,
    styles: [`
    .page-wrapper {
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
      transition: --condition 0.8s;
    }

    /* === Dynamic gradient background per condition === */
    .bg-gradient {
      position: fixed;
      inset: 0;
      z-index: 0;
      transition: background 1.2s ease;
    }
    [data-condition="clear"] .bg-gradient {
      background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%);
    }
    [data-condition="clouds"] .bg-gradient {
      background: linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%);
    }
    [data-condition="rain"] .bg-gradient {
      background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #1d4ed8 100%);
    }
    [data-condition="drizzle"] .bg-gradient {
      background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%);
    }
    [data-condition="thunderstorm"] .bg-gradient {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    }
    [data-condition="snow"] .bg-gradient {
      background: linear-gradient(135deg, #93c5fd 0%, #bfdbfe 50%, #dbeafe 100%);
    }
    [data-condition="mist"] .bg-gradient {
      background: linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #475569 100%);
    }
    [data-condition="night"] .bg-gradient {
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    }

    /* === Animated orbs === */
    .bg-orbs { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
      animation: orbit 20s ease-in-out infinite alternate;
    }
    .orb-1 { width: 450px; height: 450px; background: rgba(255,255,255,0.2); top: -150px; left: -100px; animation-duration: 18s; }
    .orb-2 { width: 350px; height: 350px; background: rgba(255,255,255,0.15); bottom: -100px; right: -80px; animation-duration: 22s; animation-delay: -5s; }
    .orb-3 { width: 280px; height: 280px; background: rgba(255,255,255,0.1); top: 40%; left: 50%; animation-duration: 25s; animation-delay: -10s; }
    @keyframes orbit {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(60px, 40px) scale(1.15); }
    }

    /* === Layout === */
    .page-content {
      position: relative;
      z-index: 1;
      max-width: 680px;
      margin: 0 auto;
      padding: 1.25rem 1rem 3rem;
    }

    /* === Header === */
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.75rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .brand-icon { font-size: 1.5rem; }
    .brand-name {
      font-size: 1.35rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
    }
    .locate-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 999px;
      padding: 0.45rem 1rem;
      color: #fff;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      backdrop-filter: blur(10px);
      transition: background 0.2s, transform 0.15s;
    }
    .locate-btn:hover { background: rgba(255,255,255,0.25); transform: scale(1.03); }

    /* === Search === */
    .search-section { margin-bottom: 2rem; }

    /* === Glass cards === */
    .glass-card {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 28px;
      padding: 1.75rem;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25);
    }
    .hero-card { margin-bottom: 1.25rem; }
    .details-card { }
    .divider {
      height: 1px;
      background: rgba(255,255,255,0.1);
      margin: 1.5rem 0;
    }

    /* === Loading === */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 4rem 2rem;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text {
      color: rgba(255,255,255,0.65);
      font-size: 0.9rem;
      margin: 0;
    }

    /* === Error === */
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 3rem 2rem;
      text-align: center;
    }
    .error-icon { font-size: 2.5rem; }
    .error-text { color: rgba(255,255,255,0.85); font-size: 1rem; margin: 0; }
    .retry-btn {
      margin-top: 0.5rem;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 999px;
      padding: 0.5rem 1.5rem;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.2s;
    }
    .retry-btn:hover { background: rgba(255,255,255,0.3); }

    /* === Empty === */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 5rem 2rem;
      text-align: center;
    }
    .empty-icon { font-size: 4rem; margin-bottom: 0.5rem; animation: float-slow 4s ease-in-out infinite; }
    @keyframes float-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    .empty-title { font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0; }
    .empty-sub { font-size: 0.9rem; color: rgba(255,255,255,0.55); margin: 0; }

    /* === Footer === */
    .app-footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.72rem;
      color: rgba(255,255,255,0.3);
    }
  `]
})
export class HomePageComponent implements OnInit {
    store = inject(WeatherStore);

    ngOnInit(): void {
        this.store.loadByLocation();
    }

    locateMe(): void {
        this.store.loadByLocation();
    }

    onSearch(city: string): void {
        this.store.loadByCity(city);
    }
}
