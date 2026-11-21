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
  setHTML($('#banner'), b ? html`<div class="banner" role="status">${icon('info')}<span>${b}</span></div>` : '');
}
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
