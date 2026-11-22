/* ===== Lotsa: vyer för personalen ===== */
const V = {};
const UI = { dept: '', q: '', devTab: {}, alarmDev: '' };

function deviceTile(d) {
  const m = manualFor(d), st = manualStatus(m), rep = openReportFor(d.id), fav = favorites().includes(d.id);
  return html`<div class="tile">
    ${devIcon(d)}
    <div><a class="tile-name" href="#enhet-${d.id}"><span class="stretch"></span>${d.name}</a><span class="tile-sub">${makerLine(d) || 'Tillverkare saknas'}</span></div>
    <button class="star above ${fav ? 'is-on' : ''}" data-act="fav" data-id="${d.id}" aria-label="${fav ? 'Ta bort från favoriter' : 'Lägg till som favorit'}" aria-pressed="${fav}">${icon('star')}</button>
    <div class="tile-meta"><span class="badge">${d.dept || 'Avdelning saknas'}</span>
      ${st.key !== 'ok' ? html`<span class="badge ${st.cls}">${icon(st.ic)}${st.label}</span>` : ''}
      ${rep ? html`<span class="badge b-crit">${icon('warn')}Öppen felanmälan</span>` : ''}${demoBadge(d)}</div>
  </div>`;
}
const deviceRow = d => html`<div class="row">${devIcon(d)}<div class="row-main"><a class="tile-name" href="#enhet-${d.id}"><span class="stretch"></span>${d.name}</a><span class="row-sub">${[makerLine(d), d.dept].filter(Boolean).join(', ')}</span></div>${icon('right')}</div>`;

/* ----- Hem ----- */
V.hem = {
  title: 'Hem',
  render(el) {
    setHTML(el, html`
      <div id="hemIntro"></div>
      <h1 class="h1">Vad behöver du hjälp med?</h1>
      <div class="omni" data-tour="omni">
        <form class="omni-box" data-form="omni">${icon('search', 'ic-l')}
          <input id="omni" name="q" type="search" autocomplete="off" placeholder="Sök enhet, larmkod eller ställ en fråga" data-input="omni" aria-label="Sök enhet, skriv en larmkod eller ställ en fråga">
          ${micBtn('omni', 'btn-quiet')}<button class="btn btn-primary">Sök</button></form>
        <div id="omniSug"></div>
      </div>
      <div class="quick" data-tour="quick">
        <a href="#larm">${icon('bell', 'ic-l')}<span>Larmkod<small>Betydelse, orsak och åtgärd</small></span></a>
        <button data-act="scanQR">${icon('qr', 'ic-l')}<span>Skanna QR-kod<small>Fota etiketten på enheten</small></span></button>
        <a href="#natt">${icon('moon', 'ic-l')}<span>Nattläge<small>Stora knappar, dämpat ljus</small></span></a>
        <a href="#fraga">${icon('chat', 'ic-l')}<span>Fråga manualerna<small>Sök i alla enheter</small></span></a>
      </div>
      <div id="hemBody"></div>
      <div class="sect">${phiNote('Lotsa visar bara det som står i tillverkarnas bruksanvisningar. Skriv aldrig patientuppgifter. Vid akut fara för patienten gäller alltid avdelningens rutiner.')}</div>`);
    this.update();
  },
  update() {
    const intro = $('#hemIntro'), body = $('#hemBody');
    if (!body) return;
    setHTML(intro, S.prefs.introHidden ? '' : html`<section class="intro" data-tour="intro">
      <div><h2 class="h2">Manualen som svarar, dygnet runt</h2><p>${BRAND} hjälper personalen att använda och felsöka medicinteknisk utrustning. Varje svar kommer ur tillverkarens bruksanvisning och visar sidan det bygger på.</p></div>
      <div class="rowflex"><button class="btn btn-primary" data-act="tour">${icon('play')}Starta rundturen</button><a class="btn btn-quiet" href="#om">Om tjänsten</a></div>
      <button class="btn btn-quiet btn-icon intro-x" data-act="hideIntro" aria-label="Dölj rutan">${icon('x')}</button>
    </section>`);
    const devs = devices(), fav = favorites().map(deviceById).filter(Boolean), rec = recents().map(deviceById).filter(Boolean).filter(d => !fav.includes(d)).slice(0, 4);
    const pend = tips().filter(t => t.status === 'pending').length, fl = flags().filter(f => f.status === 'open').length, rp = reports().filter(r => r.status === 'open').length;
    const old = devs.filter(d => manualStatus(manualFor(d)).key !== 'ok').length;
    setHTML(body, html`
      ${isAdmin() ? html`<section class="sect"><div class="sect-head"><h2 class="h2">Att göra som ansvarig</h2></div><div class="todo">
        <a href="#granska"><b class="num">${pend}</b><span>tips väntar på godkännande</span></a>
        <a href="#granska"><b class="num">${fl}</b><span>flaggade svar att granska</span></a>
        <a href="#granska"><b class="num">${rp}</b><span>öppna felanmälningar</span></a>
        <a href="#manualer"><b class="num">${old}</b><span>manualer att se över</span></a></div></section>` : ''}
      ${!devs.length ? html`<section class="sect"><div class="empty"><h3 class="h3">Inga enheter än</h3><p>Lägg till den första enheten genom att ladda upp tillverkarens bruksanvisning som PDF.</p>${isAdmin() ? html`<button class="btn btn-primary" data-act="upload">${icon('upload')}Lägg till enhet</button>` : html`<button class="btn" data-act="role" data-role="admin">Byt till ansvarig för att lägga till</button>`}</div></section>` : ''}
      ${fav.length ? html`<section class="sect"><div class="sect-head"><h2 class="h2">Favoriter</h2></div><div class="tiles">${fav.map(deviceTile)}</div></section>` : ''}
      ${rec.length ? html`<section class="sect"><div class="sect-head"><h2 class="h2">Senast använda</h2><a href="#enheter">Visa all utrustning</a></div><div class="rows">${rec.map(deviceRow)}</div></section>` : ''}
      ${devs.length && !fav.length && !rec.length ? html`<section class="sect"><div class="sect-head"><h2 class="h2">Utrustning</h2><a href="#enheter">Visa alla</a></div><div class="rows">${devs.slice(0, 5).map(deviceRow)}</div></section>` : ''}`);
  }
};
ACT.hideIntro = () => { S.prefs.introHidden = true; savePrefs(); V.hem.update(); };
INPUT.omni = el => {
  const q = el.value.trim(), out = $('#omniSug');
  if (!out) return;
  if (!q) { setHTML(out, ''); return; }
  const low = q.toLowerCase();
  const hits = devices().filter(d => [d.name, d.manufacturer, d.model, d.dept, d.inventoryNo].join(' ').toLowerCase().includes(low)).slice(0, 4);
  const codeHits = looksLikeCode(q) ? devices().map(d => ({ d, hit: matchAlarm(alarmsOf(manualFor(d)), q) })).filter(x => x.hit) : [];
  setHTML(out, html`<div class="omni-sug">
    ${codeHits.map(x => html`<button data-act="omniCode" data-code="${q}" data-id="${x.d.id}">${icon('bell')}<span><strong class="code">${x.hit.key}</strong> ${x.hit.entry.label || ''}</span><span class="sub">${x.d.name}</span></button>`)}
    ${looksLikeCode(q) && !codeHits.length ? html`<button data-act="omniCode" data-code="${q}">${icon('bell')}<span>Slå upp larmkoden <strong class="code">${q.toUpperCase()}</strong></span><span class="sub">Alla enheter</span></button>` : ''}
    ${hits.map(d => html`<a href="#enhet-${d.id}">${icon('cat-' + (CATS[d.category] ? d.category : 'other'))}<span>${d.name}</span><span class="sub">${d.dept || ''}</span></a>`)}
    ${!looksLikeCode(q) && q.length > 2 ? html`<button data-act="omniAsk">${icon('chat')}<span>Fråga manualerna: ”${trunc(q, 60)}”</span><span class="sub">Alla enheter</span></button>` : ''}
  </div>`);
};
ACT.omniCode = el => { UI.pendingAlarm = { code: el.dataset.code, dev: el.dataset.id || '' }; location.hash = '#larm'; };
ACT.omniAsk = () => { const q = $('#omni').value.trim(); if (!q) return; UI.pendingAsk = q; location.hash = '#fraga'; };
FORM.omni = f => {
  const q = f.elements.q.value.trim();
  if (!q) return;
  if (looksLikeCode(q)) { UI.pendingAlarm = { code: q, dev: '' }; location.hash = '#larm'; return; }
  const low = q.toLowerCase(), hits = devices().filter(d => [d.name, d.model].join(' ').toLowerCase().includes(low));
  if (hits.length === 1) { location.hash = '#enhet-' + hits[0].id; return; }
  UI.pendingAsk = q; location.hash = '#fraga';
};

