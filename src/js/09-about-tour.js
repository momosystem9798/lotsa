/* ===== Lotsa: Om tjänsten och den guidade rundturen ===== */
V.om = {
  title: 'Om ' + BRAND,
  render(el) {
    const ds = DEMO.stats, tot = ds ? sum(ds.questions.map(q => q.n)) : 0, ans = ds ? sum(ds.questions.filter(q => q.a).map(q => q.n)) : 0;
    const night = ds ? sum(ds.hours.filter((_, h) => h >= 22 || h < 6)) / sum(ds.hours) : 0;
    const check = (t, s) => html`<li>${icon('check')}<strong>${t}</strong><span>${s}</span></li>`;
    const feat = (ic, t, s) => html`<div class="feat">${icon(ic)}<strong>${t}</strong><span>${s}</span></div>`;
    setHTML(el, html`
      <section class="about-hero">
        <div>
          <h1 class="h1">Rätt handgrepp, direkt ur manualen</h1>
          <p class="lead">Klockan tre på natten finns ingen att ringa. ${BRAND} svarar på hur utrustningen startas, vad larmet betyder och hur den rengörs, och visar alltid sidan i tillverkarens bruksanvisning som svaret bygger på.</p>
          <div class="rowflex"><button class="btn btn-primary btn-lg" data-act="tour">${icon('play')}Starta rundturen</button><a class="btn btn-lg" href="#hem">Öppna appen</a></div>
        </div>
        <div class="about-demo" aria-hidden="true">
          <div class="msg-q">Pumpen visar E-23. Vad gör jag?</div>
          <div class="msg-a"><div class="a-body"><p><strong>Stopp i slangen mellan pumpen och patienten.</strong> Infusionen har stoppats.</p><ol><li>Tryck på TYSTA LARM.</li><li>Följ slangen och kontrollera klämmor, kranar och veck.</li><li>Åtgärda hindret och tryck på START. <span class="cite">1</span></li></ol></div>
            <div class="src" style="cursor:default"><span class="src-n">1</span><span class="src-where">Sida 7, 5.1 Larmkoder</span><span class="src-check ok">${icon('check')}Citat kontrollerat</span><span class="src-quote">”<mark>E-23 OCKLUSION NEDSTRÖMS</mark> (hög prioritet)”</span></div></div>
        </div>
      </section>

      <section class="sect"><div class="sect-head"><h2 class="h2">Problemet</h2></div>
        <div class="trio">
          <div><h3 class="h3">Lappar på maskinerna</h3><p>Handskrivna lathundar tejpas upp, blir gamla och stämmer till slut inte med gällande bruksanvisning.</p></div>
          <div><h3 class="h3">Funktioner som inte används</h3><p>Utrustningen kan mer än personalen hinner lära sig. Manualen ligger i en pärm eller långt ner på intranätet.</p></div>
          <div><h3 class="h3">Ingen att fråga på natten</h3><p>Medicinteknik och tillverkarens support har stängt. Larmet går ändå, och patienten väntar.</p></div>
        </div></section>

      <section class="sect"><div class="sect-head"><h2 class="h2">Så fungerar det</h2></div>
        <ol class="flow">
          <li><strong>Ladda upp manualen</strong><span>Tillverkarens PDF kopplas till enhet, avdelning och version. Skannade sidor tolkas med OCR.</span></li>
          <li><strong>Fråga eller skriv larmkoden</strong><span>I mobilen, på surfplattan eller via QR-koden på enheten. Nattläget har stora knappar.</span></li>
          <li><strong>Svar på svenska med källa</strong><span>Numrerade steg, sida och avsnitt. Citatet kontrolleras ordagrant mot manualtexten.</span></li>
          <li><strong>Ansvariga ser behoven</strong><span>Vanligaste frågorna, kunskapsluckor och gamla manualer samlas i en översikt.</span></li>
        </ol></section>

      <section class="sect"><div class="sect-head"><h2 class="h2">Nyttan</h2><span class="badge b-demo">Exempeldata</span></div>
        <div class="proof">
          <div><b>${nf(Math.round(ans * DEFAULT_SETTINGS.minutesPerAnswer / 60))} timmar</b><span>uppskattad sparad tid per månad på fem enheter, när varje svar sparar ${DEFAULT_SETTINGS.minutesPerAnswer} minuters letande</span></div>
          <div><b>${tot ? Math.round(ans / tot * 100) : 0} %</b><span>av frågorna besvarade direkt ur manualen, utan samtal till MT eller kollega</span></div>
          <div><b>${Math.round(night * 100)} %</b><span>av frågorna ställs mellan 22 och 06, när ingen annan svarar</span></div>
        </div>
        <p class="assume">Siffrorna kommer från appens påhittade exempeldata och visar hur nyttan redovisas för en verksamhet. De är inte uppmätta resultat.</p></section>

      <section class="sect"><div class="sect-head"><h2 class="h2">Säkerhet och regelefterlevnad</h2></div>
        <ul class="checks">
          ${check('Inga patientuppgifter', 'Skriv aldrig patientuppgifter i Lotsa. Appen kontrollerar fritextfält och stoppar text som ser ut att innehålla personnummer innan den sparas eller skickas till AI.')}
          ${check('Bara manualen som källa', 'Svaren bygger på tillverkarens bruksanvisning. Saknas svaret står det ”Det står inte i manualen”.')}
          ${check('Källhänvisning med citatkontroll', 'I både lokalt läge och molnläget måste ett citat stämma ordagrant med manualtexten för att godkännas. Godkända citat länkar till sidan i manualen.')}
          ${check('Inga kliniska bedömningar', 'AI:n är instruerad att avvisa frågor om dosering och patientinställningar och hänvisa till ordination och lokala rutiner.')}
          ${check('Hänvisning till medicinteknik', 'Vid fel som kan påverka patientsäkerheten visas ”Kontakta medicinteknik” med numret till MT-jouren.')}
          ${check('Versionshantering', 'Varje svar visar manualens version. Gamla manualer flaggas, och larmregister och snabbkort nollställs när en ny version laddas upp.')}
          ${check('Mänsklig granskning', 'Lokala tips visas först när en ansvarig har godkänt dem. AI-skapade snabbkort är utkast tills de har granskats, och kan först då skrivas ut.')}
          ${check('Spårbarhet', 'Händelseloggen visar vad som ändrats och när. Frågeloggen är anonym och sparar aldrig vem som frågade.')}
        </ul></section>

      <section class="sect"><div class="sect-head"><h2 class="h2">Funktioner</h2></div>
        <div class="featlist">
          ${feat('chat', 'Fråga manualen', 'Per enhet eller över alla, på svenska även när manualen är på engelska.')}
          ${feat('bell', 'Larmkodsläge', 'Betydelse, orsak och åtgärd direkt ur larmregistret.')}
          ${feat('book', 'Källvisare', 'Manualsidan visas med citatet överstruket.')}
          ${feat('steps', 'Steg för steg', 'Ett handgrepp i taget med stor text.')}
          ${feat('moon', 'Nattläge', 'Stora knappar, dämpat ljus och tre genvägar.')}
          ${feat('card', 'Snabbkort', 'Ersätter de tejpade lapparna och skrivs ut med QR-kod.')}
          ${feat('note', 'Lokala tips', 'Från personalen, tydligt märkta och godkända av ansvarig.')}
          ${feat('clipboard', 'Felanmälan till MT', 'Förifylld med enhet, felkod och vad som har provats.')}
          ${feat('chart', 'Översikt', 'Frågor, sparad tid, utbildningsbehov och manualer att se över.')}
          ${feat('search', 'Reservläge utan AI', 'Snabbkort, larmregister och sökning fungerar ändå.')}
        </div></section>

      <section class="sect"><div class="notice">${icon('info')}<div><strong>Det här är en demo</strong>Enheter, tillverkare, manualer och statistik är påhittade. ${BRAND} är ett arbetsnamn och en prototyp. Tjänsten är inte CE-märkt och inte validerad för kliniskt bruk. Inför skarp drift behövs regulatorisk bedömning, informationssäkerhetsgranskning och inloggning via vårdgivarens system.</div></div></section>`);
  }
};

