// Simple enhancements: mobile nav toggle, smooth-ish scroll offset, dynamic year

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("nav-open");
    });
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const targetEl = targetId ? document.querySelector(targetId) : null;
      if (!targetEl) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const rect = targetEl.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - headerHeight - 8;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });

      // Close mobile nav after clicking
      if (nav.classList.contains("nav-open")) {
        nav.classList.remove("nav-open");
      }
    });
  });
});


