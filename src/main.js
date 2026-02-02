import "./sass/style.scss";

const menuBtn = document.querySelector(".header__menu");
const menuLinks = document.querySelector(".header__links");
const scrollRoot = document.getElementById("scroll-root");
const spacer = document.getElementById("scroll-spacer");

const state = {
  current: 0,
  target: 0,
  maxScroll: 0,
  ease: 0.07,
  isMenuOpen: false,
  isRunning: true,
};

function toggleMenu(force) {
  state.isMenuOpen = typeof force === "boolean" ? force : !state.isMenuOpen;

  menuBtn.classList.toggle("active", state.isMenuOpen);
  menuLinks.classList.toggle("active", state.isMenuOpen);
}

menuBtn.addEventListener("click", () => toggleMenu());

function updateBounds() {
  const height = scrollRoot.scrollHeight;
  if (spacer) {
    spacer.style.height = height + "px";
  }

  state.maxScroll = Math.max(0, height - window.innerHeight);

  state.target = Math.max(0, Math.min(state.target, state.maxScroll));
  state.current = Math.max(0, Math.min(state.current, state.maxScroll));
}

function onResize() {
  if (window.innerWidth >= 768) {
    toggleMenu(false);
  }
  updateBounds();
}

function onWheel(e) {
  if (state.isMenuOpen) return;

  e.preventDefault();

  state.target += e.deltaY;
  state.target = Math.max(0, Math.min(state.target, state.maxScroll));
}

function onAnchorClick(e) {
  const link = e.currentTarget;
  const id = link.getAttribute("href").slice(1);
  const targetEl = document.getElementById(id);
  if (!targetEl) return;

  e.preventDefault();
  toggleMenu(false);

  const rect = targetEl.getBoundingClientRect();
  state.target += rect.top;
  state.target = Math.max(0, Math.min(state.target, state.maxScroll));
}

function loop() {
  if (!state.isRunning) return;

  state.current += (state.target - state.current) * state.ease;

  if (Math.abs(state.target - state.current) < 0.1) {
    state.current = state.target;
  }

  scrollRoot.style.transform = `translate3d(0, ${-state.current}px, 0)`;

  requestAnimationFrame(loop);
}

let touchStartY = 0;
let touchEndY = 0;
let touchVelocity = 0;
let lastTouchY = 0;
let lastTime = 0;
let momentumId = null;

function onTouchStart(e) {
  if (state.isMenuOpen) return;

  if (momentumId) {
    cancelAnimationFrame(momentumId);
    momentumId = null;
  }

  touchStartY = e.touches[0].clientY;
  lastTouchY = touchStartY;
  lastTime = Date.now();
  touchVelocity = 0;
}

function onTouchMove(e) {
  if (state.isMenuOpen) return;

  e.preventDefault();
  touchEndY = e.touches[0].clientY;

  const delta = touchStartY - touchEndY;
  const currentTime = Date.now();
  const timeDelta = Math.max(1, currentTime - lastTime);

  touchVelocity = ((lastTouchY - touchEndY) / timeDelta) * 16;

  state.target += delta * 2;
  state.target = Math.max(0, Math.min(state.target, state.maxScroll));

  touchStartY = touchEndY;
  lastTouchY = touchEndY;
  lastTime = currentTime;
}

function onTouchEnd() {
  const applyMomentum = () => {
    if (Math.abs(touchVelocity) < 0.5) {
      momentumId = null;
      return;
    }

    touchVelocity *= 0.97;
    state.target += touchVelocity * 2;
    state.target = Math.max(0, Math.min(state.target, state.maxScroll));

    momentumId = requestAnimationFrame(applyMomentum);
  };

  if (Math.abs(touchVelocity) > 1) {
    momentumId = requestAnimationFrame(applyMomentum);
  }
}

window.addEventListener("resize", onResize);

window.addEventListener("wheel", onWheel, {
  passive: false,
});

window.addEventListener("touchstart", onTouchStart, { passive: false });
window.addEventListener("touchmove", onTouchMove, { passive: false });
window.addEventListener("touchend", onTouchEnd, { passive: false });

document
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => link.addEventListener("click", onAnchorClick));

updateBounds();

window.addEventListener("load", () => {
  updateBounds();
});

const resizeObserver = new ResizeObserver(() => {
  updateBounds();
});

resizeObserver.observe(scrollRoot);

loop();