/* ----- Utrustningsbibliotek ----- */
V.enheter = {
  title: 'Utrustning',
  render(el) {
    setHTML(el, html`
      <div class="page-head"><h1 class="h1">Utrustning</h1>${isAdmin() ? html`<button class="btn btn-primary" data-act="upload">${icon('plus')}Lägg till enhet</button>` : ''}</div>
      <div class="rowflex" data-tour="filters"><div class="searchbox">${icon('search')}<input class="input" id="devSearch" type="search" placeholder="Sök namn, tillverkare, modell eller inventarienummer" value="${UI.q}" data-input="devSearch" aria-label="Sök utrustning"></div></div>
      <div class="chips" id="deptChips" style="margin:12px 0 18px"></div>
      <div id="devList"></div>`);
    this.update();
  },
  update() {
    const list = $('#devList');
    if (!list) return;
    const ds = depts();
    if (UI.dept && !ds.includes(UI.dept)) UI.dept = '';
    setHTML($('#deptChips'), html`<button class="chip ${!UI.dept ? 'is-on' : ''}" data-act="dept" data-dept="">Alla avdelningar <span class="n num">${devices().length}</span></button>${ds.map(x => html`<button class="chip ${UI.dept === x ? 'is-on' : ''}" data-act="dept" data-dept="${x}">${x} <span class="n num">${devices().filter(d => d.dept === x).length}</span></button>`)}`);
    const low = UI.q.toLowerCase();
    const shown = devices().filter(d => (!UI.dept || d.dept === UI.dept) && (!low || [d.name, d.manufacturer, d.model, d.dept, d.inventoryNo, CATS[d.category]].join(' ').toLowerCase().includes(low)));
    setHTML(list, shown.length ? html`<div class="tiles">${shown.map(deviceTile)}</div>` : html`<div class="empty"><h3 class="h3">${devices().length ? 'Ingen utrustning matchar sökningen' : 'Inga enheter än'}</h3><p>${devices().length ? 'Ändra sökordet eller välj en annan avdelning.' : 'Lägg till den första enheten genom att ladda upp tillverkarens bruksanvisning.'}</p>${devices().length ? html`<button class="btn" data-act="clearFilters">Visa all utrustning</button>` : ''}</div>`);
  }
};
INPUT.devSearch = el => { UI.q = el.value.trim(); V.enheter.update(); };
ACT.dept = el => { UI.dept = el.dataset.dept; V.enheter.update(); };
ACT.clearFilters = () => { UI.q = ''; UI.dept = ''; const i = $('#devSearch'); if (i) i.value = ''; V.enheter.update(); };

