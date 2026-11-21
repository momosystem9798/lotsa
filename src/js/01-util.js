'use strict';
/* ===== Lotsa: grundfunktioner ===== */
const DEMO = window.LOTSA_DEMO || { devices: [], manuals: [], tips: [], flags: [], reports: [], stats: null };
/* Artefaktens adress. Används i QR-koder. Kan ändras under Inställningar. */
const ARTIFACT_URL = 'https://claude.ai/artifact/Ld1mdvoVqrePFL7QeFHrdD';
const BRAND = 'Lotsa';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ESC[c]);
const raw = s => ({ __raw: String(s ?? '') });
const isRaw = v => v && typeof v === 'object' && typeof v.__raw === 'string';
function part(v) {
  if (v === null || v === undefined || v === false || v === true) return '';
  if (Array.isArray(v)) return v.map(part).join('');
  if (isRaw(v)) return v.__raw;
  return esc(v);
}
/* Mallsträng som alltid escapar insatta värden. Text från databasen, manualer och AI går aldrig in som HTML. */
function html(strings, ...vals) {
  let out = '';
  strings.forEach((s, i) => { out += s; if (i < vals.length) out += part(vals[i]); });
  return raw(out);
}
const setHTML = (el, tpl) => { if (el) el.innerHTML = part(tpl); };
const icon = (name, cls = '') => raw(`<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${name}"/></svg>`);

