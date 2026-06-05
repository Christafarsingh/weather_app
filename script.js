/* script.js - Weather App logic
   • Fetches data from OpenWeatherMap using the provided API key
   • Updates the UI
   • Handles loading / error states
   • Beginner‑friendly comments throughout */

const apiKey = "abcd1234efgh5678ijkl9012mnop3456"; // <-- your OpenWeatherMap API key
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const cardDiv = document.getElementById("weather-card");

// UI element references inside the card
const cityNameEl = document.getElementById("city-name");
const iconEl = document.getElementById("weather-icon");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

// Helper: show/hide utility
function toggleVisibility(elem, show) {
  elem.classList.toggle("hidden", !show);
}

// Build the request URL for a given city
function buildUrl(city) {
  // units=metric gives Celsius; change to imperial for Fahrenheit if desired
  return `${baseUrl}?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
}

// Render fetched weather data into the card
function renderWeather(data) {
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  iconEl.alt = data.weather[0].description;

  tempEl.textContent = `🌡️ ${Math.round(data.main.temp)}°C`;
  descEl.textContent = `Condition: ${data.weather[0].description}`;
  humidityEl.textContent = `💧 Humidity: ${data.main.humidity}%`;
  windEl.textContent = `💨 Wind: ${data.wind.speed} m/s`;

  toggleVisibility(cardDiv, true);
}

function showError(message) {
  errorDiv.textContent = message;
  toggleVisibility(errorDiv, true);
}

async function fetchWeather(city) {
  // Reset UI state
  toggleVisibility(cardDiv, false);
  toggleVisibility(errorDiv, false);
  toggleVisibility(loadingDiv, true);

  try {
    const response = await fetch(buildUrl(city));
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to fetch weather");
    }
    renderWeather(data);
  } catch (err) {
    showError(`❗ ${err.message}`);
  } finally {
    toggleVisibility(loadingDiv, false);
  }
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

// Optional: load a default city on start (uncomment if desired)
// fetchWeather("London");
