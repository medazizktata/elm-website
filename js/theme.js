(function () {
  "use strict";

  var STORAGE_KEY = "elm-theme";

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }

  function updateMeta(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#121212" : "#BD1F71");
  }

  function updateToggle(theme) {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    var isDark = theme === "dark";
    btn.setAttribute("aria-pressed", isDark ? "true" : "false");
    btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    var sun = btn.querySelector(".theme-icon-light");
    var moon = btn.querySelector(".theme-icon-dark");
    if (sun) sun.hidden = isDark;
    if (moon) moon.hidden = !isDark;
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    updateMeta(theme);
    updateToggle(theme);
  }

  function toggleTheme() {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  }

  function bind() {
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.addEventListener("click", toggleTheme);
    updateToggle(getTheme());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
