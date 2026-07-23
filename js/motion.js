(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SECTION_SELECTORS = [
    ".content-section",
    ".engagement-section",
    ".stats-row.content-section",
  ].join(",");

  var HEAD_SELECTORS = [
    ".section-title",
    ".feature-cards-section__head",
    ".capability-section__head",
    ".sectors-grid__intro",
    ".about-intro__eyebrow",
    ".about-intro__content > h2",
    ".also-explore__head",
    ".sticky-stack-section__head",
    ".process-section__head",
    ".tech-spec-section__head",
    ".compare-section__head",
    ".stats-row__head",
    ".stats-row__title",
    ".stats-row__eyebrow",
    ".home-why-hub__eyebrow",
    ".home-why-hub__title",
    ".technology-partners__head",
    ".sustainability-commitment__head",
    ".engagement-section__head",
    ".glass-panel__eyebrow",
    ".glass-panel__title",
    ".page-header h1",
    ".page-header__lede",
  ].join(",");

  var ITEM_SELECTORS = [
    ".capability-card",
    ".stats-row__item",
    ".sectors-index__item",
    ".engagement-timeline__step",
    ".feature-cards > li",
    ".portfolio-card",
    ".project-card",
    ".also-explore__card",
    ".about-intro__media",
    ".sectors-grid__media",
    ".about-intro__facts > li",
    ".tech-preview-card",
    ".tech-routes__item",
    ".spec-card",
    ".technology-partners__card",
    ".sticky-stack__item",
    ".policy-rail__item",
    ".process-step",
    ".sustainability-commitment__card",
    ".director-team",
    ".core-values-box",
    ".news-box",
    ".contact-box",
    ".glass-panel",
    ".applications-panel",
    ".print-capabilities__item",
    ".case-study-card",
    ".metric-stage__card",
    ".home-why-hub__card",
    ".sector-card",
  ].join(",");

  var SKIP_ANCESTOR =
    ".navbar, .side-widget, .footer, .footer-bar, .search-box, .contact-form, .testimonials-slider, .story-timeline__scroller, .page-loader";

  function inSkipZone(el) {
    return el.closest(SKIP_ANCESTOR);
  }

  function markReveal(el, variant, index) {
    if (!el || el.classList.contains("elm-reveal")) return;
    el.classList.add("elm-reveal");
    if (variant) el.classList.add("elm-reveal--" + variant);
    var i = Math.min(index || 0, 6);
    el.style.setProperty("--elm-motion-i", String(i));
  }

  function collectRevealTargets() {
    var seen = new WeakSet();
    var targets = [];

    function addAll(selector, variant) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (seen.has(el) || inSkipZone(el)) return;
        // Don't double-wrap if a parent section is already the target and this is nested content
        // still allow heads/items inside sections
        seen.add(el);
        markReveal(el, variant, 0);
        targets.push({ el: el, variant: variant });
      });
    }

    addAll(SECTION_SELECTORS, "section");
    addAll(HEAD_SELECTORS, "head");
    addAll(ITEM_SELECTORS, "item");
    addAll(".compare-table, .story-timeline__frame", "fade");

    var staggerParents = [
      ".capability-section__grid",
      ".stats-row__grid",
      ".sectors-index",
      ".feature-cards",
      ".about-intro__facts",
      ".process-steps",
      ".policy-rail",
      ".also-explore__grid",
      ".tech-spec-grid",
      ".tech-routes",
      ".technology-partners__grid",
      ".sticky-stack",
      ".sustainability-commitment__grid",
      ".row:has(.tech-preview-card)",
      ".row:has(.portfolio-card)",
      ".row:has(.capability-card)",
      ".row:has(.contact-box)",
    ];

    staggerParents.forEach(function (parentSel) {
      document.querySelectorAll(parentSel).forEach(function (parent) {
        var items = parent.querySelectorAll(".elm-reveal--item");
        items.forEach(function (item, i) {
          item.style.setProperty("--elm-motion-i", String(Math.min(i, 6)));
        });
      });
    });

    return targets;
  }

  function revealNow(el) {
    el.classList.add("is-visible");
  }

  function initHero() {
    var inner = document.querySelector(".hero__inner");
    if (!inner) return;

    var kids = inner.children;
    for (var i = 0; i < kids.length; i++) {
      markReveal(kids[i], "hero", i);
      if (prefersReduced) revealNow(kids[i]);
    }

    if (prefersReduced) return;

    requestAnimationFrame(function () {
      for (var j = 0; j < kids.length; j++) {
        (function (idx) {
          setTimeout(function () {
            revealNow(kids[idx]);
          }, 90 + idx * 100);
        })(j);
      }
    });
  }

  function initPageHeader() {
    var header = document.querySelector(".page-header .container");
    if (!header) return;

    var parts = [];
    var h1 = header.querySelector("h1");
    if (h1) parts.push(h1);
    header.querySelectorAll(".page-breadcrumb a, .page-breadcrumb [aria-current='page']").forEach(function (el) {
      parts.push(el);
    });
    var lede = header.querySelector(".page-header__lede");
    if (lede) parts.push(lede);

    parts.forEach(function (el, i) {
      if (!el.classList.contains("elm-reveal")) {
        markReveal(el, "head", i);
      }
      if (prefersReduced) revealNow(el);
    });

    if (!prefersReduced) {
      requestAnimationFrame(function () {
        parts.forEach(function (el, i) {
          setTimeout(function () {
            revealNow(el);
          }, 70 + i * 90);
        });
      });
    }
  }

  function initScrollReveal(targets) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach(function (t) {
        revealNow(t.el);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          revealNow(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.08,
      }
    );

    targets.forEach(function (t) {
      if (t.el.closest(".hero") || t.el.closest(".page-header")) return;
      // Already in view on load — reveal immediately so first fold isn't blank
      var rect = t.el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        revealNow(t.el);
        return;
      }
      observer.observe(t.el);
    });
  }

  function boot() {
    document.documentElement.classList.add("elm-motion-ready");
    initHero();
    initPageHeader();
    var targets = collectRevealTargets();
    initScrollReveal(targets);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
