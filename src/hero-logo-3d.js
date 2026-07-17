/**
 * ELM monogram (images/logo.svg) extruded into 3D — ported from the Propagenda
 * hero logo (raw three.js). The mark turns on 3 axes following the mouse; click it
 * to cycle through the ELM brand palette (magenta → blue → purple) with a full
 * spin, a smooth colour lerp, and a glow pulse.
 *
 * Mounts into `.hero__logo3d` on the home page only. Desktop-only (the container
 * is display:none below the lg breakpoint, so this bails out when it has no size).
 * The container is pointer-events:none so the hero CTAs stay clickable — clicks are
 * caught on `window` and raycast against the logo, so only hits on the mark cycle it.
 */
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// ELM brand palette (scss: $color-main / $color-secondary / $color-accent).
const COLOR_MAGENTA = new THREE.Color(0xbd1f71);
const COLOR_BLUE = new THREE.Color(0x0a76b5);
const COLOR_PURPLE = new THREE.Color(0x592c7b);
const COLOR_CYCLE = [COLOR_MAGENTA, COLOR_BLUE, COLOR_PURPLE];
// Per-colour surface — all glossy jewel-tone metals with env reflections for form.
const MAT_PARAMS = [
  { metalness: 0.5, roughness: 0.28, env: 0.65 }, // magenta
  { metalness: 0.55, roughness: 0.24, env: 0.75 }, // blue
  { metalness: 0.6, roughness: 0.22, env: 0.75 }, // purple
];
const GLOW_COLOR = new THREE.Color(0xffa8d4); // soft pink flash during the transition

const LOGO_URL = `${import.meta.env.BASE_URL}images/logo.svg`;

function initHeroLogo3D(el) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Bail out if the container is collapsed (mobile/tablet: display:none → 0×0).
  if (!el.clientWidth || !el.clientHeight) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, el.clientWidth / el.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(el.clientWidth, el.clientHeight);
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
  // Modest back rim — traces an edge so the mark separates from the dark hero bg.
  const backRim = new THREE.DirectionalLight(0xffffff, 0.55);
  backRim.position.set(3, -3, -8);
  scene.add(backRim);

  const group = new THREE.Group();
  scene.add(group);
  const positionGroup = () => {
    // Bias right, clear of the left-aligned hero copy.
    group.position.x = el.clientWidth / el.clientHeight > 1 ? 2.85 : 0;
  };
  positionGroup();

  const disposables = [];
  let logoMaterial = null;

  const loader = new SVGLoader();
  loader.load(LOGO_URL, (data) => {
    const mat = new THREE.MeshStandardMaterial({
      color: COLOR_MAGENTA.clone(),
      metalness: MAT_PARAMS[0].metalness,
      roughness: MAT_PARAMS[0].roughness,
      envMapIntensity: MAT_PARAMS[0].env,
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
    const fit = 3.05 / Math.max(size.x, size.y);
    logo.scale.set(fit, -fit, fit); // flip Y: SVG space is Y-down, three is Y-up
    group.add(logo);
  });

  // --- Mouse-driven rotation ---
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  const onMove = (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMove);

  // --- Click-to-cycle colour (magenta → blue → purple) with a spin + glow ---
  let colorIndex = 0;
  let fromIndex = 0;
  let spinTarget = 0;
  let spin = 0;
  let transStart = -1;
  const fromColor = COLOR_MAGENTA.clone();
  const toColor = COLOR_MAGENTA.clone();
  const raycaster = new THREE.Raycaster();
  // Listen on window (the container is pointer-events:none). Raycast so only a hit
  // on the mark cycles it; clicks elsewhere fall through to the hero buttons.
  const onClick = (e) => {
    if (!logoMaterial) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.intersectObject(group, true).length === 0) return;
    fromIndex = colorIndex;
    colorIndex = (colorIndex + 1) % COLOR_CYCLE.length;
    fromColor.copy(logoMaterial.color);
    toColor.copy(COLOR_CYCLE[colorIndex]);
    transStart = (performance.now() - start) / 1000;
    spinTarget += Math.PI * 2; // one full turn per click
  };
  window.addEventListener('click', onClick);

  const start = performance.now();
  let raf = 0;
  const render = () => {
    const t = (performance.now() - start) / 1000;
    cur.x += (target.x - cur.x) * 0.05;
    cur.y += (target.y - cur.y) * 0.05;
    spin += (spinTarget - spin) * 0.06;
    group.rotation.y = cur.x * 0.9 + Math.sin(t * 0.25) * 0.12 + spin;
    group.rotation.x = cur.y * 0.7 + Math.sin(t * 0.3) * 0.06;
    group.rotation.z = cur.x * 0.12;

    if (transStart >= 0 && logoMaterial) {
      const p = Math.min((t - transStart) / 1.0, 1);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOutQuad
      logoMaterial.color.lerpColors(fromColor, toColor, e);
      const fp = MAT_PARAMS[fromIndex];
      const tp = MAT_PARAMS[colorIndex];
      logoMaterial.metalness = fp.metalness + (tp.metalness - fp.metalness) * e;
      logoMaterial.roughness = fp.roughness + (tp.roughness - fp.roughness) * e;
      logoMaterial.envMapIntensity = fp.env + (tp.env - fp.env) * e;
      const glow = Math.sin(p * Math.PI); // 0 → 1 → 0
      logoMaterial.emissive.copy(GLOW_COLOR).multiplyScalar(glow * 0.4);
      if (p >= 1) {
        transStart = -1;
        logoMaterial.emissive.setScalar(0);
      }
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(render);
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
    render();
  }

  const onResize = () => {
    if (!el.clientWidth || !el.clientHeight) return;
    camera.aspect = el.clientWidth / el.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(el.clientWidth, el.clientHeight);
    positionGroup();
  };
  window.addEventListener('resize', onResize);
}

const mount = document.querySelector('.hero__logo3d');
if (mount) initHeroLogo3D(mount);
