/* ══════════════════════════════════════
   COSMIC.ID — scene.js
   Three.js 3D Solar System Simulation
   Depends on: database.js, lang.js, ui.js
══════════════════════════════════════ */

/* ══ ORBITAL PARAMETERS ══
   [semiMajorAU, eccentricity, periodDays, inclinationDeg]
*/
const ORBIT_PARAMS = {
  Mercury: [0.387, 0.2056,  87.97,  7.00],
  Venus:   [0.723, 0.0067, 224.70,  3.39],
  Earth:   [1.000, 0.0167, 365.25,  0.00],
  Mars:    [1.524, 0.0934, 686.97,  1.85],
  Jupiter: [5.203, 0.0489,4332.59,  1.30],
  Saturn:  [9.537, 0.0565,10759.22, 2.49],
  Uranus:  [19.22, 0.0463,30688.50, 0.77],
  Neptune: [30.05, 0.0097,60195.00, 1.77],
};

/* Moon orbits — [radiusFromParent (scene units), periodDays] */
const MOON_PARAMS = {
  Moon:   { parent: 'Earth',   r: 1.6,  period: 27.32  },
  Phobos: { parent: 'Mars',    r: 0.5,  period: 0.319  },
  Deimos: { parent: 'Mars',    r: 0.85, period: 1.263  },
  Europa: { parent: 'Jupiter', r: 1.0,  period: 3.551  },
  Titan:  { parent: 'Saturn',  r: 1.4,  period: 15.945 },
  Triton: { parent: 'Neptune', r: 0.9,  period: -5.877 }, // retrograde
};

/* Visual radii (scene units) */
const PLANET_RADIUS = {
  Sun: 2.6, Mercury: 0.22, Venus: 0.38, Earth: 0.40,
  Mars: 0.28, Jupiter: 1.10, Saturn: 0.95, Uranus: 0.65, Neptune: 0.62,
  Moon: 0.12, Phobos: 0.05, Deimos: 0.04,
  Europa: 0.10, Titan: 0.16, Triton: 0.09,
};

const AU = 8; // scene units per AU

/* ══ SETUP ══ */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.cssText =
  'position:fixed;top:0;left:0;pointer-events:none;z-index:10';
document.body.appendChild(labelRenderer.domElement);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 60, 100);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 5;
controls.maxDistance = 600;

/* ── Starfield ── */
(function addStars() {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(6000);
  for (let i = 0; i < 6000; i++) pos[i] = (Math.random() - 0.5) * 2000;
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(geo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, sizeAttenuation: true })));
})();

/* ── Lighting ── */
scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const sunLight = new THREE.PointLight(0xfff5cc, 2.4, 900);
scene.add(sunLight);

/* ══ HELPERS ══ */
function makeLabel(text, cls) {
  const div = document.createElement('div');
  div.className = cls;
  div.textContent = text;
  const obj = new THREE.CSS2DObject(div);
  return obj;
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const textureLoader = new THREE.TextureLoader();

const TEXTURES = {
  Sun:     'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/1024px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg',
  Mercury: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/600px-Mercury_in_true_color.jpg',
  Venus:   'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/600px-Venus-real_color.jpg',
  Earth:   'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Blue_Marble_%28remastered%29.jpg/600px-The_Blue_Marble_%28remastered%29.jpg',
  Mars:    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/600px-OSIRIS_Mars_true_color.jpg',
  Jupiter: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/600px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
  Saturn:  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/600px-Saturn_during_Equinox.jpg',
  Uranus:  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/600px-Uranus2.jpg',
  Neptune: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/600px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg',
};

function makeSphere(name, radius, hex) {
  const geo = new THREE.SphereGeometry(radius, 32, 32);
  const tex = TEXTURES[name] ? textureLoader.load(TEXTURES[name]) : null;
  const mat = new THREE.MeshStandardMaterial({
    map: tex || null,
    color: tex ? 0xffffff : new THREE.Color(hex),
    roughness: 0.8,
    metalness: 0.05,
    emissive: (name === 'Sun') ? new THREE.Color(0.6, 0.3, 0) : new THREE.Color(0,0,0),
    emissiveIntensity: (name === 'Sun') ? 1.2 : 0,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.name = name;
  return mesh;
}

/** Kepler ellipse position: returns {x, z} for a given true anomaly angle */
function keplerPos(a, e, theta) {
  const r = a * (1 - e * e) / (1 + e * Math.cos(theta));
  return { x: r * Math.cos(theta), z: r * Math.sin(theta) };
}

/** Mean anomaly → eccentric anomaly (Newton iteration) */
function solveKepler(M, e, iters = 6) {
  let E = M;
  for (let i = 0; i < iters; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return E;
}

/** Convert sim date → orbital angle (radians) */
function orbitAngle(periodDays, date) {
  const JD = date.getTime() / 86400000 + 2440587.5;
  return (2 * Math.PI * (JD % periodDays)) / periodDays;
}

/** Draw orbit ellipse as a LineLoop */
function makeOrbitLine(a, e, inc, color = 0x333333) {
  const points = [];
  const incR = (inc * Math.PI) / 180;
  for (let i = 0; i <= 128; i++) {
    const theta = (i / 128) * Math.PI * 2;
    const { x, z } = keplerPos(a, e, theta);
    // Apply inclination on Y-axis
    points.push(new THREE.Vector3(x * AU, z * AU * Math.sin(incR), z * AU * Math.cos(incR)));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.22 }));
}

/* ══ ASTEROID BELTS ══ */
function makeAsteroidBelt(innerAU, outerAU, count, color, opacity) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r     = (innerAU + Math.random() * (outerAU - innerAU)) * AU;
    const theta = Math.random() * Math.PI * 2;
    const yOff  = (Math.random() - 0.5) * 0.4;
    positions[i * 3]     = r * Math.cos(theta);
    positions[i * 3 + 1] = yOff;
    positions[i * 3 + 2] = r * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    color, size: 0.15, sizeAttenuation: true, transparent: true, opacity,
  }));
}
scene.add(makeAsteroidBelt(2.2, 3.2, 3200, 0x887766, 0.5));  // Main Belt
scene.add(makeAsteroidBelt(38,  48,  2500, 0x446688, 0.3));   // Kuiper Belt

