// ---------- Mobile navigation ----------
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    burger.classList.remove("active");
    nav.classList.remove("open");
  });
});

// ---------- Dropdown menu (Voyages) ----------
document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const parent = toggle.closest(".nav-item-dropdown");
    const isOpen = parent.classList.contains("open");
    document.querySelectorAll(".nav-item-dropdown.open").forEach((el) => el.classList.remove("open"));
    if (!isOpen) parent.classList.add("open");
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-item-dropdown")) {
    document.querySelectorAll(".nav-item-dropdown.open").forEach((el) => el.classList.remove("open"));
  }
});

// ---------- Back to top button ----------
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

// ---------- Rotating announcement ticker ----------
const tickerMessages = [
  "✈️ Billets, visas, hôtels et circuits : tout en un seul endroit.",
  "🕑 7 ans d'expérience au service des voyageurs de Conakry.",
  "💬 Réponse rapide et suivi personnalisé via WhatsApp.",
  "🌍 Votre pont de Conakry vers le reste du monde.",
];

const tickerEl = document.getElementById("ticker-text");
let tickerIndex = 0;

if (tickerEl) {
  setInterval(() => {
    tickerEl.classList.add("fade");
    setTimeout(() => {
      tickerIndex = (tickerIndex + 1) % tickerMessages.length;
      tickerEl.textContent = tickerMessages[tickerIndex];
      tickerEl.classList.remove("fade");
    }, 400);
  }, 4000);
}

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Contact form (démo, sans backend) ----------
const form = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formNote.textContent = "Merci ! Votre demande a bien été enregistrée. Nous vous recontacterons rapidement.";
  form.reset();
});
