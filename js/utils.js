import { CURRENT_LOCATION_TIMEOUT, GEOLOCATION_KEY } from './constant.js';

const currentDate = new Date();


//set a cookie
/*Adapted from code found on W3Schools: https://www.w3schools.com/js/js_cookies.asp*/
export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//get a cookie
/*Adapted from code found on W3Schools: https://www.w3schools.com/js/js_cookies.asp*/
export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Function to set data in sessionStorage
export const setSessionData = (key, value, isJson) => {
  sessionStorage.removeItem(key);
  sessionStorage.setItem(key, isJson ? JSON.stringify(value) : value);
}

// Function to get data from sessionStorage
export const getSessionData = (key, isJson) => {
  return isJson ? JSON.parse(sessionStorage.getItem(key) != undefined || sessionStorage.getItem(key) != '' ? sessionStorage.getItem(key) : '') : sessionStorage.getItem(key) || '';
}

//Function to get current time
export const getCurrentTime = () => {
  let hour = currentDate.getHours();
  let minute = currentDate.getMinutes();

  hour = hour < 10 ? '0' + hour : hour;

  minute = minute < 10 ? '0' + minute : minute;

  const ampm = hour >= 12 ? 'PM' : 'AM';

   // Convert hour to 12-hour format
   hour = hour % 12 || 12;

  return `${hour}:${minute}${' '}${ampm}`;
}

//Function to get current date
export const getCurrentDate = () => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const day = dayNames[currentDate.getDay()];
  const month = monthNames[currentDate.getMonth()];
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  return `${day}, ${month} ${date}, ${year}`;
}

//get user current location
export const getUserLocation = () => {
  const options = {
    enableHighAccuracy: true,
    timeout: CURRENT_LOCATION_TIMEOUT,
  };

  const successCallback = (position) => {
    const geolocationData = { latitude: position.coords.latitude, longitude: position.coords.longitude }

    setSessionData(GEOLOCATION_KEY, geolocationData, true);
  };

  const errorCallback = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied the request for geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.error("An unknown error occurred.");
        break;
    }
  };


  navigator.geolocation.getCurrentPosition(
    successCallback,
    errorCallback,
    options
  );
}

//Convert Celcius to Fahrenheit
export const celsiusToFahrenheit = (celsius) =>{
  return (celsius * 9/5) + 32;
}
  