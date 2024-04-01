/** Open-Meteo. 2024. Open-Meteo API Documentation. Open-Meteo. https://open-meteo.com/en/docs/ */

/**
 * Represents units for pollution data.
 * @constructor
 * @param {string} time - The time unit.
 * @param {string} interval - The interval unit.
 * @param {string} pm10 - The unit for PM10.
 * @param {string} pm25 - The unit for PM2.5.
 * @param {string} carbonMonoxide - The unit for carbon monoxide.
 * @param {string} nitrogenDioxide - The unit for nitrogen dioxide.
 * @param {string} sulphurDioxide - The unit for sulphur dioxide.
 * @param {string} ozone - The unit for ozone.
 * @param {string} dust - The unit for dust.
 * @param {string} ammonia - The unit for ammonia.
 */
export class PollutionUnits {
    constructor(time, interval, pm10, pm25, carbonMonoxide, nitrogenDioxide, sulphurDioxide, ozone, dust, ammonia) {
        this.time = time;
        this.interval = interval;
        this.pm10 = pm10 != null || pm10 != undefined ? pm10 : 0;
        this.pm25 = pm25 != null || pm25 != undefined ? pm25 : 0;
        this.carbonMonoxide = carbonMonoxide != null || carbonMonoxide != undefined ? carbonMonoxide : 0;
        this.nitrogenDioxide = nitrogenDioxide != null || nitrogenDioxide != undefined ? nitrogenDioxide : 0;
        this.sulphurDioxide = sulphurDioxide != null || sulphurDioxide != undefined ? sulphurDioxide : 0;
        this.ozone = ozone != null || ozone != undefined ? ozone : 0;
        this.dust = dust != null || dust != undefined ? dust : 0;
        this.ammonia = ammonia != null && ammonia != undefined ? ammonia : 0;
    }
}

/**
 * Represents pollution data.
 * @constructor
 * @param {string} time - The time of the pollution data.
 * @param {number} interval - The interval of the pollution data.
 * @param {number} pm10 - The PM10 level.
 * @param {number} pm25 - The PM2.5 level.
 * @param {number} carbonMonoxide - The carbon monoxide level.
 * @param {number} nitrogenDioxide - The nitrogen dioxide level.
 * @param {number} sulphurDioxide - The sulphur dioxide level.
 * @param {number} ozone - The ozone level.
 * @param {number} dust - The dust level.
 * @param {number} ammonia - The ammonia level.
 */
export class PollutionData {
    constructor(time, interval, pm10, pm25, carbonMonoxide, nitrogenDioxide, sulphurDioxide, ozone, dust, ammonia) {
        this.time = time;
        this.interval = interval;
        this.pm10 = pm10 != null || pm10 != undefined ? pm10 : 0;
        this.pm25 = pm25 != null || pm25 != undefined ? pm25 : 0;
        this.carbonMonoxide = carbonMonoxide != null || carbonMonoxide != undefined ? carbonMonoxide : 0;
        this.nitrogenDioxide = nitrogenDioxide != null || nitrogenDioxide != undefined ? nitrogenDioxide : 0;
        this.sulphurDioxide = sulphurDioxide != null || sulphurDioxide != undefined ? sulphurDioxide : 0;
        this.ozone = ozone != null || ozone != undefined ? ozone : 0;
        this.dust = dust != null || dust != undefined ? dust : 0;
        this.ammonia = ammonia != null && ammonia != undefined ? ammonia : 0;
    }
}

/**
 * Represents pollution index response obtained from the API.
 * @constructor
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @param {number} generationTimeMs - The time taken to generate the data (in milliseconds).
 * @param {number} utcOffsetSeconds - The UTC offset (in seconds).
 * @param {string} timezone - The timezone of the location.
 * @param {string} timezoneAbbreviation - The timezone abbreviation.
 * @param {number} elevation - The elevation of the location (in meters).
 * @param {PollutionUnits} currentUnits - The units for pollution data.
 * @param {PollutionData} current - The current pollution data.
 */
export class PollutionIndexResponse {
    constructor(latitude, longitude, generationTimeMs, utcOffsetSeconds, timezone, timezoneAbbreviation, elevation, currentUnits, current) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.generationTimeMs = generationTimeMs;
        this.utcOffsetSeconds = utcOffsetSeconds;
        this.timezone = timezone;
        this.timezoneAbbreviation = timezoneAbbreviation;
        this.elevation = elevation;
        this.currentUnits = currentUnits;
        this.current = current;
    }
}

/**
 * Parses pollution index response obtained from the API.
 * @param {Object} data - The pollution index response obtained from the API.
 * @returns {PollutionIndexResponse} - An instance of PollutionIndexResponse class containing parsed data.
 */
export const parsePollutionIndexResponse = (data) => {
    const latitude = data.latitude;
    const longitude = data.longitude;
    const generationTimeMs = data.generationtime_ms;
    const utcOffsetSeconds = data.utc_offset_seconds;
    const timezone = data.timezone;
    const timezoneAbbreviation = data.timezone_abbreviation;
    const elevation = data.elevation;

    const currentUnitsData = data.current_units;
    const currentUnits = new PollutionUnits(
        currentUnitsData.time,
        currentUnitsData.interval,
        currentUnitsData.pm10,
        currentUnitsData.pm2_5,
        currentUnitsData.carbon_monoxide,
        currentUnitsData.nitrogen_dioxide,
        currentUnitsData.sulphur_dioxide,
        currentUnitsData.ozone,
        currentUnitsData.dust,
        currentUnitsData.ammonia
    );

    const currentData = new PollutionData(
        data.current.time,
        data.current.interval,
        data.current.pm10,
        data.current.pm2_5,
        data.current.carbon_monoxide,
        data.current.nitrogen_dioxide,
        data.current.sulphur_dioxide,
        data.current.ozone,
        data.current.dust,
        data.current.ammonia
    );

    return new PollutionIndexResponse(
        latitude,
        longitude,
        generationTimeMs,
        utcOffsetSeconds,
        timezone,
        timezoneAbbreviation,
        elevation,
        currentUnits,
        currentData
    );
};