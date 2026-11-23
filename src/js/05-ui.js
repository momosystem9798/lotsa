/* ===== Lotsa: gemensamma delar i gränssnittet ===== */
const CATS = { infusion: 'Infusion', monitor: 'Patientövervakning', suction: 'Sug', diathermy: 'Diatermi', ventilator: 'Ventilator', ecg: 'EKG', defib: 'Defibrillator', other: 'Övrigt' };
const KINDS = { start: 'Uppstart', alarm: 'Larm och fel', clean: 'Rengöring', other: 'Övrigt' };
const devIcon = (d, cls = '') => html`<span class="devic ${cls}">${icon('cat-' + (CATS[d.category] ? d.category : 'other'), cls === 'lg' ? 'ic-l' : '')}</span>`;
const demoBadge = x => (x && x.demo ? html`<span class="badge b-demo">Exempel</span>` : '');
const statusBadge = m => { const s = manualStatus(m); return html`<span class="badge ${s.cls}">${icon(s.ic)}${s.label}</span>`; };
const telHref = p => 'tel:' + String(p || '').replace(/[^\d+]/g, '');
const makerLine = d => [d.manufacturer, d.model].filter(Boolean).join(' ');
const dots = () => raw('<span class="dots"><i></i><i></i><i></i></span>');
const phiNote = (txt = 'Skriv aldrig namn, personnummer eller andra patientuppgifter. Svaren bygger på manualen och ersätter inte klinisk bedömning.') => html`<p class="phi">${icon('shield')}<span>${txt}</span></p>`;

/* ----- Källvisare: manualsidan som papper med citatet överstruket ----- */
async function openSource({ manualId, page, range = null, section = '', rev = null }) {
  const m = manualById(manualId);
  if (!m) { toast('Manualen finns inte längre.'); return; }
  /* Svaret byggde på en tidigare uppladdning av manualen: samma teckenposition kan vara en annan text nu. */
  const moved = rev != null && rev !== '' && Number(rev) !== (m.uploadedAt || 0);
  if (moved) range = null;
  const pages = await pagesOf(m);
  if (!pages.length) { toast('Manualens text kunde inte läsas in.'); return; }
  const st = { n: pages.some(p => p.n === page) ? page : pages[0].n };
  const stt = manualStatus(m);
  const d = drawer(html`
    <div class="drawer-h"><div><h2 class="h3">${m.title || 'Bruksanvisning'}</h2><p class="small muted">${verLine(m)}</p></div>
      <button class="btn btn-icon btn-quiet" data-act="closeOverlay" aria-label="Stäng">${icon('x')}</button></div>
    <div class="drawer-b"></div>`);
  const body = $('.drawer-b', d.body);
  const draw = () => {
    const i = Math.max(0, pages.findIndex(x => x.n === st.n)), p = pages[i], here = p.n === page && range;
    setHTML(body, html`
      ${moved ? html`<div class="notice crit">${icon('warn')}<div><strong>Manualen har bytts ut</strong>Svaret byggde på en tidigare version. Citatet markeras inte här. Ställ frågan igen.</div></div>` : ''}
      ${stt.key === 'stale' ? html`<div class="notice warn">${icon('clock')}<div>Manualen är äldre än ${S.settings.staleMonths} månader. Kontrollera att det är gällande version.</div></div>` : ''}
      <div class="paper-head"><strong>Sida ${p.n}</strong>${p.n === page && section ? html`<span class="muted">${section}</span>` : ''}${here ? html`<span class="src-check ok">${icon('check')}Citatet står här</span>` : ''}${p.ocr ? html`<span class="badge">Tolkad med OCR</span>` : ''}</div>
      <div class="paper" tabindex="0">${here ? markRange(p.text, range) : p.text}</div>
      <div class="paper-pager"><button class="btn btn-s" data-pg="-1" ${i <= 0 ? 'disabled' : ''}>${icon('left', 'ic-s')}Föregående</button><span class="sp"></span><span class="small muted num">${i + 1} av ${pages.length}</span><span class="sp"></span><button class="btn btn-s" data-pg="1" ${i >= pages.length - 1 ? 'disabled' : ''}>Nästa${icon('right', 'ic-s')}</button></div>`);
    const mk = $('mark', body);
    if (mk && mk.scrollIntoView) mk.scrollIntoView({ block: 'center' }); else body.scrollTop = 0;
  };
  body.addEventListener('click', e => {
    const b = e.target.closest('[data-pg]');
    if (!b) return;
    const i = pages.findIndex(x => x.n === st.n) + Number(b.dataset.pg);
    if (pages[i]) { st.n = pages[i].n; draw(); }
  });
  draw();
}
ACT.openPage = el => openSource({ manualId: el.dataset.m, rev: el.dataset.r, page: Number(el.dataset.p), range: el.dataset.s !== '' && el.dataset.s !== undefined ? { start: Number(el.dataset.s), end: Number(el.dataset.e) } : null });
ACT.openManual = el => openSource({ manualId: el.dataset.m, page: 1 });

/* ----- Steg för steg: ett handgrepp i taget med stor text ----- */
function openSteps({ title, sub = '', steps }) {
  if (!steps || !steps.length) return;
  const st = { i: 0 };
  const el = document.createElement('div');
  el.className = 'steps';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Steg för steg');
  const o = openOverlay(el);
  const draw = () => {
    setHTML(el, html`
      <div class="steps-h"><div><strong>${title}</strong>${sub ? html`<div class="small muted">${sub}</div>` : ''}</div><button class="btn btn-icon" data-s="x" aria-label="Stäng">${icon('x')}</button></div>
      <div class="steps-b"><div class="steps-dots">${steps.map((_, i) => raw(`<i class="${i <= st.i ? 'done' : ''}"></i>`))}</div>
        <div class="steps-n">Steg ${st.i + 1} av ${steps.length}</div><p class="steps-t">${steps[st.i]}</p></div>
      <div class="steps-f"><button class="btn" data-s="p" ${st.i === 0 ? 'disabled' : ''}>Tillbaka</button><button class="btn btn-primary" data-s="n" autofocus>${st.i === steps.length - 1 ? 'Klar' : 'Klart, nästa steg'}</button></div>`);
    const nb = $('[data-s="n"]', el);
    if (nb) nb.focus();
  };
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-s]');
    if (!b) return;
    if (b.dataset.s === 'x') o.close();
    else if (b.dataset.s === 'p') { st.i = Math.max(0, st.i - 1); draw(); }
    else if (st.i === steps.length - 1) o.close();
    else { st.i++; draw(); }
  });
  draw();
}

