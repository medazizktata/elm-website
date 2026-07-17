(function () {
  "use strict";

  var LOCALE_KEY = "elm-locale";
  var CACHE_PREFIX = "elm-locale-bundle-v3-";
  var BUNDLE_VERSION = "3";
  var SUPPORTED = ["en", "ar"];
  var DEFAULT_LOCALE = "en";
  var bundles = {};
  var currentLocale = DEFAULT_LOCALE;
  var defaultsCaptured = false;

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

  function readBundleCache(locale) {
    try {
      var raw = localStorage.getItem(CACHE_PREFIX + locale);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function writeBundleCache(locale, data) {
    if (!data || typeof data !== "object") return;
    try {
      localStorage.setItem(CACHE_PREFIX + locale, JSON.stringify(data));
    } catch (e) {}
  }

  function applyHtmlAttrs(locale) {
    var root = document.documentElement;
    root.setAttribute("lang", locale);
    root.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    if (locale === "en") {
      root.classList.remove("elm-i18n-pending");
    } else {
      root.classList.add("elm-i18n-pending");
    }
  }

  function markReady() {
    var root = document.documentElement;
    root.classList.add("elm-i18n-ready");
    root.classList.remove("elm-i18n-pending");
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

  function purgeLegacyCaches() {
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("elm-locale-bundle") === 0 && k.indexOf(CACHE_PREFIX) !== 0) {
          keys.push(k);
        }
      }
      keys.forEach(function (k) {
        localStorage.removeItem(k);
      });
    } catch (e) {}
  }

  function loadBundle(locale, revalidate) {
    if (!revalidate && bundles[locale]) return Promise.resolve(bundles[locale]);
    return fetch("locales/" + locale + ".json?v=" + BUNDLE_VERSION, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("Locale bundle unavailable: " + locale);
        return res.json();
      })
      .then(function (data) {
        bundles[locale] = data;
        writeBundleCache(locale, data);
        return data;
      })
      .catch(function () {
        bundles[locale] = bundles[locale] || readBundleCache(locale) || {};
        return bundles[locale];
      });
  }

  function t(key, locale) {
    locale = locale || currentLocale;
    var value = getNested(bundles[locale], key);
    if (value) return value;
    // Prefer empty so callers can use data-i18n-default; only fall back to EN
    // when the active locale bundle is missing the key entirely.
    if (locale !== "en") {
      value = getNested(bundles.en, key);
      if (value) return value;
    }
    return "";
  }

  function captureDefaults() {
    if (defaultsCaptured) return;
    defaultsCaptured = true;

    [
      ["data-i18n", "text"],
      ["data-i18n-html", "html"],
      ["data-i18n-placeholder", "placeholder"],
      ["data-i18n-aria", "aria"],
      ["data-i18n-value", "value"],
    ].forEach(function (pair) {
      var attr = pair[0];
      var kind = pair[1];
      document.querySelectorAll("[" + attr + "]").forEach(function (el) {
        if (el.hasAttribute("data-i18n-default")) return;
        if (kind === "html") el.setAttribute("data-i18n-default", el.innerHTML);
        else if (kind === "placeholder") el.setAttribute("data-i18n-default", el.getAttribute("placeholder") || "");
        else if (kind === "aria") el.setAttribute("data-i18n-default", el.getAttribute("aria-label") || "");
        else if (kind === "value") el.setAttribute("data-i18n-default", el.getAttribute("value") || "");
        else el.setAttribute("data-i18n-default", el.textContent);
      });
    });
  }

  function resolveValue(key) {
    var value = t(key, currentLocale);
    if (value) return value;
    if (currentLocale === "en") return "";
    return t(key, "en");
  }

  function applyAttr(keyAttr, attr) {
    document.querySelectorAll("[" + keyAttr + "]").forEach(function (el) {
      var key = el.getAttribute(keyAttr);
      var value = resolveValue(key);
      if (!value) {
        var fallback = el.getAttribute("data-i18n-default");
        if (fallback != null) {
          if (attr === "textContent") el.textContent = fallback;
          else if (attr === "innerHTML") el.innerHTML = fallback;
          else el.setAttribute(attr, fallback);
        }
        return;
      }
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

    var siteName = "ELM Media Design";
    var prefix = "pages." + pageId + ".meta.";
    var title = resolveValue(prefix + "title");
    var description = resolveValue(prefix + "description");

    if (title) {
      if (pageId !== "index" && title.indexOf(siteName) === -1) {
        title = title + " | " + siteName;
      }
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
    captureDefaults();
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
    return Promise.all([
      loadBundle("en", true),
      locale !== "en" ? loadBundle(locale, true) : Promise.resolve(),
    ]);
  }

  function setLocale(locale) {
    if (SUPPORTED.indexOf(locale) === -1) locale = DEFAULT_LOCALE;
    currentLocale = locale;
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch (e) {}
    applyHtmlAttrs(locale);

    if (locale !== "en") {
      document.documentElement.classList.remove("elm-i18n-ready");
      document.documentElement.classList.add("elm-i18n-pending");
    } else {
      markReady();
    }

    return loadBundles(locale).then(function () {
      applyLocale();
      markReady();
    });
  }

  function init() {
    purgeLegacyCaches();
    currentLocale = readStoredLocale();
    applyHtmlAttrs(currentLocale);
    captureDefaults();

    return loadBundles(currentLocale).then(function () {
      applyLocale();
      markReady();
    });
  }

  var localeSwitching = false;

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-locale]");
    if (!btn) return;
    e.preventDefault();
    var locale = btn.getAttribute("data-locale");
    if (!locale || locale === currentLocale || localeSwitching) return;

    localeSwitching = true;
    var loader = document.querySelector(".page-loader");
    var fadeInMs = 550;
    var holdMs = 480;

    if (loader) loader.classList.add("is-active");

    // Cover the page first, then swap locale under the loader
    setTimeout(function () {
      setLocale(locale).then(function () {
        setTimeout(function () {
          if (loader) loader.classList.remove("is-active");
          localeSwitching = false;
        }, holdMs);
      });
    }, fadeInMs);
  });

  window.ElmI18n = { getLocale: getLocale, setLocale: setLocale, t: t, init: init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
