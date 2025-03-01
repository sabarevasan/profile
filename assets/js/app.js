// SELECT NAV
const burger = document.querySelector("#burger-menu");
const ul = document.querySelector("nav ul");
const nav = document.querySelector("nav");

// HTML SCROLLED
window.onscroll = function() {scrolledToggle()};
function scrolledToggle() {
    if (document.body.scrollTop >= 1 || document.documentElement.scrollTop >= 1) {
        nav.classList.add("navbar-toggle-top");
    } else {
        nav.classList.remove("navbar-toggle-top");
    }
}

// SELECT SCROLL TO TOP
const scrollUp = document.querySelector("#scroll-up");

// SELECT NAV OPTION
const navLink = document.querySelectorAll(".nav-link");

// MENU FUNCTION
burger.addEventListener("click", () => {
    ul.classList.toggle("show");
});

// CLOSE MENU
navLink.forEach((link) =>
    link.addEventListener("click", () => {
        ul.classList.remove("show");
    })
);

// SCROLL TO TOP
scrollUp.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
});