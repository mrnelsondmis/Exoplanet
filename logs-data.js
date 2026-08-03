// Shared archive data: the colony's logs on file.
window.BASE_LOGS = [
  {
    "id": "LOG-01",
    "dept": "sci",
    "author": "Dr. Diego Rodriguez Sanchez, Lead Research Officer",
    "tags": [
      "Atmosphere",
      "Energy"
    ],
    "title": "Ultimate Energy Source",
    "content": "Sensor scans confirm that, just like on Earth, 99% of all energy measured on this planet comes from its central sun. The sun’s radiant energy powers our solar panels, creates wind currents, and allows photosynthesis for our plants in the Greenhouse Dome.",
    "earth": ""
  },
  {
    "id": "LOG-02",
    "dept": "sci",
    "author": "Soren Vasquez, Climate Analyst",
    "tags": [
      "Atmosphere",
      "Energy"
    ],
    "title": "Planetary Energy Budget",
    "content": "Our data shows a balance in energy entering and leaving the atmosphere. However, extra carbon dioxide produced by our base is trapping heat radiation, slightly raising surface temperatures nearby compared to locations farther away on the planet.",
    "earth": ""
  },
  {
    "id": "LOG-03",
    "dept": "scout",
    "author": "Naomi Aldric, Scouting Captain",
    "tags": [
      "Atmosphere"
    ],
    "title": "Dome Air Currents",
    "content": "Air heated near the dome floor expands, becomes less dense, and rises toward the ceiling. As it cools at higher altitudes, it becomes denser and sinks, creating a continuous circulating wind loop.\n\nWe are continuing to monitor, in case these wind loops can turn dangerous or destructive in the future.",
    "earth": "This is the same as Earth."
  },
  {
    "id": "LOG-04",
    "dept": "eng",
    "author": "Nadia Kowalski, Maintenance Tech",
    "tags": [
      "Energy",
      "Geosphere"
    ],
    "title": "Heat Transfer on Rover Baseplates",
    "content": "The wheels of our rover directly touching the sun-baked rock bed grew hot within minutes. Thermal energy transferred by direct contact from the solid ground into the metal rover frame, demonstrating conduction.",
    "earth": ""
  }
];

// The data above is now the source of truth. Clear any browser-side overlay
// left from before it was baked in, once per browser.
try {
  if (!localStorage.getItem('exo-baseline-v5')) {
    ['exo-logs', 'exo-log-edits', 'exo-logs-removed', 'exo-logs-hidden',
     'exo-log-order', 'exo-depts', 'exo-tags', 'exo-telemetry-v3', 'exo-situations', 'exo-profile', 'exo-profile-notes', 'exo-profile-published',
     'exo-dept-colors-v2'].forEach(k => localStorage.removeItem(k));
    localStorage.setItem('exo-baseline-v5', '1');
    localStorage.removeItem('exo-baseline-v4');
  }
} catch (e) {}

