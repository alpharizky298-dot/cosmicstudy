/* ══════════════════════════════════════
   COSMIC.ID — ui.js
   Popup, Info Menu, Time Bar, Uptime
══════════════════════════════════════ */

/* ── Uptime ── */
const CREATED_DATE = new Date('2026-03-04T00:00:00Z');

function updateUptime() {
  const diff = Date.now() - CREATED_DATE.getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  document.getElementById('uptimeValue').textContent = `${d}d ${h}h ${m}m`;
}
setInterval(updateUptime, 60000);
updateUptime();

/* ── Clock (UTC & WIB) ── */
function updateClock() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const utc = `UTC: ${now.getUTCFullYear()}-${pad(now.getUTCMonth()+1)}-${pad(now.getUTCDate())} `
            + `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
  const wibH = (now.getUTCHours() + 7) % 24;
  const wib  = `WIB: ${pad(wibH)}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
  document.getElementById('utcTime').textContent = utc;
  document.getElementById('wibTime').textContent = wib;
}
setInterval(updateClock, 1000);
updateClock();

/* ── Info Menu toggle ── */
function toggleInfo() {
  const m = document.getElementById('infoMenu');
  m.style.display = (m.style.display === 'block') ? 'none' : 'block';
}

/* ── Tooltip ── */
const tooltip = document.getElementById('tooltip');
function showTooltip(name, x, y) {
  tooltip.textContent = name;
  tooltip.style.left  = (x + 14) + 'px';
  tooltip.style.top   = (y - 10) + 'px';
  tooltip.style.display = 'block';
}
function hideTooltip() { tooltip.style.display = 'none'; }

/* ══ POPUP ══ */
let openPopupName = null;

/** Draw a colored circle on the popup <canvas> icon */
function drawPopupIcon(name, color) {
  const c  = document.getElementById('popupIcon');
  const cx = c.getContext('2d');
  cx.clearRect(0, 0, 50, 50);
  const g = cx.createRadialGradient(18, 16, 2, 25, 25, 25);
  g.addColorStop(0, '#ffffff88');
  g.addColorStop(1, color);
  cx.beginPath();
  cx.arc(25, 25, 22, 0, Math.PI * 2);
  cx.fillStyle = g;
  cx.fill();
  /* Saturn ring decoration */
  if (name === 'Saturn') {
    cx.save();
    cx.translate(25, 25);
    cx.scale(1, 0.28);
    cx.beginPath();
    cx.arc(0, 0, 30, 0, Math.PI * 2);
    cx.strokeStyle = 'rgba(255,238,136,0.6)';
    cx.lineWidth = 3.5;
    cx.stroke();
    cx.restore();
  }
}

/** Open popup for a body name */
function openPopup(name) {
  const data = DB[name];
  if (!data) return;
  openPopupName = name;
  const d = data[lang] || data['en'];

  document.getElementById('popupName').textContent = name;
  document.getElementById('popupType').textContent = d.type || '';
  document.getElementById('popupPeriod').textContent = d.period || '—';
  document.getElementById('popupDist').textContent   = d.dist   || '—';
  document.getElementById('popupDiam').textContent   = d.diam   || '—';
  document.getElementById('popupTemp').textContent   = d.temp   || '—';

  /* distLbl override (moons use "Distance from X") */
  document.getElementById('popupDistLbl').textContent = d.distLbl || tl('distSun');

  /* Facts */
  const factsEl = document.getElementById('popupFacts');
  factsEl.innerHTML = '';
  (d.facts || []).forEach(f => {
    const row = document.createElement('div');
    row.className = 'fact-item';
    const dot = document.createElement('div');
    dot.className = 'fact-dot';
    dot.style.background = data.col || '#ffc832';
    const txt = document.createElement('div');
    txt.className = 'fact-text';
    txt.textContent = f;
    row.appendChild(dot);
    row.appendChild(txt);
    factsEl.appendChild(row);
  });

  /* Moons chips */
  const moonsWrap = document.getElementById('moonsWrap');
  const moonsEl   = document.getElementById('popupMoons');
  moonsEl.innerHTML = '';
  if (data.moons && data.moons.length) {
    moonsWrap.style.display = 'block';
    data.moons.forEach(mn => {
      const chip = document.createElement('span');
      chip.className = 'moon-chip';
      chip.textContent = mn;
      chip.onclick = () => openPopup(mn);
      moonsEl.appendChild(chip);
    });
  } else {
    moonsWrap.style.display = 'none';
  }

  drawPopupIcon(name, data.col || '#aaaaaa');
  document.getElementById('overlay').classList.add('show');
}

function closePopup() {
  document.getElementById('overlay').classList.remove('show');
  openPopupName = null;
}
function overlayClick(e) {
  if (e.target === document.getElementById('overlay')) closePopup();
}

/* ══ TIME CONTROL ══ */
// Speed steps: negative = backward
const SPEED_STEPS = [
  -86400 * 365,   // -1 year/s
  -86400 * 30,    // -30 days/s
  -86400 * 7,     // -7 days/s
  -86400,         // -1 day/s
  0,              // pause
  1,              // 1× real
  60,             // 1 min/s
  3600,           // 1 hr/s
  86400,          // 1 day/s
  86400 * 7,      // 1 week/s
  86400 * 30,     // 1 month/s
  86400 * 365,    // 1 year/s
];
const REAL_IDX = 5;   // index of 1× real
let speedIdx = REAL_IDX;
let paused   = false;
let simTime  = Date.now(); // ms

function currentSpeed() { return paused ? 0 : SPEED_STEPS[speedIdx]; }

function changeSpeed(dir) {
  speedIdx = Math.max(0, Math.min(SPEED_STEPS.length - 1, speedIdx + dir));
  paused = false;
  updateSpeedLabel();
}
function togglePause() {
  paused = !paused;
  document.getElementById('pauseBtn').textContent = paused ? '▶' : '⏸';
  updateSpeedLabel();
}
function resetToNow() {
  simTime  = Date.now();
  speedIdx = REAL_IDX;
  paused   = false;
  document.getElementById('pauseBtn').textContent = '⏸';
  updateSpeedLabel();
}

function updateSpeedLabel() {
  const sp = SPEED_STEPS[speedIdx];
  const lbl = document.getElementById('speedLabel');
  if (paused) { lbl.textContent = tl('paused'); return; }
  const abs = Math.abs(sp);
  const sign = sp < 0 ? '-' : '';
  let txt;
  if (abs === 1)              txt = `1× ${tl('real')}`;
  else if (abs < 3600)        txt = `${sign}${abs}s/s`;
  else if (abs < 86400)       txt = `${sign}${abs/3600}h/s`;
  else if (abs < 86400*30)    txt = `${sign}${abs/86400}d/s`;
  else if (abs < 86400*365)   txt = `${sign}${Math.round(abs/86400/30)}mo/s`;
  else                        txt = `${sign}${(abs/86400/365).toFixed(1)}y/s`;
  lbl.textContent = txt;
}

/** Call once per animation frame with delta seconds */
function tickSimTime(deltaSec) {
  simTime += currentSpeed() * deltaSec * 1000;
  /* Update simDate display */
  const d = new Date(simTime);
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('simDate').textContent =
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
}

/** Return simulated Date object */
function getSimDate() { return new Date(simTime); }
