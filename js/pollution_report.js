import { retrieveFormDataFromDB, deleteFormDataFromDB, displayMessage, formatDateTime, fetchStateData, fetchCountryData, toTitleCase, getImageUrl} from './utils.js';

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
        displayMessage('Error retrieving form data:' + error, 'error');
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
        document.getElementById('table_record_total').innerHTML = 'Total:' + formDataArray.length;
        
        noDataRow.style.display = 'block';
    } else {
        document.getElementById('table_record_total').innerHTML = 'Total:' + formDataArray.length;

        noDataRow.style.display = 'none';
        // Populate table rows with form data
        formDataArray.forEach((formData, index) => {
            const tr = document.createElement('tr');
            const countryName = getCountryName(formData.countryAlpha3);
            const stateName = getStateName(formData.countryAlpha3, formData.stateCode);
            const currentTime = formatDateTime(formData.createdAt);

            tr.innerHTML = `
                <td data-label="S/N">${index + 1}</td>
                <td data-label="Full Name">${formData.fullName}</td>
                <td data-label="Country">${countryName}</td>
                <td data-label="State">${stateName}</td>
                <td data-label="Pollution Type">${formData.pollutionType + ' Pollution'}</td>
                <td data-label="Created At">${currentTime}</td>
                <td><button type="button" class="btn-dark view-btn">View</button></td>
            `;
            tbody.appendChild(tr);

            // Add event listener to the view button in this row
            const viewBtn = tr.querySelector('.view-btn');
            viewBtn.addEventListener('click', () => {
                const modal = createModal(formData, stateName, countryName, currentTime);
                document.body.appendChild(modal);
                const closeBtn = modal.querySelector('.close');
                closeBtn.addEventListener('click', function () {
                    document.body.removeChild(modal);
                });
            });
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
        displayMessage('Error retrieving form data:' + error, 'error');
    });
});

const createModal = (formData, stateName, countryName, currentTime) => {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="modal-heading">
                <h2>More Information</h2>
            </div>   
            <div id="messageContainer" class="alert mt-1 p-2" style="display: none;">
                <div style="display: flex; align-items: center; justify-content: center;">
                    <i id="messageIcon" style="font-size: 25px;"></i>
                    <span style="margin-left: 10px;" id="message"></span>
                </div>
            </div>
            <div class="row">
                <div class="col" style="flex-basis: 30%;">
                    <table>
                        <tr>
                            <td>Name:</td>
                            <td>${formData.fullName}</td>
                        </tr>
                        <tr>
                            <td>Location:</td>
                            <td>${countryName + ','} ${stateName}</td>
                        </tr>
                        <tr>
                            <td>Created At:</td>
                            <td>${currentTime}</td>
                        </tr>
                        <tr>
                            <td>Type of Pollution:</td>
                            <td>${formData.pollutionType + ' Pollution'}</td>
                        </tr>
                        <tr>
                            <td>More info</td>
                            <td>${formData.description}</td>
                        </tr>
                    </table>
                </div>
                <div class="col flex-control">
                    <div class="square-background" style="padding: .5rem;">
                            <img class="modal-image" src="${getImageUrl(formData.image)}" alt="image">
                    </div>
                    <div>
                        <div class="rect-background">
                            <small style="margin: .5rem;">Created on <p style="margin: 0 .5rem;">
                                <p style="margin: 0 .5rem;">${currentTime}</p>
                            </small>
                        </div>
                        <div style="width: 100%;">
                            <button type="button" id="deleteBtn" class="btn btn-danger">
                            <span id="buttonText">Delete</span>
                            <span id="loader" style="display: none;"><span class="fa fa-spinner fa-spin"></span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const deleteBtn = modal.querySelector('#deleteBtn');

    deleteBtn.addEventListener('click', async function () {
        document.getElementById('deleteBtn').disabled = true;
        document.getElementById('loader').style.display = 'inline';

        try {
            await deleteFormDataFromDB(formData.id);
            document.body.removeChild(modal);

            displayMessage('Record Deleted Successfully', 'success');
            setInterval(() => {
                loadInitTable();
            }, 1500)
        } catch (error) {
            document.getElementById('deleteBtn').disabled = false;
            document.getElementById('loader').style.display = 'none';
            displayMessage('Error deleting form data:' + error, 'error');
        }
    });
    
    return modal;
}