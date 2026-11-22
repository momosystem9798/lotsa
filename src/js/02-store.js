/* ===== Lotsa: tillstånd, lagring och exempeldata ===== */
const COLLS = ['devices', 'manuals', 'tips', 'flags', 'reports'];
const DEFAULT_SETTINGS = {
  orgName: 'Demosjukhuset', staleMonths: 36, minutesPerAnswer: 6, demoMode: true, aiTier: 'quick',
  baseUrl: '', mtName: 'MT-jour', mtPhone: '', mtHours: '', gapsDone: {}
};
const S = {
  caps: { db: null, user: null, sample: null, downloads: null, dictation: null },
  ready: false, live: false, readOnly: false, canWrite: null, slow: false,
  uid: null, isOwner: false,
  settings: { ...DEFAULT_SETTINGS },
  prefs: { favorites: null, recents: [], role: 'staff', introHidden: false, tourSeen: false },
  aiOff: false, aiNote: ''
};

/* ----- Lagring: riktig databas när den finns, annars minne för den här visningen ----- */
const MEM = new Map();
const TOMB = '__lotsa_deleted__';
const liveColl = new Map();
const watchers = new Set();
let dataRev = 0;
const memoStore = new Map();
function memo(key, fn) {
  const m = memoStore.get(key);
  if (m && m.rev === dataRev) return m.v;
  const v = fn();
  memoStore.set(key, { rev: dataRev, v });
  return v;
}
const splitPath = path => { const p = path.split('/'); return { coll: p.slice(0, -1).join('/'), id: p[p.length - 1] }; };
function mergedColl(coll) {
  const out = new Map(liveColl.get(coll) || []);
  for (const [path, v] of MEM) {
    const c = splitPath(path);
    if (c.coll !== coll) continue;
    if (v === TOMB) out.delete(c.id); else out.set(c.id, v);
  }
  return out;
}
let emitQueued = false;
function emit() {
  dataRev++;
  if (emitQueued) return;
  emitQueued = true;
  requestAnimationFrame(() => { emitQueued = false; watchers.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); });
}
function demote(e) {
  const code = e && e.code;
  if (code === 'quota_exceeded') { toast('Lagringen är full. Ta bort äldre manualer eller data och försök igen.', 'crit'); return false; }
  const perm = ['not_granted', 'revoked', 'capability_disabled', 'capability_removed'].includes(code) || (code === 'invalid_argument' && S.canWrite !== true);
  if (!perm) return false;
  if (!S.readOnly) {
    S.readOnly = true;
    toast('Den här visningen kan inte spara. Det du gör finns kvar tills sidan stängs.');
    emit();
  }
  return true;
}
/* Läser ett dokument direkt från databasen när den delas (artefakten), annars från lagringen.
   Används före beslut som inte får bygga på en gammal kopia, som att godkänna ett snabbkort.
   Går en delad databas inte att läsa kastas felet vidare: då ska åtgärden avbrytas, inte bygga på
   en gammal kopia. */
async function freshDoc(path) {
  if (S.live && S.caps.db) { const s = await S.caps.db.doc(path).get(); return s.exists ? s.data() : null; }
  return store.get(path);
}
const store = {
  useLive() { return S.live && !S.readOnly; },
  async set(path, data) {
    data = clone(data);
    if (this.useLive()) {
      try { await S.caps.db.doc(path).set(data); return; }
      catch (e) { if (!demote(e)) throw e; }
    }
    MEM.set(path, data); emit();
  },
  /* Sammanfogar fält. Skapar dokumentet om det saknas. */
  async update(path, data) {
    data = clone(data);
    if (this.useLive()) {
      try { await S.caps.db.doc(path).update(data); return; }
      catch (e) {
        if (e && e.code === 'invalid_argument') {
          let exists = null;
          try { exists = (await S.caps.db.doc(path).get()).exists; } catch (e1) { exists = null; }
          if (exists === false) {
            try { await S.caps.db.doc(path).set(data); return; }
            catch (e2) { if (!demote(e2)) throw e2; }
          } else if (!demote(e)) throw e;
        } else if (!demote(e)) throw e;
      }
    }
    const cur = MEM.has(path) && MEM.get(path) !== TOMB ? MEM.get(path) : await this.get(path);
    MEM.set(path, deepMerge(cur || {}, data)); emit();
  },
  async del(path) {
    if (this.useLive()) {
      try { await S.caps.db.doc(path).delete(); return; }
      catch (e) { if (!demote(e)) throw e; }
    }
    MEM.set(path, TOMB); emit();
  },
  async get(path) {
    if (MEM.has(path)) { const v = MEM.get(path); return v === TOMB ? null : v; }
    const c = splitPath(path), lc = liveColl.get(c.coll);
    if (lc && lc.has(c.id)) return lc.get(c.id);
    if (S.live && !lc) {
      try { const s = await S.caps.db.doc(path).get(); return s.exists ? s.data() : null; } catch (e) { return null; }
    }
    return null;
  },
  async list(coll) {
    const m = new Map();
    if (S.live) {
      try { const qs = await S.caps.db.collection(coll).get(); qs.docs.forEach(d => m.set(d.id, d.data())); } catch (e) { /* visa det som finns */ }
    }
    for (const [path, v] of MEM) {
      const c = splitPath(path);
      if (c.coll !== coll) continue;
      if (v === TOMB) m.delete(c.id); else m.set(c.id, v);
    }
    return m;
  }
};

