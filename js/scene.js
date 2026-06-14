/* ══════════════════════════════════════
   COSMIC.ID — scene.js v4.0
   + Milky Way background
   + 3D asteroid chunks
   + Bintang berkedip + nama bintang terang
   + Texture planet
   + Kamera lebih dekat & nyaman
══════════════════════════════════════ */

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

const MOON_PARAMS = {
  Moon:   { parent: 'Earth',   r: 1.6,  period: 27.32  },
  Phobos: { parent: 'Mars',    r: 0.5,  period: 0.319  },
  Deimos: { parent: 'Mars',    r: 0.85, period: 1.263  },
  Europa: { parent: 'Jupiter', r: 1.0,  period: 3.551  },
  Titan:  { parent: 'Saturn',  r: 1.4,  period: 15.945 },
  Triton: { parent: 'Neptune', r: 0.9,  period: -5.877 },
};

const PLANET_RADIUS = {
  Sun: 2.6, Mercury: 0.22, Venus: 0.38, Earth: 0.40,
  Mars: 0.28, Jupiter: 1.10, Saturn: 0.95, Uranus: 0.65, Neptune: 0.62,
  Moon: 0.12, Phobos: 0.05, Deimos: 0.04,
  Europa: 0.10, Titan: 0.16, Triton: 0.09,
};

const AU = 8;

/* ══ TEXTURES ══ */
const textureLoader = new THREE.TextureLoader();
const TEXTURES = {
  Sun:     '../2k_sun.jpg',
  Mercury: '../2k_mercury.jpg',
  Venus:   '../2k_venus_surface.jpg',
  Earth:   '../2k_earth_daymap.jpg',
  Mars:    '../2k_mars.jpg',
  Jupiter: '../2k_jupiter.jpg',
  Saturn:  '../2k_saturn.jpg',
  Uranus:  '../2k_uranus.jpg',
  Neptune: '../2k_neptune.jpg',
  Moon:    '../2k_moon.jpg',
};

/* ══ RENDERER ══ */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.cssText =
  'position:fixed;top:0;left:0;pointer-events:none;z-index:10';
document.body.appendChild(labelRenderer.domElement);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 45, 75); // lebih dekat

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 3;
controls.maxDistance = 500;

