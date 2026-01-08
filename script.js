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

  // Scroll reveal animations (lightweight, no libraries).
  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  )?.matches;

  const supportsIntersectionObserver = "IntersectionObserver" in window;

  const revealEls = Array.from(
    document.querySelectorAll(
      [
        ".section",
        ".card",
        ".step",
        ".client-pill",
        ".video-shell",
        ".profile-card",
        ".metric-card",
        ".contact-link",
      ].join(",")
    )
  );

  // If reduced motion is preferred (or IO isn't supported), just show everything.
  if (prefersReducedMotion || !supportsIntersectionObserver) {
    revealEls.forEach((el) => {
      el.classList.add("reveal-visible");
    });
  } else {
    revealEls.forEach((el) => {
      el.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("reveal-visible");
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealEls.forEach((el, idx) => {
      // Small stagger to make the page feel more alive.
      el.style.transitionDelay = `${Math.min(idx * 35, 280)}ms`;
      observer.observe(el);
    });
  }

  // Lazy-load the heavy MP4 so initial page load stays fast.
  const videos = Array.from(document.querySelectorAll("video.video-player"));
  const hydrateVideo = (video) => {
    if (video.dataset.hydrated === "true") return;
    video.dataset.hydrated = "true";

    // Start fetching just enough to show the first frame when near viewport.
    video.preload = "metadata";
    video.load();

    // Nudge to a renderable frame (some browsers show black at t=0).
    const nudgeToFirstFrame = () => {
      try {
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = Math.min(0.05, Math.max(0, video.duration - 0.05));
        } else {
          video.currentTime = 0.05;
        }
      } catch (_) {
        // Ignore; browser may block seek until enough is buffered.
      }
    };

    video.addEventListener("loadedmetadata", nudgeToFirstFrame, { once: true });
  };

  if (!videos.length) return;

  if (!supportsIntersectionObserver) {
    // Fallback: keep it simple.
    videos.forEach(hydrateVideo);
    return;
  }

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrateVideo(entry.target);
        videoObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.01, rootMargin: "400px 0px 400px 0px" }
  );

  videos.forEach((video) => videoObserver.observe(video));
});