/* ----- Enhetssida ----- */
const DEV_TABS = [['fraga', 'Fråga', 'chat'], ['kort', 'Snabbkort', 'card'], ['larm', 'Larmkoder', 'bell'], ['tips', 'Tips', 'note'], ['manual', 'Manual', 'book'], ['info', 'QR och kontakt', 'qr']];
function setDevTab(id, tab) {
  UI.devTab[id] = tab;
  if (ROUTE.name === 'enhet' && ROUTE.id === id) { drawDevTabs(deviceById(id)); drawDevPanel(deviceById(id)); }
}
ACT.devTab = el => {
  const id = el.dataset.id || ROUTE.id;
  UI.devTab[id] = el.dataset.tab;
  if (ROUTE.name === 'enhet' && ROUTE.id === id) setDevTab(id, el.dataset.tab); else location.hash = '#enhet-' + id;
};
const noManualTpl = d => html`<div class="empty"><h3 class="h3">Ingen manual är uppladdad</h3><p>Utan tillverkarens bruksanvisning kan ${BRAND} inte svara på frågor om ${d.name}.</p>${isAdmin() ? html`<button class="btn btn-primary" data-act="upload" data-id="${d.id}">${icon('upload')}Ladda upp manual</button>` : html`<p class="hint">Be en ansvarig ladda upp manualen, eller byt till ansvarig längst ned i menyn.</p>`}</div>`;
function drawDevHead(d) {
  const m = manualFor(d), st = manualStatus(m), rep = openReportFor(d.id), fav = favorites().includes(d.id), c = contactsOf(d);
  setHTML($('#devHead'), html`
    <div class="dev-head" data-tour="devhead">${devIcon(d, 'lg')}
      <div><h1 class="h1">${d.name}</h1><p class="dev-sub">${makerLine(d)}</p></div>
      <div class="dev-actions">
        <button class="star ${fav ? 'is-on' : ''}" data-act="fav" data-id="${d.id}" aria-label="${fav ? 'Ta bort från favoriter' : 'Lägg till som favorit'}" aria-pressed="${fav}">${icon('star', 'ic-l')}</button>
        ${c.mt.phone ? html`<a class="btn btn-s" href="${telHref(c.mt.phone)}">${icon('phone', 'ic-s')}MT-jour ${c.mt.phone}</a>` : ''}
        ${isAdmin() ? html`<button class="btn btn-s" data-act="editDevice" data-id="${d.id}">${icon('edit', 'ic-s')}Redigera</button>` : ''}
      </div>
      <div class="dev-facts"><span class="badge">${icon('pin')}${d.dept || 'Avdelning saknas'}</span>${d.inventoryNo ? html`<span class="badge">${d.inventoryNo}</span>` : ''}
        <span class="badge ${st.cls}" data-tour="version">${icon(st.ic)}${m ? 'Manual ' + verLine(m) : 'Manual saknas'}</span>${demoBadge(d)}</div>
    </div>
    ${rep ? html`<div class="notice crit mt14">${icon('warn')}<div><strong>Öppen felanmälan sedan ${fmtWhen(rep.createdAt)}</strong>${rep.code ? 'Felkod ' + rep.code + '. ' : ''}${rep.what}${rep.outOfService ? ' Enheten är tagen ur drift.' : ''}</div></div>` : ''}
    ${st.key === 'stale' ? html`<div class="notice warn mt14">${icon('clock')}<div>Manualen är utgiven ${fmtDate(m.issued)} och är äldre än ${S.settings.staleMonths} månader. Kontrollera med MT att det är gällande version.</div></div>` : ''}`);
}
function drawDevTabs(d) {
  const tab = UI.devTab[d.id] || 'fraga';
  const nTips = tips().filter(t => t.deviceId === d.id && t.status === 'approved').length;
  setHTML($('#devTabs'), DEV_TABS.map(([k, label, ic]) => html`<button role="tab" aria-selected="${tab === k}" class="${tab === k ? 'is-on' : ''}" data-act="devTab" data-id="${d.id}" data-tab="${k}" data-tour="tab-${k}">${icon(ic, 'ic-s')}${label}${k === 'tips' && nTips ? html`<span class="count num">${nTips}</span>` : ''}</button>`));
}
function drawDevPanel(d) {
  const tab = UI.devTab[d.id] || 'fraga', m = manualFor(d), el = $('#devPanel');
  if (!el) return;
  el.dataset.tab = tab;
  if (tab === 'fraga') {
    if (!m) { setHTML(el, noManualTpl(d)); return; }
    setHTML(el, chatTpl(d.id));
    renderLog(d.id);
  } else if (tab === 'kort') setHTML(el, cardPanel(d, m));
  else if (tab === 'larm') { setHTML(el, alarmPanel(d, m)); }
  else if (tab === 'tips') setHTML(el, tipsPanel(d));
  else if (tab === 'manual') setHTML(el, manualPanel(d, m));
  else { setHTML(el, infoPanel(d)); drawQR(d); }
}
V.enhet = {
  title: 'Enhet',
  render(el, route) {
    const d = deviceById(route.id);
    if (!d) {
      setHTML(el, html`<a class="back" href="#enheter">${icon('left', 'ic-s')}Utrustning</a><div class="empty"><h3 class="h3">Enheten hittades inte</h3><p>Länken eller QR-koden pekar på en enhet som inte finns här${S.settings.demoMode ? '' : '. Exempeldatan är avstängd'}.</p><a class="btn btn-primary" href="#enheter">Visa all utrustning</a></div>`);
      return;
    }
    touchRecent(d.id);
    setHTML(el, html`<a class="back" href="#enheter">${icon('left', 'ic-s')}Utrustning</a><div id="devHead"></div><div class="tabs" role="tablist" id="devTabs"></div><div id="devPanel"></div>`);
    drawDevHead(d); drawDevTabs(d); drawDevPanel(d);
  },
  update() {
    const d = deviceById(ROUTE.id);
    if (!d || !$('#devHead')) { V.enhet.render($('#view'), ROUTE); return; }
    drawDevHead(d); drawDevTabs(d);
    const tab = UI.devTab[d.id] || 'fraga', panel = $('#devPanel');
    const typing = panel && panel.contains(document.activeElement) && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (tab !== 'fraga' && tab !== 'larm' && !typing) drawDevPanel(d);
  }
};

