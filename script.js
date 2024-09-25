const apiKey = 'd87bfed2da42ff76f5205811fc0ec545'; // Replace with your OpenWeatherMap API key

async function getWeather() {
    const location = document.getElementById('location').value;
    if (!location) {
        alert('Please enter a location.');
        return;
    }

    const weatherInfoDiv = document.getElementById('weather-info');
    weatherInfoDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === '404') {
            weatherInfoDiv.innerHTML = 'Location not found.';
            return;
        }

        const { main, weather, wind } = data;
        const temperature = main.temp;
        const description = weather[0].description;
        const humidity = main.humidity;
        const windSpeed = wind.speed;

        weatherInfoDiv.innerHTML = `
            <h2>Weather in ${data.name}</h2>
            <p>Temperature: ${temperature} °C</p>
            <p>Description: ${description}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;
    } catch (error) {
        weatherInfoDiv.innerHTML = 'An error occurred while fetching weather data.';
        console.error(error);
    }
}


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            const locationInput = document.getElementById('location');
            locationInput.value = `${data.name}, ${data.sys.country}`;
            getWeather();
        } catch (error) {
            console.error('Error fetching weather for current location', error);
        }
    }, (error) => {
        console.error('Error getting geolocation', error);
    });
}
