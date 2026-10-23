const projectDetails = {
  fieldnotes: {
    title: "Fieldnotes",
    category: "Brand identity · Digital · 2025",
    description: "A calmer kind of travel journal. Together with Fieldnotes, I created a warm visual identity and an easy-to-use digital home for stories from the slower road.",
    tags: ["Brand strategy", "Visual identity", "Web design"]
  },
  goodthings: {
    title: "Good Things Studio",
    category: "E-commerce · Art direction · 2025",
    description: "A more considered way to shop small. This flexible storefront brings independent makers together with a distinctive identity and a thoughtful, welcoming shopping experience.",
    tags: ["E-commerce", "Art direction", "Creative development"]
  },
  stilllife: {
    title: "Still / Life",
    category: "Campaign · Photography · 2024",
    description: "An editorial campaign celebrating the beauty in everyday rituals. I shaped the concept, visual direction and digital campaign experience from first moodboard to launch.",
    tags: ["Campaign concept", "Art direction", "Digital"]
  },
  commonplace: {
    title: "Commonplace",
    category: "Product design · Website · 2024",
    description: "A digital workspace for teams doing good work. The new product experience makes shared knowledge easier to find, more enjoyable to use and simpler to make your own.",
    tags: ["Product strategy", "UX / UI", "Prototyping"]
  }
};

document.querySelectorAll("[data-tooltip]").forEach((trigger, index) => {
  const tooltipId = `tooltip-${index + 1}`;
  const tooltip = document.createElement("span");
  tooltip.id = tooltipId;
  tooltip.className = "tooltip-content";
  tooltip.setAttribute("role", "tooltip");
  tooltip.textContent = trigger.dataset.tooltip;
  trigger.setAttribute("aria-describedby", tooltipId);

  if (trigger.matches("input, textarea")) {
    const label = trigger.closest("label");
    label.classList.add("has-tooltip");
    label.dataset.tooltipPosition = trigger.dataset.tooltipPosition || "";
    label.append(tooltip);
  } else {
    trigger.classList.add("has-tooltip");
    trigger.append(tooltip);
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("is-open");
  }
});

const projectDialog = document.querySelector("#project-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogCategory = document.querySelector("#dialog-category");
const dialogDescription = document.querySelector("#dialog-description");
const dialogTags = document.querySelector("#dialog-tags");
const closeDialogButton = document.querySelector(".dialog-close");
let lastProjectTrigger;

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => {
    const details = projectDetails[card.dataset.project];

    if (!details) {
      throw new Error(`Project details not found for "${card.dataset.project}".`);
    }

    lastProjectTrigger = card;
    dialogTitle.textContent = details.title;
    dialogCategory.textContent = details.category;
    dialogDescription.textContent = details.description;
    dialogTags.replaceChildren(...details.tags.map((tag) => {
      const tagElement = document.createElement("span");
      tagElement.textContent = tag;
      return tagElement;
    }));
    projectDialog.showModal();
    document.body.classList.add("dialog-open");
  });
});

function closeProjectDialog() {
  projectDialog.close();
}

closeDialogButton.addEventListener("click", closeProjectDialog);
projectDialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  lastProjectTrigger?.focus();
});
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) {
    closeProjectDialog();
  }
});
projectDialog.querySelector(".dialog-contact").addEventListener("click", closeProjectDialog);

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("#year").textContent = new Date().getFullYear();

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  if (!contactForm.reportValidity()) {
    return;
  }

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const project = formData.get("project").trim();
  const subject = encodeURIComponent(`Project enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject details:\n${project}`);

  formStatus.textContent = "Your email app should open with your message ready to send.";
  window.location.href = `mailto:hello@alexstyles.design?subject=${subject}&body=${body}`;
});