// Departments (id, name, color) — editable on departments.html
window.DEPT_KEY = 'exo-depts';
window.DEFAULT_DEPTS = [
  {
    "id": "eng",
    "name": "Engineering",
    "color": "#facc15",
    "members": [
      "Elena Voss, Chief Engineer",
      "Desmond Okafor, Structural Engineer",
      "Nadia Kowalski, Maintenance Tech",
      "Dmitri Callahan, Power Systems Engineer",
      "Finn Lindgren, Equipment Tech"
    ]
  },
  {
    "id": "scout",
    "name": "Scouting",
    "color": "#ec4899",
    "members": [
      "Naomi Aldric, Scouting Captain",
      "Callum Bright, Terrain Surveyor",
      "Marcus Feye, Hazard Assessment Specialist",
      "Theo Delgado, Cartographer"
    ]
  },
  {
    "id": "sci",
    "name": "Scientific Research",
    "color": "#a855f7",
    "members": [
      "Dr. Diego Rodriguez Sanchez, Lead Research Officer",
      "Cass Fujimori, Geologist",
      "Soren Vasquez, Climate Analyst",
      "Toby Renn, Lab Technician",
      "Rosa Okonkwo, Chemist",
      "Owen Bromwell, Hydrologist"
    ]
  }
];
// One-time recolor so stored departments pick up the map's facility colors.
window.DEPT_COLOR_MIGRATION = { eng: '#facc15', scout: '#ec4899', sci: '#a855f7' };
window.migrateDeptColors = function (list) {
  try {
    if (localStorage.getItem('exo-dept-colors-v2')) return list;
    list.forEach(d => {
      if (window.DEPT_COLOR_MIGRATION[d.id]) d.color = window.DEPT_COLOR_MIGRATION[d.id];
    });
    localStorage.setItem('exo-dept-colors-v2', '1');
    localStorage.setItem(window.DEPT_KEY, JSON.stringify(list));
  } catch (e) {}
  return list;
};
window.loadDepts = function () {
  let list = null;
  try {
    const d = JSON.parse(localStorage.getItem(window.DEPT_KEY) || 'null');
    if (Array.isArray(d) && d.length) list = d;
  } catch (e) {}
  if (!list) list = JSON.parse(JSON.stringify(window.DEFAULT_DEPTS));
  list = list.map(x => Object.assign({ members: [] }, x));
  return window.migrateDeptColors(list);
};
window.saveDepts = function (d) { localStorage.setItem(window.DEPT_KEY, JSON.stringify(d)); };
window.deptOf = function (id) {
  const depts = window.loadDepts();
  return depts.find(d => d.id === id) || depts[0] || null;
};

// Log store: custom logs + edits applied to the founding logs.
window.LOG_KEY = 'exo-logs';
window.EDIT_KEY = 'exo-log-edits';
window.loadCustom = function () {
  try { return JSON.parse(localStorage.getItem(window.LOG_KEY) || '[]'); } catch (e) { return []; }
};
window.saveCustom = function (l) { localStorage.setItem(window.LOG_KEY, JSON.stringify(l)); };
window.loadEdits = function () {
  try { return JSON.parse(localStorage.getItem(window.EDIT_KEY) || '{}'); } catch (e) { return {}; }
};
window.saveEdits = function (e) { localStorage.setItem(window.EDIT_KEY, JSON.stringify(e)); };
window.REMOVED_KEY = 'exo-logs-removed';
window.loadRemoved = function () {
  try { return JSON.parse(localStorage.getItem(window.REMOVED_KEY) || '[]'); } catch (e) { return []; }
};
window.saveRemoved = function (r) { localStorage.setItem(window.REMOVED_KEY, JSON.stringify(r)); };
// Display order — set by dragging on add-log.html. Logs are numbered by position.
window.ORDER_KEY = 'exo-log-order';
window.loadOrder = function () {
  try { const o = JSON.parse(localStorage.getItem(window.ORDER_KEY) || '[]'); return Array.isArray(o) ? o : []; } catch (e) { return []; }
};
window.saveOrder = function (ids) { localStorage.setItem(window.ORDER_KEY, JSON.stringify(ids)); };
window.applyOrder = function (logs) {
  const order = window.loadOrder();
  const rank = id => { const i = order.indexOf(id); return i === -1 ? Infinity : i; };
  const sorted = logs
    .map((l, i) => ({ l, i }))
    .sort((a, b) => (rank(a.l.id) - rank(b.l.id)) || (a.i - b.i))
    .map(x => x.l);
  return sorted.map((l, i) => Object.assign({}, l, { num: i + 1, label: 'LOG-' + String(i + 1).padStart(2, '0') }));
};
window.allLogs = function () {
  const edits = window.loadEdits();
  const removed = window.loadRemoved();
  const base = window.BASE_LOGS
    .filter(l => !removed.includes(l.id))
    .map(l => Object.assign({}, l, edits[l.id] || {}, { base: true }));
  return window.applyOrder(base.concat(window.loadCustom().map(l => Object.assign({}, l, { base: false }))));
};
window.HIDDEN_KEY = 'exo-logs-hidden';
window.loadHidden = function () {
  try { return JSON.parse(localStorage.getItem(window.HIDDEN_KEY) || '[]'); } catch (e) { return []; }
};
window.saveHidden = function (h) { localStorage.setItem(window.HIDDEN_KEY, JSON.stringify(h)); };
window.isHidden = function (id) { return window.loadHidden().includes(id); };
window.visibleLogs = function () {
  const hidden = window.loadHidden();
  return window.allLogs().filter(l => !hidden.includes(l.id));
};
// Archive tags — editable on departments.html, always kept alphabetical
window.TAG_KEY = 'exo-tags';
window.DEFAULT_TAGS = ['Atmosphere', 'Energy', 'Geosphere', 'Gravity', 'Hydrosphere'];
window.loadTags = function () {
  let list = null;
  try {
    const t = JSON.parse(localStorage.getItem(window.TAG_KEY) || 'null');
    if (Array.isArray(t)) list = t.filter(x => typeof x === 'string' && x.trim());
  } catch (e) {}
  if (!list) list = window.DEFAULT_TAGS.slice();
  return list.slice().sort((a, b) => a.localeCompare(b));
};
window.saveTags = function (t) {
  localStorage.setItem(window.TAG_KEY, JSON.stringify(t.slice().sort((a, b) => a.localeCompare(b))));
};
window.tagLine = function (tags) {
  const t = (tags || []).filter(Boolean);
  return t.length ? ' · ' + t.slice().sort((a, b) => a.localeCompare(b)).join(' / ').toUpperCase() : '';
};
// Render log body text as paragraphs — blank lines (or single newlines) split.
window.contentHtml = function (text, style) {
  const css = style || 'margin:0 0 12px;line-height:1.6;';
  const paras = String(text || '').split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean);
  if (!paras.length) return '';
  return paras.map((p, i) =>
    '<p style="' + css + (i === paras.length - 1 ? 'margin-bottom:0;' : '') + '">' + window.escapeHtml(p) + '</p>'
  ).join('');
};
// The "Comparison to Earth" block that follows a log's body.
window.earthHtml = function (text, color) {
  const t = String(text || '').trim();
  if (!t) return '';
  const c = color || 'var(--primary)';
  return '<div style="margin:16px 0 0;padding:12px 0 0;border-top:1px dashed var(--border);">' +
    '<div style="font-size:11px;letter-spacing:2px;color:' + c + ';margin-bottom:8px;">COMPARISON TO EARTH</div>' +
    window.contentHtml(t, 'margin:0 0 10px;line-height:1.6;font-size:14px;color:var(--text-muted);') +
    '</div>';
};
window.escapeHtml = function (s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
};

