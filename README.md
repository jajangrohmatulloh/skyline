# Skyline 🏙️

Skyline is a premium, real-time weather application built with Angular 18, featuring a sleek glassmorphism design, signal-based state management, and dynamic weather-themed backgrounds.

## ✨ Features

- **Real-time Weather**: Current conditions and 5-day forecasts via OpenWeatherMap API.
- **Smart Search**: Fuzzy autocomplete powered by Open-Meteo Geocoding API.
- **Dynamic Themes**: UI background and styles change automatically based on weather conditions.
- **Responsive Design**: Mobile-first, glassmorphism aesthetic.
- **Clean Architecture**: Built with SOLID principles and Atomic Design.

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jajangrohmatulloh/skyline.git
   cd skyline
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up API Key**:
   Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```env
   WEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`.

## 🛠️ Build & Deploy

To generate a production build for a specific subdirectory (e.g., `/projects/skyline/`):
```bash
npm run build -- --base-href /projects/skyline/
```
The build artifacts will be stored in the `dist/Skyline/browser` directory.

## 🔧 Tech Stack

- **Framework**: Angular 18 (Standalone Components, Signals)
- **Styling**: Vanilla CSS (Modern Custom Properties)
- **APIs**: OpenWeatherMap, Open-Meteo
- **Dev Tools**: Vite, TypeScript, dotenv