/* Snabbkort */
const cardSrc = (m, b, k) => (b && b.sida ? html`<button class="linkbtn qsrc" data-act="cardSrc" data-m="${m.id}" data-k="${k}">Manual sida ${b.sida}</button>` : '');
function cardTpl(d, m, card) {
  const c = contactsOf(d);
  return html`<div class="qcard" data-tour="qcard">
    <div class="qcard-head"><strong>${d.name}</strong><span class="badge ${card.status === 'approved' ? '' : 'draft'}">${card.status === 'approved' ? 'Granskat av ansvarig' : 'Utkast, ej granskat'}</span></div>
    <div class="qcard-body">
      <section class="qsec"><h3>${icon('power')}Starta</h3>${card.uppstart.steg.length ? html`<ol>${card.uppstart.steg.map(s => html`<li>${s}</li>`)}</ol>` : html`<p class="muted small">Manualen saknar avsnitt om uppstart.</p>`}${cardSrc(m, card.uppstart, 'uppstart')}</section>
      <section class="qsec"><h3>${icon('bell')}Vanliga larm</h3>${card.larm.length ? html`<table>${card.larm.map(a => html`<tr><td>${a.kod}</td><td><strong>${a.betyder}</strong><br>${a.gor}</td></tr>`)}</table>` : html`<p class="muted small">Manualen saknar larmkoder.</p>`}</section>
      <section class="qsec"><h3>${icon('spray')}Rengöring</h3>${card.rengoring.steg.length ? html`<ol>${card.rengoring.steg.map(s => html`<li>${s}</li>`)}</ol>` : html`<p class="muted small">Manualen saknar avsnitt om rengöring.</p>`}${cardSrc(m, card.rengoring, 'rengoring')}</section>
      <section class="qsec"><h3>${icon('warn')}Viktigt</h3><ul>${(card.viktigt || []).map(s => html`<li>${s}</li>`)}</ul>${c.mt.phone ? html`<p class="small mt8">Vid fel: ${c.mt.name || 'MT-jour'} <strong class="code">${c.mt.phone}</strong></p>` : ''}</section>
    </div>
    <div class="qcard-foot">Bygger på ${m.title || 'bruksanvisningen'}, ${verLine(m)}. Snabbkortet ersätter inte bruksanvisningen.</div>
  </div>`;
}
function cardPanel(d, m) {
  if (!m) return noManualTpl(d);
  const card = m.card;
  if (!card) {
    return html`<div class="empty"><h3 class="h3">Inget snabbkort än</h3><p>${BRAND} sammanfattar uppstart, vanliga larm och rengöring ur manualen på ett kort som kan skrivas ut och sättas på enheten. En ansvarig granskar kortet först.</p>
      ${aiReady() ? html`<button class="btn btn-primary" data-act="cardMake" data-id="${d.id}">${icon('spark')}Skapa snabbkort ur manualen</button>` : html`<p class="hint">${S.aiNote || 'AI-svar är inte tillgängliga i den här visningen.'}</p>`}</div>`;
  }
  const old = card.version && m.version && card.version !== m.version;
  return html`
    ${old ? html`<div class="notice warn" style="margin-bottom:14px">${icon('clock')}<div><strong>Kortet bygger på en äldre manual</strong>Kortet gjordes från ${card.version}. Manualen är nu ${m.version}. Skapa om kortet.</div></div>` : ''}
    ${card.status !== 'approved' ? html`<div class="notice" style="margin-bottom:14px">${icon('info')}<div><strong>Utkast som väntar på granskning</strong>Kortet är skapat av AI ur manualen. MT eller en ansvarig ska granska det mot manualen innan det sätts upp.${isAdmin() ? html`<br><button class="btn btn-s btn-primary" data-act="cardApprove" data-id="${d.id}">${icon('check', 'ic-s')}Godkänn för utskrift</button>` : ''}</div></div>` : ''}
    ${cardTpl(d, m, card)}
    <div class="rowflex mt14">
      <button class="btn btn-primary" data-act="cardPdf" data-id="${d.id}" ${card.status === 'approved' ? '' : 'disabled'}>${icon('download')}Ladda ner för utskrift (PDF)</button>
      ${card.uppstart.steg.length ? html`<button class="btn" data-act="cardSteps" data-id="${d.id}" data-k="uppstart">${icon('steps')}Starta steg för steg</button>` : ''}
      ${aiReady() ? html`<button class="btn" data-act="cardMake" data-id="${d.id}">${icon('spark')}Skapa om ur manualen</button>` : ''}
    </div>
    <p class="hint mt8">${card.status === 'approved' ? (card.approvedAt ? 'Granskat ' + fmtDate(card.approvedAt) + '. ' : '') : 'Kortet kan skrivas ut när en ansvarig har godkänt det. '}Skapat ${fmtDate(card.madeAt)} från ${card.version || 'manualen'}.</p>`;
}
ACT.cardSrc = async el => {
  const m = manualById(el.dataset.m);
  if (!m || !m.card) return;
  const b = m.card[el.dataset.k], pages = await pagesOf(m);
  const v = b.citat ? verifyQuote(pages, b.sida, b.citat) : { ok: false, page: b.sida };
  openSource({ manualId: m.id, page: v.page || b.sida, range: v.range || null, section: b.avsnitt });
};
ACT.cardSteps = el => {
  const d = deviceById(el.dataset.id), m = manualFor(d);
  if (!m || !m.card) return;
  const b = m.card[el.dataset.k];
  openSteps({ title: `${d.name}: ${el.dataset.k === 'uppstart' ? 'starta' : 'rengöring'}`, sub: `Ur snabbkortet, manual sida ${b.sida}`, steps: b.steg });
};
ACT.cardMake = async el => {
  const d = deviceById(el.dataset.id), m = manualFor(d);
  if (!m || !aiReady()) return;
  el.disabled = true;
  setHTML(el, html`${dots()} Läser manualen`);
  try {
    const card = await generateCard(d, m);
    if (!card.uppstart.steg.length && !card.larm.length && !card.rengoring.steg.length) { toast('Manualen innehöll inget som passar ett snabbkort.', 'crit'); }
    else {
      await saveDoc('manuals', m.id, { card });
      audit('card', d.id, `Snabbkort skapat från ${m.version || 'manualen'}. Väntar på granskning.`);
      toast('Snabbkortet är skapat som utkast.');
    }
  } catch (e) { const t = aiFail(e); if (t) toast(t, 'crit'); }
  if (ROUTE.name === 'enhet' && ROUTE.id === d.id) drawDevPanel(deviceById(d.id));
};
ACT.cardApprove = async el => {
  const d = deviceById(el.dataset.id), m = manualFor(d);
  if (!m || !m.card) return;
  await saveDoc('manuals', m.id, { card: { ...m.card, status: 'approved', approvedAt: Date.now(), approvedBy: S.uid || '' } });
  audit('card', d.id, 'Snabbkort godkänt för utskrift.');
  toast('Snabbkortet är godkänt.');
};

