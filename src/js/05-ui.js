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
async function openSource({ manualId, page, range = null, section = '' }) {
  const m = manualById(manualId);
  if (!m) { toast('Manualen finns inte längre.'); return; }
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
ACT.openPage = el => openSource({ manualId: el.dataset.m, page: Number(el.dataset.p), range: el.dataset.s !== '' && el.dataset.s !== undefined ? { start: Number(el.dataset.s), end: Number(el.dataset.e) } : null });
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
  const steps = e.atgard || [];
  return html`<article class="alarm-card ${pr ? pr.cls : ''}">
    <div class="alarm-top"><span class="alarm-code">${code}</span>
      <div class="grow"><div class="alarm-label">${e.label || 'Larm'}</div>
        <div class="rowflex small">${pr ? html`<span class="prio ${pr.cls}"><i></i>${pr.label}</span>` : ''}<span class="muted">${dev.name}</span></div></div></div>
    <dl class="alarm-dl">
      ${e.betyder ? html`<dt>Betyder</dt><dd>${e.betyder}</dd>` : ''}
      ${e.orsak ? html`<dt>Trolig orsak</dt><dd>${e.orsak}</dd>` : ''}
      ${steps.length ? html`<dt>Gör så här</dt><dd>${steps.length > 1 ? html`<ol>${steps.map(s => html`<li>${s}</li>`)}</ol>` : steps[0]}</dd>` : ''}
    </dl>
    ${e.mt ? mtCard(dev, { why: 'Manualen anger att utrustningen ska tas ur drift eller kontrolleras av tekniker.', code, tried: steps }) : ''}
    ${e.ai && !e.verified ? html`<div class="notice warn">${icon('warn')}<div>Citatet kunde inte kontrolleras mot manualtexten. Läs sidan i manualen innan du agerar.</div></div>` : ''}
    <div class="alarm-foot">
      <button class="btn btn-s" data-act="alarmSrc" data-ctx="${ctx}">${icon('book', 'ic-s')}Manual sida ${e.sida || '?'}</button>
      <span class="small muted">${m.version || ''}${st.key === 'stale' ? ', bör kontrolleras' : ''}${r.source === 'ai' ? ', tolkad av AI' : ''}</span>
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
  range = tryPage(pages.find(p => p.n === page));
  if (!range) for (const p of pages) { const rg = tryPage(p); if (rg) { page = p.n; range = rg; break; } }
  openSource({ manualId: r.manual.id, page, range });
};
ACT.alarmSteps = el => { const r = ALARM_CTX.get(el.dataset.ctx); if (r) openSteps({ title: `${r.key} ${r.entry.label || ''}`.trim(), sub: `${r.device.name}, manual sida ${r.entry.sida}`, steps: r.entry.atgard }); };
ACT.alarmReport = el => { const r = ALARM_CTX.get(el.dataset.ctx); if (r) openReport({ deviceId: r.device.id, code: el.dataset.code || r.key, tried: r.entry.atgard || [] }); };
function alarmResultTpl(res, { deviceId = null, code = '' } = {}) {
  const dev = deviceId ? deviceById(deviceId) : null;
  if (res.results.length) return html`${res.results.map(r => alarmCard(r, { shown: code }))}`;
  if (res.textHits && res.textHits.length) {
    return html`<div class="notice warn">${icon('info')}<div><strong>Reservläge utan AI</strong>${res.error ? aiFail(res.error) + ' ' : ''}Koden nämns i manualen. Här är manualens egen text.</div></div>
      ${res.textHits.map(h => h.pages.slice(0, 2).map(p => { const m = p.text.match(codeRegex(code)); const i = m ? m.index + m[1].length : 0; const rg = m ? { start: i, end: i + m[2].length } : null;
        return html`<button class="fallback-hit" data-act="openPage" data-m="${h.manual.id}" data-p="${p.n}" data-s="${rg ? rg.start : ''}" data-e="${rg ? rg.end : ''}"><strong>${h.device.name}, sida ${p.n}</strong><span>${snippetAround(p.text, rg, 420)}</span></button>`; }))}`;
  }
  return html`<div class="a-status saknas">${icon('search-x')}Det står inte i manualen</div>
    <p>Koden <span class="code">${code}</span> finns inte i ${dev ? 'manualen för ' + dev.name : 'någon av manualerna'}. Kontrollera att koden är rätt avläst.</p>
    ${dev ? mtCard(dev, { soft: true, why: 'Stämmer koden: kontakta MT eller tillverkarens support.', code }) : ''}`;
}
async function runAlarm(code, deviceId, out) {
  code = String(code || '').trim();
  if (!code || !out) return;
  if (findPNR(code).length) { toast('Skriv bara larmkoden, inga personuppgifter.', 'crit'); return; }
  const shown = code.toUpperCase();
  setHTML(out, html`<div class="typing">${dots()}<span>Slår upp ${shown}</span></div>`);
  let res;
  try { res = await lookupAlarm(code, deviceId || null); }
  catch (e) { setHTML(out, html`<div class="notice warn">${icon('warn')}<div>${aiFail(e) || 'Uppslaget avbröts.'}</div></div>`); return; }
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
  if (findPNR(what + ' ' + more).length) { toast('Texten ser ut att innehålla ett personnummer. Ta bort det och försök igen.', 'crit'); return; }
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
      <p class="lead">Fråga om ${dev.name}. Svaret hämtas ur bruksanvisningen och visar alltid sidan det bygger på. Det ersätter inte klinisk bedömning.</p>
      <div class="shortcuts" data-tour="shortcuts">${Object.entries(SHORTCUTS).map(([k, s]) => html`<button class="shortcut" data-act="shortcut" data-key="${key}" data-k="${k}">${icon(s.ic)}${s.label}</button>`)}</div>
      ${!aiReady() ? html`<div class="notice">${icon('info')}<div>${S.aiNote || 'AI-svar är inte tillgängliga i den här visningen.'} Genvägarna visar förinspelade exempelsvar för exempelenheterna, och du kan söka i manualen och slå upp larmkoder.</div></div>` : ''}
    </div>`;
  }
  const ex = S.settings.demoMode ? ['Hur rengör jag patientmonitorn mellan patienter?', 'Sugen når inte fullt vakuum, vad kontrollerar jag?', 'Hur gör jag kontroll före användning på ventilatorn?'] : [];
  return html`<div class="chat-empty">
    <p class="lead">Ställ en fråga så söker Lotsa i alla ${manuals().length} manualer. Nämn gärna vilken utrustning det gäller.</p>
    ${ex.length ? html`<div class="stack">${ex.map(q => html`<button class="shortcut" data-act="exampleQ" data-q="${q}">${icon('chat')}${q}</button>`)}</div>` : ''}
    ${!aiReady() ? html`<div class="notice">${icon('info')}<div>${S.aiNote || 'AI-svar är inte tillgängliga i den här visningen.'} Du får i stället de sidor i manualerna som matchar frågan bäst.</div></div>` : ''}
  </div>`;
}
function srcTpl(m, k, multi) {
  const dev = deviceById(k.deviceId);
  return html`<button class="src" data-act="cite" data-mid="${m.id}" data-n="${k.n}">
    <span class="src-n">${k.n}</span>
    <span class="src-where">Sida ${k.page || '?'}${k.section ? ', ' + k.section : ''}${multi && dev ? html` <span class="muted small">${dev.name}</span>` : ''}</span>
    <span class="src-check ${k.ok ? 'ok' : 'no'}">${icon(k.ok ? 'check' : 'warn')}${k.ok ? 'Citat kontrollerat' : 'Citatet hittades inte'}</span>
    ${k.quote ? html`<span class="src-quote">”${k.quote}”</span>` : ''}
  </button>`;
}
function usedLine(r) {
  if (!r.used || !r.used.length) return '';
  const ms = r.used.map(u => manualById(u.manualId)).filter(Boolean);
  const stale = ms.filter(m => manualStatus(m).key === 'stale');
  const cited = [...new Set(r.kallor.map(k => k.manualId))].map(manualById).filter(Boolean);
  const show = cited.length ? cited : (ms.length === 1 ? ms : []);
  return html`<span>${show.length ? 'Bygger på ' + show.map(m => `${m.title || 'bruksanvisning'}, ${verLine(m)}`).join(' och ') : `Sökte i ${ms.length} manualer`}</span>
    ${show.some(m => stale.includes(m)) ? html`<span class="badge b-warn">${icon('clock')}Manualen är äldre än ${S.settings.staleMonths} månader</span>` : ''}`;
}
function answerTpl(m) {
  const r = m.res;
  const dev = (m.deviceId && deviceById(m.deviceId)) || (r.kallor[0] && deviceById(r.kallor[0].deviceId)) || null;
  let svar = r.svar;
  if (r.status === 'saknas') svar = svar.replace(/^\s*Det står inte i manualen\.?\s*/i, '');
  const steps = parseSteps(r.svar);
  const multi = !m.deviceId || new Set(r.kallor.map(k => k.manualId)).size > 1;
  const okTips = dev ? tips().filter(t => t.deviceId === dev.id && t.status === 'approved').length : 0;
  return html`
    ${m.example ? html`<div><span class="badge b-demo">Förinspelat exempelsvar</span></div>` : ''}
    ${r.status === 'saknas' ? html`<div class="a-status saknas">${icon('search-x')}Det står inte i manualen</div>` : ''}
    ${r.status === 'avvisad' ? html`<div class="a-status avvisad">${icon('shield')}Ingen klinisk bedömning</div>` : ''}
    ${svar ? html`<div class="a-body">${renderAnswer(svar, m.id)}</div>` : ''}
    ${r.status === 'delvis' ? html`<div class="notice warn">${icon('info')}<div>Manualen besvarar bara en del av frågan.</div></div>` : ''}
    ${r.unverified ? html`<div class="notice warn">${icon('warn')}<div><strong>Svaret är inte styrkt med citat</strong>Inget citat kunde kontrolleras mot manualtexten. Läs i manualen innan du agerar.</div></div>` : ''}
    ${r.mt ? mtCard(dev, { why: r.mtWhy, tried: steps }) : (r.status === 'saknas' && dev && !r.noManual ? mtCard(dev, { soft: true, why: 'Manualen ger inget svar. Fråga MT eller tillverkarens support.' }) : '')}
    ${r.kallor.length ? html`<div class="sources"><div class="sources-h">Källor ur manualen</div>${r.kallor.map(k => srcTpl(m, k, multi))}</div>` : ''}
    <div class="a-meta">${usedLine(r)}${okTips ? html`<button class="linkbtn" data-act="devTab" data-id="${dev.id}" data-tab="tips">${okTips} lokala tips finns för enheten</button>` : ''}</div>
    <div class="a-actions">
      <button class="btn btn-s btn-icon ${m.fb === 1 ? 'is-on' : ''}" data-act="fb" data-mid="${m.id}" data-v="1" aria-label="Bra svar" aria-pressed="${m.fb === 1}">${icon('thumb-up', 'ic-s')}</button>
      <button class="btn btn-s btn-icon ${m.fb === -1 ? 'is-on' : ''}" data-act="fb" data-mid="${m.id}" data-v="-1" aria-label="Dåligt svar" aria-pressed="${m.fb === -1}">${icon('thumb-down', 'ic-s')}</button>
      <button class="btn btn-s ${m.flagged ? 'is-on' : ''}" data-act="flag" data-mid="${m.id}" ${m.flagged ? 'disabled' : ''}>${icon('flag', 'ic-s')}${m.flagged ? 'Flaggat' : 'Flagga fel'}</button>
      <span class="sp"></span>
      ${steps.length > 1 ? html`<button class="btn btn-s btn-primary" data-act="stepsMsg" data-mid="${m.id}">${icon('steps', 'ic-s')}Steg för steg</button>` : ''}
      ${!m.example && r.tier === 'quick' && aiReady() && r.status !== 'avvisad' && !r.noManual ? html`<button class="btn btn-s" data-act="deeper" data-mid="${m.id}">Noggrannare svar</button>` : ''}
      <button class="btn btn-s btn-icon" data-act="copyMsg" data-mid="${m.id}" aria-label="Kopiera svaret">${icon('copy', 'ic-s')}</button>
    </div>`;
}
function msgTpl(m) {
  if (m.role === 'q') return html`<div class="msg-q">${m.text}</div>`;
  let inner;
  const stop = html`<span class="sp"></span><button class="btn btn-s btn-quiet" data-act="stopAsk" data-key="${m.key}">Avbryt</button>`;
  if (m.state === 'wait') inner = html`<div class="typing">${dots()}<span>${m.note || 'Söker i manualen'}</span>${stop}</div>`;
  else if (m.state === 'stream') inner = html`<div class="a-body">${renderAnswer(m.text || '')}</div><div class="typing">${dots()}<span>Skriver svaret</span>${stop}</div>`;
  else if (m.state === 'blocked') inner = html`<div class="notice crit">${icon('shield')}<div><strong>Frågan skickades inte</strong>Texten ser ut att innehålla ett personnummer. Ta bort alla patientuppgifter och ställ frågan igen.</div></div>`;
  else if (m.state === 'alarm') inner = alarmResultTpl(m.alarm, { deviceId: m.deviceId, code: m.code || m.q.toUpperCase() });
  else if (m.state === 'fallback') inner = html`<div class="notice warn">${icon('info')}<div><strong>Reservläge utan AI</strong>${m.why || ''} ${m.hits.length ? 'Här är de sidor i manualen som matchar frågan bäst.' : ''}</div></div>
      ${m.hits.length ? m.hits.map(h => html`<button class="fallback-hit" data-act="openPage" data-m="${h.m.id}" data-p="${h.n}" data-s="${h.range ? h.range.start : ''}" data-e="${h.range ? h.range.end : ''}"><strong>${h.d.name}, sida ${h.n}</strong><span>${snippetAround(h.text, h.range, 240)}</span></button>`) : html`<p>Inga sidor i manualen matchar frågan.</p>`}
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
function exampleAnswer(dev, man, kind) {
  const b = kind === 'start' ? man.card.uppstart : man.card.rengoring;
  const v = verifyQuote(man.pages || [], b.sida, b.citat);
  return {
    status: 'besvarad', svar: b.steg.map((s, i) => `${i + 1}. ${s}${i === b.steg.length - 1 ? ' [1]' : ''}`).join('\n'),
    kallor: [{ n: 1, manualId: man.id, deviceId: dev.id, page: v.page || b.sida, section: b.avsnitt, quote: b.citat, ok: !!v.ok, range: v.range || null }],
    mt: false, mtWhy: '', unverified: false, tier: 'exempel', used: [{ manualId: man.id, deviceId: dev.id, version: man.version, issued: man.issued }]
  };
}
async function askFallback(m, why) {
  m.why = why;
  const dev = m.deviceId && deviceById(m.deviceId), man = dev && manualFor(dev);
  if (m.shortcut && man && man.demo && man.pages && man.card && (m.kind === 'start' || m.kind === 'clean')) {
    m.res = exampleAnswer(dev, man, m.kind); m.example = true; m.state = 'done';
  } else {
    m.hits = await searchPassages(m.q, m.deviceId, 3);
    m.state = 'fallback';
  }
  m.logP = logQuestion({ d: m.deviceId || '', q: m.q, k: m.kind, st: m.example ? 'ok' : 'reserv', m: 'chatt' });
}
/* Korta frågor som nämner en kod ur larmregistret besvaras direkt ur registret, utan AI. */
function embeddedCode(text, deviceId) {
  if (text.trim().split(/\s+/).length > 9) return '';
  const cands = text.match(/[A-Za-zÅÄÖåäö]{1,4}[-\s]?\d{1,4}[A-Za-z]?(?![\wåäö])/g) || [];
  const devs = deviceId ? [deviceById(deviceId)].filter(Boolean) : devices();
  for (const c of cands) if (devs.some(d => matchAlarm((manualFor(d) || {}).alarms, c))) return c.trim();
  return '';
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
  const prevA = [...c.msgs].reverse().find(x => x.role === 'a' && x.state === 'done' && x.res);
  const m = { id: uid(), role: 'a', key, deviceId, q: text, kind: kind || guessKind(text), state: 'wait', fb: 0, shortcut };
  c.msgs.push({ id: uid(), role: 'q', text }, m);
  c.busy = true;
  renderLog(key); scrollToEnd();
  try {
    const code = looksLikeCode(text) ? text : (tier ? '' : embeddedCode(text, deviceId));
    if (code) {
      m.note = 'Slår upp larmkoden'; m.kind = 'alarm'; m.code = code.toUpperCase();
      c.ctl = new AbortController();
      const res = await lookupAlarm(code, deviceId, { signal: c.ctl.signal });
      m.alarm = res; m.state = 'alarm';
      m.logP = logQuestion({ d: deviceId || (res.results[0] ? res.results[0].device.id : ''), q: m.code, k: 'alarm', st: res.results.length ? 'ok' : (res.textHits ? 'reserv' : 'saknas'), m: 'larm', mt: res.results.some(r => r.entry.mt) ? 1 : 0 });
    } else if (!aiReady()) {
      await askFallback(m, S.aiNote || 'AI-svar är inte tillgängliga i den här visningen.');
    } else {
      c.ctl = new AbortController();
      const res = await askManuals({
        question: text, deviceId, tier: tier || S.settings.aiTier, signal: c.ctl.signal,
        history: prevA ? [{ q: prevA.q, a: prevA.res.svar }] : [],
        onStream: t => {
          m.text = t;
          if (m.state !== 'stream') { m.state = 'stream'; updateMsg(m); }
          else { const b = document.querySelector('#m-' + m.id + ' .a-body'); if (b) setHTML(b, renderAnswer(t)); }
        }
      });
      m.res = res; m.state = 'done';
      const dId = deviceId || (res.kallor[0] ? res.kallor[0].deviceId : '');
      m.logP = logQuestion({ d: dId, q: text, k: m.kind, st: res.status === 'besvarad' ? 'ok' : res.status, m: 'chatt', mt: res.mt ? 1 : 0, ver: res.used.length === 1 ? res.used[0].version : '', ms: res.ms, src: res.kallor.filter(k => k.ok).length });
    }
  } catch (e) {
    if (e && e.code === 'cancelled') { m.state = 'error'; m.err = 'Frågan avbröts.'; m.cancelled = true; }
    else {
      const why = aiFail(e);
      try { await askFallback(m, why); } catch (e2) { m.state = 'error'; m.err = why || 'Något gick fel.'; }
    }
  }
  c.busy = false; c.ctl = null;
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
ACT.deeper = el => { const m = findMsg(el.dataset.mid); if (m) ask(m.key, m.q, { kind: m.kind, tier: 'default' }); };
ACT.cite = el => {
  const m = findMsg(el.dataset.mid);
  const k = m && m.res && m.res.kallor.find(x => String(x.n) === el.dataset.n);
  if (k) openSource({ manualId: k.manualId, page: k.page, range: k.range, section: k.section });
  else toast('Källan finns inte med i svaret.');
};
ACT.stepsMsg = el => {
  const m = findMsg(el.dataset.mid);
  if (!m || !m.res) return;
  const dev = m.deviceId ? deviceById(m.deviceId) : null, k = m.res.kallor[0];
  openSteps({ title: dev ? dev.name : 'Steg för steg', sub: k ? `Ur manualen, sida ${k.page}` : '', steps: parseSteps(m.res.svar) });
};
ACT.copyMsg = el => { const m = findMsg(el.dataset.mid); if (m && m.res) copyText(plainAnswer(m.res.svar) + (m.res.kallor.length ? '\n\nKälla: ' + m.res.kallor.map(k => 'sida ' + k.page).join(', ') : ''), 'Svaret är kopierat'); };
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
    await addDoc('flags', { deviceId, q: m.q, a: trunc(r.svar, 1500), reason: fd.reason, note: fd.note, status: 'open', version: r.used.length === 1 ? r.used[0].version : (k ? (manualById(k.manualId) || {}).version || '' : ''), sida: k ? k.page : 0, verified: r.kallor.filter(x => x.ok).length, createdAt: Date.now() });
  } catch (e) { toast('Flaggningen kunde inte sparas. Försök igen.', 'crit'); return; }
  m.flagged = true; m.fb = -1;
  logPatch(await m.logP, { fb: -1, flag: 1 });
  audit('flag', deviceId, 'Svar flaggat: ' + fd.reason + '.');
  ACT.closeOverlay();
  updateMsg(m);
  toast('Tack. Svaret är flaggat för granskning.');
};
ACT.fav = el => { toggleFav(el.dataset.id); emit(); };