/* ----- Hänvisning till medicinteknik ----- */
const REPORT_CTX = new Map();
function mtCard(dev, { why = '', soft = false, code = '', tried = [] } = {}) {
  const c = contactsOf(dev);
  let ctx = '';
  if (dev) { ctx = uid(); REPORT_CTX.set(ctx, { deviceId: dev.id, code, tried }); }
  return html`<div class="mtcard ${soft ? 'soft' : ''}">
    <div class="mtcard-h">${icon('wrench')}Kontakta medicinteknik (MT)</div>
    ${why ? html`<p>${why}</p>` : ''}
    <div class="mtcard-rows">
      ${c.mt.phone ? html`<div class="mtcard-row"><span>${c.mt.name || 'MT-jour'}</span><a class="tel" href="${telHref(c.mt.phone)}">${c.mt.phone}</a>${c.mt.hours ? html`<span class="small muted">${c.mt.hours}</span>` : ''}</div>` : html`<p class="small">Inget nummer till MT är inlagt${dev ? ' för enheten' : ''}. Följ avdelningens rutin.</p>`}
      ${c.support.phone ? html`<div class="mtcard-row"><span>${c.support.name || 'Tillverkarens support'}</span><a class="tel" href="${telHref(c.support.phone)}">${c.support.phone}</a>${c.support.hours ? html`<span class="small muted">${c.support.hours}</span>` : ''}</div>` : ''}
    </div>
    ${dev ? html`<div><button class="btn btn-s" data-act="report" data-ctx="${ctx}">${icon('clipboard', 'ic-s')}Gör felanmälan</button></div>` : ''}
  </div>`;
}

/* ----- Larmkort ----- */
const ALARM_CTX = new Map();
function alarmCard(r, { shown = '' } = {}) {
  const e = r.entry, pr = prioOf(e.prio), dev = r.device, m = r.manual, st = manualStatus(m);
  const code = e.range && shown ? shown : r.key;
  const ctx = uid();
  ALARM_CTX.set(ctx, r);
  const b = r.block, steps = b ? b.steps : [];
  return html`<article class="alarm-card ${pr ? pr.cls : ''}">
    <div class="alarm-top"><span class="alarm-code">${code}</span>
      <div class="grow"><div class="alarm-label">${b ? b.head || 'Larm' : (e.ai ? 'Larm' : e.label || 'Larm')}</div>
        <div class="rowflex small">${pr ? html`<span class="prio ${pr.cls}"><i></i>${pr.label}</span>` : ''}<span class="muted">${dev.name}</span></div></div></div>
    ${b ? html`<div class="alarm-text"><div class="ex-ref"><span class="ex-page">Ur manualen, sida ${b.page}, ordagrant</span>${b.ocr ? html` <span class="ocr-tag">OCR</span>` : ''}</div><div class="excerpt-text">${b.text}</div></div>`
      : html`<div class="notice warn">${icon('warn')}<div>Larmstycket hittades inte i manualtexten. Öppna manualen på sidan ${e.sida || '?'} och läs där.</div></div>`}
    ${e.mt ? mtCard(dev, { why: 'Enligt larmregistret ska utrustningen tas ur drift eller kontrolleras av tekniker.', code, tried: steps }) : ''}
    ${e.ai && !e.verified ? html`<div class="notice warn">${icon('warn')}<div>Citatet kunde inte kontrolleras mot manualtexten. Läs sidan i manualen innan du agerar.</div></div>` : ''}
    <div class="alarm-foot">
      <button class="btn btn-s" data-act="alarmSrc" data-ctx="${ctx}">${icon('book', 'ic-s')}Läs i manualen, sida ${e.sida || '?'}</button>
      <span class="small muted">Kod, rubrik och prioritet ur larmregistret. ${m.version || ''}${st.key === 'stale' ? ', bör kontrolleras' : ''}${e.ai ? ', tolkad av AI och inte granskad' : ''}</span>
      <span class="sp"></span>
      ${steps.length > 1 ? html`<button class="btn btn-s btn-primary" data-act="alarmSteps" data-ctx="${ctx}">${icon('steps', 'ic-s')}Steg för steg</button>` : ''}
      ${!e.mt ? html`<button class="btn btn-s" data-act="alarmReport" data-ctx="${ctx}" data-code="${code}">${icon('clipboard', 'ic-s')}Felanmälan</button>` : ''}
    </div>
  </article>`;
}
ACT.alarmSrc = async el => {
  const r = ALARM_CTX.get(el.dataset.ctx);
  if (!r) return;
  const pages = await pagesOf(r.manual), e = r.entry;
  let page = e.sida, range = null;
  const tryPage = p => (p ? alarmBlock(p.text, e.rad || r.key) || (e.citat ? findQuote(p.text, e.citat) : null) : null);
  if (r.block) { page = r.block.page; range = { start: r.block.start, end: r.block.end }; }
  else range = tryPage(pages.find(p => p.n === page));
  if (!range) for (const p of pages) { const rg = tryPage(p); if (rg) { page = p.n; range = rg; break; } }
  openSource({ manualId: r.manual.id, page, range });
};
ACT.alarmSteps = el => { const r = ALARM_CTX.get(el.dataset.ctx); if (r) openSteps({ title: `${r.key} ${r.block ? r.block.head : ''}`.trim(), sub: `${r.device.name}, ur manualen sida ${r.block ? r.block.page : r.entry.sida}${r.block && r.block.ocr ? ' (OCR, maskinellt tolkad sida)' : ''}`, steps: r.block ? r.block.steps : [] }); };
ACT.alarmReport = el => { const r = ALARM_CTX.get(el.dataset.ctx); if (r) openReport({ deviceId: r.device.id, code: el.dataset.code || r.key, tried: r.block ? r.block.steps : [] }); };
function alarmResultTpl(res, { deviceId = null, code = '' } = {}) {
  const dev = deviceId ? deviceById(deviceId) : null;
  const hits = res.textHits || [];
  const textInner = hits.length ? html`<div class="notice">${icon('book')}<div><strong>Ur manualen${hits.some(h => h.pages.slice(0, 2).some(p => p.ocr)) ? ' (sidor märkta OCR är tolkade maskinellt)' : ', ordagrant'}</strong>Koden finns inte i larmregistret${res.results.length ? ' för ' + hits.map(h => h.device.name).join(' och ') : ''}, men nämns i manualen. Här är manualens egen text.</div></div>
      ${hits.map(h => h.pages.slice(0, 2).map(p => {
        const m = p.text.match(codeRegex(code)), i = m ? m.index + m[1].length : 0;
        const rg = m ? (alarmBlock(p.text, p.text.slice(i, i + m[2].length)) || { start: i, end: i + m[2].length }) : null;
        return html`<button class="fallback-hit" data-act="openPage" data-m="${h.manual.id}" data-p="${p.n}" data-s="${rg ? rg.start : ''}" data-e="${rg ? rg.end : ''}"><strong>${h.device.name}, sida ${p.n}${p.ocr ? html` <span class="ocr-tag">OCR</span>` : ''}</strong><span>${snippetAround(p.text, rg, 420)}</span></button>`; }))}` : '';
  /* Utan registerträff ramar anroparen in texten. Med registerträffar får texten en egen ruta. */
  const textPart = textInner && res.results.length ? html`<article class="msg-a">${textInner}</article>` : textInner;
  if (res.results.length) return html`${res.results.map(r => alarmCard(r, { shown: code }))}${textPart}`;
  if (hits.length) return textPart;
  return html`<div class="a-status saknas">${icon('search-x')}Det står inte i manualen</div>
    <p>Koden <span class="code">${code}</span> finns inte i ${dev ? 'manualen för ' + dev.name : 'någon av manualerna'}. Kontrollera att koden är rätt avläst.</p>
    ${dev ? mtCard(dev, { soft: true, why: 'Stämmer koden: kontakta MT eller tillverkarens support.', code }) : ''}`;
}
async function runAlarm(code, deviceId, out) {
  code = String(code || '').trim();
  if (!code || !out) return;
  if (findPNR(code).length) { toast('Skriv bara larmkoden, inga personuppgifter.', 'crit'); return; }
  const shown = code.toUpperCase();
  /* Varje uppslag får ett löpnummer. Ett äldre uppslag som blir klart sent ritar inte över ett nyare. */
  const seq = String((Number(out.dataset.seq) || 0) + 1);
  out.dataset.seq = seq;
  const current = () => out.dataset.seq === seq && out.isConnected;
  setHTML(out, html`<div class="typing">${dots()}<span>Slår upp ${shown}</span></div>`);
  let res;
  try { res = await lookupAlarm(code, deviceId || null); }
  catch (e) { if (current()) setHTML(out, html`<div class="notice warn">${icon('warn')}<div>${aiFail(e) || 'Uppslaget avbröts.'}</div></div>`); return; }
  if (!current()) return;
  setHTML(out, res.results.length ? alarmResultTpl(res, { deviceId, code: shown }) : html`<article class="msg-a">${alarmResultTpl(res, { deviceId, code: shown })}</article>`);
  if (deviceId) touchRecent(deviceId);
  if (!TOUR.on) logQuestion({ d: deviceId || (res.results[0] ? res.results[0].device.id : ''), q: shown, k: 'alarm', st: res.results.length ? 'ok' : (res.textHits ? 'reserv' : 'saknas'), m: 'larm', mt: res.results.some(r => r.entry.mt) ? 1 : 0 });
}
FORM.alarm = f => {
  const code = f.elements.code.value, scope = f.dataset.scope || (f.elements.scope ? f.elements.scope.value : '');
  runAlarm(code, scope || null, document.getElementById(f.dataset.out));
  f.elements.code.blur();
};
ACT.codechip = el => {
  const f = el.closest('[data-alarmbox]').querySelector('form');
  f.elements.code.value = el.dataset.code;
  if (el.dataset.dev && f.elements.scope) f.elements.scope.value = el.dataset.dev;
  FORM.alarm(f);
};

