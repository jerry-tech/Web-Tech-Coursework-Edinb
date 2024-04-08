import { toTitleCase, openDatabase, displayError, fetchStateData, fetchCountryData } from './utils.js';
import { MAX_FILE_UPLOAD } from './constant.js';


//Load Countries.json
document.addEventListener("DOMContentLoaded", function () {
    fetchCountryData()
        .then(data => populateCountry(data))
        .catch(error => console.error('Error fetching countries:', error));
});

const fetchState = (alpha3) => {
    return new Promise((resolve, reject) => { 
        fetchStateData()
        .then(data => {
            const filteredStates = data.filter(state => state.alpha3 === alpha3);
            resolve(filteredStates);
        })
        .catch(error => reject(error));
    });
}

const populateCountry = (countries) => {
    console.log(countries);
    const countrySelect = document.getElementById('countrySelect');

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.alpha3;
        option.textContent = toTitleCase(country.name);
        countrySelect.appendChild(option);
    });
}


const populateStates = (alpha3) => {
    var stateSelect = document.getElementById('stateSelect');
    fetchState(alpha3)
        .then(stateData => {
            stateSelect.innerHTML = '<option value="">Select State</option>';
            stateData.forEach(state => {
                var option = document.createElement('option');
                option.value = state.code;
                option.textContent = state.name;
                stateSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching states:', error));
}

// Attach onchange event listener to the country select element
document.getElementById('countrySelect').addEventListener('change', (event) => {
    var selectedCountry = event.target.value;
    populateStates(selectedCountry);
});

//checking image size
document.getElementById('image').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const maxSizeInBytes = MAX_FILE_UPLOAD;

    if (file && file.size > maxSizeInBytes) {
        displayError('Image size exceeds the maximum allowed size of 500 KB.');
        event.target.value = '';
    }
});


const storeFormData = async (countryAlpha3, stateCode, pollutionType, fullName, image, description) => {
    try {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result;

            addFormData({
                countryAlpha3: countryAlpha3,
                stateCode: stateCode,
                pollutionType: pollutionType,
                fullName: fullName,
                description: description,
                createdAt: new Date(),
                image: imageData
            });
        };

        reader.onerror = function (event) {
            displayError('Error reading image file:'+ event.target.error);
        };

        reader.readAsArrayBuffer(image);
    } catch (error) {
        displayError('Error storing form data');
    }
};

// Open database and perform operations on IDBObjectStore
// https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore
const addFormData = async (formData) => {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(['form_data'], 'readwrite');
        const objectStore = transaction.objectStore('form_data');

        const request = objectStore.add(formData);
        request.onsuccess = function (event) {
            alert('Form data added to IndexedDB.');
        };
        request.onerror = function (event) {
            displayError('Error adding form data to IndexedDB:'+ request.error);
        };

        // Commit the transaction after adding the form data
        await request.transaction.complete;
    } catch (error) {
        displayError('Error adding form data to IndexedDB:'+ error);
    }
};

const validateAndSaveFormValues = () => {
    var countrySelect = document.getElementById('countrySelect');
    var stateSelect = document.getElementById('stateSelect');
    var pollutionType = document.getElementById('pollutionType');
    var fullName = document.getElementById('fullName').value;
    var image = document.getElementById('image').files[0];
    var additionalInfo = document.getElementById('additionalInfo').value;

    if (countrySelect.value === "" || pollutionType.value === "" ) {
        displayError("Please fill in all required fields.");
        return false;
    }

    // Show loader
    document.getElementById('submitButton').disabled = true;
    document.getElementById('loader').style.display = 'inline';

    setTimeout(function () {
        storeFormData(countrySelect.value, stateSelect.value, pollutionType.value, fullName, image, additionalInfo);

        // Hide loader
        document.getElementById('submitButton').disabled = false;
        document.getElementById('loader').style.display = 'none';

        window.location.href="/pollution_report.html";
    }, 1500);

}

// Attach click event listener to the submit button
document.getElementById('submitButton').addEventListener('click', () => {
    validateAndSaveFormValues();
});