/* ══ BUILD SCENE OBJECTS ══ */
const objects = {}; // name → { mesh, label, orbitLine? }

/* Sun */
const sunMesh  = makeSphere('Sun', PLANET_RADIUS.Sun * AU / 8, DB.Sun.col);
const sunGlow  = new THREE.PointLight(0xffcc44, 1.2, 80);
sunMesh.add(sunGlow);
const sunLabel = makeLabel('☀ SUN', 'sun-label');
sunLabel.position.set(0, PLANET_RADIUS.Sun * AU / 8 + 1.2, 0);
sunMesh.add(sunLabel);
scene.add(sunMesh);
objects['Sun'] = { mesh: sunMesh };

/* Planets */
Object.entries(ORBIT_PARAMS).forEach(([name, [a, e, period, inc]]) => {
  const hex  = DB[name]?.col || '#aaaaaa';
  const r    = (PLANET_RADIUS[name] || 0.35);
  const mesh = makeSphere(name, r, hex);

  /* Label */
  const lbl = makeLabel(name.toUpperCase(), 'planet-label');
  lbl.position.set(0, r + 0.35, 0);
  mesh.add(lbl);

  /* Orbit line */
  const orbitLine = makeOrbitLine(a, e, inc, parseInt(hex.replace('#',''), 16));
  scene.add(orbitLine);

  scene.add(mesh);
  objects[name] = { mesh, orbitLine, a, e, period, inc };

  /* Saturn rings */
  if (name === 'Saturn') {
    const ringGeo = new THREE.RingGeometry(r * 1.5, r * 2.6, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffe688, side: THREE.DoubleSide, transparent: true, opacity: 0.55,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    mesh.add(ring);
  }
});

/* Moons */
Object.entries(MOON_PARAMS).forEach(([name, { parent, r, period }]) => {
  const hex  = DB[name]?.col || '#cccccc';
  const rad  = PLANET_RADIUS[name] || 0.1;
  const mesh = makeSphere(name, rad, hex);

  const lbl = makeLabel(name, 'moon-label');
  lbl.position.set(0, rad + 0.18, 0);
  mesh.add(lbl);

  scene.add(mesh);
  objects[name] = { mesh, moonOf: parent, moonR: r, moonPeriod: period };
});

/* ══ RAYCASTER (click/hover) ══ */
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2(-9999, -9999);

window.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  showTooltip('', e.clientX, e.clientY); // position update; name set in loop
});
window.addEventListener('click', () => {
  const hit = pickObject();
  if (hit) openPopup(hit);
});
window.addEventListener('touchend', e => {
  const t = e.changedTouches[0];
  mouse.x = (t.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(t.clientY / window.innerHeight) * 2 + 1;
  const hit = pickObject();
  if (hit) openPopup(hit);
});

function pickObject() {
  raycaster.setFromCamera(mouse, camera);
  const meshes = Object.values(objects).map(o => o.mesh);
  const hits   = raycaster.intersectObjects(meshes, false);
  return hits.length ? hits[0].object.userData.name : null;
}

/* ══ ANIMATION LOOP ══ */
let lastT = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now    = performance.now();
  const deltaS = (now - lastT) / 1000;
  lastT = now;

  tickSimTime(deltaS); // advance sim clock (ui.js)
  const simDate = getSimDate();

  /* Update planet positions */
  Object.entries(ORBIT_PARAMS).forEach(([name, [a, e, period, inc]]) => {
    const obj = objects[name];
    if (!obj) return;
    const M        = orbitAngle(period, simDate);
    const E        = solveKepler(M, e);
    const trueAnom = 2 * Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    );
    const { x, z } = keplerPos(a, e, trueAnom);
    const incR  = (inc * Math.PI) / 180;
    obj.mesh.position.set(x * AU, z * AU * Math.sin(incR), z * AU * Math.cos(incR));
    obj.mesh.rotation.y += 0.003; // self rotation
  });

  /* Update moon positions */
  Object.entries(MOON_PARAMS).forEach(([name, { parent, r, period }]) => {
    const obj       = objects[name];
    const parentObj = objects[parent];
    if (!obj || !parentObj) return;
    const angle = (simDate.getTime() / (Math.abs(period) * 86400000)) * Math.PI * 2;
    const dir   = period < 0 ? -1 : 1;
    const px    = parentObj.mesh.position.x + r * Math.cos(angle * dir);
    const pz    = parentObj.mesh.position.z + r * Math.sin(angle * dir);
    obj.mesh.position.set(px, parentObj.mesh.position.y, pz);
  });

  /* Hover tooltip */
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(Object.values(objects).map(o => o.mesh), false);
  if (hits.length) {
    const n = hits[0].object.userData.name;
    const sx = (mouse.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-mouse.y * 0.5 + 0.5) * window.innerHeight;
    showTooltip(n, sx, sy);
    document.body.style.cursor = 'pointer';
  } else {
    hideTooltip();
    document.body.style.cursor = 'default';
  }

  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

/* ══ RESIZE ══ */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
