import "./sass/style.scss";

let menuBtn = document.querySelector(".header__menu");
let menuLinks = document.querySelector(".header__links");

menuBtn.addEventListener("click", function () {
  menuBtn.classList.toggle("active");
  menuLinks.classList.toggle("active");
});
