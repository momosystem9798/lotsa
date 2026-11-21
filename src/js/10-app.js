/* ===== Lotsa: skal, navigering och start ===== */
const ROUTE = { name: 'hem', id: '' };
const ROUTES = ['hem', 'enheter', 'fraga', 'larm', 'natt', 'oversikt', 'granska', 'manualer', 'logg', 'installningar', 'om'];
const ADMIN_ROUTES = ['oversikt', 'granska', 'manualer', 'logg', 'installningar'];
const NAV_STAFF = [['hem', 'Hem', 'home'], ['enheter', 'Utrustning', 'grid'], ['fraga', 'Fråga manualerna', 'chat'], ['larm', 'Larmkod', 'bell'], ['natt', 'Nattläge', 'moon']];
const NAV_ADMIN = [['oversikt', 'Översikt', 'chart'], ['granska', 'Granska', 'inbox'], ['manualer', 'Manualer', 'book'], ['logg', 'Logg', 'list'], ['installningar', 'Inställningar', 'gear']];
let curView = null, entered = '';

function parseHash() {
  let h = location.hash.replace(/^#/, '');
  try { h = decodeURIComponent(h); } catch (e) { /* behåll som den är */ }
  h = h.trim().toLowerCase();
  if (h.startsWith('enhet-')) return { name: 'enhet', id: h.slice(6) };
  return { name: ROUTES.includes(h) ? h : 'hem', id: '' };
}
const todoCount = () => tips().filter(t => t.status === 'pending').length + flags().filter(f => f.status === 'open').length + reports().filter(r => r.status === 'open').length;
const navLinks = (list, cur, counts = {}) => list.map(([k, label, ic]) => html`<a href="#${k}" class="${cur === k ? 'is-on' : ''}" data-tour="nav-${k}">${icon(ic)}${label}${counts[k] ? html`<span class="count num">${counts[k]}</span>` : ''}</a>`);
const roleSeg = admin => html`<div class="seg" role="group" aria-label="Roll"><button class="${!admin ? 'is-on' : ''}" data-act="role" data-role="staff">Personal</button><button class="${admin ? 'is-on' : ''}" data-act="role" data-role="admin">Ansvarig</button></div>`;
function drawShell() {
  const cur = ROUTE.name === 'enhet' ? 'enheter' : ROUTE.name, admin = isAdmin(), todo = S.ready && admin ? todoCount() : 0;
  setHTML($('#nav'), html`${navLinks(NAV_STAFF, cur)}${admin ? html`<div class="nav-group">Ansvarig</div>${navLinks(NAV_ADMIN, cur, { granska: todo })}` : ''}`);
  setHTML($('#railFoot'), html`<div class="role"><span class="role-label">Visa appen som</span>${roleSeg(admin)}</div>
    <nav class="nav" aria-label="Mer"><button data-act="tour">${icon('play')}Rundtur</button><a href="#om" class="${cur === 'om' ? 'is-on' : ''}">${icon('info')}Om ${BRAND}</a></nav>`);
  setHTML($('#topbarRight'), html`<button class="btn btn-s" data-act="tour" aria-label="Starta rundturen">${icon('play', 'ic-s')}Rundtur</button>`);
  const tabs = [['hem', 'Hem', 'home'], ['enheter', 'Utrustning', 'grid'], ['fraga', 'Fråga', 'chat'], ['larm', 'Larmkod', 'bell']];
  setHTML($('#tabbar'), html`${tabs.map(([k, l, ic]) => html`<a href="#${k}" class="${cur === k ? 'is-on' : ''}">${icon(ic)}${l}</a>`)}<button data-act="more" class="${tabs.some(t => t[0] === cur) ? '' : 'is-on'}">${icon('menu')}Mer</button>`);
  let b = '';
  if (S.ready) {
    if (S.slow) b = 'Lagringen svarar inte ännu. Exempeldatan visas, men sparade manualer och tips kan saknas tills den svarar.';
    else if (!S.live) b = 'Den här visningen har ingen lagring. Det du lägger till finns kvar tills sidan stängs.';
    else if (S.readOnly) b = 'Skrivskyddad visning. Det du lägger till finns kvar tills sidan stängs.';
  }
  const keyBtn = STANDALONE && S.ready && !b && !STANDALONE.hasKey() && !S.prefs.keyBannerHidden;
  if (keyBtn) b = 'AI-svar är avstängda tills en API-nyckel för Claude läggs in. Manualer, larmkoder och snabbkort fungerar ändå.';
  setHTML($('#banner'), b ? html`<div class="banner" role="status">${icon('info')}<span>${b}</span>${keyBtn ? html`<button class="btn btn-s" data-act="apiKey">Lägg in nyckel</button><button class="btn btn-s btn-quiet" data-act="hideKeyBanner">Inte nu</button>` : ''}</div>` : '');
}

/* ----- Fristående läge: API-nyckel för AI-svar ----- */
ACT.apiKey = () => {
  if (!STANDALONE) return;
  const has = STANDALONE.hasKey();
  modal(html`<form data-form="apiKey">
    <div class="modal-h"><h2 class="h2">API-nyckel för AI-svar</h2><button type="button" class="btn btn-icon btn-quiet" data-act="closeOverlay" aria-label="Stäng">${icon('x')}</button></div>
    <div class="modal-b">
      <p>Utanför Claude hämtar ${BRAND} sina AI-svar direkt från Anthropic API. Skapa en nyckel i Claude Console (console.anthropic.com) och klistra in den här.</p>
      <p class="hint mt8">Nyckeln sparas bara i den här webbläsaren och skickas bara till Anthropic. Varje person och dator behöver en egen. Använd en nyckel med en låg kostnadsgräns och lägg inte in den på delade datorer.</p>
      <div class="field mt14"><label for="akKey">API-nyckel</label><input class="input" id="akKey" name="key" type="password" autocomplete="off" spellcheck="false" placeholder="${has ? STANDALONE.keyHint() : 'sk-ant-...'}"></div>
    </div>
    <div class="modal-f">${has ? html`<button type="button" class="btn btn-danger" data-act="apiKeyClear">Ta bort nyckeln</button>` : ''}<button type="button" class="btn" data-act="closeOverlay">Avbryt</button><button class="btn btn-primary">Spara</button></div>
  </form>`);
};
function applyKey() {
  S.caps.sample = STANDALONE.hasKey() ? STANDALONE.sample : null;
  S.aiOff = false; S.aiNote = '';
  closeAllOverlays(); render();
}
FORM.apiKey = f => {
  const key = String(formData(f).key || '').trim();
  if (!key) { toast('Klistra in nyckeln först.', 'crit'); return; }
  if (!/^sk-ant-/.test(key)) { toast('Det ser inte ut som en API-nyckel från Anthropic. Den börjar med sk-ant-.', 'crit'); return; }
  if (!STANDALONE.setKey(key)) { toast('Nyckeln kunde inte sparas i den här webbläsaren.', 'crit'); return; }
  applyKey(); toast('Nyckeln är sparad. AI-svar är påslagna.');
};
ACT.apiKeyClear = () => { STANDALONE.setKey(''); applyKey(); toast('Nyckeln är borttagen.'); };
ACT.hideKeyBanner = () => { S.prefs.keyBannerHidden = true; savePrefs(); render(); };
function render() {
  drawShell();
  const el = $('#view');
  if (!S.ready) setHTML(el, html`<div class="skel" style="height:54px;max-width:420px"></div><div class="skel mt20" style="height:66px"></div><div class="skel mt14" style="height:180px"></div>`);
  else curView.render(el, ROUTE);
  document.dispatchEvent(new CustomEvent('lotsa:route'));
}
function route() {
  const r = parseHash(), prev = ROUTE.name;
  if (curView && curView.leave && entered === prev && prev !== r.name) { curView.leave(); entered = ''; }
  Object.assign(ROUTE, r);
  closeAllOverlays();
  vizTip.hide();
  curView = V[r.name];
  if (curView.enter && entered !== r.name) { curView.enter(); entered = r.name; }
  render();
  const main = $('#main');
  if (main) main.scrollTop = 0;
}
window.addEventListener('hashchange', route);

ACT.role = el => {
  const role = el.dataset.role === 'admin' ? 'admin' : 'staff';
  if (S.prefs.role === role) return;
  S.prefs.role = role; savePrefs();
  closeAllOverlays();
  toast(role === 'admin' ? 'Du ser nu appen som ansvarig.' : 'Du ser nu appen som personal.');
  if (role === 'staff' && ADMIN_ROUTES.includes(ROUTE.name)) location.hash = '#hem'; else render();
};
ACT.more = () => {
  const admin = isAdmin(), todo = admin ? todoCount() : 0, cur = ROUTE.name;
  const w = document.createElement('div');
  setHTML(w, html`<div class="drawer-scrim" data-act="closeOverlay"></div><div class="sheet" role="dialog" aria-label="Mer">
    <nav class="nav">${navLinks([NAV_STAFF[4]], cur)}${admin ? html`<div class="nav-group">Ansvarig</div>${navLinks(NAV_ADMIN, cur, { granska: todo })}` : ''}
      <div class="nav-group">${BRAND}</div><button data-act="tour">${icon('play')}Rundtur</button><a href="#om">${icon('info')}Om ${BRAND}</a></nav>
    <div class="role" style="margin-top:12px"><span class="role-label">Visa appen som</span>${roleSeg(admin)}</div></div>`);
  openOverlay(w);
};

watchers.add(() => {
  if (!S.ready) return;
  drawShell();
  if (curView && curView.update) curView.update();
});

(async function init() {
  hydrateDemo();
  curView = V[parseHash().name];
  route();
  await initCaps();
  await loadPrefs();
  startData(() => { route(); });
})();
