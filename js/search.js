(function () {
  "use strict";

  var DEBOUNCE_MS = 120;
  var MAX_RESULTS = 8;

  var index = null;
  var indexPromise = null;
  var debounceTimer = null;
  var activeIndex = -1;
  var lastResults = [];

  var els = {};

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (indexPromise) return indexPromise;

    indexPromise = fetch("js/search-index.json", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("Search index unavailable");
        return res.json();
      })
      .then(function (data) {
        index = data;
        return index;
      })
      .catch(function () {
        index = { items: [], quickLinks: [] };
        return index;
      });

    return indexPromise;
  }

  function normalize(text) {
    return (text || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function scoreItem(item, terms) {
    var blob = normalize(
      [item.title, item.heading, item.subtitle, item.description, item.excerpt]
        .concat(item.keywords || [])
        .join(" ")
    );
    var score = 0;

    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      if (!term) continue;
      if (normalize(item.title).indexOf(term) !== -1) score += 12;
      if (normalize(item.heading).indexOf(term) !== -1) score += 10;
      if ((item.keywords || []).some(function (k) { return normalize(k).indexOf(term) !== -1; })) score += 7;
      if (normalize(item.description).indexOf(term) !== -1) score += 5;
      if (blob.indexOf(term) !== -1) score += 2;
    }

    return score;
  }

  function search(query) {
    var q = normalize(query);
    if (!q || !index) return [];

    var terms = q.split(" ").filter(Boolean);
    return index.items
      .map(function (item) {
        return { item: item, score: scoreItem(item, terms) };
      })
      .filter(function (row) {
        return row.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .slice(0, MAX_RESULTS)
      .map(function (row) {
        return row.item;
      });
  }

  function highlight(text, query) {
    var safe = (text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var terms = normalize(query).split(" ").filter(Boolean);
    if (!terms.length) return safe;

    terms.forEach(function (term) {
      if (term.length < 2) return;
      var re = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      safe = safe.replace(re, "<mark>$1</mark>");
    });

    return safe;
  }

  function resultHtml(item, query) {
    var excerpt = item.excerpt || item.description || item.subtitle || "";
    if (excerpt.length > 120) excerpt = excerpt.slice(0, 117) + "…";

    return (
      '<a class="search-result" role="option" href="' +
      item.url +
      '" data-url="' +
      item.url +
      '">' +
      '<span class="search-result__meta">' +
      '<span class="search-result__category">' +
      (item.category || "Page") +
      "</span>" +
      "</span>" +
      '<span class="search-result__title">' +
      highlight(item.heading || item.title, query) +
      "</span>" +
      (excerpt ? '<span class="search-result__excerpt">' + highlight(excerpt, query) + "</span>" : "") +
      '<i class="lni lni-arrow-right search-result__arrow" aria-hidden="true"></i>' +
      "</a>"
    );
  }

  function quickLinkHtml(item) {
    return (
      '<a class="search-result" role="option" href="' +
      item.url +
      '" data-url="' +
      item.url +
      '">' +
      '<span class="search-result__title">' +
      item.title +
      "</span>" +
      '<i class="lni lni-arrow-right search-result__arrow" aria-hidden="true"></i>' +
      "</a>"
    );
  }

  function renderResults(query) {
    var q = (query || "").trim();
    var html = "";
    activeIndex = -1;

    if (!q) {
      lastResults = (index && index.quickLinks) || [];
      html = lastResults.map(quickLinkHtml).join("");
      els.results.innerHTML = html;
      els.panel.classList.remove("has-query");
      return;
    }

    lastResults = search(q);
    html = lastResults.map(function (item) {
      return resultHtml(item, q);
    }).join("");

    els.results.innerHTML = html;
    els.panel.classList.add("has-query");
  }

  function setActive(indexValue) {
    var links = els.results.querySelectorAll(".search-result");
    if (!links.length) {
      activeIndex = -1;
      return;
    }

    activeIndex = Math.max(0, Math.min(indexValue, links.length - 1));
    links.forEach(function (link, i) {
      link.classList.toggle("is-active", i === activeIndex);
    });
    links[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function openSearch() {
    loadIndex().then(function () {
      els.box.classList.add("active");
      els.box.setAttribute("aria-hidden", "false");
      els.trigger.setAttribute("aria-expanded", "true");
      document.body.classList.add("overflow");
      renderResults("");
      window.setTimeout(function () {
        els.input.focus();
        els.input.select();
      }, 50);
    });
  }

  function closeSearch() {
    els.box.classList.remove("active");
    els.box.setAttribute("aria-hidden", "true");
    els.trigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow");
    els.input.value = "";
    activeIndex = -1;
    lastResults = [];
    els.trigger.focus();
  }

  function navigateToActive() {
    if (activeIndex < 0) {
      var first = els.results.querySelector(".search-result");
      if (first) first.click();
      return;
    }
    var links = els.results.querySelectorAll(".search-result");
    if (links[activeIndex]) links[activeIndex].click();
  }

  function onInput() {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(function () {
      renderResults(els.input.value);
    }, DEBOUNCE_MS);
  }

  function bind() {
    els.box = $("#site-search");
    if (!els.box) return;

    els.trigger = $(".navbar .search-toggle");
    els.input = $("#site-search-input");
    els.results = $("#site-search-results");
    els.panel = $(".search-panel");
    els.close = $(".search-close");
    els.backdrop = $(".search-backdrop");

    els.trigger.addEventListener("click", function (e) {
      e.preventDefault();
      if (els.box.classList.contains("active")) closeSearch();
      else openSearch();
    });

    els.close.addEventListener("click", closeSearch);
    els.backdrop.addEventListener("click", closeSearch);

    els.input.addEventListener("input", onInput);

    els.input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(activeIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(activeIndex <= 0 ? 0 : activeIndex - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        navigateToActive();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeSearch();
      }
    });

    els.results.addEventListener("mousemove", function (e) {
      var link = e.target.closest(".search-result");
      if (!link) return;
      var links = Array.prototype.slice.call(els.results.querySelectorAll(".search-result"));
      setActive(links.indexOf(link));
    });

    document.addEventListener("keydown", function (e) {
      var mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (els.box.classList.contains("active")) closeSearch();
        else openSearch();
      } else if (e.key === "Escape" && els.box.classList.contains("active")) {
        closeSearch();
      }
    });

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-open-search]");
      if (!trigger) return;
      e.preventDefault();
      openSearch();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
