
<template>
  <div class="container">
    <h1>Weather API – JSON (GetAllBookAPI)</h1>

    <div class="ctrls">
      <input
        v-model="city"
        placeholder="e.g. Clayton,AU"
        @keyup.enter="fetchJSON"
      />
      <button @click="fetchJSON" :disabled="loading">
        {{ loading ? "Loading…" : "Fetch JSON" }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <pre v-else class="json">{{ prettyJson }}</pre>
  </div>
</template>

<script>
import axios from "axios";

const API_KEY = "18eac589be46e86434e3291fb6304d2c";

export default {
  name: "GetAllBookAPI",
  data() {
    return {
      city: "Clayton,AU",
      jsondata: null,
      loading: false,
      error: null,
    };
  },
  computed: {
    prettyJson() {
      return this.jsondata ? JSON.stringify(this.jsondata, null, 2) : "";
    },
  },
  mounted() {
    this.fetchJSON();
  },
  methods: {
    async fetchJSON() {
      if (!this.city.trim()) {
        this.error = "Please enter a city, e.g., Melbourne,AU.";
        return;
      }
      this.loading = true;
      this.error = null;
      this.jsondata = null;

      try {
        const { data } = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              q: this.city.trim(),
              appid: API_KEY,
              units: "metric",
            },
          }
        );
        this.jsondata = data;
      } catch (e) {
        console.error(e);
        if (e.response?.status === 404) this.error = "City not found.";
        else if (e.response?.status === 401) this.error = "Invalid API key.";
        else this.error = "Failed to fetch API.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 16px; }
.ctrls { display: flex; gap: 8px; margin-bottom: 12px; }
.ctrls input { flex: 1; padding: 8px; }
.ctrls button { padding: 8px 12px; cursor: pointer; }
.json { background:#0b1020; color:#d8f3ff; padding:12px; border-radius:10px; min-height:240px; overflow:auto; }
.error { color:#c00; margin:8px 0; }
</style>
