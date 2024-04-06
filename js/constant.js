export const CURRENT_LOCATION_TIMEOUT = 10000;
export const USERNAME_COOKIE_KEY = "username";
export const GEOLOCATION_KEY = "GEOLOCATION_KEY";
export const MAX_FILE_UPLOAD = 500 * 1024;

//Third Party API'S 
export const DEFAULT_LONGITUDE = 55.9533;
export const DEFAULT_LATITUDE = -3.1883;
export const BASE_URL = "https://api.open-meteo.com";
export const AIR_QUALITY_BASE_URL = "https://air-quality-api.open-meteo.com";
export const CURRENT_WEATHER_URL = "/v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m,is_day,rain,showers&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&forecast_days=1";
export const POLLUTION_WEATHER_URL = "/v1/air-quality?current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,ammonia&forecast_days=1";