// Kontrollerar att exempeldatan hänger ihop: larmregister, snabbkort och statistik mot manualtexten.
const fs = require('fs'), vm = require('vm');
const ctx = { window: {}, document: { addEventListener() {} }, console, setTimeout, requestAnimationFrame: f => setTimeout(f, 0), navigator: {}, Blob, URL };
ctx.window.LOTSA_DEMO = null;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('../src/demo.js', 'utf8'), ctx);
vm.runInContext('var LOTSA_DEMO = window.LOTSA_DEMO;', ctx);
vm.runInContext(fs.readFileSync('../src/js/01-util.js', 'utf8').replace("'use strict';", '') + '\n' + fs.readFileSync('../src/js/03-text.js', 'utf8') + '\nthis.T = { verifyQuote, alarmBlock, matchAlarm, findPNR, canonCode, looksLikeCode, codeRegex, terms, detectLang, extractCodes };', ctx);
const D = ctx.window.LOTSA_DEMO, T = ctx.T;
let bad = 0;
const fail = m => { bad++; console.log('FEL:', m); };
const devIds = new Set(D.devices.map(d => d.id));
for (const m of D.manuals) {
  if (!devIds.has(m.deviceId)) fail(m.id + ': okänd enhet');
  const lang = T.detectLang(m.pages.map(p => p.text).join(' '));
  if (lang !== m.lang) fail(`${m.id}: språk ${lang} != ${m.lang}`);
  for (const [k, e] of Object.entries(m.alarms)) {
    const p = m.pages.find(x => x.n === e.sida);
    if (!p) { fail(`${m.id} ${k}: sida ${e.sida} saknas`); continue; }
    const b = T.alarmBlock(p.text, e.rad || k);
    if (!b) fail(`${m.id} ${k}: hittar inte stycket på sida ${e.sida}`);
    else { const t = p.text.slice(b.start, b.end); if (e.label && !t.includes(e.label)) fail(`${m.id} ${k}: larmtexten "${e.label}" står inte i stycket: ${t.slice(0, 60)}`); }
    if (!e.range && !T.matchAlarm(m.alarms, k)) fail(`${m.id} ${k}: matchAlarm misslyckas`);
  }
  const found = T.extractCodes(m.pages).map(T.canonCode);
  for (const k of Object.keys(m.alarms)) if (!m.alarms[k].range && !found.includes(T.canonCode(k))) fail(`${m.id} ${k}: extractCodes hittar inte koden (${found.join(',')})`);
  for (const key of ['uppstart', 'rengoring']) {
    const b = m.card[key], v = T.verifyQuote(m.pages, b.sida, b.citat);
    if (!v.ok) fail(`${m.id} kort ${key}: citatet finns inte: ${b.citat}`);
    else if (v.page !== b.sida) fail(`${m.id} kort ${key}: citatet står på sida ${v.page}, inte ${b.sida}`);
    const p = m.pages.find(x => x.n === b.sida);
    if (!p.text.includes(b.avsnitt)) fail(`${m.id} kort ${key}: avsnittet "${b.avsnitt}" står inte på sidan`);
  }
  for (const a of m.card.larm) if (!T.matchAlarm(m.alarms, a.kod.split(/ till | to /)[0])) fail(`${m.id} kort: larmkod ${a.kod} finns inte i registret`);
  console.log(m.id, m.pages.length, 'sidor,', m.pages.reduce((s, p) => s + p.text.length, 0), 'tecken,', Object.keys(m.alarms).length, 'larm');
}
for (const c of ['tips', 'flags', 'reports']) for (const x of D[c]) if (!devIds.has(x.deviceId)) fail(`${c} ${x.id}: okänd enhet`);
const qs = D.stats.questions, tot = qs.reduce((s, q) => s + q.n, 0);
for (const q of qs) if (!devIds.has(q.d)) fail('statistik: okänd enhet ' + q.d);
for (const r of D.stats.recent) if (!devIds.has(r.d)) fail('logg: okänd enhet ' + r.d);
console.log('frågor totalt', tot, '| obesvarade', qs.filter(q => !q.a).reduce((s, q) => s + q.n, 0), '| timmar', D.stats.hours.reduce((s, v) => s + v, 0), '| jitter', D.stats.jitter.length);
// personnummerspärr
const pn = [['Patient 19121212-1212 larmar', 1], ['121212-1212', 1], ['inventarie MT-10482 visar E-23', 0], ['ring 08-465 004 10', 0], ['20250314 är datumet', 0], ['pumpen 8112189876 larmar', 1]];
for (const [t, n] of pn) if (T.findPNR(t).length !== n) fail(`PNR: "${t}" gav ${T.findPNR(t).length}, väntade ${n}`);
for (const [t, ok] of [['E-23', true], ['e23', true], ['Err 11', true], ['T-112', true], ['F5', true], ['V-215', true], ['hur startar jag', false], ['batteri', false], ['2025', true]]) if (T.looksLikeCode(t) !== ok) fail(`looksLikeCode(${t}) != ${ok}`);
console.log(bad ? bad + ' fel' : 'Exempeldatan är konsekvent');
process.exit(bad ? 1 : 0);