// Situations — the open problems shown in the Situation Room. Editable on situations.html.
window.SIT_KEY = 'exo-situations';
window.DEFAULT_SITUATIONS = [
  {
    "id": "sit-01",
    "priority": "HIGH",
    "dept": "eng",
    "tags": [
      "Hydrosphere",
      "Geosphere"
    ],
    "title": "Night-phase pipe rupture, Hydro line 4",
    "body": "The line held for eleven cycles and split at 04:10 local, during the coldest band. Maintenance wants to re-lay the same alloy pipe on the same route. Water reserves cover nine days.",
    "prompt": "Will replacing the pipe like-for-like stop this happening again? What would you change about the route, the material, or the night-phase procedure — and what in the logs supports it?"
  },
  {
    "id": "sit-02",
    "priority": "MEDIUM",
    "dept": "scout",
    "tags": [
      "Gravity"
    ],
    "title": "Ridge survey shuttle is coming back light on fuel",
    "body": "Every ridge run lands with less margin than the flight plan predicted. The plan was written using Earth-standard launch figures. Scouting wants to cut crew from three to two rather than shorten the survey.",
    "prompt": "Is the crew the right thing to cut? Work out where the extra fuel is going before you decide what to remove."
  },
  {
    "id": "sit-03",
    "priority": "HIGH",
    "dept": "sci",
    "tags": [
      "Atmosphere",
      "Geosphere"
    ],
    "title": "Battery reserve is draining faster than it charges",
    "body": "Reserve storage has dropped for four consecutive cycles. A technician proposes locking the solar arrays flat to reduce the tracking motors’ own power draw.",
    "prompt": "Would locking the arrays flat help or hurt? Consider how long a daylight phase actually lasts here."
  }
];
window.loadSituations = function () {
  let list = null;
  try {
    const s = JSON.parse(localStorage.getItem(window.SIT_KEY) || 'null');
    if (Array.isArray(s)) list = s;
  } catch (e) {}
  if (!list) list = JSON.parse(JSON.stringify(window.DEFAULT_SITUATIONS));
  return list.map((s, i) => Object.assign({ tags: [] }, s, { num: i + 1, label: 'SIT-' + String(i + 1).padStart(2, '0') }));
};
window.saveSituations = function (list) {
  localStorage.setItem(window.SIT_KEY, JSON.stringify(list.map(s => ({
    id: s.id, priority: s.priority, dept: s.dept, tags: s.tags || [],
    title: s.title, body: s.body, prompt: s.prompt
  }))));
};

