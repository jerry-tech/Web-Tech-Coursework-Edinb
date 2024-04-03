import { toTitleCase, openDatabase } from './utils.js';


//Load Countries.json
document.addEventListener("DOMContentLoaded", function () {
    fetch('./js/master_record/country.json')
        .then(response => response.json())
        .then(data => populateCountry(data))
        .catch(error => console.error('Error fetching countries:', error));
});

const fetchStateData = (alpha3) => {
    return new Promise((resolve, reject) => {
        fetch('./js/master_record/state.json')
            .then(response => response.json())
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
    fetchStateData(alpha3)
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

const isValidImage = (imageDocumentId) => {
    var fileSize = image.files[0].size;
    var maxSize = 500 * 1024; // Maximum size in bytes (500 KB)
    if (fileSize > maxSize) {
        alert("File size exceeds the limit of 500 KB.");
        return false;
    }

    return true;
}

// Function to store form data into IndexedDB
const storeFormData = (countryAlpha2, stateCode, pollutionType, phone, image, description) => {
    openDatabase().then(db => {
        var transaction = db.transaction(['form_data'], 'readwrite');
        var objectStore = transaction.objectStore('form_data');

        // Convert image file to ArrayBuffer
        var reader = new FileReader();
        reader.onload = function (event) {
            var imageData = event.target.result;

            var formData = {
                country: countryAlpha2,
                stateCode: stateCode,
                pollutionType: pollutionType,
                phone: phone,
                description: description,
                image: imageData
            };

            var request = objectStore.add(formData);

            request.onsuccess = function (event) {
                console.log('Form data added to IndexedDB.');
            };

            request.onerror = function (event) {
                console.error('Error adding form data to IndexedDB.');
            };
        };

        reader.onerror = function (event) {
            console.error('Error reading image file:', event.target.error);
        };

        reader.readAsArrayBuffer(image);

    }).catch(error => {
        console.error('Error opening database:', error);
    });
}

const validateAndSaveFormValues = () => {
    var countrySelect = document.getElementById('countrySelect');
    var stateSelect = document.getElementById('stateSelect');
    var pollutionType = document.getElementById('pollutionType');
    var phone = document.getElementById('phone').value;
    var image = document.getElementById('image').files[0];
    var additionalInfo = document.getElementById('additionalInfo').value;

    if (countrySelect.value === "" || pollutionType.value === "" || !isValidImage(document.getElementById('image'))) {
        alert("Please fill in all required fields.");
        return false;
    }

    // Show loader
    document.getElementById('submitButton').disabled = true;
    document.getElementById('buttonText').style.display = 'none';
    document.getElementById('loader').style.display = 'inline';

    setTimeout(function() {
         storeFormData(countrySelect.value, stateSelect.value, pollutionType.value, phone, image, additionalInfo);

         // Hide loader
        document.getElementById('submitButton').disabled = false;
        document.getElementById('buttonText').style.display = 'inline';
        document.getElementById('loader').style.display = 'none';
    }, 1500);

}

// Attach click event listener to the submit button
document.getElementById('submitButton').addEventListener('click', () => {
    validateAndSaveFormValues();
});