/* Larmkoder på enhetssidan */
function alarmPanel(d, m) {
  if (!m) return noManualTpl(d);
  const entries = Object.entries(alarmsOf(m));
  return html`<div data-alarmbox>
    <form class="alarm-form" data-form="alarm" data-scope="${d.id}" data-out="alOut-${d.id}">
      <div class="field"><label for="al-${d.id}">Larm- eller felkod</label><input class="input alarm-input" id="al-${d.id}" name="code" placeholder="t.ex. ${entries.length ? entries[0][0] : 'E-23'}" autocomplete="off" autocapitalize="characters" spellcheck="false" required></div>
      <p class="hint">Skriv koden som den står på displayen. Finns den i registret visas svaret direkt, annars söker ${BRAND} i manualen.</p>
      <button class="btn btn-primary btn-lg">Slå upp</button>
    </form>
    ${entries.length ? html`<div class="codechips"><span class="small muted">Koder i manualen</span>${entries.map(([k]) => html`<button class="codechip" data-act="codechip" data-code="${k.split('–')[0]}">${k}</button>`)}</div>` : ''}
    <div id="alOut-${d.id}" class="stack" style="margin-top:20px" aria-live="polite"></div>
  </div>
  ${entries.length ? html`<section class="sect"><div class="sect-head"><h2 class="h2">Larmregister</h2></div>
    <div class="table-wrap"><table class="table regtable"><thead><tr><th>Kod</th><th>Larmtext</th><th>Prioritet</th><th class="r">Sida</th></tr></thead><tbody>
    ${entries.map(([k, e]) => { const pr = prioOf(e.prio); return html`<tr><td>${k}</td><td>${e.label || e.betyder}${e.mt ? html` <span class="badge b-crit">Kontakta MT</span>` : ''}${e.ai ? html` <span class="badge">Tolkad av AI</span>` : ''}</td><td>${pr ? html`<span class="prio ${pr.cls}"><i></i>${pr.label.replace(' prioritet', '')}</span>` : ''}</td><td class="r num">${e.sida || ''}</td></tr>`; })}
    </tbody></table></div><p class="hint mt8">Registret fylls på när nya koder slås upp. Varje post pekar på sidan i manualen.</p></section>` : ''}`;
}

/* Lokala tips */
const tipTpl = t => html`<div class="tipnote"><span class="tip-label">Lokalt tips, ej från tillverkaren</span><p>${t.text}</p><span class="tip-meta">Godkänt av ansvarig ${fmtDate(t.decidedAt || t.createdAt)}</span></div>`;
function tipsPanel(d) {
  const list = tips().filter(t => t.deviceId === d.id), ok = list.filter(t => t.status === 'approved');
  const pend = list.filter(t => t.status === 'pending' && (isAdmin() || (S.uid && t.by === S.uid) || t.mine));
  const hidden = list.filter(t => t.status === 'pending').length - pend.length;
  return html`
    <p class="page-sub" style="margin-top:0">Lokala tips kommer från personalen och inte från tillverkaren. De visas först när en ansvarig har godkänt dem.</p>
    ${ok.length ? html`<div class="tipgrid" data-tour="tips">${ok.map(tipTpl)}</div>` : html`<div class="empty"><p>Inga godkända tips för den här enheten än.</p></div>`}
    ${pend.length ? html`<section class="sect"><div class="sect-head"><h2 class="h2">Väntar på godkännande</h2></div><div class="rows">${pend.map(t => html`<div class="row wrap-s"><div class="row-main"><span>${t.text}</span><span class="row-sub">Inskickat ${fmtWhen(t.createdAt)}</span></div>
      ${isAdmin() ? html`<div class="row-meta"><button class="btn btn-s btn-primary" data-act="tipDecide" data-id="${t.id}" data-v="approved">Godkänn</button><button class="btn btn-s" data-act="tipDecide" data-id="${t.id}" data-v="rejected">Avslå</button></div>` : html`<span class="badge">Väntar</span>`}</div>`)}</div></section>` : ''}
    ${hidden > 0 ? html`<p class="hint mt14">${hidden} tips från kollegor väntar på godkännande.</p>` : ''}
    <section class="sect"><div class="sect-head"><h2 class="h2">Lägg till ett tips</h2></div>
      <form class="stack" data-form="tip" data-id="${d.id}"><textarea class="textarea" name="text" id="tip-${d.id}" required maxlength="400" placeholder="Till exempel var reservdelar finns eller en lokal rutin. Inga patientuppgifter." aria-label="Ditt tips"></textarea>
        <div class="rowflex">${micBtn('tip-' + d.id)}<button class="btn btn-primary">${isAdmin() ? 'Lägg till tipset' : 'Skicka för godkännande'}</button></div></form></section>`;
}
FORM.tip = async f => {
  const text = f.elements.text.value.trim();
  if (!text) return;
  if (findPNR(text).length) { toast('Tipset ser ut att innehålla ett personnummer. Ta bort det.', 'crit'); return; }
  const admin = isAdmin();
  try {
    await addDoc('tips', { deviceId: f.dataset.id, text, status: admin ? 'approved' : 'pending', by: S.uid || '', mine: !S.uid, createdAt: Date.now(), ...(admin ? { decidedAt: Date.now() } : {}) });
  } catch (e) { toast('Tipset kunde inte sparas. Försök igen.', 'crit'); return; }
  f.reset();
  if (admin) audit('tip', f.dataset.id, 'Lokalt tips tillagt av ansvarig.');
  toast(admin ? 'Tipset är tillagt.' : 'Tack. Tipset visas när en ansvarig har godkänt det.');
  if (ROUTE.name === 'enhet') drawDevPanel(deviceById(ROUTE.id));
};
ACT.tipDecide = async el => {
  const t = tips().find(x => x.id === el.dataset.id);
  if (!t) return;
  await saveDoc('tips', t.id, { status: el.dataset.v, decidedAt: Date.now(), decidedBy: S.uid || '' });
  audit('tip', t.deviceId, el.dataset.v === 'approved' ? 'Lokalt tips godkänt.' : 'Lokalt tips avslaget.');
  toast(el.dataset.v === 'approved' ? 'Tipset är godkänt och visas nu för personalen.' : 'Tipset är avslaget.');
};

