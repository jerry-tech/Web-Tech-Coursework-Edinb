import { CURRENT_LOCATION_TIMEOUT, GEOLOCATION_KEY, DATABASE_NAME } from './constant.js';

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
export const celsiusToFahrenheit = (celsius) => {
  const fahrenheit = (celsius * 9/5) + 32;
  return parseFloat(fahrenheit.toFixed(2));
}

//Titlecase
export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Function to open the IndexedDB database
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
      var request = window.indexedDB.open(DATABASE_NAME, 1);

      request.onupgradeneeded = function(event) {
          var db = event.target.result;
          var objectStore = db.createObjectStore('form_data', { keyPath: 'id', autoIncrement:true });
          objectStore.createIndex('countryAlpha3', 'countryAlpha3', { unique: false });
          objectStore.createIndex('stateCode', 'stateCode', { unique: false });
          objectStore.createIndex('pollutionType', 'pollutionType', { unique: false });
          objectStore.createIndex('fullName', 'fullName', { unique: false });
          objectStore.createIndex('description', 'description', { unique: false });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
          objectStore.createIndex('image', 'image', { unique: false });
      };

      request.onsuccess = (event) => {
          resolve(event.target.result);
      };

      request.onerror = (event) => {
          reject(event.target.error);
      };
  });
}

// Function to retrieve form data from IndexedDB
export const retrieveFormDataFromDB = () => {
  return new Promise((resolve, reject) => {
      openDatabase().then(db => {
          const transaction = db.transaction(['form_data'], 'readonly');
          const objectStore = transaction.objectStore('form_data');
          const getRequest = objectStore.getAll();

          getRequest.onsuccess = (event) => {
              const formDataArray = event.target.result;
              resolve(formDataArray);
          };

          getRequest.onerror = (event) => {
              reject(new Error('Error retrieving form data from IndexedDB.'));
          };
      }).catch(error => {
          reject(error);
      });
  });
}

// Function to delete form data from IndexedDB
// https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/delete
export const deleteFormDataFromDB = (id) => {
  return new Promise((resolve, reject) => {
      openDatabase().then(db => {
          const transaction = db.transaction(['form_data'], 'readwrite');
          const objectStore = transaction.objectStore('form_data');
          const deleteRequest = objectStore.delete(id);

          deleteRequest.onsuccess = (event) => {
            resolve();
        };

        deleteRequest.onerror = (event) => {
            reject('Error deleting form data from database');
        };
      }).catch(error => {
          reject(error);
      });
  });
}

//Displaying of messages as an alert error / success
export const displayMessage = (message, type) => {
  const messageContainer = document.getElementById('messageContainer');
  const messageSpan = document.getElementById('message');
  const messageIcon = document.getElementById('messageIcon');

  messageSpan.textContent = message;

  if (type === 'success') {
      messageContainer.className = 'alert alert-success mt-1 p-2';
      messageIcon.className = 'fa fa-check-circle me-2';
  } else if (type === 'error') {
      messageContainer.className = 'alert alert-danger mt-1 p-2';
      messageIcon.className = 'fa fa-info-circle me-2';
  }

  messageContainer.style.display = 'block';
  setTimeout(() => {
      messageContainer.style.display = 'none';
  }, 2500);
}

//format date and time
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  
  // Format the date
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  // Format the time
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Convert hours to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;

  // Construct the formatted date and time string
  return `${day}-${month}-${year} ${hours12}:${minutes}${ampm}`;

}

export const fetchStateData = async () => {
  const response = await fetch('./js/master_record/state.json');
  return await response.json();
}

export const fetchCountryData = async () => {
  const response = await fetch('./js/master_record/country.json');
  return await response.json();
}

export const getImageUrl = (imageData) => {
  const blob = new Blob([imageData], { type: 'image/jpeg' });
  return URL.createObjectURL(blob);
}

export const navigateByUrl = (urlPath) => {
  var a = document.createElement('a');
  a.href = urlPath;
  document.body.appendChild(a);
  a.click();
}