/* ----- Guidad rundtur ----- */
const TOUR = { i: -1, on: false, prevRole: 'staff', hole: null, pop: null, block: null, el: null };
function tourExample() {
  const d = deviceById('flow300'), m = manualFor(d);
  if (!d || !m || !m.card || !m.pages) return;
  const c = chatOf('flow300');
  if (!c.msgs.some(x => x.example)) {
    c.msgs.push({ id: uid(), role: 'q', text: SHORTCUTS.start.q });
    c.msgs.push({ id: uid(), role: 'a', key: 'flow300', deviceId: 'flow300', q: SHORTCUTS.start.q, kind: 'start', state: 'done', fb: 0, example: true, shortcut: true, res: exampleAnswer(d, m, 'start'), logP: Promise.resolve(null) });
  }
  renderLog('flow300');
}
const TOUR_STEPS = [
  { route: '#hem', sel: '[data-tour="omni"]', title: 'Ett fält för allt', text: 'Sök en enhet, skriv en larmkod eller ställ en fråga. Svaren kommer bara ur tillverkarnas bruksanvisningar.' },
  { route: '#enheter', sel: '#devList', title: 'Utrustningsbiblioteket', text: 'Alla enheter med sina manualer. Sök på namn eller filtrera per avdelning. Märkningen visar om en manual behöver ses över eller om en enhet har en öppen felanmälan.' },
  { route: '#enhet-flow300', pre: () => { UI.devTab.flow300 = 'fraga'; }, before: tourExample, sel: '#devPanel .msg-a .a-body', title: 'Fråga manualen', text: 'Svaret kommer som numrerade steg på svenska. Det här är ett förinspelat exempel. När du frågar själv svarar AI:n utifrån manualen.' },
  { route: '#enhet-flow300', pre: () => { UI.devTab.flow300 = 'fraga'; }, before: tourExample, sel: '#devPanel .sources', title: 'Källan går att kontrollera', text: 'Varje svar anger sida och avsnitt, och citatet jämförs ordagrant med manualtexten. Ett tryck på källan visar manualsidan med stycket överstruket.' },
  { route: '#larm', before: async () => { const i = $('#alCode'); if (i) i.value = 'E-23'; UI.alarmDev = ''; await runAlarm('E-23', null, $('#alOut')); }, sel: '#alOut', title: 'Larmkodsläge', text: 'Skriv koden från displayen och få betydelse, orsak och åtgärd direkt. Kräver felet tekniker visas numret till MT-jouren.' },
  { route: '#enhet-flow300', pre: () => { UI.devTab.flow300 = 'kort'; }, sel: '[data-tour="qcard"]', title: 'Snabbkort i stället för lappar', text: 'AI:n sammanfattar uppstart, vanliga larm och rengöring. Kortet granskas av en ansvarig och skrivs ut med QR-kod till enheten.' },
  { route: '#natt', pre: () => { NIGHT.deviceId = 'flow300'; NIGHT.picking = false; NIGHT.mode = ''; }, sel: '[data-tour="ngrid"]', title: 'Nattläge', text: 'Stora knappar, dämpat ljus och tre genvägar. Uppstart och rengöring visas direkt från snabbkortet, utan väntan.' },
  { route: '#granska', role: 'admin', pre: () => { UI.revTab = 'tips'; }, sel: '#revBody', title: 'Ansvariga godkänner', text: 'Tips från personalen visas först när MT eller vårdenhetschef har godkänt dem. Här hamnar också flaggade svar, felanmälningar och frågor som manualen inte kunde besvara.' },
  { route: '#oversikt', role: 'admin', sel: '[data-tour="kpis"]', title: 'Nyttan i siffror', text: 'Vad personalen frågar om, vilka enheter som kräver mest stöd, uppskattad sparad tid och när på dygnet behovet finns. Underlag för utbildning och inköp.' },
  { route: '#manualer', role: 'admin', sel: '[data-tour="manuals"]', title: 'Versionskontroll', text: 'Varje svar visar vilken manualversion det bygger på. Gamla manualer flaggas, och larmkoderna jämförs när en ny version laddas upp.' },
  { route: '#om', sel: null, title: 'Det var rundturen', text: 'Prova själv: ställ en egen fråga, ladda upp en PDF som ansvarig eller skriv ut en QR-etikett. Den här sidan sammanfattar problemet, lösningen och säkerheten.' }
];
const waitRoute = () => new Promise(r => {
  const t = setTimeout(r, 700);
  document.addEventListener('lotsa:route', () => { clearTimeout(t); r(); }, { once: true });
});
ACT.tour = () => tourStart();
function tourStart() {
  if (TOUR.on) return;
  if (!S.settings.demoMode) { toast('Rundturen använder exempeldatan. Slå på den under Inställningar.'); return; }
  closeAllOverlays();
  TOUR.on = true; TOUR.prevRole = S.prefs.role;
  TOUR.block = document.createElement('div'); TOUR.block.className = 'tour-block';
  TOUR.hole = document.createElement('div'); TOUR.hole.className = 'tour-hole';
  TOUR.pop = document.createElement('div'); TOUR.pop.className = 'tour-pop';
  TOUR.pop.setAttribute('role', 'dialog'); TOUR.pop.setAttribute('aria-label', 'Rundtur');
  document.body.append(TOUR.block, TOUR.hole, TOUR.pop);
  TOUR.pop.addEventListener('click', e => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    if (b.dataset.t === 'next') tourGo(TOUR.i + 1); else if (b.dataset.t === 'prev') tourGo(TOUR.i - 1); else tourEnd();
  });
  tourGo(0);
}
function tourEnd() {
  if (!TOUR.on) return;
  TOUR.on = false; TOUR.i = -1; TOUR.el = null;
  [TOUR.block, TOUR.hole, TOUR.pop].forEach(n => n && n.remove());
  S.prefs.tourSeen = true; S.prefs.introHidden = true;
  if (S.prefs.role !== TOUR.prevRole) { S.prefs.role = TOUR.prevRole; if (!isAdmin() && ['oversikt', 'granska', 'manualer', 'logg', 'installningar'].includes(ROUTE.name)) location.hash = '#hem'; }
  savePrefs();
  drawShell();
}
let tourBusy = false;
async function tourGo(i) {
  if (tourBusy) return;
  if (i >= TOUR_STEPS.length) { tourEnd(); return; }
  if (i < 0) return;
  tourBusy = true;
  TOUR.i = i;
  const s = TOUR_STEPS[i], role = s.role || 'staff';
  if (S.prefs.role !== role) S.prefs.role = role;
  if (s.pre) s.pre();
  if (location.hash !== s.route) { location.hash = s.route; await waitRoute(); }
  else { render(); }
  await nextFrame();
  if (!TOUR.on) { tourBusy = false; return; }
  try { if (s.before) await s.before(); } catch (e) { console.warn('Rundtur:', e); }
  let el = null;
  if (s.sel) for (let k = 0; k < 20 && !(el = $(s.sel)); k++) await sleep(70);
  if (el && el.scrollIntoView) el.scrollIntoView({ block: el.getBoundingClientRect().height > window.innerHeight * 0.6 ? 'start' : 'center', inline: 'nearest' });
  await nextFrame();
  TOUR.el = el;
  tourBusy = false;
  if (TOUR.on) tourPlace();
}
function tourPlace() {
  if (!TOUR.on) return;
  const s = TOUR_STEPS[TOUR.i], el = TOUR.el && TOUR.el.isConnected ? TOUR.el : null, vw = window.innerWidth, vh = window.innerHeight;
  setHTML(TOUR.pop, html`<h3 class="h3">${s.title}</h3><p>${s.text}</p>
    <div class="tour-foot"><span class="tour-prog">${TOUR.i + 1} av ${TOUR_STEPS.length}</span><span class="sp"></span>
      <button class="btn btn-s btn-quiet" data-t="end">Avsluta</button>${TOUR.i > 0 ? html`<button class="btn btn-s" data-t="prev">Tillbaka</button>` : ''}
      <button class="btn btn-s btn-primary" data-t="next">${TOUR.i === TOUR_STEPS.length - 1 ? 'Klar' : 'Nästa'}</button></div>`);
  const pw = TOUR.pop.offsetWidth, ph = TOUR.pop.offsetHeight;
  let hole = { x: vw / 2, y: vh / 2, w: 0, h: 0 };
  if (el) {
    const r = el.getBoundingClientRect(), p = 6;
    const top = clamp(r.top - p, 8, vh - 60), bottom = clamp(r.bottom + p, top + 40, vh - 8);
    hole = { x: clamp(r.left - p, 4, vw - 40), y: top, w: Math.min(r.width + 2 * p, vw - 8), h: bottom - top };
  }
  Object.assign(TOUR.hole.style, { left: hole.x + 'px', top: hole.y + 'px', width: hole.w + 'px', height: hole.h + 'px' });
  let x, y;
  if (!el) { x = (vw - pw) / 2; y = (vh - ph) / 2; }
  else {
    x = clamp(hole.x + hole.w / 2 - pw / 2, 12, vw - pw - 12);
    const below = vh - (hole.y + hole.h), above = hole.y;
    if (below >= ph + 20) y = hole.y + hole.h + 12;
    else if (above >= ph + 20) y = hole.y - ph - 12;
    else y = clamp(vh - ph - 16, 12, vh);
  }
  Object.assign(TOUR.pop.style, { left: x + 'px', top: y + 'px' });
  const nb = TOUR.pop.querySelector('[data-t="next"]');
  if (nb) nb.focus({ preventScroll: true });
}
window.addEventListener('resize', debounce(() => { if (TOUR.on) tourPlace(); }, 120));
document.addEventListener('scroll', debounce(() => { if (TOUR.on && !tourBusy) tourPlace(); }, 60), true);
document.addEventListener('keydown', e => {
  if (!TOUR.on) return;
  if (e.key === 'Escape') { e.preventDefault(); tourEnd(); }
  else if (e.key === 'ArrowRight') tourGo(TOUR.i + 1);
  else if (e.key === 'ArrowLeft') tourGo(TOUR.i - 1);
});