/* Manual: version, historik och sökning */
function manualPanel(d, m) {
  if (!m) return noManualTpl(d);
  const st = manualStatus(m), hist = m.history || [];
  return html`
    <div class="two">
      <div class="panel"><div class="panel-h"><h2 class="h3">Gällande version</h2>${statusBadge(m)}</div>
        <dl class="kv"><dt>Dokument</dt><dd>${m.title || m.fileName || 'Bruksanvisning'}</dd><dt>Version</dt><dd>${m.version || 'Saknas'}</dd><dt>Utgiven</dt><dd>${m.issued ? html`${fmtDate(m.issued)} <span class="muted">(${ageLabel(st.months)} sedan)</span>` : 'Saknas'}</dd><dt>Språk</dt><dd>${LANG[m.lang || '']}</dd><dt>Sidor</dt><dd class="num">${m.pageCount || (m.pages ? m.pages.length : '')}</dd><dt>Uppladdad</dt><dd>${fmtDate(m.uploadedAt)}</dd></dl>
        <div class="rowflex mt14"><button class="btn btn-s" data-act="openManual" data-m="${m.id}">${icon('book', 'ic-s')}Läs manualen</button>${isAdmin() ? html`<button class="btn btn-s" data-act="upload" data-id="${d.id}">${icon('upload', 'ic-s')}Ladda upp ny version</button>` : ''}</div></div>
      <div class="panel"><div class="panel-h"><h2 class="h3">Versionshistorik</h2></div>
        ${hist.length ? html`<div class="stack">${hist.map(h => html`<div><strong>${h.version || 'Tidigare version'}</strong>${h.issued ? ', utgiven ' + fmtDate(h.issued) : ''}<div class="small muted">Ersatt ${fmtDate(h.replacedAt)}${h.note ? '. ' + h.note : ''}</div></div>`)}</div>` : html`<p class="muted">Ingen tidigare version är registrerad.</p>`}
        <p class="hint mt14">När en ny version laddas upp jämförs larmkoderna, och larmregister och snabbkort nollställs så att inget bygger på gammal text.</p></div>
    </div>
    <section class="sect"><div class="sect-head"><h2 class="h2">Sök i manualen</h2></div>
      <div class="searchbox">${icon('search')}<input class="input" type="search" id="ms-${d.id}" placeholder="Sök ett ord eller en fras, till exempel batteri" data-input="manualSearch" data-id="${d.id}" aria-label="Sök i manualen"></div>
      <div id="msOut-${d.id}" class="stack mt14"></div></section>`;
}
INPUT.manualSearch = debounce(async el => {
  const d = deviceById(el.dataset.id), m = manualFor(d), out = $('#msOut-' + el.dataset.id), q = el.value.trim();
  if (!out || !m) return;
  if (q.length < 2) { setHTML(out, ''); return; }
  const pages = await pagesOf(m), low = q.toLowerCase();
  let hits = pages.map(p => { const i = p.text.toLowerCase().indexOf(low); return i >= 0 ? { p, range: { start: i, end: i + q.length } } : null; }).filter(Boolean);
  if (!hits.length) {
    const words = terms(q);
    hits = rankPages(pageIndex(m, pages), words).slice(0, 6).map(r => {
      const p = pages.find(x => x.n === r.n), lowp = p.text.toLowerCase();
      let range = null;
      for (const w of words) { const i = lowp.indexOf(w); if (i >= 0) { let e = i; while (e < p.text.length && /[\p{L}\p{N}-]/u.test(p.text[e])) e++; range = { start: i, end: e }; break; } }
      return { p, range };
    });
  }
  setHTML(out, hits.length ? html`<p class="small muted">${hits.length} ${hits.length === 1 ? 'sida' : 'sidor'} med träff</p>${hits.slice(0, 10).map(h => html`<button class="fallback-hit" data-act="openPage" data-m="${m.id}" data-p="${h.p.n}" data-s="${h.range ? h.range.start : ''}" data-e="${h.range ? h.range.end : ''}"><strong>Sida ${h.p.n}</strong><span>${snippetAround(h.p.text, h.range, 220)}</span></button>`)}` : html`<p class="muted">Inga träffar på ”${q}”.</p>`);
}, 160);

/* QR och kontakt */
function deviceUrl(d) {
  const base = String(S.settings.baseUrl || ARTIFACT_URL || '').split('#')[0].trim();
  return base ? base + '#enhet-' + d.id : '';
}
function infoPanel(d) {
  const c = contactsOf(d), url = deviceUrl(d);
  const contact = (x, fallback) => html`<div class="contact"><span class="small muted">${x.name || fallback}</span>${x.phone ? html`<a class="tel" href="${telHref(x.phone)}">${x.phone}</a>` : html`<span class="muted">Telefonnummer saknas</span>`}${x.hours ? html`<span class="small">${x.hours}</span>` : ''}${x.email ? html`<a class="small" href="mailto:${x.email}">${x.email}</a>` : ''}</div>`;
  return html`<div class="two">
    <div class="panel" data-tour="qr"><div class="panel-h"><h2 class="h3">QR-kod till enheten</h2></div>
      <div class="qrbox"><div class="qr" id="qr-${d.id}" aria-label="QR-kod"></div>
        <div class="stack"><p>Skriv ut etiketten och sätt den på enheten. Den som skannar koden med mobilens kamera hamnar direkt på den här sidan.</p>
          ${url ? html`<p class="urlline">${url}</p>` : html`<div class="notice warn">${icon('info')}<div>Adressen till appen saknas. En ansvarig anger den under Inställningar.</div></div>`}
          <div class="rowflex"><button class="btn btn-primary" data-act="labelPdf" data-id="${d.id}" ${url ? '' : 'disabled'}>${icon('download')}Ladda ner etikett (PDF)</button>${url ? html`<button class="btn" data-act="copyUrl" data-id="${d.id}">${icon('copy')}Kopiera länken</button>` : ''}</div></div></div>
      <p class="hint mt14">Länken fungerar för den som har tillgång till appen. Dela artefakten med kollegorna först.</p></div>
    <div class="stack">
      ${contact(c.mt, 'MT-jour')}${contact(c.support, 'Tillverkarens support')}
      <div class="panel"><dl class="kv"><dt>Tillverkare</dt><dd>${d.manufacturer || 'Saknas'}</dd><dt>Modell</dt><dd>${d.model || 'Saknas'}</dd><dt>Typ</dt><dd>${CATS[d.category] || 'Övrigt'}</dd><dt>Avdelning</dt><dd>${d.dept || 'Saknas'}</dd><dt>Inventarienummer</dt><dd>${d.inventoryNo || 'Saknas'}</dd></dl></div>
    </div></div>`;
}
ACT.copyUrl = el => { const d = deviceById(el.dataset.id); if (d) copyText(deviceUrl(d), 'Länken är kopierad'); };

