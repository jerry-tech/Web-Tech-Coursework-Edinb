function openClose() {
  var trigger = document.getElementById("topNav");
  var aSide = document.getElementById("sideNav");

  if (trigger.className === "nav-list-items") {
    console.log("open");
    trigger.classList.add("responsive");
    aSide.style.width = "clamp(15rem, 50vw, 50rem)";

    document.querySelector(".closebtn").classList.add("effect");
  } else {
    console.log("close");
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
