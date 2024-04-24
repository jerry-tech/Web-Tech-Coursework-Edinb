import { getCookie, toTitleCase, openDatabase, displayMessage, fetchStateData, fetchCountryData, navigateByUrl } from './utils.js';
import { MAX_FILE_UPLOAD, USERNAME_COOKIE_KEY } from './constant.js';

let personalizationName = getCookie(USERNAME_COOKIE_KEY);
if (personalizationName !== "") {
    var nameInput = document.getElementById("fullName");
    nameInput.value = personalizationName;
}

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
        .catch(error => console.error('Error fetching states.'));
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
        displayMessage('Image size exceeds the maximum allowed size of 500 KB.', 'error');
        event.target.value = '';
    }
});


const storeFormData = async (countryAlpha3, stateCode, pollutionType, fullName, image, description) => {
    try {
        const imageData = await readFileAsArrayBuffer(image);

        await addFormData({
            countryAlpha3: countryAlpha3,
            stateCode: stateCode,
            pollutionType: pollutionType,
            fullName: fullName,
            description: description,
            createdAt: new Date(),
            image: imageData
        });
    } catch (error) {
        console.error('Error storing form data:', error);
        displayMessage('Error storing form data', 'error');
    }
};

const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.onerror = (event) => {
            reject(event.target.error);
        };
        reader.readAsArrayBuffer(file);
    });
};

// Open database and perform operations on IDBObjectStore
// https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore
const addFormData = async (formData) => {
    try {
        const db = await openDatabase();
        const transaction = db.transaction('form_data', 'readwrite');
        const objectStore = transaction.objectStore('form_data');

        const request = objectStore.add(formData);

        request.onsuccess = (event) => {
            // Redirect only after all form data is added
            displayMessage('Pollution Report has been saved successfully.', 'success');
            setTimeout(() => {
                navigateByUrl('./pollution_report.html');
            }, 1500);
        };
        request.onerror = (event) => {
            console.error('Error adding form data to IndexedDB:', event.target.error);
        };

        // Commit the transaction after adding the form data
        await transaction.complete;
    } catch (error) {
        console.error('Error adding form data to IndexedDB:', error);
        throw error;
    }
};


const validateAndSaveFormValues = () => {
    var countrySelect = document.getElementById('countrySelect');
    var stateSelect = document.getElementById('stateSelect');
    var pollutionType = document.getElementById('pollutionType');
    var fullName = document.getElementById('fullName').value;
    var image = document.getElementById('image').files[0];
    var additionalInfo = document.getElementById('additionalInfo').value;

    if (countrySelect.value === "" || pollutionType.value === "") {
        displayMessage("Please fill in all required fields.", 'error');
        return false;
    }

    // Show loader
    document.getElementById('submitButton').disabled = true;
    document.getElementById('loader').style.display = 'inline';

    setTimeout( () => {
        storeFormData(countrySelect.value, stateSelect.value, pollutionType.value, fullName, image, additionalInfo);

        // Hide loader
        document.getElementById('submitButton').disabled = false;
        document.getElementById('loader').style.display = 'none';

    }, 1500);

}

// Attach click event listener to the submit button
document.getElementById('submitButton').addEventListener('click', () => {
    validateAndSaveFormValues();
});