/* ----- Fråga över alla manualer ----- */
V.fraga = {
  title: 'Fråga manualerna',
  render(el) {
    setHTML(el, html`<div class="page-head"><h1 class="h1">Fråga manualerna</h1>${manuals().length ? html`<button class="btn btn-s" data-act="clearChat">${icon('plus', 'ic-s')}Ny konversation</button>` : ''}</div>${manuals().length ? chatTpl('alla') : html`<div class="empty"><h3 class="h3">Inga manualer än</h3><p>Ladda upp en bruksanvisning för att kunna ställa frågor.</p></div>`}`);
    renderLog('alla');
    if (UI.pendingAsk) { const q = UI.pendingAsk; UI.pendingAsk = ''; ask('alla', q); }
  }
};
ACT.clearChat = () => { CHATS.delete('alla'); V.fraga.render($('#view')); };

/* ----- Larmkodsläge ----- */
V.larm = {
  title: 'Larmkod',
  render(el) {
    const withManual = devices().filter(d => manualFor(d));
    if (UI.alarmDev && !withManual.some(d => d.id === UI.alarmDev)) UI.alarmDev = '';
    setHTML(el, html`
      <div class="page-head"><h1 class="h1">Larmkod</h1></div>
      <p class="page-sub">Skriv koden som den står på displayen. Du får betydelse, trolig orsak och åtgärd, med sidan i manualen.</p>
      <div data-alarmbox data-tour="alarm">
        <form class="alarm-form" data-form="alarm" data-out="alOut">
          <div class="field"><label for="alCode">Larm- eller felkod</label><input class="input alarm-input" id="alCode" name="code" placeholder="t.ex. E-23" autocomplete="off" autocapitalize="characters" spellcheck="false" required></div>
          <div class="field"><label for="alScope">Enhet</label><select class="select" id="alScope" name="scope" data-change="alarmScope" style="min-height:64px"><option value="">Alla enheter</option>${withManual.map(d => html`<option value="${d.id}" ${UI.alarmDev === d.id ? 'selected' : ''}>${d.name}</option>`)}</select></div>
          <button class="btn btn-primary btn-lg" style="min-height:64px">Slå upp</button>
        </form>
        <div class="codechips" id="alChips"></div>
        <div id="alOut" class="stack" style="margin-top:20px" aria-live="polite"></div>
      </div>
      <div class="sect">${phiNote('Larmuppslaget visar bara manualens text. Vid alla larm: kontrollera patienten först och följ avdelningens rutiner.')}</div>`);
    drawAlarmChips();
    if (UI.pendingAlarm) {
      const p = UI.pendingAlarm; UI.pendingAlarm = null;
      $('#alCode').value = p.code;
      if (p.dev) { $('#alScope').value = p.dev; UI.alarmDev = p.dev; drawAlarmChips(); }
      runAlarm(p.code, p.dev || null, $('#alOut'));
    }
  }
};
function drawAlarmChips() {
  const el = $('#alChips');
  if (!el) return;
  const d = UI.alarmDev && deviceById(UI.alarmDev);
  let chips = [];
  if (d) chips = Object.keys(alarmsOf(manualFor(d))).map(k => ({ k, dev: d.id }));
  else if (S.settings.demoMode) chips = [{ k: 'E-23', dev: '' }, { k: 'T-112', dev: '' }, { k: 'F5', dev: '' }, { k: 'Err 11', dev: '' }, { k: 'V-215', dev: '' }].filter(c => devices().some(x => matchAlarm(alarmsOf(manualFor(x)), c.k)));
  setHTML(el, chips.length ? html`<span class="small muted">${d ? 'Koder i manualen' : 'Prova till exempel'}</span>${chips.map(c => html`<button class="codechip" data-act="codechip" data-code="${c.k.split('–')[0]}" data-dev="${c.dev}">${c.k}</button>`)}` : '');
}
CHANGE.alarmScope = el => { UI.alarmDev = el.value; drawAlarmChips(); };

