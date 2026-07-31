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

// ---------- Boutique: filter & sort ----------
const productsGrid = document.getElementById("products-grid");

if (productsGrid) {
  const categorySelect = document.getElementById("category-select");
  const sortSelect = document.getElementById("sort-select");
  const resultCount = document.getElementById("result-count");
  const noResults = document.getElementById("no-results");
  const cards = Array.from(productsGrid.querySelectorAll(".product-card"));
  const originalOrder = cards.slice();

  function renderProducts() {
    const category = categorySelect.value;
    const sort = sortSelect.value;

    let visible = originalOrder.filter(
      (card) => category === "all" || card.dataset.category === category
    );

    if (sort === "name-asc") {
      visible.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name, "fr"));
    } else if (sort === "name-desc") {
      visible.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name, "fr"));
    } else if (sort === "price-asc") {
      visible.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    } else if (sort === "price-desc") {
      visible.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    }

    cards.forEach((card) => { card.hidden = true; });
    visible.forEach((card) => {
      card.hidden = false;
      productsGrid.appendChild(card);
    });

    const count = visible.length;
    resultCount.textContent = count > 1
      ? `Affichage de ${count} produits`
      : count === 1
        ? "Affichage de 1 produit"
        : "Aucun produit trouvé";
    noResults.hidden = count !== 0;
  }

  categorySelect.addEventListener("change", renderProducts);
  sortSelect.addEventListener("change", renderProducts);

  const requestedCategory = new URLSearchParams(window.location.search).get("cat");
  if (requestedCategory && [...categorySelect.options].some((opt) => opt.value === requestedCategory)) {
    categorySelect.value = requestedCategory;
  }

  renderProducts();
}

// ---------- Études : afficher la liste des pays ----------
const togglePaysBtn = document.getElementById("toggle-pays-etudes");

if (togglePaysBtn) {
  togglePaysBtn.addEventListener("click", () => {
    const liste = document.getElementById("liste-pays-etudes");
    liste.hidden = !liste.hidden;
    togglePaysBtn.textContent = liste.hidden ? "Voir les pays disponibles" : "Masquer les pays";
  });
}

// ---------- Formulaire Partenariat (envoi via WhatsApp) ----------
const partnerForm = document.getElementById("partenariat-form");

if (partnerForm) {
  const partnerNote = document.getElementById("partenariat-form-note");

  partnerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(partnerForm).entries());
    const lines = [
      "Bonjour, je souhaite proposer un partenariat avec DTS.",
      `Organisation : ${data.organisation}`,
      `Contact : ${data.contact}`,
      `Téléphone : ${data.phone}`,
      `Email : ${data.email}`,
      `Type de structure : ${data.type || "Non précisé"}`,
      "",
      data.message || "(aucun message)",
    ];
    const url = "https://wa.me/224627931640?text=" + encodeURIComponent(lines.join("\n"));
    partnerNote.textContent = "Ouverture de WhatsApp...";
    window.open(url, "_blank", "noopener");
  });
}

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

// ---------- Contact form (Netlify Function + Resend) ----------
const form = document.getElementById("contact-form");

if (form) {
  const formNote = document.getElementById("form-note");
  const submitBtn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    formNote.textContent = "Envoi en cours…";

    const data = Object.fromEntries(new FormData(form).entries());

    fetch("/.netlify/functions/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        formNote.textContent = "Merci ! Votre demande a bien été envoyée. Nous vous recontacterons rapidement.";
        form.reset();
      })
      .catch(() => {
        formNote.textContent = "Une erreur est survenue. Contactez-nous directement via WhatsApp.";
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
}
