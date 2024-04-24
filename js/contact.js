import {getCookie,displayMessage} from './utils.js';
 import { USERNAME_COOKIE_KEY } from './constant.js';

let personalizationName = getCookie(USERNAME_COOKIE_KEY);
if (personalizationName !== "") {
    var nameInput = document.getElementById("fullName");
    nameInput.value = personalizationName;
}

 // Attach click event listener to the submit button
 document.getElementById('submitButton').addEventListener('click', () => {
    displayMessage("Your details has been saved successfully.", 'success');
    document.getElementById("myForm").reset();
});