/* ----- Felanmälan till MT ----- */
function reportSummary(r, dev) {
  return ['Felanmälan till medicinteknik', `Enhet: ${dev.name}${makerLine(dev) ? ' (' + makerLine(dev) + ')' : ''}`, dev.inventoryNo ? `Inventarienummer: ${dev.inventoryNo}` : '', `Avdelning: ${dev.dept || ''}`,
    `Tid: ${dayKey(new Date(r.createdAt))} ${fmtTime(r.createdAt)}`, r.code ? `Larm- eller felkod: ${r.code}` : '', `Beskrivning: ${r.what}`, r.tried && r.tried.length ? `Provat: ${r.tried.join('; ')}` : '', `Tagen ur drift: ${r.outOfService ? 'Ja' : 'Nej'}`].filter(Boolean).join('\n');
}
function openReport({ deviceId, code = '', tried = [] }) {
  const dev = deviceById(deviceId);
  if (!dev) return;
  modal(html`<form data-form="report" data-id="${dev.id}">
    <div class="modal-h"><h2 class="h2">Felanmälan till MT</h2><button type="button" class="btn btn-icon btn-quiet" data-act="closeOverlay" aria-label="Stäng">${icon('x')}</button></div>
    <div class="modal-b">
      <div class="filecard">${devIcon(dev)}<div class="grow"><strong>${dev.name}</strong><div class="small muted">${[makerLine(dev), dev.inventoryNo ? 'inventarienummer ' + dev.inventoryNo : '', dev.dept].filter(Boolean).join(', ')}</div></div></div>
      <div class="formgrid">
        <div class="field"><label for="rpCode">Larm- eller felkod</label><input class="input code" id="rpCode" name="code" value="${code}" autocomplete="off" autocapitalize="characters"></div>
        <div class="field"><span class="label">Tagen ur drift</span><label class="switch"><input type="checkbox" name="oos" id="rpOos"><span>Enheten är märkt och undanställd</span></label></div>
        <div class="field full"><label for="rpWhat">Vad hände?</label><textarea class="textarea" id="rpWhat" name="what" required maxlength="800" placeholder="Beskriv felet. Skriv inga patientuppgifter."></textarea></div>
        ${tried.length ? html`<div class="field full"><span class="label">Vad har du provat?</span>${tried.map(t => html`<label class="check"><input type="checkbox" name="tried" value="${t}"><span>${t}</span></label>`)}</div>` : ''}
        <div class="field full"><label for="rpMore">Annat du har provat</label><input class="input" id="rpMore" name="more" maxlength="300"></div>
      </div>
      ${phiNote('Skriv aldrig namn, personnummer eller andra patientuppgifter.')}
    </div>
    <div class="modal-f"><button type="button" class="btn" data-act="closeOverlay">Avbryt</button><button class="btn btn-primary">Spara felanmälan</button></div>
  </form>`);
}
ACT.report = el => {
  const c = REPORT_CTX.get(el.dataset.ctx) || { deviceId: el.dataset.id, code: el.dataset.code || '', tried: [] };
  if (c.deviceId) openReport(c);
};
FORM.report = async f => {
  const fd = new FormData(f), dev = deviceById(f.dataset.id);
  const what = String(fd.get('what') || '').trim(), more = String(fd.get('more') || '').trim();
  if (!what || !dev) return;
  if ([...fd.values()].some(v => findPNR(v).length)) { toast('Texten ser ut att innehålla ett personnummer. Ta bort det och försök igen.', 'crit'); return; }
  const tried = fd.getAll('tried').map(String);
  if (more) tried.push(more);
  const r = { deviceId: dev.id, code: String(fd.get('code') || '').trim().toUpperCase(), what, tried, outOfService: !!fd.get('oos'), status: 'open', createdAt: Date.now() };
  try { await addDoc('reports', r); } catch (e) { toast('Felanmälan kunde inte sparas. Försök igen.', 'crit'); return; }
  audit('report', dev.id, `Felanmälan skapad${r.code ? ', felkod ' + r.code : ''}.${r.outOfService ? ' Enheten tagen ur drift.' : ''}`);
  ACT.closeOverlay();
  const c = contactsOf(dev), text = reportSummary(r, dev);
  const m = modal(html`
    <div class="modal-h"><h2 class="h2">Felanmälan sparad</h2><button class="btn btn-icon btn-quiet" data-act="closeOverlay" aria-label="Stäng">${icon('x')}</button></div>
    <div class="modal-b">
      <p>Anmälan syns nu på enhetens sida och hos ansvariga. Den här demon skickar inget till ert ärendesystem, så kopiera sammanfattningen dit om ni har ett.</p>
      <textarea class="textarea" rows="8" readonly>${text}</textarea>
      ${c.mt.phone ? html`<div class="notice">${icon('phone')}<div><strong>Är felet akut?</strong>Ring ${c.mt.name || 'MT-jour'}: <a class="code" href="${telHref(c.mt.phone)}">${c.mt.phone}</a></div></div>` : ''}
    </div>
    <div class="modal-f"><button class="btn" data-act="closeOverlay">Stäng</button><button class="btn btn-primary" data-x="copy">${icon('copy')}Kopiera sammanfattning</button></div>`);
  m.body.addEventListener('click', e => { if (e.target.closest('[data-x="copy"]')) copyText(text, 'Sammanfattningen är kopierad'); });
};

