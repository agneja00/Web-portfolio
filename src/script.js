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

function setMenu(open) {
  state.isMenuOpen = open;

  menuBtn.classList.toggle("active", open);
  menuLinks.classList.toggle("active", open);

  document.body.style.overflow = open ? "hidden" : "auto";

  if (!open) {
    state.target = Math.max(0, Math.min(window.scrollY, state.maxScroll));
  }
}

function toggleMenu(force) {
  setMenu(typeof force === "boolean" ? force : !state.isMenuOpen);
}

menuBtn.addEventListener("click", () => toggleMenu());

function updateBounds() {
  const height = scrollRoot.scrollHeight;

  spacer.style.height = `${height}px`;

  state.maxScroll = Math.max(0, height - window.innerHeight);

  state.target = Math.max(0, Math.min(window.scrollY, state.maxScroll));
  state.current = Math.max(0, Math.min(state.current, state.maxScroll));
}

function onResize() {
  if (window.innerWidth >= 768) setMenu(false);
  updateBounds();
}

function onScroll() {
  if (state.isMenuOpen) return;
  state.target = Math.max(0, Math.min(window.scrollY, state.maxScroll));
}

function onAnchorClick(e) {
  const link = e.currentTarget;
  const href = link.getAttribute("href");

  if (!href || !href.startsWith("#")) return;

  const id = href.slice(1);
  const targetEl = document.getElementById(id);
  if (!targetEl) return;

  e.preventDefault();
  setMenu(false);

  const y = Math.min(targetEl.offsetTop, state.maxScroll);

  window.scrollTo({ top: y, behavior: "auto" });
  state.target = y;
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

window.addEventListener("resize", onResize);
window.addEventListener("scroll", onScroll, { passive: true });

document
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => link.addEventListener("click", onAnchorClick));

const resizeObserver = new ResizeObserver(() => updateBounds());
resizeObserver.observe(scrollRoot);

window.addEventListener("load", () => {
  updateBounds();
  onScroll();
});

updateBounds();
loop();
