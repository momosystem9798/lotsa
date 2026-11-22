'use strict';
/* ===== Lotsa: fristående läge =====
   När appen körs som Claude-artefakt finns window.claude med lagring, AI och nedladdning.
   Öppnas den någon annanstans (till exempel GitHub Pages eller som lokal fil) byggs samma
   funktioner här i stället:
   - db:        IndexedDB i den egna webbläsaren (varje dator har sin egen data)
   - sample:    Claude via Anthropic API med en API-nyckel som användaren själv lägger in
   - downloads: vanlig nedladdning i webbläsaren
   - dictation: webbläsarens taligenkänning där den finns
   - user:      ett lokalt id för webbläsaren */
const STANDALONE = (() => {
  if (window.claude && typeof window.claude.use === 'function') return null;

  const SDK_URL = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@1.6.0/+esm';
  const MODEL = 'claude-opus-5-5';
  const KEY_NAME = 'lotsa:apiKey';
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); return true; } catch (e) { return false; } }
  };
  const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const merge = (a, b) => { const o = { ...a }; for (const k of Object.keys(b)) o[k] = isObj(b[k]) && isObj(a[k]) ? merge(a[k], b[k]) : clone(b[k]); return o; };
  const err = (code, message, extra) => Object.assign({ code, message: message || code }, extra || {});

  /* ----- Lagring i IndexedDB: allt läses in vid start och skrivs igenom vid ändring ----- */
  const docs = new Map();
  const listeners = new Set();
  let idb = null;
  const collOf = p => p.split('/').slice(0, -1).join('/');
  const idOf = p => p.split('/').pop();
  function openIdb() {
    return new Promise(resolve => {
      try {
        const req = indexedDB.open('lotsa', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('docs');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
        req.onblocked = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }
  function idbAll(dbh) {
    return new Promise(resolve => {
      try {
        const st = dbh.transaction('docs').objectStore('docs'), out = [];
        const cur = st.openCursor();
        cur.onsuccess = () => { const c = cur.result; if (c) { out.push([c.key, c.value]); c.continue(); } else resolve(out); };
        cur.onerror = () => resolve(out);
      } catch (e) { resolve([]); }
    });
  }
  function idbWrite(path, value) {
    if (!idb) return Promise.resolve();
    return new Promise((resolve, reject) => {
      try {
        const tx = idb.transaction('docs', 'readwrite'), st = tx.objectStore('docs');
        if (value === undefined) st.delete(path); else st.put(value, path);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(err('unavailable', tx.error && tx.error.message));
        tx.onabort = () => reject(err('unavailable', tx.error && tx.error.message));
      } catch (e) { reject(err('unavailable', e.message)); }
    });
  }
  const snapOf = coll => ({
    docs: [...docs].filter(([p]) => collOf(p) === coll).sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([p, d]) => ({ id: idOf(p), exists: true, data: () => clone(d) })),
    metadata: { fromCache: false, hasPendingWrites: false }
  });
  const notify = coll => listeners.forEach(l => { if (l.coll === coll) setTimeout(() => l.cb(snapOf(coll)), 0); });
  const docPath = path => { if (path.split('/').length % 2) throw new TypeError('Ogiltig sökväg: ' + path); return path; };
  async function put(path, value) {
    const before = docs.get(path);
    if (value === undefined) docs.delete(path); else docs.set(path, value);
    try { await idbWrite(path, value); }
    catch (e) { if (before === undefined) docs.delete(path); else docs.set(path, before); throw e; }
    notify(collOf(path));
  }
  const db = {
    doc(path) {
      docPath(path);
      return {
        id: idOf(path), path,
        async get() { const d = docs.get(path); return { id: idOf(path), exists: d !== undefined, data: () => clone(d) }; },
        async set(data) { await put(path, clone(data)); },
        async update(data) { if (!docs.has(path)) throw err('invalid_argument', 'Dokumentet finns inte'); await put(path, merge(docs.get(path), data)); },
        async delete() { await put(path, undefined); }
      };
    },
    collection(coll) {
      return {
        path: coll,
        async get() { return snapOf(coll); },
        onSnapshot(cb) { const l = { coll, cb }; listeners.add(l); setTimeout(() => cb(snapOf(coll)), 0); return () => listeners.delete(l); },
        doc: id => db.doc(coll + '/' + id)
      };
    }
  };
  async function makeDb() {
    idb = await openIdb();
    if (!idb) return null; /* utan IndexedDB (till exempel privat läge i vissa webbläsare) körs appen i minnet */
    for (const [k, v] of await idbAll(idb)) docs.set(k, v);
    return db;
  }

  /* ----- Användare: ett id per webbläsare ----- */
  let localId = ls.get('lotsa:uid');
  if (!localId) { localId = 'u_' + Math.random().toString(36).slice(2, 10); ls.set('lotsa:uid', localId); }
  const user = {
    id: async () => localId,
    isOwner: async () => true,
    canEdit: async () => true,
    can: async () => true,
    me: async () => ({ id: localId, name: '' })
  };

  /* ----- Nedladdning ----- */
  const downloads = {
    async save({ filename, data, mimeType }) {
      const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType || 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = filename || 'lotsa'; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      return { status: 'saved' };
    }
  };

  /* ----- Röstinmatning via webbläsarens taligenkänning ----- */
  function makeDictation() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const on = { state: new Set(), partial: new Set(), final: new Set() };
    const fire = (k, v) => on[k].forEach(f => { try { f(v); } catch (e) { /* lyssnarens fel */ } });
    let rec = null, live = false;
    return {
      onState: f => { on.state.add(f); return () => on.state.delete(f); },
      onPartial: f => { on.partial.add(f); return () => on.partial.delete(f); },
      onFinal: f => { on.final.add(f); return () => on.final.delete(f); },
      active: () => live,
      start(opts) {
        return new Promise((resolve, reject) => {
          if (live) { resolve(); return; }
          rec = new SR();
          const lang = opts && opts.language;
          rec.lang = lang === 'sv' ? 'sv-SE' : (lang || navigator.language || 'sv-SE');
          rec.interimResults = true; rec.continuous = true;
          let started = false, reason = 'stopped';
          rec.onstart = () => { started = true; live = true; fire('state', { state: 'listening' }); resolve(); };
          rec.onresult = e => {
            let partial = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
              const r = e.results[i];
              if (r.isFinal) fire('final', { text: r[0].transcript + ' ' }); else partial += r[0].transcript;
            }
            if (partial) fire('partial', { text: partial });
          };
          rec.onerror = e => {
            const c = e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'not_granted' : e.error === 'language-not-supported' ? 'unavailable' : 'stopped';
            reason = c;
            if (!started) reject(err(c));
          };
          rec.onend = () => { live = false; fire('state', { state: 'idle', reason }); };
          try { rec.start(); } catch (e) { reject(err('unavailable', e.message)); }
        });
      },
      async stop() { if (rec) rec.stop(); }
    };
  }

  /* ----- AI: Claude via Anthropic API ----- */
  let sdkP = null;
  const loadSdk = () => (sdkP = sdkP || import(SDK_URL).then(m => m.default || m.Anthropic).catch(e => { sdkP = null; throw e; }));
  const blobToB64 = b => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] || '');
    r.onerror = () => reject(err('image_rejected'));
    r.readAsDataURL(b);
  });
  /* Appen skickar antingen en textsträng eller en lista med meddelanden. Följande meddelanden
     med samma roll slås ihop. Det första långa blocket (regler och manualutdrag) cachas så att
     följdfrågor om samma enhet blir snabbare och billigare. */
  async function toMessages(input, images) {
    const list = Array.isArray(input) ? input : [{ role: 'user', content: String(input) }];
    const msgs = [];
    for (const m of list) {
      const block = { type: 'text', text: String(m.content) };
      const last = msgs[msgs.length - 1];
      if (last && last.role === m.role) last.content.push(block); else msgs.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: [block] });
    }
    if (Array.isArray(input) && msgs[0] && msgs[0].content.length > 1 && msgs[0].content[0].text.length > 4000) {
      msgs[0].content[0].cache_control = { type: 'ephemeral' };
    }
    if (images && images.length) {
      const imgs = [];
      for (const b of images) imgs.push({ type: 'image', source: { type: 'base64', media_type: b.type || 'image/jpeg', data: await blobToB64(b) } });
      msgs[0].content.unshift(...imgs);
    }
    return msgs;
  }
  function parseJson(text) {
    const t = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    try { return JSON.parse(t); } catch (e) { /* leta upp JSON i texten nedan */ }
    const a = t.search(/[[{]/), b = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
    if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { /* faller igenom */ } }
    throw err('invalid_json', 'Svaret gick inte att tolka', { text: t });
  }
  function mapError(e, Anthropic) {
    if (e && e.code && !(Anthropic && e instanceof Anthropic.APIError)) return e;
    if (!Anthropic) return err('unavailable', String(e && e.message || e));
    if (e instanceof Anthropic.APIUserAbortError) return err('cancelled');
    if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) return err('bad_key', e.message);
    if (e instanceof Anthropic.RateLimitError) return err('rate_limited', e.message);
    if (e instanceof Anthropic.APIError && /credit balance|billing|purchase credits/i.test(String(e.message || ''))) return err('billing', e.message);
    if (e instanceof Anthropic.BadRequestError) {
      const msg = String(e.message || '');
      if (/prompt is too long|too many tokens|request_too_large/i.test(msg)) return err('prompt_too_large', msg);
      if (/image/i.test(msg)) return err('image_rejected', msg);
      return err('bad_request', msg);
    }
    if (e instanceof Anthropic.APIConnectionError) return err('offline', e.message);
    if (e instanceof Anthropic.APIError && e.status === 402) return err('billing', e.message);
    if (e instanceof Anthropic.APIError && e.status === 413) return err('prompt_too_large', e.message);
    return err('unavailable', String(e && e.message || e));
  }
  async function run(input, o = {}) {
    const key = ls.get(KEY_NAME);
    if (!key) throw err('no_key');
    let Anthropic = null;
    try { Anthropic = await loadSdk(); } catch (e) { throw err('sdk_load', String(e && e.message || e)); }
    try {
      const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 2 });
      const stream = client.beta.messages.stream({
        model: MODEL,
        max_tokens: 64000,
        /* Snabbt svar: låg ansträngning. Noggrannare svar och snabbkort: hög. */
        output_config: { effort: o.modelTier === 'default' ? 'high' : 'low' },
        /* Om en säkerhetsspärr avböjer frågan provas den automatiskt på en annan modell. */
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        messages: await toMessages(input, o.images)
      }, { signal: o.signal });
      if (o.onText) stream.on('text', (delta, snapshot) => { try { o.onText({ text: snapshot, delta }); } catch (e) { /* visning */ } });
      const msg = await stream.finalMessage();
      if (msg.stop_reason === 'refusal') throw err('refused');
      const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
      if (!text.trim()) throw err('empty_completion');
      return { text, truncated: msg.stop_reason === 'max_tokens', modelTierApplied: o.modelTier || 'quick' };
    } catch (e) {
      if (o.signal && o.signal.aborted) throw err('cancelled');
      const mapped = mapError(e, Anthropic);
      console.warn('Lotsa AI-fel:', mapped.code, mapped.message);
      throw mapped;
    }
  }
  const sample = (input, o) => run(input, o);
  sample.json = async (input, o) => parseJson((await run(input, o)).text);
  sample.limits = async () => ({ maxPromptBytes: 3000000, images: { maxCount: 4, maxInputBytes: 5000000, mediaTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] } });

  /* ----- Lokal AI: en språkmodell som körs på den egna datorn via llama.cpp (llama-server) -----
     Skrivbordsversionen startar llama-server på 127.0.0.1 och låter den servera appen. Då finns
     AI:n på samma adress som sidan och inget lämnar datorn. Adressen kan också anges för hand
     (localStorage "lotsa:localAi"), till exempel http://127.0.0.1:8080 vid test. */
  const LOCAL_NAME = 'lotsa:localAi';
  const LOOPBACK = /^(127\.0\.0\.1|localhost|\[::1\])$/;
  /* Bara numeriska adresser på den egna datorn godtas för hand (inte "localhost", som beror på
     namnuppslagningen). En annan adress i "lotsa:localAi" ignoreras, så att ingen kan styra
     frågorna till en server utanför datorn. */
  const loopbackBase = v => {
    try { const u = new URL(String(v || '')); return u.protocol === 'http:' && /^(127\.0\.0\.1|\[::1\])$/.test(u.hostname) ? u.origin : null; } catch (e) { return null; }
  };
  const sameOrigin = /^https?:$/.test(location.protocol) && LOOPBACK.test(location.hostname) ? location.origin : null;
  const manualBase = loopbackBase(ls.get(LOCAL_NAME));
  /* Lokalt läge gäller när sidan serveras från den egna datorn eller när en lokal adress är
     angiven. Då används aldrig molnet, inte ens om den lokala servern inte svarar. */
  const local = { intended: !!(manualBase || sameOrigin), base: null, model: '', ctx: 0 };
  async function probeLocal() {
    for (const base of [manualBase, sameOrigin].filter(Boolean)) {
      try {
        const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 2500);
        const r = await fetch(base + '/props', { signal: ctl.signal, redirect: 'error' });
        clearTimeout(t);
        if (!r.ok) continue;
        const p = await r.json();
        if (!p || !p.default_generation_settings) continue; /* inte llama-server */
        local.base = base;
        local.model = String(p.model_alias || p.model_path || '').split(/[\\/]/).pop().replace(/\.gguf$/i, '');
        local.ctx = Number(p.default_generation_settings.n_ctx) || 0;
        return true;
      } catch (e) { /* ingen lokal server här */ }
    }
    return false;
  }
  /* Läser OpenAI-formatets strömmade svar (server-sent events) och ger texten bit för bit. */
  async function readStream(res, onDelta) {
    const reader = res.body.getReader(), dec = new TextDecoder();
    let buf = '', text = '', finish = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') continue;
        let j; try { j = JSON.parse(data); } catch (e) { continue; }
        if (j.error) throw err('local_error', j.error.message || String(j.error));
        const c = j.choices && j.choices[0];
        if (!c) continue;
        const d = (c.delta && c.delta.content) || '';
        if (d) { text += d; onDelta(d, text); }
        if (c.finish_reason) finish = c.finish_reason;
      }
    }
    return { text, finish };
  }
  async function runLocal(input, o = {}) {
    if (o.images && o.images.length) throw err('images_unavailable');
    if (!local.base) throw err('local_offline');
    const list = Array.isArray(input) ? input : [{ role: 'user', content: String(input) }];
    const messages = [];
    for (const m of list) {
      const role = m.role === 'assistant' ? 'assistant' : 'user', last = messages[messages.length - 1];
      if (last && last.role === role) last.content += '\n\n' + String(m.content); else messages.push({ role, content: String(m.content) });
    }
    const body = {
      messages, stream: true, temperature: 0.1, top_p: 0.9,
      max_tokens: o.maxTokens || 1500,
      cache_prompt: true,
      /* Tänkläget stängs av: det tar för lång tid på en vanlig dator utan grafikkort. */
      chat_template_kwargs: { enable_thinking: false }
    };
    /* Med ett JSON-schema tvingar llama.cpp modellen att skriva giltig JSON i den ordningen. */
    if (o.schema) body.response_format = { type: 'json_schema', json_schema: { name: 'svar', schema: o.schema } };
    else if (o.json) body.response_format = { type: 'json_object' };
    let res;
    try {
      res = await fetch(local.base + '/v1/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: o.signal, redirect: 'error' });
    } catch (e) {
      if (o.signal && o.signal.aborted) throw err('cancelled');
      throw err('local_offline', String(e && e.message || e));
    }
    if (!res.ok) {
      let msg = '';
      try { const j = await res.json(); msg = (j.error && (j.error.message || j.error)) || ''; } catch (e) { /* inget JSON */ }
      msg = String(msg || res.status);
      if (res.status === 503) throw err('local_loading', msg);
      if (/context|n_ctx|too long|exceeds/i.test(msg)) throw err('prompt_too_large', msg);
      throw err('local_error', msg);
    }
    try {
      const { text, finish } = await readStream(res, (delta, snapshot) => { if (o.onText) { try { o.onText({ text: snapshot, delta }); } catch (e) { /* visning */ } } });
      if (!text.trim()) throw err('empty_completion');
      return { text, finish, truncated: finish !== 'stop', modelTierApplied: 'local' };
    } catch (e) {
      if (o.signal && o.signal.aborted) throw err('cancelled');
      if (e && e.code) { console.warn('Lotsa lokal AI-fel:', e.code, e.message); throw e; }
      throw err('local_error', String(e && e.message || e));
    }
  }
  const localSample = (input, o) => runLocal(input, o);
  /* Strikt: svaret måste vara avslutat på vanligt sätt och hela texten ett JSON-objekt.
     Avbruten generering eller text runt objektet räknas som ogiltigt. */
  localSample.json = async (input, o) => {
    const r = await runLocal(input, { ...o, json: true });
    if (r.finish !== 'stop') throw err('invalid_json', 'Svaret avbröts (' + (r.finish || 'inget slut') + ')');
    try { return JSON.parse(r.text.trim()); } catch (e) { throw err('invalid_json', 'Svaret var inte giltig JSON'); }
  };
  localSample.limits = async () => ({ maxPromptBytes: 60000, images: { maxCount: 0, maxInputBytes: 0, mediaTypes: [] } });
  localSample.local = true;

  /* I lokalt läge är molnklienten och webbläsarens taligenkänning (som skickar ljudet till en
     tjänst på nätet) avstängda. Svarar inte den lokala servern ger runLocal felet local_offline. */
  const cloud = () => (!local.intended && ls.get(KEY_NAME) ? sample : null);
  const caps = { db: null, user, sample: local.intended ? localSample : cloud(), downloads, dictation: local.intended ? null : makeDictation() };
  const dbReady = Promise.all([makeDb().then(d => { caps.db = d; }), local.intended ? probeLocal() : null]);
  window.claude = { use: name => dbReady.then(() => caps[name] || null) };

  return {
    sample,
    /* AI-klienten som gäller just nu: den lokala i lokalt läge, annars molnet om en nyckel finns. */
    activeSample: () => (local.intended ? localSample : cloud()),
    isLocal: () => local.intended,
    localInfo: () => ({ ...local }),
    hasKey: () => !!ls.get(KEY_NAME),
    keyHint: () => { const k = ls.get(KEY_NAME) || ''; return k ? k.slice(0, 10) + '…' + k.slice(-4) : ''; },
    setKey: k => ls.set(KEY_NAME, String(k || '').trim()),
    persistent: () => !!idb
  };
})();
