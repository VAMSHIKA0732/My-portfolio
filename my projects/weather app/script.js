const apiKey = "b107564e1066b71e4528eb64bd161d3b";

document.getElementById("search-button").addEventListener("click", () => {
  const city = document.getElementById("city-input").value.trim();
  if (city !== "") {
    fetchWeather(city);
  }
});

function fetchWeather(city) {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(currentUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found. Try again!");
      }
      return response.json();
    })
    .then(data => {
      displayCurrentWeather(data);
      return fetch(forecastUrl);
    })
    .then(response => response.json())
    .then(data => displayForecast(data))
    .catch(error => {
      document.getElementById("error-message").textContent = error.message;
      clearWeatherData();
    });
}

function displayCurrentWeather(data) {
  document.getElementById("error-message").textContent = "";
  document.getElementById("city-name").textContent = `📍 ${data.name}`;
  document.getElementById("temperature").textContent = `🌡️ Temp: ${data.main.temp}°C`;
  document.getElementById("description").textContent = `⛅ ${data.weather[0].description}`;
  document.getElementById("humidity").textContent = `💧 Humidity: ${data.main.humidity}%`;
  document.getElementById("wind-speed").textContent = `🌬️ Wind: ${data.wind.speed} m/s`;
}

function displayForecast(data) {
  const container = document.getElementById("forecast-container");
  container.innerHTML = "";

  const forecastMap = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!forecastMap[date] && item.dt_txt.includes("12:00:00")) {
      forecastMap[date] = item;
    }
  });

  Object.values(forecastMap).slice(0, 5).forEach(day => {
    const div = document.createElement("div");
    div.classList.add("forecast-day");
    div.innerHTML = `
      <p><strong>${new Date(day.dt_txt).toDateString().split(" ").slice(0, 3).join(" ")}</strong></p>
      <p>${day.weather[0].main}</p>
      <p>${day.main.temp}°C</p>
    `;
    container.appendChild(div);
  });
}

function clearWeatherData() {
  document.getElementById("city-name").textContent = "";
  document.getElementById("temperature").textContent = "";
  document.getElementById("description").textContent = "";
  document.getElementById("humidity").textContent = "";
  document.getElementById("wind-speed").textContent = "";
  document.getElementById("forecast-container").innerHTML = "";
}