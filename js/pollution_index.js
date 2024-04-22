import { setCookie, getCookie, getCurrentDate, getCurrentTime, getUserLocation, getSessionData, celsiusToFahrenheit } from './utils.js';
import { USERNAME_COOKIE_KEY, GEOLOCATION_KEY, DEFAULT_LONGITUDE, DEFAULT_LATITUDE, BASE_URL, CURRENT_WEATHER_URL, POLLUTION_WEATHER_URL, AIR_QUALITY_BASE_URL } from './constant.js';
import { WeatherData, parseCurrentWeatherData } from './models/current_weather_model.js';
import { parsePollutionIndexResponse } from './models/pollution_model.js';

// Update the content of the HTML element with id 'current_time' && 'current_date'
document.getElementById('current_time').textContent = getCurrentTime();



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

// callCurrentWeatherAPI();
const updateWeatherUI = (weatherData) => {
    document.getElementById('temInFahrenheit').textContent = `${celsiusToFahrenheit(weatherData.current.temperature2m)}${'°F'}`;
    document.getElementById('temperatureInfo').textContent = `Feels like ${weatherData.current.temperature2m}${weatherData.currentUnits.temperature2m}`;
    document.getElementById('temperatureInfoHigh').textContent = `High: ${weatherData.daily.temperature2mMax}${weatherData.dailyUnits.temperature2mMax}`;
    document.getElementById('temperatureInfoLow').textContent = `Low: ${weatherData.daily.temperature2mMin}${weatherData.dailyUnits.temperature2mMin}`;
}







/**
 * Using promises API to call pollution history open meteo api
 * @param {pollutionData} PollutionData - An instance of PollutionData class containing parsed pollutionData data.
 */
const callPollutionHistoryAPI = () => {

    const locationData = getSessionData(GEOLOCATION_KEY, true);

    let longitude = locationData != undefined ? locationData.longitude : DEFAULT_LONGITUDE;
    let latitude = locationData != undefined ? locationData.latitude : DEFAULT_LATITUDE;


    fetch(`${AIR_QUALITY_BASE_URL}${POLLUTION_WEATHER_URL}${'&latitude=' + latitude}${'&longitude=' + longitude}`)
        .then(response => response.json())
        .then(data => {
            const pollutionData = parsePollutionIndexResponse(data);
            updatePollutionWeatherUI(pollutionData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
//
// callPollutionHistoryAPI();
const updatePollutionWeatherUI = (pollutionData) => {
    document.getElementById('pm10').textContent = `${pollutionData.current.pm10}${pollutionData.currentUnits.pm10}`;
    document.getElementById('pm2_5').textContent = `${pollutionData.current.pm25}${pollutionData.currentUnits.pm25}`;
    document.getElementById('carbon_monoxide').textContent = `${pollutionData.current.carbonMonoxide}${pollutionData.currentUnits.carbonMonoxide}`;
    document.getElementById('nitrogen_dioxide').textContent = `${pollutionData.current.nitrogenDioxide}${pollutionData.currentUnits.nitrogenDioxide}`;
    document.getElementById('sulphur_dioxide').textContent = `${pollutionData.current.sulphurDioxide}${pollutionData.currentUnits.sulphurDioxide}`;
    document.getElementById('ozone').textContent = `${pollutionData.current.ozone}${pollutionData.currentUnits.ozone}`;
    document.getElementById('dust').textContent = `${pollutionData.current.dust}${pollutionData.currentUnits.dust}`;
    document.getElementById('ammonia').textContent = `${pollutionData.current.ammonia}${pollutionData.currentUnits.ammonia}`;
}


