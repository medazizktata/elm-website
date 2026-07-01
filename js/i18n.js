(function () {
  "use strict";

  var LOCALE_KEY = "elm-locale";
  var SUPPORTED = ["en", "ar"];
  var DEFAULT_LOCALE = "en";
  var bundles = {};
  var currentLocale = DEFAULT_LOCALE;

  function getLocale() {
    return currentLocale;
  }

  function readStoredLocale() {
    try {
      var stored = localStorage.getItem(LOCALE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {}
    return DEFAULT_LOCALE;
  }

  function applyHtmlAttrs(locale) {
    var root = document.documentElement;
    root.setAttribute("lang", locale);
    root.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
  }

  function getNested(obj, key) {
    if (!obj || !key) return undefined;
    var parts = key.split(".");
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== "object") return undefined;
      cur = cur[parts[i]];
    }
    return typeof cur === "string" ? cur : undefined;
  }

  function loadBundle(locale) {
    if (bundles[locale]) return Promise.resolve(bundles[locale]);
    return fetch("locales/" + locale + ".json", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("Locale bundle unavailable: " + locale);
        return res.json();
      })
      .then(function (data) {
        bundles[locale] = data;
        return data;
      })
      .catch(function () {
        bundles[locale] = {};
        return bundles[locale];
      });
  }

  function t(key, locale) {
    locale = locale || currentLocale;
    var value = getNested(bundles[locale], key);
    if (value) return value;
    if (locale !== "en") {
      value = getNested(bundles.en, key);
      if (value) return value;
    }
    return "";
  }

  function applyAttr(keyAttr, attr) {
    var nodes = document.querySelectorAll("[" + keyAttr + "]");
    nodes.forEach(function (el) {
      var key = el.getAttribute(keyAttr);
      var value = t(key);
      if (!value) return;
      if (attr === "textContent") el.textContent = value;
      else if (attr === "innerHTML") el.innerHTML = value;
      else el.setAttribute(attr, value);
    });
  }

  function setMetaContent(selector, content) {
    var el = document.querySelector(selector);
    if (el && content) el.setAttribute("content", content);
  }

  function applyPageMeta() {
    var pageId = document.documentElement.getAttribute("data-page");
    if (!pageId) return;

    var prefix = "pages." + pageId + ".meta.";
    var title = t(prefix + "title");
    var description = t(prefix + "description");

    if (title) {
      document.title = title;
      setMetaContent('meta[property="og:title"]', title);
      setMetaContent('meta[name="twitter:title"]', title);
    }
    if (description) {
      setMetaContent('meta[name="description"]', description);
      setMetaContent('meta[property="og:description"]', description);
      setMetaContent('meta[name="twitter:description"]', description);
    }
  }

  function applyLocale() {
    applyAttr("data-i18n", "textContent");
    applyAttr("data-i18n-html", "innerHTML");
    applyAttr("data-i18n-placeholder", "placeholder");
    applyAttr("data-i18n-aria", "aria-label");
    applyAttr("data-i18n-value", "value");
    applyPageMeta();
    updateSwitcher();
    document.dispatchEvent(
      new CustomEvent("elm:localechange", { detail: { locale: currentLocale } })
    );
  }

  function updateSwitcher() {
    document.querySelectorAll("[data-locale]").forEach(function (btn) {
      var loc = btn.getAttribute("data-locale");
      var isActive = loc === currentLocale;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      btn.classList.toggle("is-active", isActive);
    });
  }

  function loadBundles(locale) {
    var tasks = [loadBundle("en")];
    if (locale !== "en") tasks.push(loadBundle(locale));
    return Promise.all(tasks);
  }

  function setLocale(locale) {
    if (SUPPORTED.indexOf(locale) === -1) locale = DEFAULT_LOCALE;
    currentLocale = locale;
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch (e) {}
    applyHtmlAttrs(locale);
    return loadBundles(locale).then(applyLocale);
  }

  function init() {
    currentLocale = readStoredLocale();
    applyHtmlAttrs(currentLocale);
    return loadBundles(currentLocale).then(applyLocale);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-locale]");
    if (!btn) return;
    e.preventDefault();
    var locale = btn.getAttribute("data-locale");
    if (locale && locale !== currentLocale) setLocale(locale);
  });

  window.ElmI18n = { getLocale: getLocale, setLocale: setLocale, t: t, init: init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