// Planet Profile — Earth facts are fixed; the exoplanet column is filled in on profile.html.
window.PROFILE_KEY = 'exo-profile';
window.NOT_COLLECTED = 'Data not yet collected';
// Profile figures are imperial (miles, °F); mass and gravity stay metric.
window.DEFAULT_PROFILE = [
  {
    "key": "diameter",
    "label": "DIAMETER",
    "earth": "7,918 miles across",
    "planet": "8,105 miles across"
  },
  {
    "key": "mass",
    "label": "MASS",
    "earth": "5.97 × 10²⁴ kg",
    "planet": "8.66 × 10²⁴ kg"
  },
  {
    "key": "gravity",
    "label": "SURFACE GRAVITY",
    "earth": "1.0 g (9.8 m/s²)",
    "planet": "1.1 g (10.8 m/s²)"
  },
  {
    "key": "day",
    "label": "LENGTH OF DAY",
    "earth": "24 hours",
    "planet": "24 hours"
  },
  {
    "key": "year",
    "label": "LENGTH OF YEAR",
    "earth": "365.25 days",
    "planet": "320 days"
  },
  {
    "key": "star",
    "label": "DISTANCE FROM ITS STAR",
    "earth": "93 million miles (1 AU)",
    "planet": "88 million miles"
  },
  {
    "key": "atmosphere",
    "label": "ATMOSPHERE",
    "earth": "78% nitrogen, 21% oxygen, 0.04% carbon dioxide",
    "planet": "74% nitrogen, 21% argon, 4.8% oxygen, 0.01% carbon dioxide"
  },
  {
    "key": "temp_day",
    "label": "AVERAGE DAYTIME TEMPERATURE",
    "earth": "About 70 °F across the daylit side",
    "planet": "95 °F"
  },
  {
    "key": "temp_night",
    "label": "AVERAGE NIGHTTIME TEMPERATURE",
    "earth": "About 50 °F across the night side",
    "planet": "-4 °F"
  },
  {
    "key": "water",
    "label": "SURFACE WATER",
    "earth": "71% of the surface; liquid, ice and vapor all present",
    "planet": "30% of the surface; liquid, ice and vapor all present"
  },
  {
    "key": "water_underground",
    "label": "UNDERGROUND WATER",
    "earth": "Aquifers hold more liquid fresh water than every river and lake combined",
    "planet": "No underground aquifers exist due to solid, non-porous rock"
  },
  {
    "key": "moons",
    "label": "MOONS",
    "earth": "1",
    "planet": "2"
  },
  {
    "key": "magnetic",
    "label": "MAGNETIC FIELD",
    "earth": "Yes — shields the surface from solar radiation",
    "planet": "Yes — strong protection from solar winds due to its dense molten iron core"
  },
  {
    "key": "geosphere",
    "label": "SURFACE FEATURES",
    "earth": "Rock and soil, active plate tectonics, volcanoes, mountains",
    "planet": "Deep tectonic canyons, tall volcanic spires, non-porous iron-basalt crust, massive fields of shattered gravel and fine rock dust"
  },
  {
    "key": "life",
    "label": "KNOWN LIFE",
    "earth": "Yes — the only planet where life is confirmed",
    "planet": "No — the planet is currently completely barren"
  }
];
window.loadProfile = function () {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(window.PROFILE_KEY) || '{}') || {}; } catch (e) {}
  const pub = window.loadPublished();
  return window.DEFAULT_PROFILE.map(r => Object.assign({}, r, {
    planet: String(saved[r.key] !== undefined ? saved[r.key] : r.planet).trim(),
    published: pub.includes(r.key)
  }));
};
// Which measurements are released to students. Anything unpublished still
// reads "Data not yet collected" on the public page, even once it is typed in.
window.PROFILE_PUB_KEY = 'exo-profile-published';
window.DEFAULT_PUBLISHED = [];
window.loadPublished = function () {
  try {
    const p = JSON.parse(localStorage.getItem(window.PROFILE_PUB_KEY) || 'null');
    if (Array.isArray(p)) return p;
  } catch (e) {}
  return window.DEFAULT_PUBLISHED.slice();
};
window.savePublished = function (keys) { localStorage.setItem(window.PROFILE_PUB_KEY, JSON.stringify(keys)); };

