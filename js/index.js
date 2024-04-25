import { setCookie, getCookie, getCurrentDate, getCurrentTime, getUserLocation, getSessionData } from './utils.js';
import { USERNAME_COOKIE_KEY, GEOLOCATION_KEY, DEFAULT_LONGITUDE, DEFAULT_LATITUDE, BASE_URL, CURRENT_WEATHER_URL } from './constant.js';
import { WeatherData, parseCurrentWeatherData } from './models/current_weather_model.js';


const greeting = () => {
    var hour = new Date().getHours();
    if (hour < 12) {
        return 'Good Morning';
    }
    if (hour < 17) {
        return 'Good Afternoon';
    }
    return 'Good Evening';
}

// Update the content of the HTML element with id 'current_time' && 'current_date'
if (document.getElementById('current_date')) {
    document.getElementById('current_date').textContent = getCurrentDate();
}
if (document.getElementById('current_time')) {
    document.getElementById('current_time').textContent = getCurrentTime();
}

//Getting Cookie    
let personalizationName = getCookie(USERNAME_COOKIE_KEY);
if (personalizationName === "") {
    //requesting User loaction
    getUserLocation();

    var modal = document.querySelector(".modal");
    if (modal.classList.contains("hide")) {
        modal.classList.remove("hide");
    }
    document.getElementById('greetings').textContent = greeting();
} else {
    if (document.getElementById('greetings')) {
        document.getElementById('greetings').textContent = greeting() + ", " + personalizationName.split(' ')[0];
    }
}


// Cookie Modal Page Logic
personalizationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    //Getting value from form field
    let personalizationName = document.getElementById("personal_name").value;
    if (personalizationName != "" && personalizationName != null) {
        setCookie(USERNAME_COOKIE_KEY, personalizationName, 365);
        closeModal();
        //calling the function to call the current weather api.
        callCurrentWeatherAPI();
        document.getElementById('greetings').textContent = greeting() + ", " + personalizationName.split(' ')[0];
    }
});


/**
 * Calling the function to call the current weather api..
 * @param {WeatherData} weatherData - An instance of WeatherData class containing parsed weather data.
 */
const callCurrentWeatherAPI = () => {

    const locationData = getSessionData(GEOLOCATION_KEY, true);

    let longitude = locationData != undefined ? locationData.longitude : DEFAULT_LONGITUDE;
    let latitude = locationData != undefined ? locationData.latitude : DEFAULT_LATITUDE;

    fetch(`${BASE_URL}${CURRENT_WEATHER_URL}${'&latitude=' + latitude}${'&longitude=' + longitude}`)
        .then(response => response.json())
        .then(data => {
            const weatherData = parseCurrentWeatherData(data);
            updateWeatherUI(weatherData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
//calling the function to call the current weather api.
callCurrentWeatherAPI();

const updateWeatherUI = (weatherData) => {
    document.getElementById('elevation').textContent = `${weatherData.elevation + ' meters'}`;
    document.getElementById('windSpeedInfo').textContent = `${weatherData.current.windSpeed10m}${weatherData.currentUnits.windSpeed10m}`;
    document.getElementById('humidityInfo').textContent = `${weatherData.current.relativeHumidity2m}${weatherData.currentUnits.relativeHumidity2m}`;
    document.getElementById('temperatureInfo').textContent = `${weatherData.current.temperature2m}${weatherData.currentUnits.temperature2m}`;
}

