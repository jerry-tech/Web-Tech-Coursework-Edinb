import { setCookie, getCookie } from './generic.js';

/** Cookie Modal Page Logic **/

//Getting Cookie    
let personalizationName = getCookie("username");

if (personalizationName === "") {
    var modal = document.querySelector(".modal");
    if (modal.classList.contains("hide")) {
        modal.classList.remove("hide");
    }
}


// Cookie Modal Page Logic
personalizationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //Getting value from form field
    let personalizationName = document.getElementById("personal_name").value;
    if (personalizationName != "" && personalizationName != null) {
        setCookie("username", personalizationName, 365);

        alert("Welcome again Jaaaa" + personalizationName);
    }
  
});