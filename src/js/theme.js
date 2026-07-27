(function () {
  "use strict";

  var STORAGE_KEY = "elm-theme";

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function updateMeta(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#121212" : "#BD1F71");
  }

  function updateToggle(theme) {
    var isDark = theme === "dark";
    var labelLight = "Switch to light mode";
    var labelDark = "Switch to dark mode";
    var buttons = document.querySelectorAll(".theme-toggle");
    buttons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
      btn.setAttribute("aria-label", isDark ? labelLight : labelDark);
      var sun = btn.querySelector(".theme-icon-light");
      var moon = btn.querySelector(".theme-icon-dark");
      if (sun) sun.hidden = isDark;
      if (moon) moon.hidden = !isDark;
      var toLight = btn.querySelector(".theme-toggle__label--to-light");
      var toDark = btn.querySelector(".theme-toggle__label--to-dark");
      if (toLight) toLight.hidden = !isDark;
      if (toDark) toDark.hidden = isDark;
    });
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
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", toggleTheme);
    });
    updateToggle(getTheme());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
