/* =========================================================
   SCRIPT.JS — Portfolio Ndeye Aminata Diagne
   ========================================================= */

/* =========================================================
   CONFIGURATION — LES 2 SEULES CHOSES À MODIFIER
   ========================================================= */

// Adresse email qui recevra les messages du formulaire de contact
const CONTACT_EMAIL = "amycrea915@gmail.com";

// Intitulés de poste affichés en boucle dans le hero (2 à 4 conseillés)
const JOB_TITLES = [
  "Infographiste",
  "Motion Designer",
  "Community Manager",
  "Créatrice de contenu"
];

/* ========================= FIN DE LA CONFIGURATION ===================== */


document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initTypewriter();
  initStickyHeader();
  initMobileMenu();
  initScrollSpy();
  initRevealOnScroll();
  initContactForm();
});

/* ---------- Année automatique dans le pied de page ---------- */
function initYear() {
  const el = document.getElementById("year");
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}

/* ---------- Effet "machine à écrire" pour l'intitulé de poste ---------- */
function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el || JOB_TITLES.length === 0) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Si l'utilisateur préfère un mouvement réduit : on affiche simplement le premier intitulé,
  // sans animation, et on ne boucle pas.
  if (prefersReducedMotion) {
    el.textContent = JOB_TITLES[0];
    return;
  }

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId = null;

  const TYPING_SPEED = 70;       // vitesse d'écriture (ms par caractère)
  const DELETING_SPEED = 40;     // vitesse d'effacement (ms par caractère)
  const PAUSE_AFTER_TYPE = 4200; // pause avant effacement
  const PAUSE_AFTER_DELETE = 400;

  function tick() {
    const currentTitle = JOB_TITLES[titleIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = currentTitle.slice(0, charIndex);

      if (charIndex === currentTitle.length) {
        isDeleting = true;
        timeoutId = setTimeout(tick, PAUSE_AFTER_TYPE);
        return;
      }
      timeoutId = setTimeout(tick, TYPING_SPEED);
    } else {
      charIndex--;
      el.textContent = currentTitle.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % JOB_TITLES.length;
        timeoutId = setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }
      timeoutId = setTimeout(tick, DELETING_SPEED);
    }
  }

  tick();

  // Nettoyer le timeout si la page est déchargée
  window.addEventListener("beforeunload", () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

/* ---------- Menu sticky avec ombre au scroll ---------- */
function initStickyHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const onScroll = () => {
    const isScrolled = window.scrollY > 12;
    header.classList.toggle("is-scrolled", isScrolled);
  };

  // Exécution initiale
  onScroll();

  // Utilisation de l'option passive pour de meilleures performances
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Menu mobile (hamburger) ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    const isOpen = menu.classList.contains("is-open");
    if (isOpen) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
    }
  };

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  };

  toggle.addEventListener("click", toggleMenu);

  // Ferme le menu mobile après le clic sur un lien
  menu.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Ferme le menu si on clique en dehors
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      closeMenu();
    }
  });

  // Ferme le menu si on appuie sur la touche Échap
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Ferme le menu si on repasse en affichage desktop
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    }, 100);
  });
}

/* ---------- Mise en surbrillance du lien de la section visible ---------- */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = links
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return null;
      return document.querySelector(href);
    })
    .filter(Boolean);

  if (sections.length === 0) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === `#${id}`;
      link.classList.toggle("is-active", isActive);
    });
  };

  // Utilisation d'IntersectionObserver pour une meilleure performance
  const observer = new IntersectionObserver(
    (entries) => {
      // Trouver la section la plus visible
      let maxRatio = 0;
      let activeId = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          activeId = entry.target.id;
        }
      });

      if (activeId) {
        setActive(activeId);
      }
    },
    {
      rootMargin: "-40% 0px -40% 0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Activer la première section par défaut
  if (sections.length > 0 && sections[0].id) {
    setActive(sections[0].id);
  }
}

/* ---------- Apparition progressive des sections au défilement ---------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (items.length === 0) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Si l'utilisateur préfère un mouvement réduit, on affiche tout directement
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Ajouter un délai progressif pour un effet plus naturel
          const delay = Array.from(items).indexOf(entry.target) * 80;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------- Formulaire de contact → ouverture du client mail (mailto:) ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (!form) return;

  // Réinitialiser le message de statut
  const clearNote = () => {
    if (note) {
      setTimeout(() => {
        note.textContent = "";
      }, 6000);
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    // Validation des champs
    if (!name || !email || !subject || !message) {
      if (note) {
        note.textContent = "⚠️ Merci de remplir tous les champs avant d'envoyer.";
        note.style.color = "var(--color-corail, #FF6B6B)";
      }
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (note) {
        note.textContent = "⚠️ Veuillez saisir une adresse email valide.";
        note.style.color = "var(--color-corail, #FF6B6B)";
      }
      return;
    }

    const mailSubject = `[Portfolio] ${subject}`;
    const mailBody =
      `Nom : ${name}\n` +
      `Email : ${email}\n\n` +
      `${message}`;

    const mailtoLink =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(mailSubject)}` +
      `&body=${encodeURIComponent(mailBody)}`;

    // Essayer d'ouvrir le client mail
    try {
      window.location.href = mailtoLink;

      if (note) {
        note.textContent = "✅ Votre client mail va s'ouvrir avec le message pré-rempli.";
        note.style.color = "var(--color-violet, #5B3CC4)";
        clearNote();
      }

      // Réinitialiser le formulaire après un court délai
      setTimeout(() => {
        form.reset();
      }, 1000);
    } catch (error) {
      if (note) {
        note.textContent = "❌ Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.";
        note.style.color = "var(--color-corail, #FF6B6B)";
      }
      console.error("Erreur lors de l'ouverture du client mail:", error);
    }
  });

  // Nettoyer le message de statut lors de la saisie
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      if (note && note.textContent !== "") {
        note.textContent = "";
      }
    });
  });
}

/* ---------- Gestion du dark mode (si supporté par le CSS) ---------- */
function initDarkMode() {
  // Cette fonction est un placeholder pour une éventuelle extension future
  // Elle n'est pas appelée par défaut
}

console.log("🚀 Portfolio Ndeye Aminata Diagne chargé avec succès !"); 