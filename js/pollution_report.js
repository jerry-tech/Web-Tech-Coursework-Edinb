import { retrieveFormDataFromDB, displayError, formatDateTime, fetchStateData, fetchCountryData, toTitleCase } from './utils.js';

let stateData = null;
let countryData = null;

fetchStateData()
    .then(data => {
        stateData = data;
    })
    .catch(error => console.error('Error fetching state data:', error));


fetchCountryData()
.then(data => {
    countryData = data;
})
.catch(error => console.error('Error fetching country data:', error));


// Populate the table with data from IndexedDB
const loadInitTable = () => {
    retrieveFormDataFromDB().then(formDataArray => {
        document.getElementById('table_record_total').innerHTML = 'Total:' + formDataArray.length;
        populateTable(formDataArray);
    }).catch(error => {
        displayError('Error retrieving form data:' + error);
    });
}

// Call the populateTable function to populate the table when the page loads
document.addEventListener('DOMContentLoaded', function () {
    loadInitTable();
});


const populateTable = (formDataArray) => {
    const dataTable = document.getElementById('dataTable');
    const tbody = dataTable.querySelector('tbody');
    const noDataRow = document.getElementById('noDataRow');

       // Clear existing rows
       tbody.innerHTML = '';

    if (formDataArray.length === 0) {
        // If no data is retrieved, display a message
        noDataRow.style.display = 'block';
    } else {
        noDataRow.style.display = 'none';
        // Populate table rows with form data
        formDataArray.forEach((formData, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td data-label="${index + 1}">${index + 1}</td>
                <td data-label="${formData.fullName}">${formData.fullName}</td>
                <td data-label="${getCountryName(formData.countryAlpha3)}">${getCountryName(formData.countryAlpha3)}</td>
                <td data-label="${getStateName(formData.countryAlpha3, formData.stateCode)}">${getStateName(formData.countryAlpha3, formData.stateCode)}</td>
                <td data-label="${formData.pollutionType + ' Pollution'}">${formData.pollutionType + ' Pollution'}</td>
                <td data-label="${formatDateTime(formData.createdAt)}">${formatDateTime(formData.createdAt)}</td>
                <td><button type="button" class="btn-dark">View</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
}


document.getElementById('filterForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get filter criteria from form fields
    const nameFilterValue = document.getElementById('nameFilter').value.trim().toLowerCase();
    const pollutionTypeFilterValue = document.getElementById('pollutionTypeFilter').value.trim().toLowerCase();

    retrieveFormDataFromDB().then(formDataArray => {
        document.getElementById('table_record_total').innerHTML = 'Total:' + formDataArray.length;

        // Filter records based on criteria
        const filteredRecords = formDataArray.filter(record => {
         console.log(record)
            return (!nameFilterValue || record.fullName.toLowerCase().includes(nameFilterValue)) &&
                (!pollutionTypeFilterValue || record.pollutionType.toLowerCase().includes(pollutionTypeFilterValue));
        });

        // Call function to populate table with filtered records
        populateTable(filteredRecords);
    }).catch(error => {
        displayError('Error retrieving form data:' + error);
    });
});

const getStateName = (alpha3, code) => {
    const state = stateData.find(state => state.alpha3 === alpha3 && state.code === code);   
    console.log(state)      
    if (state) {
        return toTitleCase(state.name);
    } else {
        throw new Error('State not found');
    }
}

const getCountryName = (alpha3) => {
    const country = countryData.find(country => country.alpha3 === alpha3);         
    if (country) {
        return toTitleCase(country.name);
    } else {
        throw new Error('Country not found');
    }
}