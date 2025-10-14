<!-- src/views/WeatherView.vue -->
<template>
  <div class="container">
    <header class="header">
      <h1>WEATHER APP</h1>
    </header>

    <section class="search-bar">
      <input
        type="text"
        v-model="city"
        placeholder="Enter city name"
        class="search-input"
      />
      <button @click="searchByCity" class="search-button">Search</button>
    </section>

    <main>
      <p v-if="loading">Loading...</p>
      <p v-else-if="error" class="error">{{ error }}</p>

      <div v-else-if="weatherData" class="card">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>

        <div class="row">
          <img :src="iconUrl" alt="Weather Icon" />
          <div class="meta">
            <p class="temp">{{ Math.round(weatherData.main.temp) }} °C</p>
            <p class="desc">{{ weatherData.weather[0].description }}</p>
            <p class="more">
              Humidity: {{ weatherData.main.humidity }}% · Wind:
              {{ Math.round(weatherData.wind.speed) }} m/s
            </p>
          </div>
        </div>
      </div>

      <p v-else class="hint">Type a city and click Search.</p>
    </main>
  </div>
</template>

<script>
import axios from "axios";

const API_KEY = "fda346c9608b67383ea377db9e3fe53a";

export default {
  name: "WeatherView",
  data() {
    return {
      city: "",
      weatherData: null,
      loading: false,
      error: null,
    };
  },

  computed: {
    iconUrl() {
      const code = this.weatherData?.weather?.[0]?.icon;
      return code ? `https://openweathermap.org/img/wn/${code}@2x.png` : "";
    },
  },

  mounted() {
    // Try current-location weather on load (optional)
    this.fetchCurrentLocationWeather();
  },

  methods: {
    async searchByCity() {
      if (!this.city.trim()) {
        this.error = "Please enter a city name.";
        return;
      }
      await this.fetchWeather({
        q: this.city.trim(),
        appid: API_KEY,
        units: "metric",
      });
    },

    async fetchCurrentLocationWeather() {
      if (!navigator.geolocation) return;
      const opts = { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 };
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          await this.fetchWeather({
            lat: coords.latitude,
            lon: coords.longitude,
            appid: API_KEY,
            units: "metric",
          });
        },
        () => {
          // Silent fail; user can search by city
        },
        opts
      );
    },

    async fetchWeather(params) {
      this.loading = true;
      this.error = null;
      this.weatherData = null;

      try {
        const { data } = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          { params }
        );
        this.weatherData = data;
      } catch (e) {
        console.error(e);
        this.error = "Failed to fetch weather data. Check the city name or network.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.container { max-width: 720px; margin: 0 auto; padding: 16px; }
.header { margin-bottom: 12px; }
.search-bar { display: flex; gap: 8px; margin-bottom: 16px; }
.search-input { flex: 1; padding: 8px 10px; }
.search-button { padding: 8px 12px; cursor: pointer; }
.card { padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; }
.row { display: flex; align-items: center; gap: 12px; }
.meta p { margin: 2px 0; }
.temp { font-size: 1.6rem; font-weight: 600; }
.desc { text-transform: capitalize; }
.error { color: #c00; }
.hint { color: #666; }
</style>
