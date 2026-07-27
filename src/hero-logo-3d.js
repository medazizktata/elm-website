/**
 * ELM monogram (images/logo.svg) extruded into 3D, ported from the Propagenda
 * hero logo (raw three.js). The mark carries the ELM brand gradient (magenta →
 * purple → blue, left→right) baked across its surface, exactly like the topbar
 * logo. Desktop: turns on 3 axes following the mouse. Mobile / no-hover: slow
 * continuous idle rotation. Click it for a full spin + glow on either.
 *
 * Mounts into `.hero__logo3d`. Desktop: full-bleed right-biased overlay. Mobile /
 * tablet: centered square above the hero copy. The container is
 * pointer-events:none so the hero CTAs stay clickable; clicks are caught on
 * `window` and raycast against the logo, so only hits on the mark spin it.
 */
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// ELM brand gradient, official hex codes from the branding guidelines (Color
// Palette, branding PDF p.22) and matching the logo.svg gradient stops/offsets.
const GRADIENT_STOPS = [
  { off: 0.0, color: new THREE.Color(0xbd1f71) }, // magenta  #BD1F71
  { off: 0.47, color: new THREE.Color(0x592c7b) }, // purple   #592C7B
  { off: 0.98, color: new THREE.Color(0x0a76b5) }, // blue     #0A76B5
  { off: 1.0, color: new THREE.Color(0x0a76b5) },
];
const GLOW_COLOR = new THREE.Color(0xffa8d4); // soft pink flash on click

const LOGO_URL = `${import.meta.env.BASE_URL}images/logo.svg`;

// Sample the 3-stop brand gradient at t∈[0,1]. Colours are stored in the working
// linear space; the returned r/g/b go straight into a vertex-colour buffer.
function sampleGradient(t, out) {
  const x = Math.min(1, Math.max(0, t));
  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    const a = GRADIENT_STOPS[i];
    const b = GRADIENT_STOPS[i + 1];
    if (x <= b.off) {
      const span = b.off - a.off;
      return out.copy(a.color).lerp(b.color, span <= 0 ? 0 : (x - a.off) / span);
    }
  }
  return out.copy(GRADIENT_STOPS[GRADIENT_STOPS.length - 1].color);
}

// Bake a left→right gradient across the whole mark as vertex colours, using each
// vertex's X within the mark's overall X extent (t = 0 at the left edge → 1 right).
function applyGradientColors(root) {
  const meshes = [];
  root.traverse((o) => {
    if (o.isMesh) meshes.push(o);
  });
  let minX = Infinity;
  let maxX = -Infinity;
  meshes.forEach((m) => {
    const pos = m.geometry.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + m.position.x;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
  });
  const span = maxX - minX || 1;
  const tmp = new THREE.Color();
  meshes.forEach((m) => {
    const pos = m.geometry.getAttribute('position');
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      sampleGradient((pos.getX(i) + m.position.x - minX) / span, tmp);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    m.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  });
}

export function signalHero3dReady() {
  window.__elmHero3dReady = true;
  window.dispatchEvent(new CustomEvent('elm:hero3dready'));
}

