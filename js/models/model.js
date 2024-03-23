
/**
 * WeatherDataModel represents the weather data retrieved from open-meteo.com.
 */


/**
 * Represents current weather data obtained from Open-Meteo.com.
 * @constructor
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @param {number} generationTimeMs - The time taken to generate the data (in milliseconds).
 * @param {number} utcOffsetSeconds - The UTC offset (in seconds).
 * @param {string} timezone - The timezone of the location.
 * @param {string} timezoneAbbreviation - The timezone abbreviation.
 * @param {number} elevation - The elevation of the location (in meters).
 * @param {CurrentUnits} currentUnits - The units for current weather data.
 * @param {CurrentData} current - The current weather data.
 * @param {DailyUnits} dailyUnits - The units for daily weather data.
 */
export class WeatherData {
    constructor(latitude, longitude, generationTimeMs, utcOffsetSeconds, timezone, timezoneAbbreviation, elevation, currentUnits, current, dailyUnits) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.generationTimeMs = generationTimeMs;
        this.utcOffsetSeconds = utcOffsetSeconds;
        this.timezone = timezone;
        this.timezoneAbbreviation = timezoneAbbreviation;
        this.elevation = elevation;
        this.currentUnits = currentUnits;
        this.current = current;
        this.dailyUnits = dailyUnits;
    }
}

/**
 * Represents current weather data.
 * @constructor
 * @param {string} time - The time of the weather data.
 * @param {number} interval - The interval of the weather data.
 * @param {number} temperature2m - The temperature at 2 meters above ground level.
 * @param {number} relativeHumidity2m - The relative humidity at 2 meters above ground level.
 * @param {number} windSpeed10m - The wind speed at 10 meters above ground level.
 */
class CurrentData {
    constructor(time, interval, temperature2m, relativeHumidity2m, windSpeed10m) {
        this.time = time;
        this.interval = interval;
        this.temperature2m = temperature2m;
        this.relativeHumidity2m = relativeHumidity2m;
        this.windSpeed10m = windSpeed10m;
    }
}

/**
 * Represents units for current weather data.
 * @constructor
 * @param {string} time - The time unit.
 * @param {string} interval - The interval unit.
 * @param {string} temperature2m - The temperature unit.
 * @param {string} relativeHumidity2m - The relative humidity unit.
 * @param {string} windSpeed10m - The wind speed unit.
 */
class CurrentUnits {
    constructor(time, interval, temperature2m, relativeHumidity2m, windSpeed10m) {
        this.time = time;
        this.interval = interval;
        this.temperature2m = temperature2m;
        this.relativeHumidity2m = relativeHumidity2m;
        this.windSpeed10m = windSpeed10m;
    }
}

/**
 * Represents units for daily weather data.
 * @constructor
 * @param {string} time - The time unit.
 * @param {string} sunrise - The sunrise time.
 * @param {string} sunset - The sunset time.
 */
class DailyUnits {
    constructor(time, sunrise, sunset) {
        this.time = time;
        this.sunrise = sunrise;
        this.sunset = sunset;
    }
}

/**
 * Parses weather data obtained from Open-Meteo.com API.
 * @param {Object} data - The weather data obtained from the API.
 * @returns {WeatherData} - An instance of WeatherData class containing parsed data.
 */
export const parseCurrentWeatherData = (data) => {
  
    const latitude = data.latitude;
    const longitude = data.longitude;
    const generationTimeMs = data.generationtime_ms;
    const utcOffsetSeconds = data.utc_offset_seconds;
    const timezone = data.timezone;
    const timezoneAbbreviation = data.timezone_abbreviation;
    const elevation = data.elevation;
  
    const currentUnitsData = data.current_units;
    const currentUnits = new CurrentUnits(
      currentUnitsData.time,
      currentUnitsData.interval,
      currentUnitsData.temperature_2m,
      currentUnitsData.relative_humidity_2m,
      currentUnitsData.wind_speed_10m
    );
  
    const currentData = new CurrentData(
      data.current.time,
      data.current.interval,
      data.current.temperature_2m,
      data.current.relative_humidity_2m,
      data.current.wind_speed_10m
    );
  
    const dailyUnitsData = data.daily_units;
    const dailyUnits = new DailyUnits(
      dailyUnitsData.time,
      dailyUnitsData.sunrise,
      dailyUnitsData.sunset
    );
  

    return new WeatherData(
      latitude,
      longitude,
      generationTimeMs,
      utcOffsetSeconds,
      timezone,
      timezoneAbbreviation,
      elevation,
      currentUnits,
      currentData,
      dailyUnits
    );
  }
  