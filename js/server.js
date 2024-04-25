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

function showModal() {
  var modal = document.querySelector(".modal");
  if (modal.classList.contains("hide")) {
    modal.classList.remove("hide");
  }
}

function hideDiv() {
  // Correctly use getElementById without the '#' prefix
  var hidden = document.getElementById("toBeHidden");

  if (hidden != undefined) {
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


const news = document.querySelector("#more_news");
const contReading = document.querySelector(".cont_readn");


function hideNews() {
  if (news.classList.contains("d-none") === true) {
    news.classList.remove("d-none");
    contReading.innerHTML = "<strong><em>Read less <<</em></strong>";
  } else {
    news.classList.add("d-none");
    contReading.innerHTML = "<strong><em>Continue reading >></em></strong>";
  }
}


const news2 = document.querySelector("#more_news_2");
const contReading2 = document.querySelector(".cont_readn_2");

function hideNews2() {
  if (news2.classList.contains("d-none") === true) {
    news2.classList.remove("d-none");
    contReading2.innerHTML = "<strong><em>Read less <<</em></strong>";
  } else {
    news2.classList.add("d-none");
    contReading2.innerHTML = "<strong><em>Continue reading >></em></strong>";
  }
}

const news3 = document.querySelector("#more_news_3");
const contReading3 = document.querySelector(".cont_readn_3");

function hideNews3() {
  if (news3.classList.contains("d-none") === true) {
    news3.classList.remove("d-none");
    contReading3.innerHTML = "<strong><em>Read less <<</em></strong>";
  } else {
    news3.classList.add("d-none");
    contReading3.innerHTML = "<strong><em>Continue reading >></em></strong>";
  }
}

function navigate(urlPath) {
  var a = document.createElement('a');
  a.href = urlPath;
  document.body.appendChild(a);
  a.click();
}


function previousArticle() {
  var currentURL = window.location.href;

  if (currentURL.endsWith("/blog.html#article_2")) {
    navigate('./blog.html#article_1');
  } else if (currentURL.endsWith("/blog.html#article_3")) {
    navigate('./blog.html#article_2');
  }
  window.scrollTo(0, 0);
}

function nextArticle() {
  var currentURL = window.location.href;

  if (currentURL.endsWith("/blog.html#article_1")) {
    navigate('./blog.html#article_2');
  } else if (currentURL.endsWith("/blog.html#article_2")) {
    navigate('./blog.html#article_3');
  }
  window.scrollTo(0, 0);
}