/* ----- Nattläge ----- */
const NIGHT = { deviceId: '', mode: '', picking: false };
V.natt = {
  title: 'Nattläge',
  enter() { document.documentElement.classList.add('night'); if (!NIGHT.deviceId) { const r = recents().map(deviceById).filter(Boolean)[0]; NIGHT.deviceId = r ? r.id : ''; NIGHT.picking = !r; } },
  leave() { document.documentElement.classList.remove('night'); },
  render(el) { drawNight(el); },
  update() { if (!$('#nOut') && !NIGHT.picking) drawNight($('#view')); }
};
function nightDevices() {
  const order = [...recents(), ...favorites()];
  return devices().slice().sort((a, b) => { const ia = order.indexOf(a.id), ib = order.indexOf(b.id); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
}
function drawNight(el) {
  const d = NIGHT.deviceId && deviceById(NIGHT.deviceId);
  const head = html`<div class="nhead"><h1 class="h1">${icon('moon', 'ic-l')}Nattläge</h1><a class="btn" href="#hem">Avsluta</a></div>`;
  if (!d || NIGHT.picking) {
    setHTML(el, html`<div class="nview">${head}<h2 class="h2">Vilken enhet gäller det?</h2>
      <div class="npick">${nightDevices().map(x => html`<button data-act="nPick" data-id="${x.id}">${devIcon(x)}<div>${x.name}<span>${x.dept || ''}</span></div></button>`)}</div>
      ${!devices().length ? html`<div class="empty"><p>Inga enheter finns inlagda.</p></div>` : ''}</div>`);
    return;
  }
  const m = manualFor(d), c = contactsOf(d);
  setHTML(el, html`<div class="nview">${head}
    <button class="ndev" data-act="nChange" data-tour="ndev">${devIcon(d)}<div><strong>${d.name}</strong><span>${d.dept || ''}</span></div><span class="chg">Byt enhet</span></button>
    ${m ? html`<div class="ngrid" data-tour="ngrid">
      <button class="nbtn ${NIGHT.mode === 'start' ? 'is-on' : ''}" data-act="nGo" data-k="start">${icon('power', 'ic-xl')}Hur startar jag?</button>
      <button class="nbtn ${NIGHT.mode === 'alarm' ? 'is-on' : ''}" data-act="nGo" data-k="alarm">${icon('bell', 'ic-xl')}Larm eller fel</button>
      <button class="nbtn ${NIGHT.mode === 'clean' ? 'is-on' : ''}" data-act="nGo" data-k="clean">${icon('spray', 'ic-xl')}Rengöring</button></div>` : html`<div class="notice warn">${icon('warn')}<div>Ingen manual är uppladdad för ${d.name}.</div></div>`}
    <div class="nout" id="nOut" aria-live="polite"></div>
    ${m ? html`<form class="composer" data-form="nAsk"><textarea id="nQ" name="q" rows="1" maxlength="1200" placeholder="Annan fråga om enheten" data-input="grow" enterkeyhint="send" aria-label="Annan fråga"></textarea>${micBtn('nQ', 'btn-quiet')}<button class="btn btn-primary btn-icon" aria-label="Skicka frågan">${icon('send')}</button></form>` : ''}
    ${c.mt.phone ? html`<a class="ncall" href="${telHref(c.mt.phone)}">${icon('phone', 'ic-l')}<div><span>${c.mt.name || 'MT-jour'}${c.mt.hours ? ', ' + c.mt.hours.toLowerCase() : ''}</span><strong>${c.mt.phone}</strong></div></a>` : ''}
    ${phiNote(S.caps.dictation ? 'Skriv eller tala aldrig in patientuppgifter.' : 'Skriv aldrig patientuppgifter. Tips: använd tangentbordets mikrofon för att tala in frågan.')}
  </div>`);
  drawNightOut();
}
function drawNightOut() {
  const out = $('#nOut'), d = deviceById(NIGHT.deviceId);
  if (!out || !d) return;
  const m = manualFor(d), k = NIGHT.mode;
  if (!k || !m) { setHTML(out, ''); return; }
  if (k === 'alarm') {
    const keys = Object.keys(alarmsOf(m));
    setHTML(out, html`<div data-alarmbox><form class="alarm-form" style="grid-template-columns:minmax(0,1fr) auto" data-form="alarm" data-scope="${d.id}" data-out="nAl">
        <div class="field"><label for="nCode">Larm- eller felkod på displayen</label><input class="input alarm-input" id="nCode" name="code" placeholder="t.ex. ${keys[0] || 'E-23'}" autocomplete="off" autocapitalize="characters" spellcheck="false" required></div>
        <button class="btn btn-primary btn-lg" style="min-height:84px">Slå upp</button></form>
      ${keys.length ? html`<div class="codechips">${keys.map(x => html`<button class="codechip" data-act="codechip" data-code="${x.split('–')[0]}">${x}</button>`)}</div>` : ''}
      <div id="nAl" class="stack" style="margin-top:16px"></div></div>`);
    return;
  }
  if (k === 'ask') { setHTML(out, html`<div class="chat-log" id="log-${d.id}"></div>`); renderLog(d.id); return; }
  const b = m.card && (k === 'start' ? m.card.uppstart : m.card.rengoring);
  if (b && b.steg && b.steg.length) {
    setHTML(out, html`<article class="msg-a"><div class="a-body"><ol>${b.steg.map(s => html`<li>${s}</li>`)}</ol></div>
      <div class="a-meta"><span>Ur snabbkortet, manual sida ${b.sida} (${m.version || 'version saknas'})${m.card.status !== 'approved' ? '. Kortet är ett utkast som inte är granskat.' : ''}</span></div>
      <div class="a-actions"><button class="btn btn-primary" data-act="cardSteps" data-id="${d.id}" data-k="${k === 'start' ? 'uppstart' : 'rengoring'}">${icon('steps')}Steg för steg</button><button class="btn" data-act="cardSrc" data-m="${m.id}" data-k="${k === 'start' ? 'uppstart' : 'rengoring'}">${icon('book')}Visa i manualen</button>${aiReady() ? html`<button class="btn" data-act="nAI" data-k="${k}">Fråga efter fler detaljer</button>` : ''}</div></article>`);
    return;
  }
  NIGHT.mode = 'ask';
  setHTML(out, html`<div class="chat-log" id="log-${d.id}"></div>`);
  ask(d.id, SHORTCUTS[k].q, { kind: k, shortcut: true });
}
ACT.nPick = el => { NIGHT.deviceId = el.dataset.id; NIGHT.picking = false; NIGHT.mode = ''; touchRecent(el.dataset.id); drawNight($('#view')); };
ACT.nChange = () => { NIGHT.picking = true; drawNight($('#view')); };
ACT.nGo = el => {
  NIGHT.mode = el.dataset.k;
  const d = deviceById(NIGHT.deviceId), m = manualFor(d);
  $$('.nbtn').forEach(b => b.classList.toggle('is-on', b === el));
  drawNightOut();
  if (NIGHT.mode !== 'alarm' && m && m.card) logQuestion({ d: d.id, q: SHORTCUTS[el.dataset.k].label, k: el.dataset.k, st: 'ok', m: 'natt' });
  const f = $('#nCode');
  if (f) f.focus();
  const out = $('#nOut');
  if (out && out.scrollIntoView) out.scrollIntoView({ block: 'nearest' });
};
ACT.nAI = el => { const d = deviceById(NIGHT.deviceId); NIGHT.mode = 'ask'; setHTML($('#nOut'), html`<div class="chat-log" id="log-${d.id}"></div>`); ask(d.id, SHORTCUTS[el.dataset.k].q, { kind: el.dataset.k, shortcut: true }); };
FORM.nAsk = f => {
  const d = deviceById(NIGHT.deviceId), text = f.elements.q.value.trim();
  if (!d || !text || chatOf(d.id).busy) return;
  NIGHT.mode = 'ask';
  $$('.nbtn').forEach(b => b.classList.remove('is-on'));
  setHTML($('#nOut'), html`<div class="chat-log" id="log-${d.id}"></div>`);
  if (!findPNR(text).length) { f.elements.q.value = ''; f.elements.q.style.height = ''; }
  ask(d.id, text);
};
