/* ══════════════════════════════════════
   COSMIC.ID — lang.js
   Bilingual UI strings (id / en)
══════════════════════════════════════ */

let lang = 'id';

const L = {
  id: {
    langBtn:  '🌐 EN',
    desc:     'Simulasi tata surya 3D dengan orbit elips realistis berdasarkan waktu UTC nyata.',
    created:  'Dibuat',
    uptime:   '⏱ SUDAH BERJALAN',
    uptimeSub:'sejak pertama kali dibuat',
    belts:    'Asteroid Belts:',
    main:     'Main Belt: antara Mars & Jupiter',
    kuiper:   'Kuiper Belt: di luar Neptunus',
    period:   'Periode Orbit',
    diam:     'Diameter',
    temp:     'Suhu',
    facts:    '✦ Fakta Menarik',
    moons:    '🌙 Bulan — klik untuk info',
    distSun:  'Jarak dari Matahari',
    real:     'real',
    paused:   'JEDA',
  },
  en: {
    langBtn:  '🌐 ID',
    desc:     '3D solar system simulation with realistic elliptic orbits based on real UTC time.',
    created:  'Created',
    uptime:   '⏱ RUNNING FOR',
    uptimeSub:'since first created',
    belts:    'Asteroid Belts:',
    main:     'Main Belt: between Mars & Jupiter',
    kuiper:   'Kuiper Belt: beyond Neptune',
    period:   'Orbital Period',
    diam:     'Diameter',
    temp:     'Temperature',
    facts:    '✦ Fun Facts',
    moons:    '🌙 Moons — tap for info',
    distSun:  'Distance from Sun',
    real:     'real',
    paused:   'PAUSED',
  },
};

/** Get translated string */
function tl(k) { return L[lang][k] || k; }

/** Push all translated strings into the DOM */
function applyLang() {
  document.getElementById('langBtn').textContent      = tl('langBtn');
  document.getElementById('t-desc').textContent       = tl('desc');
  document.getElementById('t-created').textContent    = tl('created');
  document.getElementById('uptimeLabel').textContent  = tl('uptime');
  document.getElementById('uptimeSub').textContent    = tl('uptimeSub');
  document.getElementById('t-belts').textContent      = tl('belts');
  document.getElementById('t-main').textContent       = tl('main');
  document.getElementById('t-kuiper').textContent     = tl('kuiper');
  document.getElementById('t-period').textContent     = tl('period');
  document.getElementById('t-diam').textContent       = tl('diam');
  document.getElementById('t-temp').textContent       = tl('temp');
  document.getElementById('t-facts').textContent      = tl('facts');
  document.getElementById('t-moons').textContent      = tl('moons');
  document.getElementById('popupDistLbl').textContent = tl('distSun');
  updateSpeedLabel();                  // defined in ui.js
  if (openPopupName) openPopup(openPopupName); // defined in ui.js
}

/** Toggle language and re-render */
function toggleLang() {
  lang = (lang === 'id') ? 'en' : 'id';
  applyLang();
}