/* ----- Start: hämta funktionerna från värden och börja lyssna ----- */
async function initCaps() {
  const c = window.claude;
  const use = n => (c && typeof c.use === 'function') ? Promise.resolve().then(() => c.use(n)).catch(() => null) : Promise.resolve(null);
  const names = ['db', 'user', 'sample', 'downloads', 'dictation'];
  const res = await Promise.all(names.map(use));
  names.forEach((n, i) => { S.caps[n] = res[i] || null; });
  if (S.caps.user) {
    try {
      S.uid = await S.caps.user.id();
      S.isOwner = await S.caps.user.isOwner();
      S.canWrite = await S.caps.user.can('data.write');
    } catch (e) { /* läsningar ska aldrig avvisas, men appen klarar sig utan */ }
  }
  S.live = !!S.caps.db;
  if (S.live && S.canWrite === false) S.readOnly = true;
}
function startData(onReady) {
  let done = false;
  const finish = () => { if (done) return; done = true; S.ready = true; onReady(); };
  if (!S.live) { applySettings(); finish(); return; }
  const timer = setTimeout(() => { S.slow = true; applySettings(); finish(); emit(); }, 10000);
  const need = new Set([...COLLS, 'settings']);
  const got = coll => {
    need.delete(coll);
    if (coll === 'settings') applySettings();
    if (!need.size) { clearTimeout(timer); if (S.slow) { S.slow = false; } finish(); }
    emit();
  };
  for (const coll of [...COLLS, 'settings']) {
    S.caps.db.collection(coll).onSnapshot(qs => {
      const m = new Map();
      qs.docs.forEach(d => m.set(d.id, d.data()));
      liveColl.set(coll, m);
      got(coll);
    }, err => {
      console.warn('Lagring:', coll, err && err.code);
      got(coll);
    });
  }
}
function applySettings() {
  const doc = mergedColl('settings').get('app') || {};
  S.settings = { ...DEFAULT_SETTINGS, ...doc, gapsDone: { ...(doc.gapsDone || {}) } };
  dataRev++;
}
async function saveSettings(patch) {
  S.settings = { ...S.settings, ...patch };
  await store.update('settings/app', patch);
  applySettings();
}

/* ----- Exempeldata: tider räknas om från i dag så att demon alltid känns aktuell ----- */
const DEMO_IDS = {};
function hydrateDemo() {
  for (const c of COLLS) DEMO_IDS[c] = new Set(DEMO[c].map(x => x.id));
  DEMO.manuals.forEach(m => {
    m.uploadedAt = relToMs(m.uploadedRel);
    if (m.card) { m.card.madeAt = relToMs(m.card.madeRel); if (m.card.approvedRel) m.card.approvedAt = relToMs(m.card.approvedRel); }
    (m.history || []).forEach(h => { h.replacedAt = relToMs(h.replacedRel); });
  });
  for (const c of ['tips', 'flags', 'reports']) DEMO[c].forEach(x => {
    x.createdAt = relToMs(x.rel);
    if (x.decidedRel) x.decidedAt = relToMs(x.decidedRel);
    x.seedStatus = x.status;
  });
}
function mergeManual(b, o) {
  if (o.bundled === false) return { ...o, id: b.id, deviceId: b.deviceId, demo: false };
  return { ...b, ...o, id: b.id, demo: true, alarms: { ...(b.alarms || {}), ...(o.alarms || {}) }, card: o.card || b.card, history: o.history || b.history };
}
function all(coll) {
  return memo('all:' + coll, () => {
    const over = mergedColl(coll), out = [];
    if (S.settings.demoMode) {
      for (const b of DEMO[coll]) {
        const o = over.get(b.id);
        if (!o) out.push({ ...b, demo: true });
        else if (!o.deleted) out.push(coll === 'manuals' ? mergeManual(b, o) : { ...b, ...o, id: b.id, demo: true });
      }
    }
    for (const [id, o] of over) {
      if (DEMO_IDS[coll].has(id) || o.deleted) continue;
      out.push({ ...o, id });
    }
    return out;
  });
}
const devices = () => memo('devices', () => all('devices').slice().sort((a, b) => String(a.name).localeCompare(String(b.name), 'sv')));
const deviceById = id => devices().find(d => d.id === id) || null;
const manuals = () => memo('manuals', () => { const ids = new Set(devices().map(d => d.id)); return all('manuals').filter(m => ids.has(m.deviceId)); });
const manualFor = dev => (dev ? manuals().find(m => m.deviceId === dev.id) || null : null);
const manualById = id => manuals().find(m => m.id === id) || null;
const forDevices = coll => memo('fd:' + coll, () => { const ids = new Set(devices().map(d => d.id)); return all(coll).filter(x => ids.has(x.deviceId)).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); });
const tips = () => forDevices('tips');
const flags = () => forDevices('flags');
const reports = () => forDevices('reports');
const depts = () => memo('depts', () => [...new Set(devices().map(d => d.dept).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'sv')));
const openReportFor = id => reports().find(r => r.deviceId === id && r.status === 'open') || null;

