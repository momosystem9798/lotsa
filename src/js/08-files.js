/* ===== Lotsa: uppladdning, OCR, QR-koder och utskrifter ===== */
const LIBS = {
  pdf: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js'],
  pdfWorker: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js', 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'],
  jspdf: ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'],
  qr: ['https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js', 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js'],
  jsqr: ['https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js', 'https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js']
};
async function loadLib(name) {
  let i = 0;
  for (const src of LIBS[name]) {
    try { await loadScript(src); return i; } catch (e) { i++; }
  }
  throw new Error('Biblioteket ' + name + ' kunde inte laddas');
}

/* ----- PDF till text ----- */
async function loadPdfJs() {
  const i = await loadLib('pdf');
  const lib = window.pdfjsLib;
  if (!lib) throw new Error('pdf.js saknas');
  lib.GlobalWorkerOptions.workerSrc = LIBS.pdfWorker[Math.min(i, 1)];
  return lib;
}
function textFromItems(items) {
  let out = '', lastY = null;
  for (const it of items) {
    if (typeof it.str !== 'string') continue;
    const y = it.transform ? it.transform[5] : null;
    if (lastY !== null && y !== null && Math.abs(y - lastY) > 2 && !out.endsWith('\n')) out += '\n';
    out += it.str;
    if (it.hasEOL) { out += '\n'; lastY = null; } else if (y !== null) lastY = y;
  }
  return out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim();
}
/* Öppnar PDF:en i en bakgrundstråd. Svarar den inte körs tolkningen i sidans egen tråd i stället. */
let pdfMainThread = false;
async function openPdfDoc(lib, bytes) {
  const open = () => lib.getDocument({ data: bytes.slice(), isEvalSupported: false });
  if (!pdfMainThread && !window.pdfjsWorker) {
    const task = open();
    let timer;
    try {
      return await Promise.race([task.promise, new Promise((_, rej) => { timer = setTimeout(() => rej(new Error('pdf-worker-timeout')), 15000); })]);
    } catch (e) {
      if (e && /Password|InvalidPDF|MissingPDF/.test(e.name || '')) throw e;
      try { task.destroy(); } catch (e2) { /* redan avslutad */ }
      pdfMainThread = true;
      await loadScript(lib.GlobalWorkerOptions.workerSrc);
    } finally { clearTimeout(timer); }
  }
  return open().promise;
}
async function extractPdf(file, onProgress, signal) {
  const lib = await loadPdfJs();
  const doc = await openPdfDoc(lib, new Uint8Array(await file.arrayBuffer()));
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    if (signal && signal.aborted) { doc.destroy(); throw { code: 'cancelled' }; }
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    pages.push({ n: i, text: textFromItems(tc.items) });
    page.cleanup();
    onProgress(i, doc.numPages);
    if (i % 3 === 0) await sleep(0);
  }
  return { doc, pages };
}
async function renderPageBlob(doc, n) {
  const page = await doc.getPage(n), v1 = page.getViewport({ scale: 1 });
  const scale = Math.min(3, Math.sqrt(1500000 / (v1.width * v1.height)));
  const vp = page.getViewport({ scale }), c = document.createElement('canvas');
  c.width = Math.round(vp.width); c.height = Math.round(vp.height);
  await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
  const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.85));
  c.width = c.height = 0;
  return blob;
}
function splitText(text) {
  const chunks = text.includes('\f') ? text.split('\f') : [];
  if (!chunks.length) {
    let cur = '';
    for (const para of text.replace(/\r/g, '').split(/\n{2,}/)) {
      if (cur.length + para.length > 2800 && cur) { chunks.push(cur); cur = ''; }
      cur += (cur ? '\n\n' : '') + para;
    }
    if (cur) chunks.push(cur);
  }
  return chunks.map((t, i) => ({ n: i + 1, text: t.trim() })).filter(p => p.text);
}
function guessVersion(pages) {
  const t = pages.slice(0, 3).map(p => p.text).join('\n') + '\n' + (pages.length ? pages[pages.length - 1].text : '');
  const v = t.match(/\b(Rev(?:ision)?\.?\s?[A-Z0-9][A-Z0-9.-]{0,6}|Version\s?\d+(?:\.\d+)*|Utgåva\s?\d+|Edition\s?[A-Z0-9]+|Issue\s?\d+)\b/i);
  const d = t.match(/\b(20\d{2})[-/.](0[1-9]|1[0-2])(?:[-/.](0[1-9]|[12]\d|3[01]))?\b/);
  return { version: v ? v[1].trim() : '', issued: d ? `${d[1]}-${d[2]}-${d[3] || '01'}` : '' };
}
const isBlank = p => p.text.replace(/\s/g, '').length < 40;

