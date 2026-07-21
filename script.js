const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const year = document.querySelector("#year");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const header = document.querySelector(".site-header");
const scrollProgress = document.querySelector(".scroll-progress");
const commandToggle = document.querySelector("#command-toggle");
const commandPalette = document.querySelector("#command-palette");
const commandSearch = document.querySelector("#command-search");
const commandList = document.querySelector("#command-list");
const modeChips = document.querySelectorAll(".mode-chip");
const heroLead = document.querySelector("#hero-lead");
const modeNote = document.querySelector("#mode-note");
const modeCta = document.querySelector("#mode-cta");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let typewriterTimer;

document.documentElement.classList.add("js-ready");

year.textContent = new Date().getFullYear();

const closeMenu = () => {
  navLinks.classList.remove("open");
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
};

const updateScrollState = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

  header.classList.toggle("is-scrolled", window.scrollY > 8);
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
};

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navItems.forEach((item) => {
  item.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeCommandPalette();
  }
});

const sections = [...navItems]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => observer.observe(section));

const revealTargets = document.querySelectorAll(
  ".hero-copy, .profile-panel, .split-layout > *, .section-heading, .skill-card, .lab-copy, .orbit-shell, .project-visual, .ml-project-visual, .kitchen-project-visual, .project-showcase-visual, .project-content, .education-grid > *, .mini-card, .contact-grid > *"
);

revealTargets.forEach((target, index) => {
  target.classList.add("reveal");
  target.style.setProperty("--reveal-delay", `${(index % 3) * 80}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12,
  }
);

revealTargets.forEach((target) => revealObserver.observe(target));

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();

const modeContent = {
  recruiter: {
    lead: "I build efficient web solutions, analyze data for useful insights, and design user-friendly digital experiences.",
    note: "Focused on internship readiness, strong fundamentals, and reliable teamwork.",
    cta: "Email for Opportunity",
  },
  collaborator: {
    lead: "I enjoy collaborating on practical products where clean frontend work and useful data logic improve real workflows.",
    note: "Best fit for student teams, hackathons, and project partnerships.",
    cta: "Lets Build Together",
  },
  mentor: {
    lead: "I am continuously learning in CSE and applying new skills in web development, data analysis, and UI/UX practice.",
    note: "Open to feedback, mentorship, and growth-focused technical guidance.",
    cta: "Share Guidance",
  },
};

const typeHeroLead = (text) => {
  if (!heroLead) return;

  window.clearInterval(typewriterTimer);
  heroLead.textContent = "";
  heroLead.classList.remove("is-switching");

  if (reduceMotion) {
    heroLead.textContent = text;
    return;
  }

  let characterIndex = 0;
  heroLead.classList.add("is-typing");
  typewriterTimer = window.setInterval(() => {
    heroLead.textContent += text.charAt(characterIndex);
    characterIndex += 1;

    if (characterIndex >= text.length) {
      window.clearInterval(typewriterTimer);
      heroLead.classList.remove("is-typing");
    }
  }, 55);
};
const applyMode = (modeKey, options = { persist: true }) => {
  const mode = modeContent[modeKey];
  if (!mode || !heroLead || !modeNote || !modeCta) return;

  modeChips.forEach((chip) => {
    const isActive = chip.dataset.mode === modeKey;
    chip.classList.toggle("active", isActive);
    chip.setAttribute("aria-selected", String(isActive));
  });

  modeNote.classList.add("is-switching");
  heroLead.classList.add("is-switching");

  window.setTimeout(() => {
    typeHeroLead(mode.lead);
    modeNote.textContent = mode.note;
    modeCta.innerHTML = `${mode.cta} <span class="button-arrow" aria-hidden="true"></span>`;

    modeNote.classList.remove("is-switching");
    heroLead.classList.remove("is-switching");
  }, 170);

  if (options.persist) {
    try {
      window.localStorage.setItem("portfolio_mode", modeKey);
    } catch {
      // no-op if storage is unavailable
    }
  }
};

if (modeChips.length > 0) {
  let initialMode = "recruiter";
  try {
    const savedMode = window.localStorage.getItem("portfolio_mode");
    if (savedMode && modeContent[savedMode]) initialMode = savedMode;
  } catch {
    // no-op
  }

  applyMode(initialMode, { persist: false });

  modeChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const mode = chip.dataset.mode;
      if (mode) applyMode(mode);
    });
  });
}

const openCommandPalette = () => {
  if (!commandPalette) return;
  commandPalette.hidden = false;
  commandToggle?.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => commandSearch?.focus());
};

const closeCommandPalette = () => {
  if (!commandPalette) return;
  commandPalette.hidden = true;
  commandToggle?.setAttribute("aria-expanded", "false");
};

const executeCommandAction = async (button) => {
  const action = button.dataset.action;
  const target = button.dataset.target;

  if (action === "jump" && target) {
    const targetEl = document.querySelector(target);
    if (targetEl) targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (action === "email") {
    window.location.href = "mailto:ahmedmofty12@gmail.com";
  }

  if (action === "phone") {
    window.location.href = "tel:+8801521729674";
  }

  if (action === "github") {
    window.open("https://github.com/showketahamed", "_blank", "noopener,noreferrer");
  }

  if (action === "open-cv") {
    window.open("assets/docs/Showket_Ahamed_CV.pdf", "_blank", "noopener,noreferrer");
  }

  if (action === "copy-email") {
    try {
      await navigator.clipboard.writeText("ahmedmofty12@gmail.com");
    } catch {
      window.prompt("Copy this email:", "ahmedmofty12@gmail.com");
    }
  }

  closeCommandPalette();
};

if (commandToggle && commandPalette && commandList) {
  commandToggle.addEventListener("click", () => {
    if (commandPalette.hidden) openCommandPalette();
    else closeCommandPalette();
  });

  commandPalette.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const closeTrigger = target.closest("[data-close-palette]");
    if (closeTrigger) {
      closeCommandPalette();
      return;
    }

    const actionButton = target.closest("[data-action]");
    if (actionButton instanceof HTMLButtonElement) {
      executeCommandAction(actionButton);
    }
  });

  commandSearch?.addEventListener("input", () => {
    const query = commandSearch.value.trim().toLowerCase();
    const buttons = commandList.querySelectorAll("button[data-action]");

    buttons.forEach((button) => {
      const text = button.textContent?.toLowerCase() || "";
      button.hidden = Boolean(query) && !text.includes(query);
    });
  });

  document.addEventListener("keydown", (event) => {
    const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
    if (!isShortcut) return;
    event.preventDefault();
    if (commandPalette.hidden) openCommandPalette();
    else closeCommandPalette();
  });
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please complete all fields before sending.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  formStatus.textContent = "Opening your email app...";
  window.location.href = `mailto:ahmedmofty12@gmail.com?subject=${subject}&body=${body}`;
  contactForm.reset();
});