function manualStatus(m) {
  if (!m) return { key: 'none', label: 'Manual saknas', cls: 'b-crit', ic: 'warn' };
  const mo = monthsSince(m.issued);
  if (mo === null) return { key: 'unknown', label: 'Utgivningsdatum saknas', cls: 'b-warn', ic: 'warn', months: null };
  if (mo >= S.settings.staleMonths) return { key: 'stale', label: 'Bör kontrolleras', cls: 'b-warn', ic: 'clock', months: mo };
  return { key: 'ok', label: 'Aktuell', cls: 'b-ok', ic: 'check', months: mo };
}
const verLine = m => (m ? `${m.version || 'Version saknas'}${m.issued ? ', utgiven ' + fmtDate(m.issued) : ''}` : 'Ingen manual');
const contactsOf = d => {
  const c = (d && d.contacts) || {};
  const mt = { name: S.settings.mtName, phone: S.settings.mtPhone, hours: S.settings.mtHours, ...(c.mt || {}) };
  if (!mt.phone && S.settings.mtPhone) { mt.phone = S.settings.mtPhone; mt.name = mt.name || S.settings.mtName; }
  return { mt, support: c.support || {} };
};

/* ----- Manualtext ----- */
const pageCache = new Map();
async function pagesOf(m) {
  if (!m) return [];
  if (m.pages) return m.pages;
  const key = m.id + ':' + (m.uploadedAt || 0);
  if (pageCache.has(key)) return pageCache.get(key);
  const parts = await store.list(`manuals/${m.id}/parts`);
  const arr = [...parts.values()].filter(p => !p.rev || p.rev === m.uploadedAt).sort((a, b) => (a.i || 0) - (b.i || 0)).flatMap(p => p.pages || []);
  pageCache.set(key, arr);
  return arr;
}
async function writeParts(manualId, pages, rev) {
  const parts = [];
  let cur = [], size = 0;
  for (const p of pages) {
    const bytes = new Blob([JSON.stringify(p)]).size + 2;
    if (cur.length && size + bytes > 170000) { parts.push(cur); cur = []; size = 0; }
    cur.push(p.text.length > 60000 ? { ...p, text: p.text.slice(0, 60000) } : p);
    size += bytes;
  }
  if (cur.length) parts.push(cur);
  for (let i = 0; i < parts.length; i++) await store.set(`manuals/${manualId}/parts/${rev}-${i}`, { rev, i, pages: parts[i] });
  return parts.length;
}
async function deleteParts(manualId, keepRev) {
  const parts = await store.list(`manuals/${manualId}/parts`);
  for (const [id, p] of parts) if (!keepRev || p.rev !== keepRev) await store.del(`manuals/${manualId}/parts/${id}`);
}

