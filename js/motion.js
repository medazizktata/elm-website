(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var HEAD_SELECTORS = [
    ".section-title",
    ".feature-cards-section__head > :not(.feature-cards-section__lede)",
    ".capability-section__head .section-title",
    ".sectors-grid__intro > :not(p)",
    ".about-intro__eyebrow",
    ".about-intro__content > h2",
    ".also-explore__head",
    ".sticky-stack-section__head > :not(.sticky-stack-section__lede)",
    ".process-section__intro",
    ".compare-section__head .section-title",
    ".page-header h1",
    ".page-header .page-breadcrumb",
  ].join(",");

  var ITEM_SELECTORS = [
    ".capability-card",
    ".stats-row__item",
    ".sector-card",
    ".feature-cards > li",
    ".portfolio-card",
    ".project-card",
    ".also-explore__card",
    ".about-intro__media",
    ".about-intro__facts > li",
    ".tech-preview-card",
    ".process-step",
    ".director-team",
    ".core-values-box",
    ".news-box",
    ".contact-box",
  ].join(",");

  var SKIP_ANCESTOR =
    ".navbar, .side-widget, .footer, .footer-bar, .search-overlay, .contact-form, .testimonials-slider, .sticky-stack__item";

  function inSkipZone(el) {
    return el.closest(SKIP_ANCESTOR);
  }

  function markReveal(el, variant, index) {
    if (!el || el.classList.contains("elm-reveal")) return;
    el.classList.add("elm-reveal");
    if (variant) el.classList.add("elm-reveal--" + variant);
    var i = Math.min(index || 0, 4);
    el.style.setProperty("--elm-motion-i", String(i));
  }

  function collectRevealTargets() {
    var seen = new WeakSet();
    var targets = [];

    function addAll(selector, variant) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (seen.has(el) || inSkipZone(el)) return;
        seen.add(el);
        markReveal(el, variant, 0);
        targets.push({ el: el, variant: variant });
      });
    }

    addAll(HEAD_SELECTORS, "head");
    addAll(ITEM_SELECTORS, "item");
    addAll(".compare-table", "fade");

    var staggerParents = [
      ".capability-section__grid",
      ".stats-row__grid",
      ".sectors-grid__grid",
      ".feature-cards",
      ".about-intro__facts",
      ".process-steps",
      ".also-explore__grid",
      ".row:has(.tech-preview-card)",
      ".row:has(.portfolio-card)",
    ];

    staggerParents.forEach(function (parentSel) {
      document.querySelectorAll(parentSel).forEach(function (parent) {
        var items = parent.querySelectorAll(".elm-reveal--item");
        items.forEach(function (item, i) {
          item.style.setProperty("--elm-motion-i", String(Math.min(i, 4)));
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
          }, 80 + idx * 90);
        })(j);
      }
    });
  }

  function initPageHeader() {
    var header = document.querySelector(".page-header .container");
    if (!header) return;

    var parts = header.querySelectorAll("h1, .page-breadcrumb");
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
          }, 60 + i * 80);
        });
      });
    }
  }

  function initScrollReveal(targets) {
    if (prefersReduced) {
      targets.forEach(function (t) {
        revealNow(t.el);
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
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
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    targets.forEach(function (t) {
      if (t.el.closest(".hero") || t.el.closest(".page-header")) return;
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