/* ----- Chatt ----- */
const CHATS = new Map();
const chatOf = key => { if (!CHATS.has(key)) CHATS.set(key, { msgs: [], busy: false, ctl: null }); return CHATS.get(key); };
const findMsg = mid => { for (const c of CHATS.values()) { const m = c.msgs.find(x => x.id === mid); if (m) return m; } return null; };
const SHORTCUTS = {
  start: { label: 'Hur startar jag?', q: 'Hur startar jag enheten och gör den klar för användning?', ic: 'power' },
  alarm: { label: 'Larm eller fel', ic: 'bell' },
  clean: { label: 'Rengöring', q: 'Hur rengör och desinfekterar jag enheten efter användning, och vilka medel får jag använda?', ic: 'spray' }
};
function guessKind(t) {
  t = t.toLowerCase();
  if (/reng|desinf|torka|tvätt|sprit|klor|steril|disk/.test(t)) return 'clean';
  if (/larm|felkod|fel |kod|err|varning|lyser|blinkar|piper|fungerar inte/.test(t)) return 'alarm';
  if (/start|slå på|sätt.? igång|förbered|kom igång|koppla in|montera|funktionskontroll|kontroll före/.test(t)) return 'start';
  return 'other';
}
function chatTpl(key, { placeholder = '' } = {}) {
  const dev = key === 'alla' ? null : deviceById(key);
  return html`<div class="chat" data-chat="${key}">
    <div class="chat-log" id="log-${key}" aria-live="polite"></div>
    <div class="composer-wrap">
      <form class="composer" data-form="ask" data-key="${key}" data-tour="composer">
        <textarea id="q-${key}" name="q" rows="1" maxlength="1200" placeholder="${placeholder || (dev ? 'Fråga om ' + dev.name : 'Fråga manualerna')}" data-input="grow" enterkeyhint="send" aria-label="Din fråga"></textarea>
        ${micBtn('q-' + key, 'btn-quiet')}
        <button class="btn btn-primary btn-icon" aria-label="Skicka frågan">${icon('send')}</button>
      </form>
      ${phiNote('Skriv aldrig patientuppgifter.')}
    </div>
  </div>`;
}
function chatEmptyTpl(key) {
  const dev = key === 'alla' ? null : deviceById(key);
  if (dev) {
    return html`<div class="chat-empty">
      <p class="lead">Fråga om ${dev.name}. Lotsa visar avsnittet ur bruksanvisningen som besvarar frågan, med sidhänvisning. Det ersätter inte klinisk bedömning.</p>
      <div class="shortcuts" data-tour="shortcuts">${Object.entries(SHORTCUTS).map(([k, s]) => html`<button class="shortcut" data-act="shortcut" data-key="${key}" data-k="${k}">${icon(s.ic)}${s.label}</button>`)}</div>
      ${!aiReady() ? html`<div class="notice">${icon('info')}<div>${S.aiNote || 'AI-svar är inte tillgängliga i den här visningen.'} Du får i stället de sidor i manualen som matchar frågan bäst, och du kan slå upp larmkoder.</div></div>` : ''}
    </div>`;
  }
  const ex = S.settings.demoMode ? ['Hur rengör jag patientmonitorn mellan patienter?', 'Sugen når inte fullt vakuum, vad kontrollerar jag?', 'Hur gör jag kontroll före användning på ventilatorn?'] : [];
  return html`<div class="chat-empty">
    <p class="lead">Ställ en fråga så söker Lotsa i ${manuals().length === 1 ? 'manualen' : 'alla ' + manuals().length + ' manualer'}. Nämn gärna vilken utrustning det gäller.</p>
    ${ex.length ? html`<div class="stack">${ex.map(q => html`<button class="shortcut" data-act="exampleQ" data-q="${q}">${icon('chat')}${q}</button>`)}</div>` : ''}
    ${!aiReady() ? html`<div class="notice">${icon('info')}<div>${S.aiNote || 'AI-svar är inte tillgängliga i den här visningen.'} Du får i stället de sidor i manualerna som matchar frågan bäst.</div></div>` : ''}
  </div>`;
}
function usedLine(r) {
  if (!r.used || !r.used.length) return '';
  const ms = r.used.map(u => manualById(u.manualId)).filter(Boolean);
  const stale = ms.filter(m => manualStatus(m).key === 'stale');
  const cited = [...new Set(r.kallor.map(k => k.manualId))].map(manualById).filter(Boolean);
  const show = cited.length ? cited : (ms.length === 1 ? ms : []);
  /* Versionen som svaret byggde på, inte den som gäller nu (de skiljer sig om manualen bytts ut). */
  const ver = m => { const u = r.used.find(x => x.manualId === m.id); return u && u.rev != null && u.rev !== (m.uploadedAt || 0) ? (u.version || 'tidigare version') + ' (ersatt)' : verLine(m); };
  return html`<span>${show.length ? 'Bygger på ' + show.map(m => `${m.title || 'bruksanvisning'}, ${ver(m)}`).join(' och ') : `Sökte i ${ms.length} ${ms.length === 1 ? 'manual' : 'manualer'}`}</span>
    ${show.some(m => stale.includes(m)) ? html`<span class="badge b-warn">${icon('clock')}Manualen är äldre än ${S.settings.staleMonths} månader</span>` : ''}`;
}
/* Lokalt läge: manualens egna stycken visas ordagrant, med det kontrollerade citatet markerat.
   Ett klick öppnar sidan i manualen. */
