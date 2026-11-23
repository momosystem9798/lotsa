/* ===== Lotsa: textsökning, larmkoder, citatkontroll och spärr för personnummer ===== */
const STOP = new Set(('och att det som en är på av för med den till inte har de om ett jag man kan ska vi så var hur vad när där eller men från ' +
  'vid under efter innan min mitt din sig sin detta denna dessa också bara mycket göra gör blir bli får finns enligt ' +
  'the and is of to in for with on at by an be are was it that this as or if not from can may must should will when how what do does you your').split(' '));
const SUFFIX = ['ningarna', 'ningar', 'ningen', 'ning', 'heten', 'erna', 'arna', 'orna', 'ande', 'ende', 'aren', 'ade', 'are', 'ar', 'er', 'or', 'en', 'et', 'na', 'ing', 'ed', 'es', 'ly', 'a', 'e', 's', 't', 'n'];
function stem(t) {
  if (t.length < 5 || /\d/.test(t)) return t;
  for (const s of SUFFIX) if (t.length - s.length >= 4 && t.endsWith(s)) return t.slice(0, -s.length);
  return t;
}
function terms(text) {
  const out = [];
  const toks = String(text || '').toLowerCase().normalize('NFKC').match(/[a-zåäöéüæø0-9]+(?:-[a-zåäöéüæø0-9]+)*/g) || [];
  for (const tok of toks) {
    if (tok.includes('-')) {
      out.push(tok.replace(/-/g, ''));
      for (const p of tok.split('-')) if (p.length > 1 && !STOP.has(p)) out.push(stem(p));
    } else if (tok.length > 1 && !STOP.has(tok)) out.push(stem(tok));
  }
  return out;
}
const indexCache = new Map();
function pageIndex(m, pages) {
  const key = m.id + ':' + (m.uploadedAt || 0) + ':' + pages.length;
  if (indexCache.has(key)) return indexCache.get(key);
  const docs = pages.map(p => {
    const tf = new Map(), ts = terms(p.text);
    ts.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
    return { n: p.n, tf, len: ts.length || 1 };
  });
  const df = new Map();
  docs.forEach(d => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  const idx = { docs, df, avg: sum(docs.map(d => d.len)) / (docs.length || 1) };
  indexCache.set(key, idx);
  return idx;
}
/* BM25 över sidor. Sidan är enheten eftersom källhänvisningen ska peka på en sida. */
function rankPages(idx, qTerms) {
  const N = idx.docs.length, uniq = [...new Set(qTerms)], k1 = 1.4, b = 0.75;
  return idx.docs.map(d => {
    let s = 0;
    for (const t of uniq) {
      const f = d.tf.get(t);
      if (!f) continue;
      const idf = Math.log(1 + (N - (idx.df.get(t) || 0) + 0.5) / ((idx.df.get(t) || 0) + 0.5));
      s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.len / idx.avg));
    }
    return { n: d.n, score: s };
  }).filter(x => x.score > 0).sort((a, b2) => b2.score - a.score);
}
function detectLang(text) {
  const t = ' ' + String(text || '').toLowerCase().slice(0, 20000) + ' ';
  const count = ws => ws.reduce((s, w) => s + (t.split(' ' + w + ' ').length - 1), 0);
  const sv = count(['och', 'att', 'är', 'för', 'med', 'som', 'inte', 'ska', 'eller', 'vid']);
  const en = count(['the', 'and', 'is', 'of', 'to', 'for', 'with', 'not', 'or', 'be']);
  if (sv + en < 6) return '';
  return sv >= en ? 'sv' : 'en';
}
const LANG = { sv: 'svenska', en: 'engelska', '': 'okänt språk' };