const pad = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
function fmtDate(v) {
  if (!v) return '';
  const d = typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(v + 'T12:00:00') : new Date(v);
  if (isNaN(d)) return '';
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
const fmtTime = v => { const d = new Date(v); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
function fmtWhen(v) {
  if (!v) return '';
  const d = new Date(v), now = new Date();
  const days = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
  if (days === 0) return `i dag ${fmtTime(d)}`;
  if (days === 1) return `i går ${fmtTime(d)}`;
  if (days < 7) return `${days} dagar sedan, ${fmtTime(d)}`;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}${d.getFullYear() !== now.getFullYear() ? ' ' + d.getFullYear() : ''} ${fmtTime(d)}`;
}
function relToMs(rel) {
  if (!rel) return 0;
  const d = new Date();
  const [h, m] = rel.hm.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  d.setDate(d.getDate() - rel.da);
  if (d.getTime() > Date.now()) d.setDate(d.getDate() - 1);
  return d.getTime();
}
function monthsSince(iso) {
  if (!iso) return null;
  const d = new Date(iso + (String(iso).length === 10 ? 'T12:00:00' : ''));
  if (isNaN(d)) return null;
  const n = new Date();
  return Math.max(0, (n.getFullYear() - d.getFullYear()) * 12 + (n.getMonth() - d.getMonth()) - (n.getDate() < d.getDate() ? 1 : 0));
}
function ageLabel(m) {
  if (m === null) return 'okänd ålder';
  if (m < 1) return 'under en månad';
  const y = Math.floor(m / 12), r = m % 12;
  return [y ? `${y} år` : '', r ? `${r} mån` : ''].filter(Boolean).join(' ');
}
const nf = n => Number(n).toLocaleString('sv-SE');
const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-5);
const slug = s => String(s).toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 28) || 'enhet';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sum = a => a.reduce((s, v) => s + v, 0);
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const nextFrame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function deepMerge(a, b) {
  if (!isObj(a) || !isObj(b)) return clone(b);
  const o = { ...a };
  for (const k of Object.keys(b)) o[k] = isObj(b[k]) && isObj(a[k]) ? deepMerge(a[k], b[k]) : clone(b[k]);
  return o;
}
const hashKey = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return 'k' + h.toString(36); };
const trunc = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };

const scripts = new Map();
function loadScript(src) {
  if (!scripts.has(src)) {
    scripts.set(src, new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = () => res();
      s.onerror = () => { scripts.delete(src); rej(new Error('Kunde inte ladda ' + src)); };
      document.head.append(s);
    }));
  }
  return scripts.get(src);
}

/* ----- Aviseringar och överlägg ----- */
function toast(msg, kind = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.setAttribute('role', kind === 'crit' ? 'alert' : 'status');
  setHTML(el, html`${icon(kind === 'crit' ? 'warn' : 'check')}<span>${msg}</span>`);
  $('#toasts').append(el);
  setTimeout(() => el.remove(), kind === 'crit' ? 6500 : 3800);
}
const overlays = [];
function openOverlay(node, { onClose } = {}) {
  const prev = document.activeElement;
  $('#overlays').append(node);
  const o = {
    node,
    close() {
      if (!node.isConnected) return;
      node.remove();
      const i = overlays.indexOf(o);
      if (i >= 0) overlays.splice(i, 1);
      if (onClose) onClose();
      if (prev && prev.isConnected && prev.focus) prev.focus();
    }
  };
  overlays.push(o);
  const f = node.querySelector('[autofocus]') || node.querySelector('button,[href],input,textarea,select');
  if (f) setTimeout(() => f.focus(), 30);
  return o;
}
function closeAllOverlays() { [...overlays].reverse().forEach(o => o.close()); }
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlays.length) { e.preventDefault(); overlays[overlays.length - 1].close(); }
});
function modal(tpl, { wide = false, onClose } = {}) {
  const s = document.createElement('div');
  s.className = 'scrim';
  setHTML(s, html`<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">${tpl}</div>`);
  const o = openOverlay(s, { onClose });
  s.addEventListener('mousedown', e => { if (e.target === s) o.close(); });
  o.body = s.firstElementChild;
  return o;
}
function drawer(tpl, { onClose } = {}) {
  const w = document.createElement('div');
  setHTML(w, html`<div class="drawer-scrim" data-act="closeOverlay"></div><aside class="drawer" role="dialog" aria-modal="true">${tpl}</aside>`);
  const o = openOverlay(w, { onClose });
  o.body = w.querySelector('.drawer');
  return o;
}
function confirmBox({ title, text, ok = 'OK', danger = false }) {
  return new Promise(resolve => {
    let done = false;
    const m = modal(html`
      <div class="modal-h"><h2 class="h2">${title}</h2></div>
      <div class="modal-b"><p>${text}</p></div>
      <div class="modal-f"><button class="btn" data-x="no">Avbryt</button><button class="btn ${danger ? 'btn-crit' : 'btn-primary'}" data-x="yes" autofocus>${ok}</button></div>`,
      { onClose: () => { if (!done) resolve(false); } });
    m.body.addEventListener('click', e => {
      const b = e.target.closest('[data-x]');
      if (!b) return;
      done = true; m.close(); resolve(b.dataset.x === 'yes');
    });
  });
}
async function copyText(text, okMsg = 'Kopierat') {
  try { await navigator.clipboard.writeText(text); toast(okMsg); }
  catch (e) {
    modal(html`<div class="modal-h"><h2 class="h2">Kopiera texten</h2><button class="btn btn-icon btn-quiet" data-act="closeOverlay" aria-label="Stäng">${icon('x')}</button></div>
      <div class="modal-b"><p class="hint">Automatisk kopiering tilläts inte här. Markera texten och kopiera den.</p><textarea class="textarea" rows="10" readonly autofocus>${text}</textarea></div>`);
  }
}

/* ----- Händelser: en lyssnare per typ, åtgärder slås upp på data-attribut ----- */
const ACT = {}, FORM = {}, INPUT = {}, CHANGE = {};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACT[el.dataset.act];
  if (!fn) return;
  if (el.tagName === 'A' && (el.getAttribute('href') || '#') === '#') e.preventDefault();
  fn(el, e);
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form');
  if (!f) return;
  e.preventDefault();
  const fn = FORM[f.dataset.form];
  if (fn) fn(f, e);
});
document.addEventListener('input', e => {
  const el = e.target.closest('[data-input]');
  if (el && INPUT[el.dataset.input]) INPUT[el.dataset.input](el, e);
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-change]');
  if (el && CHANGE[el.dataset.change]) CHANGE[el.dataset.change](el, e);
});
ACT.closeOverlay = () => { if (overlays.length) overlays[overlays.length - 1].close(); };
const formData = f => Object.fromEntries([...new FormData(f).entries()].map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
