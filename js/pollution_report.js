import { retrieveFormDataFromDB, displayError, formatDateTime } from './utils.js';

// Populate the table with data from IndexedDB
const populateTable = () => {
    const dataTable = document.getElementById('dataTable');
    const tbody = dataTable.querySelector('tbody');
    const noDataRow = document.getElementById('noDataRow');


    retrieveFormDataFromDB().then(formDataArray => {

        document.getElementById('table_record_total').innerHTML = 'Total:' + formDataArray.length;

        if (formDataArray.length === 0) {
            // If no data is retrieved, display a message
            noDataRow.style.display = 'block';
        } else {
            // Clear existing rows
             tbody.innerHTML = '';

            noDataRow.style.display = 'none';
            // Populate table rows with form data
            formDataArray.forEach((formData, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td data-label="${index + 1}">${index + 1}</td>
                    <td data-label="${formData.fullName}">${formData.fullName}</td>
                    <td data-label="${formData.countryAlpha3}">${formData.countryAlpha3}</td>
                    <td data-label="${formData.stateCode}">${formData.stateCode}</td>
                    <td data-label="${formData.pollutionType + ' Pollution'}">${formData.pollutionType + ' Pollution'}</td>
                    <td data-label="${formatDateTime(formData.createdAt)}">${formatDateTime(formData.createdAt)}</td>
                    <td><button type="button" class="btn-dark">View</button></td>
                `;
                tbody.appendChild(tr);
            });
        }

    }).catch(error => {
        displayError('Error retrieving form data:' + error);
    });
}

// Call the populateTable function to populate the table when the page loads
document.addEventListener('DOMContentLoaded', function () {
    populateTable();
});