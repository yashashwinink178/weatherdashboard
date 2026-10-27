async function getWeather() {
    const city = document.getElementById("city").value.trim();
    const weatherDiv = document.getElementById("weather");

    if (city === "") {
        weatherDiv.innerHTML = "Please enter a city name.";
        return;
    }

    weatherDiv.innerHTML = "Loading weather...";

    try {
        // Find the city's latitude and longitude
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            weatherDiv.innerHTML = "City not found. Please try another name.";
            return;
        }

        const place = geoData.results[0];
        const latitude = place.latitude;
        const longitude = place.longitude;

        // Fetch the current weather
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to retrieve weather data.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        // Convert the weather code into a description
        const descriptions = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Foggy",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            71: "Slight snowfall",
            73: "Moderate snowfall",
            75: "Heavy snowfall",
            80: "Rain showers",
            81: "Moderate rain showers",
            82: "Heavy rain showers",
            95: "Thunderstorm"
        };

        const description =
            descriptions[current.weather_code] || "Weather conditions unavailable";

        // Display the weather
        weatherDiv.innerHTML = `
            <h2>${place.name}, ${place.country || ""}</h2>
            <h3>${current.temperature_2m} °C</h3>
            <p>Condition: ${description}</p>
            <p>Humidity: ${current.relative_humidity_2m}%</p>
            <p>Wind Speed: ${current.wind_speed_10m} km/h</p>
            <p>Feels Like: ${current.apparent_temperature} °C</p>
            <p>Local Time: ${current.time.replace("T", " ")}</p>
        `;

    } catch (error) {
        weatherDiv.textContent =
            "Unable to load weather. Check your internet connection and try again.";
        console.error(error);
    }
}