let menuBtn = document.querySelector(".header__menu");
let menuLinks = document.querySelector(".header__links");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  menuLinks.classList.toggle("active");
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    menuBtn.classList.remove("active");
    menuLinks.classList.remove("active");
  }
});