const revOf = (r, manualId) => { const u = (r.used || []).find(x => x.manualId === manualId); return u && u.rev != null ? u.rev : ''; };
/* Har någon manual som svaret byggde på laddats upp på nytt sedan dess? */
const staleRev = r => (r.used || []).some(u => u.rev != null && manualById(u.manualId) && (manualById(u.manualId).uploadedAt || 0) !== u.rev);
function excerptTpl(r) {
  if (!r.utdrag || !r.utdrag.length) return r.svar ? html`<p>${r.svar}</p>` : '';
  return html`<div class="excerpts">${r.utdrag.map(u => {
    const k = r.kallor.find(x => x.utdrag === u.id);
    /* Valda rader markeras gula, varningar i stycket röda. I textordning och utan överlapp. */
    const all = [...(u.marks || []).map(x => ({ ...x, cls: x.warn ? 'warn' : '' })), ...(u.warnMarks || []).filter(w => !(u.marks || []).some(x => x.start === w.start)).map(x => ({ ...x, cls: 'warn' }))];
    const marks = all.sort((a, b) => a.start - b.start).filter((x, i, l) => !i || x.start >= l[i - 1].end);
    const parts = []; let at = 0;
    marks.forEach(x => { parts.push(u.text.slice(at, x.start), html`<mark class="${x.cls}">${u.text.slice(x.start, x.end)}</mark>`); at = x.end; });
    parts.push(u.text.slice(at));
    const man = manualById(u.manualId), used = (r.used || []).find(x => x.manualId === u.manualId);
    const doc = [man && man.title ? man.title : 'Bruksanvisning', used && used.version ? used.version : ''].filter(Boolean).join(', ');
    return html`<button class="excerpt" data-act="openPage" data-m="${u.manualId}" data-r="${revOf(r, u.manualId)}" data-p="${u.page}" data-s="${k ? k.range.start : ''}" data-e="${k ? k.range.end : ''}">
      <span class="ex-ref"><span class="ex-dev">${u.device}</span><span class="ex-doc">${doc}</span><span class="ex-page">Sida ${u.page}${u.section ? ' · ' + u.section : ''}</span></span>
      ${u.ocr ? html`<span class="ex-ocr">${icon('info', 'ic-s')}Sidan är skannad och tolkad maskinellt (OCR). Jämför med originalsidan.</span>` : ''}
      <span class="excerpt-text">${parts}</span></button>`;
  })}${r.varningar && r.varningar.length ? html`<div class="notice crit">${icon('warn')}<div><strong>Varningar i samma avsnitt av manualen</strong>${r.varningar.map(v => html`<button class="linkbtn warnline" data-act="openPage" data-m="${v.manualId}" data-r="${revOf(r, v.manualId)}" data-p="${v.page}" data-s="${v.start}" data-e="${v.end}">${v.text} <span class="muted small">(sida ${v.page})</span>${v.ocr ? html` <span class="ocr-tag">OCR</span>` : ''}</button>`)}</div></div>` : ''}
  <p class="hint">${r.utdrag.some(u => u.ocr) ? 'Text ur tillverkarens bruksanvisning. Sidor märkta OCR är skannade och tolkade maskinellt, jämför med originalet.' : 'Text ur tillverkarens bruksanvisning, oförändrad.'} Urvalet av avsnitt är automatiskt. Öppna sidan för att läsa hela avsnittet.</p></div>`;
}
/* Svaret är alltid manualens egen text (utdrag) eller en fast rad från Lotsa. AI:n skriver ingenting. */
function answerTpl(m) {
  const r = m.res;
  const dev = (m.deviceId && deviceById(m.deviceId)) || (r.kallor[0] && deviceById(r.kallor[0].deviceId)) || null;
  const okTips = dev ? tips().filter(t => t.deviceId === dev.id && t.status === 'approved').length : 0;
  const none = r.status === 'saknas';
  return html`
    ${none ? html`<div class="a-status saknas">${icon('search-x')}${r.noManual ? 'Det finns ingen manual att söka i' : r.partial ? 'Inget utdrag i de sökta avsnitten av manualen besvarar frågan' : 'Inget utdrag i manualen besvarar frågan'}</div>` : ''}
    ${r.status === 'avvisad' ? html`<div class="a-status avvisad">${icon('shield')}Ingen klinisk bedömning</div><p>${LOCAL_TEXT.avvisad}</p>` : ''}
    ${r.status === 'besvarad' ? excerptTpl(r) : ''}
    ${staleRev(r) ? html`<div class="notice crit">${icon('warn')}<div><strong>Manualen har bytts ut sedan svaret gavs</strong>Utdraget kommer från en tidigare version. Ställ frågan igen innan du agerar.</div></div>` : ''}
    ${none && m.hits && m.hits.length ? html`<details class="hits-more"><summary>Sök själv i manualen (${m.hits.length} ${m.hits.length === 1 ? 'sida' : 'sidor'} med orden i frågan)</summary><div class="hits-live">${m.hits.map(hitTpl)}</div></details>` : ''}
    ${none && !r.noManual ? mtCard(dev, { soft: true, why: 'Läs i manualen eller kontakta MT eller tillverkarens support.' }) : ''}
    ${r.status === 'besvarad' && m.hits && m.hits.length ? html`<details class="hits-more"><summary>Fler sökträffar i manualen (${m.hits.length})</summary><div class="hits-live">${m.hits.map(hitTpl)}</div></details>` : ''}
    <div class="a-meta">${usedLine(r)}${okTips ? html`<button class="linkbtn" data-act="devTab" data-id="${dev.id}" data-tab="tips">${okTips} ${okTips === 1 ? 'lokalt tips' : 'lokala tips'} finns för enheten</button>` : ''}</div>
    <div class="a-actions">
      <button class="btn btn-s btn-icon ${m.fb === 1 ? 'is-on' : ''}" data-act="fb" data-mid="${m.id}" data-v="1" aria-label="Rätt avsnitt" aria-pressed="${m.fb === 1}">${icon('thumb-up', 'ic-s')}</button>
      <button class="btn btn-s btn-icon ${m.fb === -1 ? 'is-on' : ''}" data-act="fb" data-mid="${m.id}" data-v="-1" aria-label="Fel avsnitt" aria-pressed="${m.fb === -1}">${icon('thumb-down', 'ic-s')}</button>
      <button class="btn btn-s ${m.flagged ? 'is-on' : ''}" data-act="flag" data-mid="${m.id}" ${m.flagged ? 'disabled' : ''}>${icon('flag', 'ic-s')}${m.flagged ? 'Flaggat' : 'Flagga fel'}</button>
      <span class="sp"></span>
      ${r.status === 'besvarad' ? html`<button class="btn btn-s btn-icon" data-act="copyMsg" data-mid="${m.id}" aria-label="Kopiera utdraget">${icon('copy', 'ic-s')}</button>` : ''}
    </div>`;
}
const hitTpl = h => html`<button class="fallback-hit" data-act="openPage" data-m="${h.m.id}" data-r="${h.m.uploadedAt || 0}" data-p="${h.n}" data-s="${h.range ? h.range.start : ''}" data-e="${h.range ? h.range.end : ''}"><strong>${h.d.name}, sida ${h.n}${h.ocr ? html` <span class="ocr-tag">OCR</span>` : ''}</strong><span>${snippetAround(h.text, h.range, 240)}</span></button>`;
function msgTpl(m) {
  if (m.role === 'q') return html`<div class="msg-q">${m.text}</div>`;
  let inner;
  const stop = html`<span class="sp"></span><button class="btn btn-s btn-quiet" data-act="stopAsk" data-key="${m.key}">Avbryt</button>`;
  if (m.state === 'wait') inner = html`<div class="typing">${dots()}<span>${m.note || 'Söker i manualen'}</span>${stop}</div>${m.hits && m.hits.length ? html`<div class="hits-live"><div class="sources-h">Sökträffar i manualen</div>${m.hits.map(hitTpl)}</div>` : ''}`;
  else if (m.state === 'blocked') inner = html`<div class="notice crit">${icon('shield')}<div><strong>Frågan skickades inte</strong>Texten ser ut att innehålla ett personnummer. Ta bort alla patientuppgifter och ställ frågan igen.</div></div>`;
  else if (m.state === 'alarm') inner = alarmResultTpl(m.alarm, { deviceId: m.deviceId, code: m.code || m.q.toUpperCase() });
  else if (m.state === 'fallback') inner = html`<div class="notice warn">${icon('info')}<div><strong>Sökning utan AI</strong>${m.why || ''} ${m.hits.length ? 'Här är de sidor i manualen som matchar frågan bäst.' : ''}</div></div>
      ${m.hits.length ? m.hits.map(hitTpl) : html`<p>Inga sidor i manualen matchar frågan.</p>`}
      ${aiReady() ? html`<div><button class="btn btn-s" data-act="retryAsk" data-mid="${m.id}">Försök igen</button></div>` : ''}`;
  else if (m.state === 'error') inner = html`<p class="muted">${m.err || 'Något gick fel.'}</p>${m.cancelled ? '' : html`<div><button class="btn btn-s" data-act="retryAsk" data-mid="${m.id}">Försök igen</button></div>`}`;
  else inner = answerTpl(m);
  return html`<article class="msg-a ${m.state === 'alarm' && m.alarm.results.length ? 'bare' : ''}" id="m-${m.id}">${inner}</article>`;
}
function renderLog(key) {
  const c = chatOf(key), el = document.getElementById('log-' + key);
  if (!el) return;
  setHTML(el, c.msgs.length ? c.msgs.map(msgTpl) : chatEmptyTpl(key));
}
function updateMsg(m) {
  const node = document.getElementById('m-' + m.id);
  if (node) node.outerHTML = part(msgTpl(m));
}
function scrollToEnd() { const s = $('#main'); if (s) s.scrollTop = s.scrollHeight; }
/* När svaret är klart: visa frågan överst om svaret är långt, annars hela svaret. */
function revealAnswer(m) {
  const node = document.getElementById('m-' + m.id), main = $('#main');
  if (!node || !main || !main.contains(node)) return;
  const first = node.previousElementSibling && node.previousElementSibling.classList.contains('msg-q') ? node.previousElementSibling : node;
  const top = first.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 14;
  main.scrollTop = Math.min(top, main.scrollHeight - main.clientHeight);
}
async function askFallback(m, why) {
  m.why = why;
  m.hits = await searchPassages(m.q, m.deviceId, 3);
  m.state = 'fallback';
  m.logP = logQuestion({ d: m.deviceId || '', q: m.q, k: m.kind, st: 'reserv', m: 'chatt' });
}
/* Korta frågor kan innehålla en larmkod som stöds av registret eller manualen. */
function embeddedCodes(text) {
  if (text.trim().split(/\s+/).length > 9) return [];
  return text.match(/(?<![\p{L}\p{N}])[A-ZÅÄÖ]{1,5}[\s\-.:]{0,2}\d{1,4}[A-ZÅÄÖ]?(?![\p{L}\p{N}])/giu) || [];
}
async function ask(key, text, { kind = '', tier = '', shortcut = false } = {}) {
  const c = chatOf(key);
  text = String(text || '').trim();
  if (!text || c.busy) return false;
  if (findPNR(text).length) {
    c.msgs.push({ id: uid(), role: 'a', key, state: 'blocked' });
    renderLog(key); scrollToEnd();
    return false;
  }
  const deviceId = key === 'alla' ? null : key;
  if (deviceId) touchRecent(deviceId);
  /* Fråga om en viss patient: fast besked direkt, utan larmuppslag, sökträffar eller AI. */
  if (isClinicalQuestion(text)) {
    const res = { status: 'avvisad', svar: LOCAL_TEXT.avvisad, kallor: [], utdrag: [], used: [], ms: 0, tier: 'regel' };
    const ma = { id: uid(), role: 'a', key, deviceId, q: text, kind: 'annat', state: 'done', fb: 0, res };
    c.msgs.push({ id: uid(), role: 'q', text }, ma);
    ma.logP = logQuestion({ d: deviceId || '', q: '(patientfråga, texten sparas inte)', k: 'annat', st: 'avvisad', m: 'chatt' });
    renderLog(key); scrollToEnd();
    return true;
  }
  /* En avvisad fråga (patientfråga) skickas aldrig vidare som tidigare fråga. */
  const prevA = [...c.msgs].reverse().find(x => x.role === 'a' && x.state === 'done' && x.res && x.res.status !== 'avvisad');
  const m = { id: uid(), role: 'a', key, deviceId, q: text, kind: kind || guessKind(text), state: 'wait', fb: 0, shortcut };
  c.msgs.push({ id: uid(), role: 'q', text }, m);
  c.busy = true;
  /* Avbryt fungerar från första stund: kontrollen finns innan vänteläget visas och prövas efter
     varje steg som väntar. */
  const ctl = c.ctl = new AbortController();
  const live = () => { if (ctl.signal.aborted) throw Object.assign(new Error('cancelled'), { code: 'cancelled' }); };
  renderLog(key); scrollToEnd();
  try {
    let code = '', evidence;
    const candidates = isCodeQuery(text) ? [text] : (tier ? [] : embeddedCodes(text).filter(isCodeQuery));
    for (const candidate of candidates) {
      evidence = await alarmEvidence(candidate, deviceId);
      live();
      if (!evidence.notFound) { code = candidate; break; }
    }
    if (code) {
      m.note = 'Slår upp larmkoden'; m.kind = 'alarm'; m.code = code.toUpperCase();
      const res = await lookupAlarm(code, deviceId, { signal: ctl.signal, evidence });
      live();
      m.alarm = res; m.state = 'alarm';
      m.logP = logQuestion({ d: deviceId || (res.results[0] ? res.results[0].device.id : ''), q: m.code, k: 'alarm', st: res.results.length ? 'ok' : (res.textHits ? 'reserv' : 'saknas'), m: 'larm', mt: res.results.some(r => r.entry.mt) ? 1 : 0 });
    } else if (!aiReady()) {
      await askFallback(m, S.aiNote || 'AI-svar är inte tillgängliga i den här visningen.');
      live();
    } else {
      /* Sökträffarna visas direkt, så att man kan börja läsa medan AI:n arbetar. */
      try { m.hits = await searchPassages(text, deviceId, 3); } catch (e) { m.hits = []; }
      live();
      if (m.state === 'wait' && document.getElementById('m-' + m.id)) updateMsg(m);
      const res = await askManuals({
        question: text, deviceId, tier: tier || S.settings.aiTier, signal: ctl.signal,
        history: prevA ? [{ q: prevA.q, a: prevA.res.svar }] : []
      });
      live();
      m.res = res; m.state = 'done';
      const dId = deviceId || (res.kallor[0] ? res.kallor[0].deviceId : '');
      m.logP = logQuestion({ d: dId, q: text, k: m.kind, st: res.status === 'besvarad' ? 'urval' : res.status, m: 'chatt', mt: res.mt ? 1 : 0, ver: res.used.length === 1 ? res.used[0].version : '', ms: res.ms, src: res.kallor.filter(k => k.ok).length });
    }
  } catch (e) {
    if ((e && e.code === 'cancelled') || ctl.signal.aborted) { m.state = 'error'; m.err = 'Frågan avbröts.'; m.cancelled = true; }
    else {
      const why = aiFail(e);
      try { await askFallback(m, why); } catch (e2) { m.state = 'error'; m.err = why || 'Något gick fel.'; }
      /* Avbröts frågan medan reservsökningen pågick visas inget reservsvar. */
      if (ctl.signal.aborted) { m.state = 'error'; m.err = 'Frågan avbröts.'; m.cancelled = true; }
    }
  }
  c.busy = false; if (c.ctl === ctl) c.ctl = null;
  /* Rensad konversation: det gamla svaret ritas inte upp i den nya. */
  if (CHATS.get(key) !== c) return true;
  if (document.getElementById('m-' + m.id)) updateMsg(m); else renderLog(key);
  revealAnswer(m);
  return true;
}
FORM.ask = async f => {
  const key = f.dataset.key, ta = f.elements.q, text = ta.value;
  if (!text.trim() || chatOf(key).busy) return;
  const ok = await Promise.race([ask(key, text), sleep(0).then(() => 'pending')]);
  if (ok !== false) { ta.value = ''; ta.style.height = ''; }
};
INPUT.grow = el => { el.style.height = 'auto'; el.style.height = Math.min(160, el.scrollHeight) + 'px'; };
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
  const ta = e.target.closest && e.target.closest('.composer textarea');
  if (!ta) return;
  e.preventDefault();
  if (ta.form.requestSubmit) ta.form.requestSubmit(); else ta.form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
});
ACT.shortcut = el => {
  const key = el.dataset.key, k = el.dataset.k;
  if (k === 'alarm') { if (typeof setDevTab === 'function') setDevTab(key, 'larm'); return; }
  ask(key, SHORTCUTS[k].q, { kind: k, shortcut: true });
};
ACT.exampleQ = el => ask('alla', el.dataset.q);
ACT.stopAsk = el => { const c = chatOf(el.dataset.key); if (c.ctl) c.ctl.abort(); };
ACT.retryAsk = el => {
  const m = findMsg(el.dataset.mid);
  if (!m) return;
  const c = chatOf(m.key), i = c.msgs.indexOf(m);
  if (i > 0) c.msgs.splice(i - 1, 2);
  ask(m.key, m.q, { kind: m.kind, shortcut: m.shortcut });
};
/* Kopian bär samma märkning och varningar som skärmen, så att den inte ser mer säker ut än svaret. */
ACT.copyMsg = el => {
  const m = findMsg(el.dataset.mid);
  if (!m || !m.res) return;
  const r = m.res, out = [];
  if (staleRev(r)) out.push('VARNING: Manualen har bytts ut sedan utdraget hämtades.', '');
  if (r.status === 'besvarad') {
    for (const u of r.utdrag || []) {
      const used = (r.used || []).find(x => x.manualId === u.manualId), man = manualById(u.manualId);
      out.push(`${u.device}, ${(used && used.title) || (man && man.title) || 'bruksanvisning'}${used && used.version ? ', ' + used.version : ''}, sida ${u.page}${u.section ? ', ' + u.section : ''}${u.ocr ? ' (OCR, maskinellt tolkad skannad sida)' : ''}:`, u.text, '');
    }
    if (r.varningar && r.varningar.length) out.push('Varningar i samma avsnitt av manualen:', ...r.varningar.map(v => '- ' + v.text + ' (' + v.device + ', sida ' + v.page + (v.ocr ? ', OCR' : '') + ')'), '');
    out.push([...(r.utdrag || []), ...(r.varningar || [])].some(u => u.ocr) ? 'Text ur tillverkarens bruksanvisning. Sidor märkta OCR är tolkade maskinellt.' : 'Text ur tillverkarens bruksanvisning. Urvalet av avsnitt är automatiskt.');
  } else out.push(r.status === 'avvisad' ? LOCAL_TEXT.avvisad : r.noManual ? 'Det finns ingen manual att söka i.' : r.partial ? 'Inget utdrag i de sökta avsnitten av manualen besvarar frågan.' : LOCAL_TEXT.saknas);
  copyText(out.join('\n').trim(), 'Utdraget är kopierat');
};
ACT.fb = async el => {
  const m = findMsg(el.dataset.mid);
  if (!m) return;
  const v = Number(el.dataset.v);
  m.fb = m.fb === v ? 0 : v;
  updateMsg(m);
  logPatch(await m.logP, { fb: m.fb });
};
ACT.flag = el => {
  const m = findMsg(el.dataset.mid);
  if (!m || !m.res) return;
  modal(html`<form data-form="flag" data-mid="${m.id}">
    <div class="modal-h"><h2 class="h2">Flagga svaret som felaktigt</h2><button type="button" class="btn btn-icon btn-quiet" data-act="closeOverlay" aria-label="Stäng">${icon('x')}</button></div>
    <div class="modal-b">
      <p class="hint">Frågan, svaret och manualversionen sparas så att en ansvarig kan granska. Inga uppgifter om dig sparas.</p>
      <div class="field"><label for="flReason">Vad är fel?</label><select class="select" id="flReason" name="reason"><option>Stämmer inte med manualen</option><option>Otydligt eller ofullständigt</option><option>Fel enhet eller fel avsnitt</option><option>Annat</option></select></div>
      <div class="field"><label for="flNote">Kommentar</label><textarea class="textarea" id="flNote" name="note" maxlength="500" placeholder="Beskriv kort vad som borde stå. Inga patientuppgifter."></textarea></div>
    </div>
    <div class="modal-f"><button type="button" class="btn" data-act="closeOverlay">Avbryt</button><button class="btn btn-primary">Flagga svaret</button></div>
  </form>`);
};
FORM.flag = async f => {
  const m = findMsg(f.dataset.mid), fd = formData(f);
  if (!m) return;
  if (findPNR(fd.note).length) { toast('Kommentaren ser ut att innehålla ett personnummer. Ta bort det.', 'crit'); return; }
  const r = m.res, k = r.kallor[0];
  const deviceId = m.deviceId || (k && k.deviceId) || (r.used[0] && r.used[0].deviceId) || '';
  try {
    const refs = (r.utdrag || []).map(u => `${u.device}, sida ${u.page}${u.section ? ', ' + u.section : ''}`).join('; ');
    await addDoc('flags', { deviceId, q: r.status === 'avvisad' ? '(patientfråga, texten sparas inte)' : m.q, a: trunc((refs ? 'Utdrag: ' + refs + '\n\n' : '') + (r.svar || ''), 1500), reason: fd.reason, note: fd.note, status: 'open', version: r.used.length === 1 ? r.used[0].version : (k ? (manualById(k.manualId) || {}).version || '' : ''), sida: k ? k.page : 0, verified: r.kallor.filter(x => x.ok).length, createdAt: Date.now() });
  } catch (e) { toast('Flaggningen kunde inte sparas. Försök igen.', 'crit'); return; }
  m.flagged = true; m.fb = -1;
  logPatch(await m.logP, { fb: -1, flag: 1 });
  audit('flag', deviceId, 'Svar flaggat: ' + fd.reason + '.');
  ACT.closeOverlay();
  updateMsg(m);
  toast('Tack. Svaret är flaggat för granskning.');
};
ACT.fav = el => { toggleFav(el.dataset.id); emit(); };
