// Simulerad Claude-miljö för lokala tester: databas i minnet, AI med förutsägbara svar.
(() => {
  const opts = window.__MOCK_OPTS || {};
  const docs = new Map(); // path -> data
  const listeners = new Set(); // {coll, cb}
  if (opts.seed) for (const k of Object.keys(opts.seed)) docs.set(k, opts.seed[k]);
  const collOf = p => p.split('/').slice(0, -1).join('/');
  const idOf = p => p.split('/').pop();
  const clone = v => JSON.parse(JSON.stringify(v));
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const merge = (a, b) => { const o = { ...a }; for (const k of Object.keys(b)) o[k] = isObj(b[k]) && isObj(a[k]) ? merge(a[k], b[k]) : clone(b[k]); return o; };
  const snapOf = coll => ({ docs: [...docs].filter(([p]) => collOf(p) === coll).sort((a, b) => a[0] < b[0] ? -1 : 1).map(([p, d]) => ({ id: idOf(p), exists: true, data: () => clone(d) })), metadata: { fromCache: false, hasPendingWrites: false } });
  const notify = coll => listeners.forEach(l => { if (l.coll === coll) setTimeout(() => l.cb(snapOf(l.coll)), 0); });
  const check = path => { if (path.split('/').length % 2) throw new TypeError('bad doc path ' + path); };
  const denied = () => Promise.reject({ code: 'invalid_argument', message: 'no write' });
  const db = {
    doc(path) {
      check(path);
      return {
        id: idOf(path), path,
        async get() { const d = docs.get(path); return { id: idOf(path), exists: !!d, data: () => (d ? clone(d) : undefined) }; },
        async set(data) { if (opts.readOnly) return denied(); if (JSON.stringify(data).length > 262144) throw { code: 'invalid_argument', message: 'too large' }; docs.set(path, clone(data)); notify(collOf(path)); },
        async update(data) { if (opts.readOnly) return denied(); if (!docs.has(path)) throw { code: 'invalid_argument', message: 'missing' }; docs.set(path, merge(docs.get(path), data)); notify(collOf(path)); },
        async delete() { if (opts.readOnly) return denied(); docs.delete(path); notify(collOf(path)); }
      };
    },
    collection(coll) {
      if (coll.split('/').length % 2 === 0) throw new TypeError('bad collection path ' + coll);
      return {
        path: coll,
        async get() { return snapOf(coll); },
        onSnapshot(cb) { const l = { coll, cb }; listeners.add(l); setTimeout(() => cb(snapOf(coll)), 5); return () => listeners.delete(l); },
        doc: id => db.doc(coll + '/' + id)
      };
    }
  };
  window.__mockDocs = docs;
  const user = { id: async () => 'u_test1', isOwner: async () => true, canEdit: async () => true, can: async () => (opts.readOnly ? false : true), me: async () => ({ id: 'u_test1', name: '' }) };

  const calls = [];
  window.__aiCalls = calls;
  const pagesIn = text => { const out = []; const re = /\[Sida (\d+)\]\n([\s\S]*?)(?=\n\n\[Sida \d+\]|\n\n=== M\d|$)/g; let m; while ((m = re.exec(text))) out.push({ n: Number(m[1]), text: m[2] }); return out; };
  const firstSentence = t => { const lines = t.split('\n').map(s => s.trim()).filter(s => s.length > 28); return (lines[1] || lines[0] || t).slice(0, 110); };
  function answer(input, o) {
    const text = Array.isArray(input) ? input.map(x => x.content).join('\n\n') : String(input);
    const q = Array.isArray(input) ? input[input.length - 1].content : text;
    if (o && o.images) { const nums = (text.match(/sida ([\d, ]+)\./) || [, '1'])[1].split(',').map(s => Number(s.trim())); return nums.map(n => ({ sida: n, text: `Skannad sida ${n}\nTryck på START för att starta testpumpen.\nZ-9 SENSORFEL\nOrsak: Sensorn är smutsig.\nÅtgärd: Torka av sensorn.` })); }
    if (text.includes('Ge sökord')) return { sv: ['starta', 'uppstart'], en: ['start', 'switching'] };
    if (text.includes('FÖRSTA SIDORNA')) return { namn: 'Testpump X1', tillverkare: 'Testbolaget', modell: 'X1', kategori: 'infusion', version: 'Rev A', utgiven: '2025-06-01' };
    if (text.includes('Förklara larm- eller felkoden')) {
      const code = (text.match(/felkoden "([^"]+)"/) || [])[1] || '';
      const ps = pagesIn(text.split('UTDRAG')[1] || text);
      for (const p of ps) { const line = p.text.split('\n').find(l => l.toUpperCase().replace(/[^A-Z0-9]/g, '').includes(code.toUpperCase().replace(/[^A-Z0-9]/g, ''))); if (line) return { finns: true, kod: code.toUpperCase(), larmtext: 'SENSORFEL', prioritet: 'medel', betyder: 'Sensorn ger inget värde.', orsak: 'Sensorn är smutsig.', atgard: ['Torka av sensorn.', 'Starta om.'], sida: p.n, citat: line.trim().slice(0, 80), kontakta_mt: false }; }
      return { finns: false };
    }
    if (text.includes('snabbkort (lathund)')) {
      const ps = pagesIn(text.split('UTDRAG')[1] || text), p = ps[0] || { n: 1, text: '' };
      return { uppstart: { steg: ['Anslut nätkabeln.', 'Tryck på START.'], sida: p.n, avsnitt: 'Uppstart', citat: firstSentence(p.text) }, larm: [{ kod: 'Z-1', betyder: 'Sensorfel', gor: 'Torka av sensorn.' }], rengoring: { steg: ['Torka med fuktig duk.'], sida: p.n, avsnitt: 'Rengöring', citat: firstSentence(p.text) }, viktigt: ['Använd endast godkända tillbehör.'] };
    }
    // huvudfrågan
    const low = q.split(/(?:^|\n)Fråga[^:\n]*: /).pop().toLowerCase();
    if (/säkring|extern skärm/.test(low)) return { status: 'saknas', svar: 'Det står inte i manualen. Manualen beskriver underhåll men inte detta.', kallor: [], kontakta_mt: false, mt_orsak: '', typ: 'annat' };
    if (/dos|vilken hastighet ska/.test(low)) return { status: 'avvisad', svar: 'Jag kan inte ge råd om dosering eller inställningar för en patient. Följ ordinationen och lokala rutiner.', kallor: [], kontakta_mt: false, mt_orsak: '', typ: 'annat' };
    const head = Array.isArray(input) ? input[0].content : text;
    const ps = pagesIn(head.split('UTDRAG UR BRUKSANVISNINGAR')[1] || head);
    const words = low.match(/[a-zåäö]{4,}/g) || [];
    let best = ps[0] || { n: 1, text: 'x' }, bs = -1;
    for (const p of ps) { const t = p.text.toLowerCase(); const s = words.reduce((a, w) => a + (t.includes(w.slice(0, 5)) ? 1 : 0), 0) + (/start/.test(low) && /starta|switching on|set-up|funktionskontroll|kontroll före/i.test(p.text) ? 3 : 0) + (/reng/.test(low) && /rengöring|cleaning/i.test(p.text) ? 3 : 0); if (s > bs) { bs = s; best = p; } }
    const label = (head.match(/=== (M\d+):/g) || ['=== M1:']).length > 1 ? (() => { const idx = head.indexOf('[Sida ' + best.n + ']\n' + best.text.slice(0, 30)); const before = head.slice(0, idx); const all = before.match(/=== (M\d+):/g) || ['=== M1:']; return all[all.length - 1].replace(/[=: ]/g, ''); })() : 'M1';
    const mt = /tekniskt fel|ur drift|går inte att starta/.test(low);
    return { status: 'besvarad', svar: `Så här gör du enligt manualen:\n1. Kontrollera att enheten är hel och rengjord. [1]\n2. Följ stegen på sidan ${best.n}. [1]\n3. **Varning:** kontrollera alltid mot ordinationen. [2]`, kallor: [{ n: 1, manual: label, sida: best.n, avsnitt: 'Testavsnitt', citat: firstSentence(best.text) }, { n: 2, manual: label, sida: best.n + 40, avsnitt: 'Påhittat', citat: 'Det här citatet finns inte i manualen alls.' }], kontakta_mt: mt, mt_orsak: mt ? 'Manualen säger att enheten ska tas ur drift.' : '', typ: 'procedur' };
  }
  const run = async (input, o, asJson) => {
    calls.push({ input, tier: o && o.modelTier, images: o && o.images ? o.images.length : 0 });
    if (opts.aiError) throw { code: opts.aiError, message: 'mock' };
    const val = answer(input, o);
    const textOut = JSON.stringify(val);
    if (o && o.onText) { for (let i = 1; i <= 4; i++) { await new Promise(r => setTimeout(r, opts.slow || 30)); if (o.signal && o.signal.aborted) throw { code: 'cancelled', message: 'x' }; o.onText({ text: textOut.slice(0, Math.ceil(textOut.length * i / 4)), delta: '' }); } }
    else await new Promise(r => setTimeout(r, opts.slow || 30));
    if (o && o.signal && o.signal.aborted) throw { code: 'cancelled', message: 'x' };
    return asJson ? val : { text: textOut, truncated: false, modelTierApplied: 'quick' };
  };
  const sample = (input, o) => run(input, o, false);
  sample.json = (input, o) => run(input, o, true);
  sample.limits = async () => ({ maxPromptBytes: 262144, images: { maxCount: 4, maxInputBytes: 2e7, mediaTypes: ['image/jpeg', 'image/png'] } });
  const downloads = { save: async ({ filename, data }) => { const buf = data instanceof Blob ? new Uint8Array(await data.arrayBuffer()) : new TextEncoder().encode(String(data)); let bin = ''; for (let i = 0; i < buf.length; i += 8192) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 8192)); await window.__saveFile(filename, btoa(bin)); return { status: 'saved' }; } };
  const caps = { db, user, sample: opts.noAI ? null : sample, downloads, dictation: null };
  window.claude = { use: name => new Promise(r => setTimeout(() => r(caps[name] || null), 10)) };
})();
