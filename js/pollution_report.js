import { retrieveFormDataFromDB, displayError, formatDateTime, fetchStateData, fetchCountryData, toTitleCase } from './utils.js';

let stateData = null;
let countryData = null;

async function fetchData() {
    try {
        countryData = await fetchCountryData();
        stateData = await fetchStateData();
        
        // After data is fetched, populate the table
        loadInitTable();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();

const getStateName = (alpha3, code) => {
    if (!stateData) throw new Error('State data not available');
    
    const state = stateData.find(state => state.alpha3 === alpha3 && state.code === code);
    
    if (state) {
        return toTitleCase(state.name);
    } else {
        throw new Error('State not found');
    }
}

const getCountryName = (alpha3) => {
    if (!countryData) throw new Error('Country data not available');
    
    const country = countryData.find(country => country.alpha3 === alpha3);
    
    if (country) {
        return toTitleCase(country.name);
    } else {
        throw new Error('Country not found');
    }
}

// Populate the table with data from IndexedDB
const loadInitTable = () => {
    retrieveFormDataFromDB().then(formDataArray => {
        populateTable(formDataArray);
    }).catch(error => {
        displayError('Error retrieving form data:' + error);
    });
}

// Function to populate the table
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
        document.getElementById('table_record_total').innerHTML = 'Total:' + formDataArray.length;
        
        noDataRow.style.display = 'none';
        // Populate table rows with form data
        formDataArray.forEach((formData, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td data-label="S/N">${index + 1}</td>
                <td data-label="Full Name">${formData.fullName}</td>
                <td data-label="Country">${getCountryName(formData.countryAlpha3)}</td>
                <td data-label="State">${getStateName(formData.countryAlpha3, formData.stateCode)}</td>
                <td data-label="Pollution Type">${formData.pollutionType + ' Pollution'}</td>
                <td data-label="Created At">${formatDateTime(formData.createdAt)}</td>
                <td><button type="button" class="btn-dark">View</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Event listener for filter form submission
document.getElementById('filterForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get filter criteria from form fields
    const nameFilterValue = document.getElementById('nameFilter').value.trim().toLowerCase();
    const pollutionTypeFilterValue = document.getElementById('pollutionTypeFilter').value.trim().toLowerCase();

    retrieveFormDataFromDB().then(formDataArray => {
        document.getElementById('table_record_total').innerHTML = 'Total:' + formDataArray.length;

        // Filter records based on criteria
        const filteredRecords = formDataArray.filter(record => {
            return (!nameFilterValue || record.fullName.toLowerCase().includes(nameFilterValue)) &&
                (!pollutionTypeFilterValue || record.pollutionType.toLowerCase().includes(pollutionTypeFilterValue));
        });

        // Call function to populate table with filtered records
        populateTable(filteredRecords);
    }).catch(error => {
        displayError('Error retrieving form data:' + error);
    });
});