export function initHeroLogo3D(el) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Bail out if the container is collapsed (no layout size yet).
  if (!el.clientWidth || !el.clientHeight) {
    signalHero3dReady();
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, el.clientWidth / el.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9.5);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(el.clientWidth, el.clientHeight);
  renderer.domElement.style.background = 'transparent';
  el.appendChild(renderer.domElement);

  // Studio environment so metallic surfaces show form via reflections.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(4, 6, 9);
  scene.add(key);
  // Neutral fill (kept white so it doesn't tint the saturated brand colours).
  const fill = new THREE.PointLight(0xffffff, 1.0, 60);
  fill.position.set(-7, -3, 6);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 1.0);
  rim.position.set(-5, 4, -7);
  scene.add(rim);
  // Modest back rim, traces an edge so the mark separates from the dark hero bg.
  const backRim = new THREE.DirectionalLight(0xffffff, 0.55);
  backRim.position.set(3, -3, -8);
  scene.add(backRim);

  const group = new THREE.Group();
  scene.add(group);
  const positionGroup = () => {
    // Desktop wide: bias opposite the copy. Mobile square mount: stay centered.
    const wide = el.clientWidth / el.clientHeight > 1.15;
    const rtl = document.documentElement.getAttribute('dir') === 'rtl';
    group.position.x = wide ? (rtl ? -2.4 : 2.4) : 0;
    group.position.y = wide ? 0 : -0.1;
    // Square mounts: slightly closer than desktop, not frame-filling.
    camera.position.z = wide ? 9.5 : 8.4;
  };
  positionGroup();

  const disposables = [];
  let logoMaterial = null;

  const loader = new SVGLoader();
  loader.load(LOGO_URL, (data) => {
    // White base so the per-vertex brand gradient shows true; glossy metal for form.
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      metalness: 0.5,
      roughness: 0.28,
      envMapIntensity: 0.65,
      side: THREE.DoubleSide,
    });
    logoMaterial = mat;
    disposables.push(mat);

    const logo = new THREE.Group();
    data.paths.forEach((path) => {
      path.toShapes(true).forEach((shape) => {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 22,
          bevelEnabled: true,
          bevelThickness: 2.6,
          bevelSize: 2,
          bevelSegments: 4,
          curveSegments: 28,
        });
        disposables.push(geo);
        logo.add(new THREE.Mesh(geo, mat));
      });
    });

    const box = new THREE.Box3().setFromObject(logo);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    logo.children.forEach((m) => m.position.sub(center));
    applyGradientColors(logo); // bake magenta→purple→blue across the mark
    const wide = el.clientWidth / el.clientHeight > 1.15;
    const fit = (wide ? 3.1 : 3.35) / Math.max(size.x, size.y);
    logo.scale.set(fit, -fit, fit); // flip Y: SVG space is Y-down, three is Y-up
    group.add(logo);
    signalHero3dReady();
  }, () => {
    signalHero3dReady();
  });

  // --- Rotation: mouse on desktop; continuous idle on mobile mount / no-hover ---
  const idleMq = window.matchMedia('(max-width: 1023px), (hover: none)');
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  const onMove = (e) => {
    if (idleMq.matches || !visible) return;
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMove, { passive: true });

  // --- Click for a full spin + glow pulse (gradient stays, it's the brand mark) ---
  let spinTarget = 0;
  let spin = 0;
  let glowStart = -1;
  let animTime = 0;
  let lastFrame = performance.now();
  let visible = true;
  const raycaster = new THREE.Raycaster();
  // Listen on window (the container is pointer-events:none). Raycast so only a hit
  // on the mark spins it; clicks elsewhere fall through to the hero buttons.
  const onClick = (e) => {
    if (!logoMaterial || !visible) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.intersectObject(group, true).length === 0) return;
    glowStart = animTime;
    spinTarget += Math.PI * 2; // one full turn per click
  };
  window.addEventListener('click', onClick);

  let raf = 0;
  const render = () => {
    if (!visible) {
      raf = 0;
      return;
    }

    const now = performance.now();
    animTime += (now - lastFrame) / 1000;
    lastFrame = now;
    const t = animTime;
    spin += (spinTarget - spin) * 0.06;

    if (idleMq.matches) {
      // Constant 3-axis idle drift - readable brand mark, never flat.
      group.rotation.y = t * 0.45 + spin;
      group.rotation.x = Math.sin(t * 0.38) * 0.28 + Math.cos(t * 0.17) * 0.08;
      group.rotation.z = Math.sin(t * 0.22) * 0.12;
    } else {
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      group.rotation.y = cur.x * 0.9 + Math.sin(t * 0.25) * 0.12 + spin;
      group.rotation.x = cur.y * 0.7 + Math.sin(t * 0.3) * 0.06;
      group.rotation.z = cur.x * 0.12;
    }

    if (glowStart >= 0 && logoMaterial) {
      const p = Math.min((t - glowStart) / 1.0, 1);
      const glow = Math.sin(p * Math.PI); // 0 → 1 → 0
      logoMaterial.emissive.copy(GLOW_COLOR).multiplyScalar(glow * 0.35);
      if (p >= 1) {
        glowStart = -1;
        logoMaterial.emissive.setScalar(0);
      }
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(render);
  };

  const stopLoop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const startLoop = () => {
    if (reducedMotion || raf) return;
    lastFrame = performance.now();
    render();
  };

  if (reducedMotion) {
    // Render a static frame once the SVG has loaded and meshes exist.
    const once = window.setInterval(() => {
      if (group.children.length) {
        renderer.render(scene, camera);
        window.clearInterval(once);
      }
    }, 100);
  } else {
    startLoop();
  }

  // Pause WebGL while the hero is off-screen so scroll stays smooth.
  const heroRoot = el.closest('.hero') || el;
  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startLoop();
      else stopLoop();
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' },
  );
  visibilityObserver.observe(heroRoot);

  const onResize = () => {
    if (!el.clientWidth || !el.clientHeight) return;
    camera.aspect = el.clientWidth / el.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(el.clientWidth, el.clientHeight);
    positionGroup();
  };
  window.addEventListener('resize', onResize);

  // Re-bias when locale flips LTR ↔ RTL without a full reload.
  const dirObserver = new MutationObserver(positionGroup);
  dirObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['dir', 'lang'],
  });
}

