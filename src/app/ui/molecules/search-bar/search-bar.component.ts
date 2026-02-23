import { Component, EventEmitter, Output, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of, catchError } from 'rxjs';
import { GeoService } from '../../../core/services/geo.service';
import { GeoLocation } from '../../../core/models/weather.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-bar" [class.focused]="isFocused">
        <span class="search-icon">🔍</span>
        <input
          id="city-search-input"
          type="text"
          [ngModel]="query"
          (ngModelChange)="onInput($event)"
          (keyup.enter)="onSearch(query)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          placeholder="Search city..."
          class="search-input"
          autocomplete="off"
        />
        <button
          *ngIf="query"
          class="clear-btn"
          (click)="clear()"
          type="button"
          aria-label="Clear search"
        >✕</button>
        <button class="search-btn" (click)="onSearch(query)" type="button" aria-label="Search">
          Go
        </button>
      </div>

      <!-- Autocomplete Dropdown -->
      <div class="suggestions-dropdown" *ngIf="showSuggestions() && suggestions().length > 0">
        <ul class="suggestion-list">
          <li *ngFor="let loc of suggestions()" 
              class="suggestion-item" 
              (mousedown)="selectCity(loc)">
            <span class="location-pin">📍</span>
            <span class="city-name">{{ loc.city }}</span>
            <span class="country-name" *ngIf="loc.country">, {{ loc.country }}</span>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      width: 100%;
      max-width: 520px;
      margin: 0 auto;
      position: relative;
    }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.12);
      border: 1.5px solid rgba(255,255,255,0.2);
      border-radius: 999px;
      padding: 0.6rem 0.75rem 0.6rem 1.25rem;
      backdrop-filter: blur(20px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
      position: relative;
      z-index: 10;
    }
    .search-bar.focused {
      background: rgba(255,255,255,0.18);
      border-color: rgba(255,255,255,0.45);
      box-shadow: 0 4px 32px rgba(255,255,255,0.1), 0 0 0 3px rgba(255,255,255,0.08);
    }
    .search-icon { font-size: 1rem; opacity: 0.7; flex-shrink: 0; }
    .search-input {
      flex: 1; background: transparent; border: none; outline: none;
      color: #fff; font-size: 1rem; font-family: inherit; font-weight: 400;
    }
    .search-input::placeholder { color: rgba(255,255,255,0.45); }
    .clear-btn {
      background: rgba(255,255,255,0.15); border: none; border-radius: 50%;
      width: 22px; height: 22px; cursor: pointer; color: rgba(255,255,255,0.7);
      font-size: 0.65rem; display: flex; align-items: center; justify-content: center;
      transition: background 0.2s; flex-shrink: 0;
    }
    .clear-btn:hover { background: rgba(255,255,255,0.25); color: #fff; }
    .search-btn {
      background: rgba(255,255,255,0.25); border: none; border-radius: 999px;
      padding: 0.4rem 1.1rem; color: #fff; font-size: 0.85rem; font-weight: 600;
      cursor: pointer; font-family: inherit; transition: background 0.2s, transform 0.15s;
    }
    .search-btn:hover { background: rgba(255,255,255,0.35); transform: scale(1.03); }
    .search-btn:active { transform: scale(0.98); }

    .suggestions-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 16px;
      padding: 0.5rem 0;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 5;
      max-height: 240px;
      overflow-y: auto;
    }
    .suggestion-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .suggestion-item {
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;
    }
    .suggestion-item:hover {
      background: rgba(255,255,255,0.15);
    }
    .suggestion-item .location-pin {
      opacity: 0.6;
      font-size: 0.9rem;
    }
    .suggestion-item .city-name {
      color: #fff;
      font-weight: 500;
      font-size: 1.05rem;
    }
    .suggestion-item .country-name {
      color: rgba(255,255,255,0.6);
      font-size: 0.9rem;
    }

    .suggestions-dropdown::-webkit-scrollbar { width: 5px; }
    .suggestions-dropdown::-webkit-scrollbar-track { background: transparent; }
    .suggestions-dropdown::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 3px; }
  `]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<string>();

  private geoService = inject(GeoService);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  query = '';
  isFocused = false;

  suggestions = signal<GeoLocation[]>([]);
  showSuggestions = signal(false);

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length < 2) return of([]);
        return this.geoService.suggestCities(term).pipe(
          catchError(() => of([]))
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.suggestions.set(results);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(term: string): void {
    this.query = term;
    this.searchSubject.next(term);
    this.showSuggestions.set(true);
  }

  onFocus(): void {
    this.isFocused = true;
    if (this.query.length >= 2) {
      this.showSuggestions.set(true);
    }
  }

  onBlur(): void {
    this.isFocused = false;
    // Delay hiding suggestions so mousedown on suggestion item can fire first
    setTimeout(() => {
      this.showSuggestions.set(false);
    }, 150);
  }

  selectCity(loc: GeoLocation): void {
    const fullQuery = loc.country ? `${loc.city}, ${loc.country}` : loc.city;
    this.query = fullQuery;
    this.showSuggestions.set(false);
    this.search.emit(fullQuery);
  }

  onSearch(term: string): void {
    const trimmed = term.trim();
    if (trimmed) {
      this.showSuggestions.set(false);
      this.search.emit(trimmed);
    }
  }

  clear(): void {
    this.query = '';
    this.suggestions.set([]);
    this.showSuggestions.set(false);
    this.searchSubject.next('');

    // Focus back into the input
    setTimeout(() => document.getElementById('city-search-input')?.focus(), 0);
  }
}