/* ----- Citatkontroll: finns AI:ns citat ordagrant i manualtexten? ----- */
function normMap(text, alnumOnly, keepCase) {
  let s = '', map = [], space = true;
  for (let i = 0; i < text.length; i++) {
    let c = keepCase ? text[i] : text[i].toLowerCase();
    if (c === '­') continue;
    if (/\s/.test(c)) { if (!alnumOnly && !space) { s += ' '; map.push(i); space = true; } continue; }
    if ('“”„«»'.includes(c)) c = '"';
    else if ('’‘´`'.includes(c)) c = "'";
    else if ((keepCase ? '–—‑' : '–—−‑').includes(c)) c = '-'; /* i strikt läge är minustecknet − eget */
    if (alnumOnly && !/[a-z0-9åäöéüæø]/.test(c)) continue;
    s += c; map.push(i); space = false;
  }
  return { s, map };
}
function findQuote(pageText, quote) {
  if (!pageText || !quote) return null;
  const pieces = String(quote).split(/\s*(?:\.\.\.|…|\[\.\.\.\])\s*/).filter(x => x.replace(/\W/g, '').length >= 6);
  if (!pieces.length) return null;
  const longest = pieces.sort((a, b) => b.length - a.length)[0];
  for (const strict of [false, true]) {
    const P = normMap(pageText, strict);
    const Q = normMap(longest, strict).s.trim().replace(/^["'.,:;\s]+|["'.,:;\s]+$/g, '');
    if (Q.length < 6) continue;
    const i = P.s.indexOf(Q);
    if (i >= 0) return { start: P.map[i], end: P.map[i + Q.length - 1] + 1 };
  }
  return null;
}
/* Strikt kontroll för den lokala AI:n: citatet måste stå som ett sammanhängande spann i texten
   och börja och sluta på ordgräns. Bara blanksteg, citattecken och bindestreck (inte minustecknet)
   jämnas ut. Skiftläge, siffror, decimaltecken, enheter (mA är inte MA),
   skiljetecken och negationer måste stämma tecken för tecken, så "15 m" godtas inte för
   "1,5 m" och "får användas" inte för "får inte användas". Med from/to godtas bara en träff
   inom det fönstret, men ordgränserna kontrolleras ändå mot hela texten. */
function strictSpan(text, quote, from = 0, to = Infinity) {
  if (!text || !quote) return null;
  let Q = normMap(String(quote), false, true).s.trim().replace(/^["'\s]+|["'\s]+$/g, '');
  if (Q.split(' ').length < 3 || Q.replace(/[^\p{L}\p{N}]/gu, '').length < 12) return null;
  const P = normMap(text, false, true), s = P.s;
  for (const q of [Q]) {
    for (let i = s.indexOf(q); i >= 0; i = s.indexOf(q, i + 1)) {
      const b = s[i - 1], a = s[i + q.length], a2 = s[i + q.length + 1];
      const before = b === undefined || /[\s"'(\[«]/.test(b);
      const after = a === undefined || /[\s"')\]»;:!?]/.test(a) || (/[.,]/.test(a) && !/[0-9]/.test(a2 || ''));
      /* Ett citat får inte klippa ett tal: "The maximum flow is 1" ur "1 200 mL/h" eller "10" ur
         "10 - 20 V". Slutar citatet på en siffra måste talet avsluta satsen, och börjar det på en
         siffra får inget tal eller tecken stå direkt före. */
      const rest = s.slice(i + q.length, i + q.length + 2);
      const cutEnd = /\d$/.test(q) && !(rest === '' || /^[.,;:!?)\]»"'](?!\d)/.test(rest));
      const cutStart = /^\d/.test(q) && /[\d.,+\-−–]/.test(s[i - 2] || '');
      const st = P.map[i], en = P.map[i + q.length - 1] + 1;
      if (before && after && !cutEnd && !cutStart && st >= from && en <= to) return { start: st, end: en };
    }
  }
  return null;
}
/* Returnerar sidan där citatet faktiskt står. Rättar sidnumret om AI:n angav fel sida. */
function verifyQuote(pages, page, quote) {
  const hit = pages.find(p => p.n === page);
  if (hit) { const r = findQuote(hit.text, quote); if (r) return { ok: true, page, range: r }; }
  for (const p of pages) {
    if (p.n === page) continue;
    const r = findQuote(p.text, quote);
    if (r) return { ok: true, page: p.n, range: r, moved: true };
  }
  return { ok: false, page };
}
function markRange(text, range) {
  if (!range) return html`${text}`;
  return html`${text.slice(0, range.start)}<mark>${text.slice(range.start, range.end)}</mark>${text.slice(range.end)}`;
}
function snippetAround(text, range, span = 170) {
  if (!range) return html`${trunc(text.replace(/\s+/g, ' '), span * 2)}`;
  const a = Math.max(0, range.start - span / 2), b = Math.min(text.length, range.end + span / 2);
  const clean = s => s.replace(/\s+/g, ' ');
  return html`${a > 0 ? '…' : ''}${clean(text.slice(a, range.start))}<mark>${clean(text.slice(range.start, range.end))}</mark>${clean(text.slice(range.end, b))}${b < text.length ? '…' : ''}`;
}

/* ----- Larmkoder ----- */
const canonCode = s => String(s || '').toUpperCase().replace(/[^A-Z0-9ÅÄÖ]/g, '').replace(/\d+/g, n => n.replace(/^0+(?=\d)/, ''));
const looksLikeCode = s => {
  const text = String(s || '').trim();
  return /^[A-ZÅÄÖ]{1,5}[\s\-.:]{0,2}\d{1,4}[A-ZÅÄÖ]?$/i.test(text) && !/^(?:PEEP|SIDA)[\s\-.:]*\d/i.test(text);
};
function codeRegex(code, flags = 'i') {
  const parts = canonCode(code).match(/[A-ZÅÄÖ]+|\d+/g) || [];
  if (!parts.length) return /$^/;
  const pattern = parts.map(p => /^\d/.test(p) ? '0*' + p : p).join('[\\s\\-‑–.:]{0,2}');
  return new RegExp('(^|[^\\p{L}\\p{N}])(' + pattern + ')(?![\\p{L}\\p{N}])', flags.includes('u') ? flags : flags + 'u');
}
function matchAlarm(alarms, code) {
  const c = canonCode(code);
  if (!c) return null;
  /* Exakt kod (bara skiljetecken och skiftläge ignoreras) går först. Inledande nollor (E7 = E-07)
     godtas bara när det ger en enda träff, så att E7 och E-07 med olika betydelse aldrig blandas ihop. */
  const raw = t => String(t || '').toUpperCase().replace(/[^A-Z0-9ÅÄÖ]/g, '');
  const singles = Object.entries(alarms || {}).filter(([, e]) => !e.range);
  const exact = singles.find(([key]) => raw(key) === raw(code));
  if (exact) return { key: exact[0], entry: exact[1] };
  const loose = singles.filter(([key]) => canonCode(key) === c);
  if (loose.length === 1) return { key: loose[0][0], entry: loose[0][1] };
  if (loose.length > 1) return null;
  const m = c.match(/^([A-ZÅÄÖ]*)(\d+)$/);
  if (m) for (const [key, entry] of Object.entries(alarms || {})) {
    if (entry.range && canonCode(entry.range[0]) === m[1] && Number(m[2]) >= entry.range[1] && Number(m[2]) <= entry.range[2]) return { key, entry };
  }
  return null;
}
const CODE_LINE = /^(?:[A-Z]{1,4}[-‑–\s]?\d{1,4}[A-Z]?|Err\s?\d{1,3}|(?:Alarm|ALARM|Larm|Error|ERROR|Fel|Fault|FAULT|Code|CODE|Kod)\s?\d{1,4})(?=[\s:–‑-]|$)/;
/* En kort kod (E-23, Err 11, E-90 till E-99) som mönster för radens början, med teckengräns. */
function alarmCodeRe(code) {
  const ls = String(code || '').trim();
  if (!/^[\p{L}\p{N}][\p{L}\p{N}\s\-–‑]{0,15}$/u.test(ls)) return null;
  return new RegExp('^' + ls.split(/[\s\-–‑]+/).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s\\-–‑]*') + '(?![\\p{L}\\p{N}])(?![\\-–‑.]\\p{N})', 'iu');
}
/* Hela stycket i manualen som hör till en larmkod: från kodraden till nästa kodrad eller tom rad följd av rubrik. */
function alarmBlock(pageText, lineStart) {
  const lines = pageText.split('\n');
  let pos = 0, start = -1, end = pageText.length;
  const want = normMap(lineStart, true).s;
  if (!want) return null;
  /* En kort kod (E-23) jämförs mot radens början med teckengräns, så att E-23 inte träffar E-23A. */
  const codeRe = alarmCodeRe(lineStart);
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (start < 0) {
      const s = normMap(ln, true).s;
      if (codeRe ? codeRe.test(ln.trim()) : (s.startsWith(want) && !(/\d$/.test(want) && /\d/.test(s[want.length] || '')))) start = pos;
    } else if (CODE_LINE.test(ln.trim()) || /^\d+(\.\d+)*\s+\S/.test(ln.trim())) { end = pos; break; }
    pos += ln.length + 1;
  }
  if (start < 0) return null;
  return { start, end: pageText.slice(0, end).trimEnd().length };
}
function extractCodes(pages) {
  const set = new Set();
  for (const p of pages) for (const ln of p.text.split('\n')) {
    const m = ln.trim().match(CODE_LINE);
    if (m) set.add(m[0].replace(/\s+/g, ' ').trim());
  }
  return [...set];
}
const PRIO = { 'hög': { cls: 'p-hog', label: 'Hög prioritet' }, 'medel': { cls: 'p-medel', label: 'Medelhög prioritet' }, 'låg': { cls: 'p-lag', label: 'Låg prioritet' } };
const prioOf = p => PRIO[String(p || '').toLowerCase().replace('medelhög', 'medel')] || null;

/* ----- Spärr för personnummer ----- */
function findPNR(text) {
  const hits = [];
  const normalized = String(text || '').normalize('NFKC').replace(/[\p{Pd}−]/gu, '-');
  const re = /(?<!\d)((?:\d{4}-\d{2}-\d{2}|\d{6}(?:\d{2})?))(\s*[-+./]\s*|\s+)?(\d{4})(?!\d)/g;
  for (const [, date, separator, last] of normalized.matchAll(re)) {
    const six = date.replace(/-/g, '').slice(-6);
    if (!/^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]|6[1-9]|[78]\d|9[01])$/.test(six)) continue;
    const ten = (six + last).split('').map(Number);
    const luhn = ten.reduce((s, d, i) => { let v = d * (i % 2 === 0 ? 2 : 1); if (v > 9) v -= 9; return s + v; }, 0) % 10 === 0;
    if (luhn || separator || date.includes('-')) hits.push(date + (separator || '') + last);
  }
  return hits;
}

/* Ersätter allt som ser ut som personnummer med [borttaget]. Används på uppladdad manualtext innan
   den skickas till AI:n eller sparas. Positionerna räknas i den normaliserade texten, som nästan
   alltid är lika lång som originalet. Annars används den normaliserade texten. */
function maskPNR(text) {
  let out = String(text || ''), count = 0;
  /* Varje varv tar bort en träff (siffrorna ersätts), så loopen tar alltid slut. */
  for (;;) {
    const h = findPNR(out)[0];
    if (!h) break;
    const norm = out.normalize('NFKC').replace(/[\p{Pd}−]/gu, '-');
    if (norm.length !== out.length) out = norm;
    const at = norm.indexOf(h);
    if (at < 0) break;
    out = out.slice(0, at) + '[borttaget]' + out.slice(at + h.length);
    count++;
  }
  return { text: out, count };
}

const plainAnswer = text => String(text || '').replace(/\s*\[\d{1,2}\]/g, '').replace(/\*\*/g, '');