/* ----- Guiden Lägg till enhet / Ny manualversion ----- */
ACT.upload = el => openUpload(el.dataset.id || '');
function openUpload(deviceId) {
  if (!isAdmin()) { toast('Byt till ansvarig för att ladda upp manualer.'); return; }
  const dev = deviceId ? deviceById(deviceId) : null, oldM = dev ? manualFor(dev) : null;
  const st = { step: 1, dev, oldM, file: null, pages: null, pdf: null, scanned: [], busy: '', prog: 0, progText: '', err: '', ctl: null, diff: null, savedId: '',
    meta: { name: '', manufacturer: '', model: '', category: 'other', dept: '', inventoryNo: '', version: '', issued: '', lang: '' } };
  const m = modal(html`<div class="up-root"></div>`, { wide: true, onClose: () => { if (st.ctl) st.ctl.abort(); if (st.pdf && st.pdf.destroy) st.pdf.destroy(); } });
  const root = $('.up-root', m.body);
  const title = dev ? (oldM ? 'Ny manualversion' : 'Ladda upp manual') : 'Lägg till enhet';
  const steps = n => html`<div class="wsteps"><span class="${n === 1 ? 'is-on' : ''}">Manual</span><span class="${n === 2 ? 'is-on' : ''}">Uppgifter</span><span class="${n === 3 ? 'is-on' : ''}">Klart</span></div>`;
  const head = html`<div class="modal-h"><h2 class="h2">${title}</h2><button type="button" class="btn btn-icon btn-quiet" data-act="closeOverlay" aria-label="Stäng">${icon('x')}</button></div>`;
  const devCard = () => (dev ? html`<div class="filecard">${devIcon(dev)}<div class="grow"><strong>${dev.name}</strong><div class="small muted">${oldM ? 'Nuvarande manual: ' + verLine(oldM) : 'Ingen manual uppladdad'}</div></div></div>` : '');
  const draw = () => {
    if (st.step === 1) {
      const textN = st.pages ? st.pages.filter(p => !isBlank(p)).length : 0, chars = st.pages ? sum(st.pages.map(p => p.text.length)) : 0;
      setHTML(root, html`${head}<div class="modal-b">${steps(1)}${devCard()}
        ${!st.pages && !st.busy ? html`<label class="drop" id="upDrop"><input type="file" id="upFile" accept=".pdf,.txt,application/pdf,text/plain" class="sr">${icon('upload', 'ic-xl')}<strong>Välj tillverkarens bruksanvisning</strong><span class="hint">PDF-fil. Dra filen hit eller tryck för att välja. Skannade sidor kan tolkas med OCR.</span></label>` : ''}
        ${st.busy ? html`<div class="stack"><div class="typing">${dots()}<span id="upProgText">${st.progText}</span><span class="sp"></span>${st.ctl ? html`<button class="btn btn-s" data-u="stop">Avbryt</button>` : ''}</div><div class="progress"><i id="upProgBar" style="width:${st.prog}%"></i></div></div>` : ''}
        ${st.err ? html`<div class="notice crit">${icon('warn')}<div>${st.err}</div></div>` : ''}
        ${st.pages && !st.busy ? html`<div class="filecard">${icon('book', 'ic-l')}<div class="grow"><strong>${st.file.name}</strong><div class="small muted">${st.pages.length} sidor, ${nf(chars)} tecken text, ${LANG[st.meta.lang || '']}</div></div><button class="btn btn-s" data-u="reset">Byt fil</button></div>
          ${st.scanned.length ? html`<div class="notice warn">${icon('info')}<div><strong>${st.scanned.length} ${st.scanned.length === 1 ? 'sida saknar' : 'sidor saknar'} sökbar text</strong>Sidorna ser ut att vara skannade bilder. ${aiReady() ? 'OCR tolkar texten med AI. Det tar ungefär 10 sekunder per sida och använder ' + (STANDALONE ? 'din API-nyckel' : 'ditt Claude-konto') + '.' : 'OCR kräver AI, som inte är tillgänglig i den här visningen.'}
            ${aiReady() ? html`<br><button class="btn btn-s btn-primary" data-u="ocr">Tolka ${Math.min(30, st.scanned.length)} ${st.scanned.length > 30 ? 'sidor nu' : (st.scanned.length === 1 ? 'sida' : 'sidor')} med OCR</button>` : ''}</div></div>` : ''}
          ${textN ? html`<div class="notice ok">${icon('check')}<div>${textN} av ${st.pages.length} sidor har text som går att söka i${st.pages.some(p => p.ocr) ? ', varav ' + st.pages.filter(p => p.ocr).length + ' tolkade med OCR' : ''}.</div></div>` : html`<div class="notice crit">${icon('warn')}<div>Ingen sökbar text hittades. Kör OCR eller välj en annan fil.</div></div>`}` : ''}
        </div><div class="modal-f"><button type="button" class="btn" data-act="closeOverlay">Avbryt</button><button class="btn btn-primary" data-u="next" ${st.pages && !st.busy && textN ? '' : 'disabled'}>Fortsätt</button></div>`);
    } else if (st.step === 2) {
      const x = st.meta;
      setHTML(root, html`<form data-u="form">${head}<div class="modal-b">${steps(2)}${devCard()}
        ${st.err ? html`<div class="notice crit">${icon('warn')}<div>${st.err}</div></div>` : ''}
        ${st.busy ? html`<div class="typing">${dots()}<span>${st.progText}</span></div>` : ''}
        ${aiReady() && !st.busy ? html`<div class="rowflex"><button type="button" class="btn btn-s" data-u="autofill">${icon('spark', 'ic-s')}Fyll i från manualen</button><span class="hint">AI läser första och sista sidan. Kontrollera uppgifterna.</span></div>` : ''}
        <div class="formgrid">
          ${dev ? '' : html`<div class="field full"><label for="upName">Enhetens namn</label><input class="input" id="upName" name="name" value="${x.name}" required maxlength="80" placeholder="Till exempel Infusionspump Flow 300"></div>
          <div class="field"><label for="upMan">Tillverkare</label><input class="input" id="upMan" name="manufacturer" value="${x.manufacturer}" maxlength="60"></div>
          <div class="field"><label for="upMod">Modell</label><input class="input" id="upMod" name="model" value="${x.model}" maxlength="60"></div>
          <div class="field"><label for="upCat">Typ</label><select class="select" id="upCat" name="category">${Object.entries(CATS).map(([k, v]) => html`<option value="${k}" ${x.category === k ? 'selected' : ''}>${v}</option>`)}</select></div>
          <div class="field"><label for="upDept">Avdelning</label><input class="input" id="upDept" name="dept" value="${x.dept}" list="upDepts" required maxlength="60"><datalist id="upDepts">${depts().map(v => html`<option value="${v}"></option>`)}</datalist></div>
          <div class="field full"><label for="upInv">Inventarienummer</label><input class="input" id="upInv" name="inventoryNo" value="${x.inventoryNo}" maxlength="40"></div>`}
          <div class="field"><label for="upVer">Manualens version</label><input class="input" id="upVer" name="version" value="${x.version}" required maxlength="40" placeholder="Till exempel Rev C"></div>
          <div class="field"><label for="upIss">Utgivningsdatum</label><input class="input" id="upIss" name="issued" type="date" value="${x.issued}" required max="${dayKey()}"></div>
          <div class="field"><label for="upLang">Manualens språk</label><select class="select" id="upLang" name="lang"><option value="sv" ${x.lang === 'sv' ? 'selected' : ''}>Svenska</option><option value="en" ${x.lang === 'en' ? 'selected' : ''}>Engelska</option><option value="" ${!x.lang ? 'selected' : ''}>Annat</option></select><span class="hint">Svaren kommer alltid på svenska.</span></div>
        </div>
        ${st.diff ? html`<div class="notice">${icon('info')}<div><strong>Jämfört med ${oldM.version || 'förra versionen'}</strong>${st.diff.note} Larmregistret och snabbkortet nollställs och byggs upp från den nya manualen.</div></div>` : ''}
        </div><div class="modal-f"><button type="button" class="btn" data-u="back">Tillbaka</button><button class="btn btn-primary" ${st.busy ? 'disabled' : ''}>Spara manualen</button></div></form>`);
    } else {
      const d = deviceById(st.savedId);
      setHTML(root, html`${head}<div class="modal-b">${steps(3)}
        <div class="notice ok">${icon('check')}<div><strong>Manualen är sparad</strong>${d ? d.name : 'Enheten'} kan nu besvara frågor ur ${st.meta.version}. Texten finns kvar nästa gång appen öppnas.</div></div>
        <p>Nästa steg: skapa ett snabbkort och skriv ut QR-etiketten till enheten.</p></div>
        <div class="modal-f"><button class="btn" data-act="closeOverlay">Stäng</button><button class="btn" data-u="open" data-tab="info">${icon('qr')}QR-etikett</button><button class="btn btn-primary" data-u="open" data-tab="kort">${icon('card')}Till snabbkortet</button></div>`);
    }
  };
  const handleFile = async file => {
    st.file = file; st.err = ''; st.busy = 'read'; st.prog = 0; st.progText = 'Läser ' + file.name; draw();
    try {
      if (/\.txt$/i.test(file.name) || file.type === 'text/plain') { st.pages = splitText(await file.text()); st.pdf = null; }
      else {
        st.ctl = new AbortController();
        const r = await extractPdf(file, (i, n) => {
          st.prog = Math.round(i / n * 100); st.progText = `Läser sida ${i} av ${n}`;
          const b = $('#upProgBar', root), t = $('#upProgText', root);
          if (b) b.style.width = st.prog + '%';
          if (t) t.textContent = st.progText;
        }, st.ctl.signal);
        st.pdf = r.doc; st.pages = r.pages;
      }
      if (!st.pages.length) throw new Error('tom');
      st.scanned = st.pdf ? st.pages.filter(isBlank).map(p => p.n) : [];
      st.meta.lang = detectLang(st.pages.map(p => p.text).join(' '));
      const g = guessVersion(st.pages);
      st.meta.version = st.meta.version || g.version; st.meta.issued = st.meta.issued || g.issued;
      if (oldM) {
        const oldPages = await pagesOf(oldM);
        const a = new Set([...extractCodes(oldPages), ...Object.keys(oldM.alarms || {}).filter(k => !(oldM.alarms[k] || {}).range)].map(canonCode)), b = new Set(extractCodes(st.pages).map(canonCode));
        const shown = new Map(extractCodes(st.pages).concat(extractCodes(oldPages)).map(c => [canonCode(c), c]));
        const added = [...b].filter(c => !a.has(c)).map(c => shown.get(c) || c), gone = [...a].filter(c => !b.has(c)).map(c => shown.get(c) || c);
        st.diff = { note: !a.size && !b.size ? 'Inga larmkoder kunde jämföras.' : (!added.length && !gone.length ? 'Larmkoderna är oförändrade.' : `Nya larmkoder: ${added.length ? added.join(', ') : 'inga'}. Borttagna: ${gone.length ? gone.join(', ') : 'inga'}.`) };
      }
    } catch (e) {
      st.pages = null;
      st.err = e && e.code === 'cancelled' ? '' : 'Filen kunde inte läsas. Kontrollera att det är en PDF som inte är lösenordsskyddad.';
      console.warn('Uppladdning:', e);
    }
    st.busy = ''; st.ctl = null; draw();
  };
  const runOcr = async () => {
    st.err = '';
    const lim = await S.caps.sample.limits().catch(() => null);
    if (!lim || !lim.images) { st.err = 'Den här visningen kan inte skicka bilder till AI:n, så skannade sidor kan inte tolkas här. Öppna appen på en dator eller ladda upp en PDF med sökbar text.'; draw(); return; }
    const per = Math.max(1, Math.min(2, lim.images.maxCount || 1)), todo = st.scanned.slice(0, 30);
    st.ctl = new AbortController(); st.busy = 'ocr';
    let done = 0;
    try {
      for (let i = 0; i < todo.length; i += per) {
        const nums = todo.slice(i, i + per);
        st.prog = Math.round(done / todo.length * 100); st.progText = `Tolkar sida ${nums.join(' och ')}. ${done} av ${todo.length} klara.`; draw();
        const blobs = [];
        for (const n of nums) blobs.push(await renderPageBlob(st.pdf, n));
        const out = await ocrPages(blobs, nums, st.ctl.signal);
        out.forEach(o => { const p = st.pages.find(x => x.n === o.n); if (p && o.text) { p.text = o.text; p.ocr = true; } });
        done += nums.length;
      }
    } catch (e) { const t = aiFail(e); if (t) st.err = t + (done ? ' Sidorna som hann tolkas är kvar.' : ''); console.warn('OCR:', e); }
    st.scanned = st.pages.filter(isBlank).map(p => p.n);
    if (!st.meta.lang) st.meta.lang = detectLang(st.pages.map(p => p.text).join(' '));
    st.busy = ''; st.ctl = null; draw();
  };
  const keep = () => { const f = $('form', root); if (f) Object.assign(st.meta, formData(f)); };
  const save = async () => {
    keep();
    const x = st.meta, now = Date.now();
    const pages = st.pages.filter(p => p.text.trim()).map(p => ({ n: p.n, text: p.text, ...(p.ocr ? { ocr: true } : {}) }));
    st.err = ''; st.busy = 'save'; st.progText = 'Sparar manualen'; draw();
    try {
      const deviceId = dev ? dev.id : slug(x.name) + '-' + uid().slice(0, 4);
      if (!dev) await store.set(`devices/${deviceId}`, { name: x.name, manufacturer: x.manufacturer, model: x.model, category: x.category, dept: x.dept, inventoryNo: x.inventoryNo, contacts: {}, createdAt: now });
      const manualId = oldM ? oldM.id : 'm-' + deviceId;
      await writeParts(manualId, pages, now);
      const history = oldM ? [{ version: oldM.version || '', issued: oldM.issued || '', replacedAt: now, note: st.diff ? st.diff.note : '' }, ...(oldM.history || []).map(h => ({ version: h.version || '', issued: h.issued || '', replacedAt: h.replacedAt || 0, note: h.note || '' }))].slice(0, 12) : [];
      await store.set(`manuals/${manualId}`, { deviceId, title: st.file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '), fileName: st.file.name, version: x.version, issued: x.issued, lang: x.lang || '', pageCount: st.pages.length, textPages: pages.length, ocrPages: pages.filter(p => p.ocr).length, chars: sum(pages.map(p => p.text.length)), uploadedAt: now, bundled: false, alarms: {}, card: null, history });
      await deleteParts(manualId, now);
      pageCache.clear(); indexCache.clear();
      audit('manual', deviceId, oldM ? `Ny manualversion: ${x.version} ersätter ${oldM.version || 'tidigare version'}. ${st.diff ? st.diff.note + ' ' : ''}Larmregister och snabbkort nollställda.` : `Manual uppladdad: ${x.version}, ${st.pages.length} sidor${pages.some(p => p.ocr) ? ', ' + pages.filter(p => p.ocr).length + ' tolkade med OCR' : ''}.`);
      st.savedId = deviceId; st.step = 3;
    } catch (e) { console.warn('Spara manual:', e); st.err = 'Manualen kunde inte sparas. ' + (e && e.code === 'quota_exceeded' ? 'Lagringen är full.' : 'Försök igen.'); }
    st.busy = ''; draw();
  };
  root.addEventListener('change', e => { if (e.target.id === 'upFile' && e.target.files[0]) handleFile(e.target.files[0]); });
  root.addEventListener('dragover', e => { const d = e.target.closest('#upDrop'); if (d) { e.preventDefault(); d.classList.add('is-over'); } });
  root.addEventListener('dragleave', e => { const d = e.target.closest('#upDrop'); if (d) d.classList.remove('is-over'); });
  root.addEventListener('drop', e => { const d = e.target.closest('#upDrop'); if (!d) return; e.preventDefault(); const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) handleFile(f); });
  root.addEventListener('submit', e => { e.preventDefault(); e.stopPropagation(); if (!st.busy) save(); });
  root.addEventListener('click', async e => {
    const b = e.target.closest('[data-u]');
    if (!b || b.tagName === 'FORM') return;
    const a = b.dataset.u;
    if (a === 'stop') { if (st.ctl) st.ctl.abort(); }
    else if (a === 'reset') { if (st.pdf && st.pdf.destroy) st.pdf.destroy(); st.pages = null; st.pdf = null; st.file = null; st.scanned = []; st.err = ''; draw(); }
    else if (a === 'ocr') runOcr();
    else if (a === 'next') { st.step = 2; st.err = ''; draw(); }
    else if (a === 'back') { keep(); st.step = 1; st.err = ''; draw(); }
    else if (a === 'open') { m.close(); UI.devTab[st.savedId] = b.dataset.tab; if (ROUTE.name === 'enhet' && ROUTE.id === st.savedId) setDevTab(st.savedId, b.dataset.tab); else location.hash = '#enhet-' + st.savedId; }
    else if (a === 'autofill') {
      keep(); st.busy = 'ai'; st.progText = 'Läser manualens första sidor'; st.err = ''; draw();
      try {
        const r = await autofillMeta(st.pages), x = st.meta, str = v => (typeof v === 'string' ? v.trim() : '');
        if (!dev) { x.name = x.name || str(r.namn); x.manufacturer = x.manufacturer || str(r.tillverkare); x.model = x.model || str(r.modell); if (CATS[r.kategori] && x.category === 'other') x.category = r.kategori; }
        x.version = x.version || str(r.version);
        if (!x.issued && /^\d{4}-\d{2}-\d{2}$/.test(str(r.utgiven))) x.issued = str(r.utgiven);
      } catch (err) { const t = aiFail(err); if (t) st.err = t; }
      st.busy = ''; draw();
    }
  });
  draw();
}

/* ----- QR-koder ----- */
async function qrMatrix(text) {
  await loadLib('qr');
  const q = window.qrcode(0, 'M');
  q.addData(text); q.make();
  return { n: q.getModuleCount(), dark: (r, c) => q.isDark(r, c) };
}
async function drawQR(d) {
  const el = document.getElementById('qr-' + d.id), url = deviceUrl(d);
  if (!el) return;
  if (!url) { setHTML(el, html`<span class="small muted">Adress saknas</span>`); return; }
  try {
    const q = await qrMatrix(url);
    let p = '';
    for (let r = 0; r < q.n; r++) for (let c = 0; c < q.n; c++) if (q.dark(r, c)) p += `M${c},${r}h1v1h-1z`;
    if (el.isConnected) setHTML(el, raw(`<svg viewBox="0 0 ${q.n} ${q.n}" shape-rendering="crispEdges" role="img" aria-label="QR-kod till ${esc(d.name)}"><path d="${p}" fill="#000"/></svg>`));
  } catch (e) { setHTML(el, html`<span class="small muted">QR-koden kunde inte ritas. Kontrollera nätverket.</span>`); }
}
ACT.scanQR = () => {
  let inp = $('#scanInput');
  if (!inp) {
    inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*'; inp.id = 'scanInput'; inp.className = 'sr'; inp.tabIndex = -1;
    inp.setAttribute('capture', 'environment'); inp.setAttribute('aria-hidden', 'true');
    document.body.append(inp);
    inp.addEventListener('change', () => { const f = inp.files[0]; inp.value = ''; if (f) decodeQR(f); });
  }
  inp.click();
};
async function decodeQR(file) {
  toast('Läser QR-koden');
  try {
    const bmp = await createImageBitmap(file);
    let text = '';
    if ('BarcodeDetector' in window) {
      try { const r = await new window.BarcodeDetector({ formats: ['qr_code'] }).detect(bmp); if (r.length) text = r[0].rawValue; } catch (e) { /* prova nästa metod */ }
    }
    if (!text) {
      await loadLib('jsqr');
      for (const side of [1400, 800]) {
        const k = Math.min(1, side / Math.max(bmp.width, bmp.height)), c = document.createElement('canvas');
        c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
        const ctx = c.getContext('2d');
        ctx.drawImage(bmp, 0, 0, c.width, c.height);
        const r = window.jsQR(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
        if (r && r.data) { text = r.data; break; }
      }
    }
    if (!text) { toast('Ingen QR-kod hittades i bilden. Fota etiketten rakt framifrån och försök igen.', 'crit'); return; }
    const m = text.match(/#enhet-([a-z0-9-]+)/i);
    if (m && deviceById(m[1])) location.hash = '#enhet-' + m[1];
    else toast(m ? 'QR-koden pekar på en enhet som inte finns här.' : 'QR-koden hör inte till den här appen.', 'crit');
  } catch (e) { console.warn('QR:', e); toast('Bilden kunde inte läsas. Försök igen.', 'crit'); }
}

/* ----- Filer till användaren ----- */
async function saveFile(filename, data, fallback) {
  const dl = S.caps.downloads;
  if (!dl) {
    if (fallback) fallback(); else toast('Nedladdning är inte tillgänglig i den här visningen. Öppna appen i en webbläsare på datorn.', 'crit');
    return false;
  }
  try { await dl.save({ filename, data }); toast('Filen är sparad.'); return true; }
  catch (e) {
    const c = e && e.code;
    if (c === 'declined') return false;
    if (c === 'rate_limited') toast('En nedladdning väntar redan. Försök igen om en stund.');
    else if (c === 'rejected_extension' || c === 'extension_not_enabled') toast('Filformatet kan inte laddas ner i den här visningen.', 'crit');
    else {
      if (['unavailable', 'not_granted', 'capability_disabled', 'capability_removed'].includes(c)) S.caps.downloads = null;
      if (fallback) fallback(); else toast('Nedladdningen gick inte att genomföra här.', 'crit');
    }
    return false;
  }
}
/* jsPDF:s standardtypsnitt klarar Latin-1. Övriga tecken byts mot närmaste motsvarighet. */
const pdfText = s => String(s ?? '').replace(/[–—−‑]/g, '-').replace(/[“”„]/g, '"').replace(/[‘’]/g, "'").replace(/…/g, '...').replace(/[•●]/g, '-').replace(/[   ]/g, ' ').replace(/[^\x00-\xff]/g, '');
async function newPdf(format, orientation) {
  await loadLib('jspdf');
  return new window.jspdf.jsPDF({ unit: 'mm', format, orientation });
}
function pdfQR(doc, q, x, y, size) {
  const k = size / (q.n + 4);
  doc.setFillColor(255, 255, 255); doc.rect(x, y, size, size, 'F');
  doc.setFillColor(0, 0, 0);
  for (let r = 0; r < q.n; r++) for (let c = 0; c < q.n; c++) if (q.dark(r, c)) doc.rect(x + (c + 2) * k, y + (r + 2) * k, k + 0.02, k + 0.02, 'F');
}
function pdfLogo(doc, x, y, s) {
  doc.setFillColor(18, 112, 122); doc.roundedRect(x, y, s, s, s * 0.28, s * 0.28, 'F');
  doc.setDrawColor(255, 255, 255); doc.setLineWidth(s * 0.1); doc.setLineCap('round'); doc.setLineJoin('round');
  doc.lines([[0, s * 0.42], [s * 0.26, 0]], x + s * 0.34, y + s * 0.26, [1, 1], 'S');
  doc.setFillColor(240, 173, 46); doc.circle(x + s * 0.72, y + s * 0.7, s * 0.085, 'F');
}
ACT.cardPdf = async el => {
  const d = deviceById(el.dataset.id), m = manualFor(d);
  if (!m || !m.card) return;
  if (m.card.status !== 'approved') { toast('Kortet kan skrivas ut när en ansvarig har godkänt det.'); return; }
  const card = m.card, c = contactsOf(d), url = deviceUrl(d), T = pdfText;
  el.disabled = true;
  try {
    const q = url ? await qrMatrix(url) : null;
    const W = 148, H = 210, M = 10, CW = W - 2 * M, FOOT = 34;
    const build = async fs => {
      const doc = await newPdf('a5', 'portrait'), lh = fs * 0.44;
      doc.setFillColor(13, 43, 51); doc.rect(0, 0, W, 24, 'F');
      pdfLogo(doc, M, 6.5, 11);
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
      doc.text(doc.splitTextToSize(T(d.name), CW - 46)[0], M + 15, 13);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
      doc.text(T([makerLine(d), d.dept, d.inventoryNo].filter(Boolean).join('   ')), M + 15, 18.5);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('SNABBKORT', W - M, 13, { align: 'right' });
      if (card.status !== 'approved') { doc.setFillColor(240, 173, 46); doc.roundedRect(W - M - 36, 15.2, 36, 5.6, 1.2, 1.2, 'F'); doc.setTextColor(27, 18, 3); doc.setFontSize(7.2); doc.text('UTKAST, EJ GRANSKAT', W - M - 18, 19.1, { align: 'center' }); }
      let y = 33;
      const section = title => { doc.setTextColor(13, 43, 51); doc.setFont('helvetica', 'bold'); doc.setFontSize(fs + 1.6); doc.text(T(title), M, y); doc.setDrawColor(18, 112, 122); doc.setLineWidth(0.5); doc.line(M, y + 1.6, M + CW, y + 1.6); y += lh + 3.4; doc.setFontSize(fs); };
      const steps = arr => { arr.forEach((s, i) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(fs); const lines = doc.splitTextToSize(T(s), CW - 7); doc.setFont('helvetica', 'bold'); doc.text(`${i + 1}.`, M, y); doc.setFont('helvetica', 'normal'); doc.text(lines, M + 7, y); y += lines.length * lh + 1.2; }); y += 3; };
      if (card.uppstart.steg.length) { section('Starta'); steps(card.uppstart.steg); }
      if (card.larm.length) {
        section('Vanliga larm');
        card.larm.forEach(a => {
          doc.setFont('courier', 'bold'); doc.setFontSize(fs); doc.text(T(a.kod), M, y);
          doc.setFont('helvetica', 'bold'); const l1 = doc.splitTextToSize(T(a.betyder), CW - 30); doc.text(l1, M + 30, y); y += l1.length * lh;
          doc.setFont('helvetica', 'normal'); const l2 = doc.splitTextToSize(T(a.gor), CW - 30); doc.text(l2, M + 30, y); y += l2.length * lh + 1.6;
        });
        y += 2.4;
      }
      if (card.rengoring.steg.length) { section('Rengöring'); steps(card.rengoring.steg); }
      if ((card.viktigt || []).length) { section('Viktigt'); card.viktigt.forEach(s => { doc.setFont('helvetica', 'normal'); doc.setFontSize(fs); const lines = doc.splitTextToSize(T(s), CW - 5); doc.text('-', M, y); doc.text(lines, M + 5, y); y += lines.length * lh + 1.2; }); }
      return { doc, y };
    };
    let out = null;
    for (const fs of [10.5, 9.6, 8.8, 8, 7.2]) { out = await build(fs); if (out.y <= H - FOOT - 2) break; }
    const doc = out.doc, fy = H - FOOT;
    doc.setDrawColor(180, 195, 196); doc.setLineWidth(0.2); doc.line(M, fy, W - M, fy);
    if (q) pdfQR(doc, q, W - M - 26, fy + 3, 26);
    doc.setTextColor(13, 43, 51); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    if (c.mt.phone) doc.text(T(`Vid fel: ${c.mt.name || 'MT-jour'} ${c.mt.phone}`), M, fy + 7);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.4); doc.setTextColor(62, 89, 98);
    const foot = doc.splitTextToSize(T(`Bygger på ${m.title || 'bruksanvisningen'}, ${verLine(m)}. ${card.status === 'approved' ? 'Granskat av ansvarig ' + fmtDate(card.approvedAt || Date.now()) + '.' : 'Utkast som inte är granskat.'} Snabbkortet ersätter inte bruksanvisningen. Kontrollera alltid mot gällande manual.${q ? ' Skanna koden för hela manualen, larmkoder och frågor.' : ''}`), CW - 32);
    doc.text(foot, M, fy + 12.5);
    doc.setFontSize(7); doc.text(T(`${BRAND}, utskrivet ${dayKey()}`), M, H - 6);
    await saveFile(`Snabbkort ${slug(d.name)}.pdf`, doc.output('blob'));
  } catch (e) { console.warn('PDF:', e); toast('PDF-filen kunde inte skapas. Kontrollera nätverket och försök igen.', 'crit'); }
  el.disabled = false;
};
ACT.labelPdf = async el => {
  const d = deviceById(el.dataset.id), url = d && deviceUrl(d), T = pdfText;
  if (!url) return;
  el.disabled = true;
  try {
    const q = await qrMatrix(url), doc = await newPdf('a6', 'landscape'), W = 148, H = 105, c = contactsOf(d);
    doc.setDrawColor(180, 195, 196); doc.setLineWidth(0.3); doc.roundedRect(5, 5, W - 10, H - 10, 3, 3, 'S');
    pdfQR(doc, q, 11, 14, 62);
    const x = 80, cw = W - x - 11;
    pdfLogo(doc, x, 14, 9);
    doc.setTextColor(13, 43, 51); doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text(BRAND, x + 12, 20.5);
    doc.setFontSize(15);
    const name = doc.splitTextToSize(T(d.name), cw).slice(0, 2);
    doc.text(name, x, 34);
    let y = 34 + name.length * 6.4;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(62, 89, 98);
    [makerLine(d), d.dept, d.inventoryNo ? 'Inventarienummer ' + d.inventoryNo : ''].filter(Boolean).forEach(s => { doc.text(T(s), x, y); y += 4.8; });
    y += 3;
    doc.setTextColor(13, 43, 51); doc.setFontSize(10.5);
    const info = doc.splitTextToSize('Skanna med mobilens kamera för manual, larmkoder och snabbkort.', cw);
    doc.text(info, x, y); y += info.length * 4.8 + 3;
    if (c.mt.phone) { doc.setFontSize(9.5); doc.setTextColor(62, 89, 98); doc.text(doc.splitTextToSize(T(c.mt.name || 'MT-jour'), cw)[0], x, y); doc.setTextColor(13, 43, 51); doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text(T(c.mt.phone), x, y + 6); }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.2); doc.setTextColor(90, 116, 124);
    doc.text(doc.splitTextToSize(T(url), W - 22), 11, 84);
    await saveFile(`QR-etikett ${slug(d.name)}.pdf`, doc.output('blob'));
  } catch (e) { console.warn('PDF:', e); toast('Etiketten kunde inte skapas. Kontrollera nätverket och försök igen.', 'crit'); }
  el.disabled = false;
};
