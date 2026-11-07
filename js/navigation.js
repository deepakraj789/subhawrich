// Smooth section navigation, active-section tracking, and hide-on-down/show-on-up navbar.
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("main-navbar");
  const navButtons = Array.from(document.querySelectorAll("[data-section]"));
  const sections = navButtons
    .map(button => document.getElementById(`section-${button.dataset.section}`))
    .filter(Boolean);

  if (!navbar || navButtons.length === 0 || sections.length === 0) return;

  let lastScrollY = window.scrollY;
  let isProgrammaticScroll = false;
  let navigationFallbackTimer;

  function setActiveSection(sectionId) {
    navButtons.forEach(button => {
      const isActive = button.dataset.section === sectionId;
      button.classList.toggle("active-nav", isActive);

      if (isActive) {
        button.setAttribute("aria-current", "location");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  // The section crossing this line is treated as the current section.
  function updateActiveSection() {
    const marker = window.innerHeight * 0.42;
    let currentSection = sections[0];

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) {
        currentSection = section;
      } else {
        break;
      }
    }

    setActiveSection(currentSection.id.replace("section-", ""));
  }

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      const target = document.getElementById(`section-${button.dataset.section}`);
      if (!target) return;

      // Keep the navbar visible while completing a navigation-button scroll.
      isProgrammaticScroll = true;
      navbar.classList.remove("nav-hidden");
      setActiveSection(button.dataset.section);
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      window.clearTimeout(navigationFallbackTimer);
      navigationFallbackTimer = window.setTimeout(() => {
        isProgrammaticScroll = false;
        lastScrollY = window.scrollY;
      }, 1800);
    });
  });

  // Modern browsers fire scrollend when smooth scrolling has finished.
  window.addEventListener("scrollend", () => {
    isProgrammaticScroll = false;
    window.clearTimeout(navigationFallbackTimer);
    lastScrollY = window.scrollY;
    updateActiveSection();
  });

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 10) {
      navbar.classList.remove("nav-hidden");
    } else if (!isProgrammaticScroll) {
      if (currentScrollY > lastScrollY + 3) {
        navbar.classList.add("nav-hidden");
      } else if (currentScrollY < lastScrollY - 3) {
        navbar.classList.remove("nav-hidden");
      }
    }

    lastScrollY = currentScrollY;
    updateActiveSection();
  }, { passive: true });

  updateActiveSection();
});
