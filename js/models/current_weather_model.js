
/**
 * WeatherDataModel represents the weather data retrieved from open-meteo.com.
 */

/**
 * Represents the weather data retrieved from open-meteo.com.
 */
export class WeatherData {
  constructor(latitude, longitude, generationTimeMs, utcOffsetSeconds, timezone, timezoneAbbreviation, elevation, currentUnits, current, dailyUnits, daily, currentTime) {
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
      this.daily = daily;
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
export class CurrentUnits {
  constructor(time, interval, temperature2m, relativeHumidity2m, windSpeed10m) {
      this.time = time;
      this.interval = interval;
      this.temperature2m = temperature2m;
      this.relativeHumidity2m = relativeHumidity2m;
      this.windSpeed10m = windSpeed10m;
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
export class CurrentData {
  constructor(time, interval, temperature2m, relativeHumidity2m, windSpeed10m) {
      this.time = time;
      this.interval = interval;
      this.temperature2m = temperature2m;
      this.relativeHumidity2m = relativeHumidity2m;
      this.windSpeed10m = windSpeed10m;
  }
}

export class DailyUnits {
  constructor(time, sunrise, sunset, temperature2mMax, temperature2mMin) {
      this.time = time;
      this.sunrise = sunrise;
      this.sunset = sunset;
      this.temperature2mMax = temperature2mMax;
      this.temperature2mMin = temperature2mMin;
  }
}

/**
 * Represents daily weather data obtained from Open-Meteo.com.
 */
class DailyData {
  constructor(time, temperature2mMax, temperature2mMin) {
      this.time = time;
      this.temperature2mMax = temperature2mMax;
      this.temperature2mMin = temperature2mMin;
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
    dailyUnitsData.sunset,
    dailyUnitsData.temperature_2m_max,
    dailyUnitsData.temperature_2m_min
  );

  const dailyData = data.daily;
  const daily = new DailyData(
    dailyData.time[0],
    dailyData.temperature_2m_max[0],
    dailyData.temperature_2m_min[0]
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
    dailyUnits,
    daily
  );
}