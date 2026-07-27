const DESKTOP_MQ = "(min-width: 1024px)";

function signalHero3dReady() {
  window.__elmHero3dReady = true;
  window.dispatchEvent(new CustomEvent("elm:hero3dready"));
}

function prefersDesktop3d() {
  return window.matchMedia(DESKTOP_MQ).matches;
}

function setStaticLogoMode(mount) {
  mount.classList.add("hero__logo3d--static");
  signalHero3dReady();
}

async function loadDesktop3d(mount) {
  mount.classList.remove("hero__logo3d--static");
  try {
    const mod = await import("./hero-logo-3d.js");
    mod.initHeroLogo3D(mount);
  } catch {
    setStaticLogoMode(mount);
  }
}

function boot() {
  const mount = document.querySelector(".hero__logo3d");
  if (!mount) {
    signalHero3dReady();
    return;
  }

  if (prefersDesktop3d()) {
    loadDesktop3d(mount);
    return;
  }

  setStaticLogoMode(mount);

  const desktop = window.matchMedia(DESKTOP_MQ);
  const onChange = (event) => {
    if (!event.matches) return;
    desktop.removeEventListener("change", onChange);
    loadDesktop3d(mount);
  };
  desktop.addEventListener("change", onChange);
}

boot();