window.PROFILE_NOTES_KEY = 'exo-profile-notes';
window.loadProfileNotes = function () {
  try { return localStorage.getItem(window.PROFILE_NOTES_KEY) || ''; } catch (e) { return ''; }
};
window.saveProfileNotes = function (text) {
  localStorage.setItem(window.PROFILE_NOTES_KEY, String(text || '').trim());
};
window.saveProfile = function (rows) {
  const out = {};
  rows.forEach(r => { if ((r.planet || '').trim()) out[r.key] = r.planet.trim(); });
  localStorage.setItem(window.PROFILE_KEY, JSON.stringify(out));
};

// Planet environment telemetry — editable on central-command.html
window.TELEM_KEY = 'exo-telemetry-v3';
try { localStorage.removeItem('exo-telemetry'); localStorage.removeItem('exo-telemetry-v2'); } catch (e) {}
window.DEFAULT_TELEMETRY = [
  { key: 'gravity', label: 'GRAVITY', value: '1.1 g' },
  { key: 'atmosphere', label: 'ATMOSPHERE', value: '74% N₂ / 21% Ar / 5% O₂' },
  { key: 'temp', label: 'SURFACE TEMP', unit: '°F', bands: [
    { name: 'EARLY MORNING', start: 7,    min: -1,  max: 20 },
    { name: 'MID MORNING',   start: 9.5,  min: 39,  max: 60 },
    { name: 'MIDDAY',        start: 11,   min: 70,  max: 85 },
    { name: 'AFTERNOON',     start: 14,   min: 79,  max: 95 },
    { name: 'EVENING',       start: 17,   min: 25,  max: 58 },
    { name: 'NIGHT',         start: 21,   min: -10, max: 4 }
  ] }
];

// Which band covers the given hour (bands are ordered by start hour, wrapping at midnight)
window.currentBand = function (temp, hour) {
  const bands = (temp && temp.bands) || [];
  if (!bands.length) return null;
  const now = new Date();
  const h = typeof hour === 'number' ? hour : now.getHours() + now.getMinutes() / 60;
  const sorted = bands.slice().sort((a, b) => a.start - b.start);
  let found = sorted[sorted.length - 1];
  for (const b of sorted) { if (h >= b.start) found = b; }
  return found;
};
// A single reading sampled at random from the current band's range.
window.tempReading = function (temp, hour) {
  const b = window.currentBand(temp, hour);
  if (!b) return '—';
  const lo = Math.min(b.min, b.max), hi = Math.max(b.min, b.max);
  return Math.round(lo + Math.random() * (hi - lo)) + ' ' + (temp.unit || '°F');
};
window.loadTelemetry = function () {
  try {
    const t = JSON.parse(localStorage.getItem(window.TELEM_KEY) || 'null');
    if (Array.isArray(t) && t.length) {
      return window.DEFAULT_TELEMETRY.map(def => {
        const hit = t.find(x => x.key === def.key);
        if (!hit) return def;
        const merged = Object.assign({}, def, hit);
        if (def.bands && !Array.isArray(merged.bands)) merged.bands = def.bands;
        return merged;
      });
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(window.DEFAULT_TELEMETRY));
};
window.saveTelemetry = function (t) { localStorage.setItem(window.TELEM_KEY, JSON.stringify(t)); };