/* ----- Personliga val: favoriter, senast använda och roll ----- */
async function loadPrefs() {
  let p = null;
  if (S.live && S.uid) {
    try { const s = await S.caps.db.doc(`data/users/${S.uid}/prefs`).get(); if (s.exists) p = s.data(); } catch (e) { /* faller tillbaka nedan */ }
  }
  if (!p) { try { p = JSON.parse(localStorage.getItem('lotsa-prefs') || 'null'); } catch (e) { p = null; } }
  if (p) Object.assign(S.prefs, p);
}
let prefsRO = false;
const savePrefs = debounce(async () => {
  const data = clone(S.prefs);
  try { localStorage.setItem('lotsa-prefs', JSON.stringify(data)); } catch (e) { /* utan webblagring gäller valen bara nu */ }
  if (S.live && S.uid && !prefsRO && !S.readOnly) {
    try { await S.caps.db.doc(`data/users/${S.uid}/prefs`).set(data); } catch (e) { prefsRO = true; }
  }
}, 900);
function favorites() {
  if (Array.isArray(S.prefs.favorites)) return S.prefs.favorites;
  return S.settings.demoMode ? ['flow300', 'vac20'] : [];
}
function recents() {
  if (S.prefs.recents && S.prefs.recents.length) return S.prefs.recents;
  return S.settings.demoMode ? ['flow300', 'vistam5', 'aer5'] : [];
}
function toggleFav(id) {
  const f = favorites().slice();
  const i = f.indexOf(id);
  if (i >= 0) f.splice(i, 1); else f.unshift(id);
  S.prefs.favorites = f; savePrefs();
}
function touchRecent(id) {
  const r = (S.prefs.recents || []).filter(x => x !== id);
  r.unshift(id);
  S.prefs.recents = r.slice(0, 6); savePrefs();
}
const isAdmin = () => S.prefs.role === 'admin';

/* ----- Anonym frågelogg och händelselogg ----- */
let logsCache = null;
async function logQuestion(e) {
  const id = uid(), day = dayKey();
  try { await store.update(`logs/${day}`, { entries: { [id]: { t: Date.now(), ...e } } }); } catch (err) { console.warn('Logg:', err); }
  logsCache = null;
  return { id, day };
}
async function logPatch(ref, patch) {
  if (!ref) return;
  try { await store.update(`logs/${ref.day}`, { entries: { [ref.id]: patch } }); } catch (err) { console.warn('Logg:', err); }
  logsCache = null;
}
async function loadLogs() {
  if (logsCache && Date.now() - logsCache.at < 15000) return logsCache.rows;
  const m = await store.list('logs');
  const rows = [];
  for (const [day, doc] of m) for (const [id, e] of Object.entries((doc && doc.entries) || {})) rows.push({ id, day, ...e });
  rows.sort((a, b) => b.t - a.t);
  logsCache = { at: Date.now(), rows };
  return rows;
}
async function audit(type, d, text) {
  try { await store.update(`audit/${dayKey().slice(0, 7)}`, { entries: { [uid()]: { t: Date.now(), type, d: d || '', text, by: S.uid || '' } } }); } catch (err) { console.warn('Händelselogg:', err); }
}
async function loadAudit() {
  const m = await store.list('audit');
  const rows = [];
  for (const doc of m.values()) for (const e of Object.values((doc && doc.entries) || {})) rows.push(e);
  if (S.settings.demoMode && DEMO.stats) DEMO.stats.audit.forEach(a => rows.push({ t: relToMs(a), type: a.type, d: a.d, text: a.text, demo: true }));
  return rows.sort((a, b) => b.t - a.t);
}

/* ----- Ändringar ----- */
const saveDoc = (coll, id, patch) => store.update(`${coll}/${id}`, patch);
async function addDoc(coll, data, id = uid()) { await store.set(`${coll}/${id}`, { ...data, createdAt: data.createdAt || Date.now() }); return id; }
async function removeDevice(id) {
  const m = manuals().find(x => x.deviceId === id);
  if (m) { await deleteParts(m.id); await store.del(`manuals/${m.id}`); }
  for (const coll of ['tips', 'flags', 'reports']) for (const x of all(coll)) if (x.deviceId === id && !x.demo) await store.del(`${coll}/${x.id}`);
  await store.del(`devices/${id}`);
}
/* Återställer exempeldatan: allt som ändrats i exemplen går tillbaka till ursprungsläget. */
async function resetDemo() {
  for (const coll of COLLS) {
    for (const id of mergedColl(coll).keys()) {
      if (!DEMO_IDS[coll].has(id)) continue;
      if (coll === 'manuals') await deleteParts(id);
      await store.del(`${coll}/${id}`);
    }
  }
  pageCache.clear();
}
/* Raderar allt som lagts till i appen: egna enheter, manualer, tips, flaggor, felanmälningar och loggar. */
async function wipeOwn() {
  for (const coll of COLLS) {
    for (const id of mergedColl(coll).keys()) {
      if (DEMO_IDS[coll].has(id)) continue;
      if (coll === 'manuals') await deleteParts(id);
      await store.del(`${coll}/${id}`);
    }
  }
  for (const coll of ['logs', 'audit']) for (const id of (await store.list(coll)).keys()) await store.del(`${coll}/${id}`);
  logsCache = null; pageCache.clear();
}