/* ══ MILKY WAY BACKGROUND ══ */
(function addMilkyWay() {
  // Layer 1: bintang putih banyak
  const geo1 = new THREE.BufferGeometry();
  const count1 = 12000;
  const pos1 = new Float32Array(count1 * 3);
  const col1 = new Float32Array(count1 * 3);
  for (let i = 0; i < count1; i++) {
    const r = 800 + Math.random() * 1200;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    pos1[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos1[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos1[i*3+2] = r * Math.cos(phi);
    // warna bervariasi: putih, biru muda, kuning muda
    const t = Math.random();
    if (t < 0.3) { col1[i*3]=0.7; col1[i*3+1]=0.8; col1[i*3+2]=1.0; }      // biru
    else if (t < 0.6) { col1[i*3]=1.0; col1[i*3+1]=1.0; col1[i*3+2]=0.8; } // kuning
    else { col1[i*3]=1.0; col1[i*3+1]=1.0; col1[i*3+2]=1.0; }               // putih
  }
  geo1.setAttribute('position', new THREE.BufferAttribute(pos1, 3));
  geo1.setAttribute('color',    new THREE.BufferAttribute(col1, 3));
  scene.add(new THREE.Points(geo1, new THREE.PointsMaterial({
    size: 0.8, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.9,
  })));

  // Layer 2: kabut Milky Way (bintang kecil padat di bidang galaksi)
  const geo2 = new THREE.BufferGeometry();
  const count2 = 8000;
  const pos2 = new Float32Array(count2 * 3);
  for (let i = 0; i < count2; i++) {
    const r     = 600 + Math.random() * 800;
    const theta = Math.random() * Math.PI * 2;
    const y     = (Math.random() - 0.5) * r * 0.18; // pipih seperti galaksi
    pos2[i*3]   = r * Math.cos(theta);
    pos2[i*3+1] = y;
    pos2[i*3+2] = r * Math.sin(theta);
  }
  geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
  scene.add(new THREE.Points(geo2, new THREE.PointsMaterial({
    size: 0.4, sizeAttenuation: true,
    color: 0xaaccff, transparent: true, opacity: 0.35,
  })));
})();

/* ══ BINTANG TERANG DENGAN NAMA ══ */
const NAMED_STARS = [
  { name: 'Sirius',     x: -320, y:  80, z: -200, col: '#cceeff', size: 2.5 },
  { name: 'Betelgeuse', x:  280, y: 150, z: -350, col: '#ff8844', size: 3.0 },
  { name: 'Rigel',      x: -180, y: -90, z: -400, col: '#aaddff', size: 2.8 },
  { name: 'Vega',       x:  350, y: 200, z:  150, col: '#ffffff',  size: 2.2 },
  { name: 'Antares',    x: -300, y: -60, z:  280, col: '#ff4422', size: 3.2 },
  { name: 'Canopus',    x:  100, y:-180, z: -320, col: '#ffffcc', size: 2.6 },
  { name: 'Arcturus',   x:  240, y: 300, z:  200, col: '#ffaa55', size: 2.4 },
  { name: 'Spica',      x: -250, y: 100, z:  350, col: '#bbddff', size: 2.1 },
];

const twinkleStars = [];
NAMED_STARS.forEach(s => {
  const geo  = new THREE.SphereGeometry(s.size, 8, 8);
  const mat  = new THREE.MeshBasicMaterial({ color: s.col });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(s.x, s.y, s.z);
  scene.add(mesh);
  twinkleStars.push({ mesh, mat, baseColor: s.col });

  // Label nama bintang
  const div = document.createElement('div');
  div.style.cssText = 'color:rgba(180,220,255,0.6);font-size:9px;font-family:Courier New;pointer-events:none;letter-spacing:1px';
  div.textContent = s.name;
  const lbl = new THREE.CSS2DObject(div);
  lbl.position.set(0, s.size + 1.5, 0);
  mesh.add(lbl);
});

/* ══ LIGHTING ══ */
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const sunLight = new THREE.PointLight(0xfff5cc, 2.8, 1000);
scene.add(sunLight);

/* ══ HELPERS ══ */
function makeLabel(text, cls) {
  const div = document.createElement('div');
  div.className = cls;
  div.textContent = text;
  return new THREE.CSS2DObject(div);
}

function makeSphere(name, radius, hex) {
  const geo = new THREE.SphereGeometry(radius, 32, 32);
  const tex = TEXTURES[name] ? textureLoader.load(TEXTURES[name]) : null;
  const mat = new THREE.MeshStandardMaterial({
    map: tex || null,
    color: tex ? 0xffffff : new THREE.Color(hex),
    roughness: 0.8, metalness: 0.05,
    emissive:          (name === 'Sun') ? new THREE.Color(0.6, 0.3, 0) : new THREE.Color(0,0,0),
    emissiveIntensity: (name === 'Sun') ? 1.2 : 0,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.name = name;
  return mesh;
}

function keplerPos(a, e, theta) {
  const r = a * (1 - e * e) / (1 + e * Math.cos(theta));
  return { x: r * Math.cos(theta), z: r * Math.sin(theta) };
}

function solveKepler(M, e, iters = 6) {
  let E = M;
  for (let i = 0; i < iters; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return E;
}

function orbitAngle(periodDays, date) {
  const JD = date.getTime() / 86400000 + 2440587.5;
  return (2 * Math.PI * (JD % periodDays)) / periodDays;
}

function makeOrbitLine(a, e, inc, color = 0x333333) {
  const points = [];
  const incR = (inc * Math.PI) / 180;
  for (let i = 0; i <= 128; i++) {
    const theta = (i / 128) * Math.PI * 2;
    const { x, z } = keplerPos(a, e, theta);
    points.push(new THREE.Vector3(x * AU, z * AU * Math.sin(incR), z * AU * Math.cos(incR)));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.2 }));
}

/* ══ ASTEROID BELT 3D ══ */
function make3DAsteroidBelt(innerAU, outerAU, count, colors, ySpread) {
  const group = new THREE.Group();
  const geoBase = new THREE.DodecahedronGeometry(1, 0); // batu 3D
  for (let i = 0; i < count; i++) {
    const r     = (innerAU + Math.random() * (outerAU - innerAU)) * AU;
    const theta = Math.random() * Math.PI * 2;
    const y     = (Math.random() - 0.5) * ySpread;
    const scale = 0.04 + Math.random() * 0.12;
    const col   = colors[Math.floor(Math.random() * colors.length)];
    const mat   = new THREE.MeshStandardMaterial({ color: col, roughness: 0.9, metalness: 0.1 });
    const mesh  = new THREE.Mesh(geoBase, mat);
    mesh.position.set(r * Math.cos(theta), y, r * Math.sin(theta));
    mesh.scale.set(scale, scale * (0.6 + Math.random()*0.8), scale);
    mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    group.add(mesh);
  }
  return group;
}

const mainBelt   = make3DAsteroidBelt(2.2, 3.2, 400, [0x887766, 0x665544, 0x998877, 0x554433], 0.5);
const kuiperBelt = make3DAsteroidBelt(38,  48,  200, [0x446688, 0x334466, 0x557799, 0x223355], 1.2);
scene.add(mainBelt);
scene.add(kuiperBelt);

/* ══ BUILD PLANETS ══ */
const objects = {};

// Sun
const sunMesh  = makeSphere('Sun', PLANET_RADIUS.Sun, DB.Sun.col);
const sunGlow  = new THREE.PointLight(0xffcc44, 1.5, 100);
sunMesh.add(sunGlow);
const sunLabel = makeLabel('☀ SUN', 'sun-label');
sunLabel.position.set(0, PLANET_RADIUS.Sun + 1.2, 0);
sunMesh.add(sunLabel);
scene.add(sunMesh);
objects['Sun'] = { mesh: sunMesh };

// Planets
Object.entries(ORBIT_PARAMS).forEach(([name, [a, e, period, inc]]) => {
  const hex  = DB[name]?.col || '#aaaaaa';
  const r    = PLANET_RADIUS[name] || 0.35;
  const mesh = makeSphere(name, r, hex);

  const lbl = makeLabel(name.toUpperCase(), 'planet-label');
  lbl.position.set(0, r + 0.35, 0);
  mesh.add(lbl);

  const orbitLine = makeOrbitLine(a, e, inc, parseInt(hex.replace('#',''), 16));
  scene.add(orbitLine);
  scene.add(mesh);
  objects[name] = { mesh, a, e, period, inc };

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

// Moons
Object.entries(MOON_PARAMS).forEach(([name, { parent, r, period }]) => {
  const hex  = DB[name]?.col || '#cccccc';
  const rad  = PLANET_RADIUS[name] || 0.1;
  const mesh = makeSphere(name, rad, hex);
  const lbl  = makeLabel(name, 'moon-label');
  lbl.position.set(0, rad + 0.18, 0);
  mesh.add(lbl);
  scene.add(mesh);
  objects[name] = { mesh, moonOf: parent, moonR: r, moonPeriod: period };
});

/* ══ RAYCASTER ══ */
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2(-9999, -9999);

window.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
window.addEventListener('click', () => { const h = pickObject(); if (h) openPopup(h); });
window.addEventListener('touchend', e => {
  const t = e.changedTouches[0];
  mouse.x = (t.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(t.clientY / window.innerHeight) * 2 + 1;
  const h = pickObject(); if (h) openPopup(h);
});

function pickObject() {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(Object.values(objects).map(o => o.mesh), false);
  return hits.length ? hits[0].object.userData.name : null;
}

/* ══ ANIMATION ══ */
let lastT = performance.now();
let tick  = 0;

function animate() {
  requestAnimationFrame(animate);
  const now    = performance.now();
  const deltaS = (now - lastT) / 1000;
  lastT = now;
  tick += deltaS;

  tickSimTime(deltaS);
  const simDate = getSimDate();

  // Planet positions
  Object.entries(ORBIT_PARAMS).forEach(([name, [a, e, period, inc]]) => {
    const obj = objects[name]; if (!obj) return;
    const M = orbitAngle(period, simDate);
    const E = solveKepler(M, e);
    const trueAnom = 2 * Math.atan2(
      Math.sqrt(1+e) * Math.sin(E/2),
      Math.sqrt(1-e) * Math.cos(E/2)
    );
    const { x, z } = keplerPos(a, e, trueAnom);
    const incR = (inc * Math.PI) / 180;
    obj.mesh.position.set(x*AU, z*AU*Math.sin(incR), z*AU*Math.cos(incR));
    obj.mesh.rotation.y += 0.003;
  });

  // Moon positions
  Object.entries(MOON_PARAMS).forEach(([name, { parent, r, period }]) => {
    const obj = objects[name], par = objects[parent];
    if (!obj || !par) return;
    const angle = (simDate.getTime() / (Math.abs(period)*86400000)) * Math.PI * 2;
    const dir = period < 0 ? -1 : 1;
    obj.mesh.position.set(
      par.mesh.position.x + r * Math.cos(angle*dir),
      par.mesh.position.y,
      par.mesh.position.z + r * Math.sin(angle*dir)
    );
  });

  // Asteroid rotation
  mainBelt.children.forEach((m, i) => { m.rotation.y += 0.002 + i*0.00001; });
  kuiperBelt.children.forEach((m, i) => { m.rotation.x += 0.001 + i*0.00001; });

  // Asteroid belt orbit drift
  mainBelt.rotation.y   += 0.0001;
  kuiperBelt.rotation.y += 0.00005;

  // Bintang berkedip
  twinkleStars.forEach((s, i) => {
    const twinkle = 0.6 + 0.4 * Math.sin(tick * (1.5 + i * 0.7));
    s.mesh.scale.setScalar(twinkle);
  });

  // Tooltip hover
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(Object.values(objects).map(o => o.mesh), false);
  if (hits.length) {
    const n  = hits[0].object.userData.name;
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

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
