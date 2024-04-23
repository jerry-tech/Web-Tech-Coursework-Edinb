function openClose() {
  var trigger = document.getElementById("topNav");
  var aSide = document.getElementById("sideNav");

  if (trigger.className === "nav-list-items") {
    trigger.classList.add("responsive");
    aSide.style.width = "clamp(15rem, 50vw, 50rem)";

    document.querySelector(".closebtn").classList.add("effect");
  } else {
    trigger.classList.remove("responsive");
    aSide.style.width = "0";

    document.querySelector(".closebtn").classList.remove("effect");
  }
}

function closeModal() {
  var closeBtn = document.querySelector(".modal");

  if (closeBtn.classList.contains(".hide")) {
    closeBtn.classList.remove("hide");
  } else {
    closeBtn.classList.add("hide");
  }
}

function showModal(){
  var modal = document.querySelector(".modal");
  if (modal.classList.contains("hide")) {
      modal.classList.remove("hide");
  }
}

function hideDiv() {
  // Correctly use getElementById without the '#' prefix
  var hidden = document.getElementById("toBeHidden");

  if(hidden != undefined){
  // Function to check the window width and hide/show the div
  function checkWindowSize() {
    if (window.innerWidth < 900) {
      hidden.classList.add("hide");
    } else {
      hidden.classList.remove("hide");
    }
  }

  // Listen for resize events
  window.addEventListener("resize", checkWindowSize);

  // Check the window size immediately in case it's already less than 900px
  checkWindowSize();
  }
}

hideDiv();