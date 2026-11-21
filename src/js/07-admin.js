/* ===== Lotsa: vyer för ansvariga (MT och vårdenhetschef) ===== */
const DASH = { days: 30, st: null };
const adminGate = el => {
  if (isAdmin()) return false;
  setHTML(el, html`<div class="empty"><h3 class="h3">Den här vyn är för ansvariga</h3><p>Översikt, granskning, manualversioner och loggar hanteras av MT eller vårdenhetschef. I demon byter du roll själv.</p><button class="btn btn-primary" data-act="role" data-role="admin">Visa som ansvarig</button></div>`);
  return true;
};
function apportion(weights, total) {
  const s = sum(weights) || 1, exact = weights.map(w => w / s * total), base = exact.map(Math.floor);
  const order = exact.map((v, i) => [v - base[i], i]).sort((a, b) => b[0] - a[0]);
  for (let k = 0, rest = total - sum(base); k < rest; k++) base[order[k % order.length][1]]++;
  return base;
}
function demoDaily() {
  const ds = DEMO.stats, now = new Date(), w = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (29 - i));
    let v = ds.weekday[d.getDay()] * ds.jitter[i] * (0.8 + 0.4 * i / 29);
    if (i === 29) v *= clamp((now.getHours() + now.getMinutes() / 60) / 24, 0.15, 1);
    w.push(v);
  }
  return apportion(w, sum(ds.questions.map(q => q.n)));
}
/* Sammanställer statistik: exempeldata (om den är på) plus alla frågor som faktiskt ställts i appen. */
async function gatherStats(days) {
  const now = new Date(), start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1)).getTime();
  const rows = (await loadLogs()).filter(r => r.t >= start);
  const ids = new Set(devices().map(d => d.id));
  const st = { days, dates: [], perDay: new Array(days).fill(0), byDev: new Map(), byKind: { start: 0, alarm: 0, clean: 0, other: 0 }, byHour: new Array(24).fill(0), qs: new Map(), heat: new Map(), total: 0, missing: 0, refused: 0, reserve: 0, up: 0, down: 0, mt: 0, alarmQ: 0, demo: false, real: rows.length };
  for (let i = 0; i < days; i++) st.dates.push(new Date(start + i * 864e5 + 432e5));
  const bump = (d, k, n, stt, q) => {
    if (!KINDS[k]) k = 'other';
    st.total += n; st.byKind[k] += n;
    if (k === 'alarm') st.alarmQ += n;
    if (stt === 'saknas') st.missing += n; else if (stt === 'avvisad') st.refused += n; else if (stt === 'reserv') st.reserve += n;
    if (d && ids.has(d)) { st.byDev.set(d, (st.byDev.get(d) || 0) + n); const hk = d + '|' + k; st.heat.set(hk, (st.heat.get(hk) || 0) + n); }
    if (q) { const key = (d || '') + '|' + q.toLowerCase(); const cur = st.qs.get(key) || { key: hashKey(key), q, d, k, n: 0, miss: 0 }; cur.n += n; if (stt === 'saknas') cur.miss += n; st.qs.set(key, cur); }
  };
  if (S.settings.demoMode && DEMO.stats) {
    const ds = DEMO.stats, daily = demoDaily().slice(30 - Math.min(30, days)), T = sum(daily), all30 = sum(ds.questions.map(q => q.n));
    const off = days - daily.length;
    daily.forEach((v, i) => { st.perDay[off + i] += v; });
    const counts = apportion(ds.questions.map(q => q.n), T);
    ds.questions.forEach((q, i) => { if (counts[i]) bump(q.d, q.k, counts[i], q.a ? 'ok' : 'saknas', q.q); });
    apportion(ds.hours, T).forEach((v, h) => { st.byHour[h] += v; });
    const f = T / all30;
    st.up += Math.round(ds.fbUp * f); st.down += Math.round(ds.fbDown * f); st.mt += Math.round(ds.mtEscalated * f);
    st.demo = true;
  }
  for (const r of rows) {
    const d = new Date(r.t), idx = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - start) / 864e5);
    if (idx >= 0 && idx < days) st.perDay[idx]++;
    st.byHour[d.getHours()]++;
    bump(r.d, r.k || 'other', 1, r.st, r.q);
    if (r.fb === 1) st.up++; else if (r.fb === -1) st.down++;
    if (r.mt) st.mt++;
  }
  st.answered = st.total - st.missing - st.refused - st.reserve;
  return st;
}
function niceMax(v) {
  if (v <= 4) return 4;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 2, 4, 5, 10]) if (v <= m * p) return m * p;
  return 10 * p;
}
const dayLabel = (d, i, n) => (i === n - 1 ? 'i dag' : `${d.getDate()} ${MONTHS[d.getMonth()]}`);

/* ----- Diagram. Ritas i containerns verkliga bredd så att texten alltid är läsbar. ----- */
function lineSvg(W, values, dates) {
  const H = 196, L = 34, R = 16, T = 14, B = 26, n = values.length, max = niceMax(Math.max(1, ...values));
  const x = i => L + (W - L - R) * (n === 1 ? 0.5 : i / (n - 1)), y = v => T + (H - T - B) * (1 - v / max);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor((W - L - R) / 74))));
  let g = '';
  for (const t of [0, max / 2, max]) g += `<line class="${t === 0 ? 'axis' : 'grid'}" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/><text x="${L - 8}" y="${y(t) + 4}" text-anchor="end">${nf(t)}</text>`;
  for (let i = n - 1; i >= 0; i -= every) g += `<text x="${x(i).toFixed(1)}" y="${H - 6}" text-anchor="${i === n - 1 ? 'end' : 'middle'}">${esc(dayLabel(dates[i], i, n))}</text>`;
  const last = n - 1;
  return raw(`<svg class="viz" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" tabindex="0" aria-label="Frågor per dag. Högsta värde ${Math.max(...values)}, senaste ${values[last]}.">${g}
    <path d="M${pts.join('L')}L${x(last).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z" fill="var(--viz-1)" opacity=".1"/>
    <path d="M${pts.join('L')}" fill="none" stroke="var(--viz-1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <line class="axis cross" y1="${T}" y2="${y(0)}" x1="0" x2="0" visibility="hidden"/>
    <circle class="crossdot" r="5" fill="var(--viz-1)" stroke="var(--surface)" stroke-width="2" cx="${x(last).toFixed(1)}" cy="${y(values[last]).toFixed(1)}"/>
    <text class="val endval" x="${(x(last) - 10).toFixed(1)}" y="${Math.max(T + 10, y(values[last]) - 10).toFixed(1)}" text-anchor="end">${nf(values[last])}</text>
    <rect class="hit" x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}"/></svg>`);
}
function hoursSvg(W, byHour) {
  const H = 176, L = 30, R = 6, T = 12, B = 24, max = niceMax(Math.max(1, ...byHour)), band = (W - L - R) / 24, bw = Math.min(18, Math.max(4, band - 3));
  const y = v => T + (H - T - B) * (1 - v / max), night = h => h >= 22 || h < 6;
  let g = '';
  for (const t of [0, max / 2, max]) g += `<line class="${t === 0 ? 'axis' : 'grid'}" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/><text x="${L - 6}" y="${y(t) + 4}" text-anchor="end">${nf(t)}</text>`;
  byHour.forEach((v, h) => {
    const cx = L + band * (h + 0.5), x0 = cx - bw / 2, top = y(v), r = Math.min(4, bw / 2, (y(0) - top));
    const d = v > 0 ? `M${x0},${y(0)}V${top + r}Q${x0},${top} ${x0 + r},${top}H${x0 + bw - r}Q${x0 + bw},${top} ${x0 + bw},${top + r}V${y(0)}Z` : '';
    g += `<rect class="hit" x="${(cx - band / 2).toFixed(1)}" y="${T}" width="${band.toFixed(1)}" height="${H - T - B}" tabindex="0" data-tip="${v} frågor|Klockan ${pad(h)}–${pad((h + 1) % 24)}"/>` + (d ? `<path class="mark" d="${d}" fill="var(${night(h) ? '--viz-1' : '--viz-mute'})"/>` : '');
    if (h % 6 === 0 || h === 23) g += `<text x="${cx.toFixed(1)}" y="${H - 6}" text-anchor="middle">${pad(h)}</text>`;
  });
  return raw(`<svg class="viz" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Frågor per timme på dygnet">${g}</svg>`);
}
function sparkSvg(values) {
  const W = 120, H = 28, max = Math.max(1, ...values), n = values.length;
  const pts = values.map((v, i) => `${(2 + (W - 4) * i / (n - 1 || 1)).toFixed(1)},${(H - 3 - (H - 6) * v / max).toFixed(1)}`);
  return raw(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="M${pts.join('L')}" fill="none" stroke="var(--viz-1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`);
}
const vizTip = {
  el: null,
  show(x, y, value, label) {
    const t = this.el || (this.el = $('#vizTip'));
    t.textContent = '';
    const b = document.createElement('b');
    b.textContent = value;
    t.append(b, document.createTextNode(label || ''));
    t.hidden = false;
    const w = t.offsetWidth, h = t.offsetHeight;
    t.style.left = clamp(x - w / 2, 8, window.innerWidth - w - 8) + 'px';
    t.style.top = (y - h - 14 < 8 ? y + 18 : y - h - 14) + 'px';
  },
  hide() { if (this.el) this.el.hidden = true; }
};
const tipOf = el => { const t = el.dataset.tip || '', i = t.indexOf('|'); return i < 0 ? [t, ''] : [t.slice(0, i), t.slice(i + 1)]; };
document.addEventListener('pointermove', e => {
  const el = e.target.closest && e.target.closest('[data-tip]');
  if (el) { const [v, l] = tipOf(el); vizTip.show(e.clientX, e.clientY, v, l); }
  else if (!e.target.closest || !e.target.closest('.viz')) vizTip.hide();
});
document.addEventListener('focusin', e => {
  const el = e.target.closest && e.target.closest('[data-tip]');
  if (!el) return;
  const r = el.getBoundingClientRect(), [v, l] = tipOf(el);
  vizTip.show(r.left + r.width / 2, r.top + r.height / 3, v, l);
});
document.addEventListener('focusout', () => vizTip.hide());
function wireLine(svg, values, dates) {
  const n = values.length, cross = $('.cross', svg), dot = $('.crossdot', svg), hit = $('.hit', svg), endv = $('.endval', svg);
  const L = Number(hit.getAttribute('x')), w = Number(hit.getAttribute('width')), T = Number(hit.getAttribute('y')), h = Number(hit.getAttribute('height'));
  const max = niceMax(Math.max(1, ...values));
  let cur = n - 1;
  const at = i => {
    cur = clamp(i, 0, n - 1);
    const px = L + w * (n === 1 ? 0.5 : cur / (n - 1)), py = T + h * (1 - values[cur] / max);
    cross.setAttribute('x1', px); cross.setAttribute('x2', px); cross.setAttribute('visibility', 'visible');
    dot.setAttribute('cx', px); dot.setAttribute('cy', py);
    endv.setAttribute('visibility', 'hidden');
    const r = svg.getBoundingClientRect(), k = r.width / svg.viewBox.baseVal.width;
    const d = dates[cur];
    vizTip.show(r.left + px * k, r.top + py * k, `${values[cur]} frågor`, cur === n - 1 ? 'I dag' : `${['sön', 'mån', 'tis', 'ons', 'tors', 'fre', 'lör'][d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`);
  };
  const reset = () => { cross.setAttribute('visibility', 'hidden'); endv.setAttribute('visibility', 'visible'); vizTip.hide(); const px = L + w, py = T + h * (1 - values[n - 1] / max); dot.setAttribute('cx', n === 1 ? L + w / 2 : px); dot.setAttribute('cy', py); };
  svg.addEventListener('pointermove', e => { const r = svg.getBoundingClientRect(), k = svg.viewBox.baseVal.width / r.width; at(Math.round(((e.clientX - r.left) * k - L) / w * (n - 1))); });
  svg.addEventListener('pointerleave', reset);
  svg.addEventListener('blur', reset);
  svg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { e.preventDefault(); at(cur - 1); } else if (e.key === 'ArrowRight') { e.preventDefault(); at(cur + 1); } });
}
function drawCharts() {
  const st = DASH.st;
  if (!st) return;
  $$('[data-chart]').forEach(el => {
    const W = Math.max(260, Math.floor(el.clientWidth));
    if (!W || el.dataset.w === String(W)) return;
    el.dataset.w = String(W);
    if (el.dataset.chart === 'line') { setHTML(el, lineSvg(W, st.perDay, st.dates)); wireLine($('svg', el), st.perDay, st.dates); }
    else if (el.dataset.chart === 'hours') setHTML(el, hoursSvg(W, st.byHour));
  });
}
window.addEventListener('resize', debounce(() => { if (ROUTE.name === 'oversikt') drawCharts(); }, 150));
ACT.vizTable = el => {
  const fig = el.closest('.chart'), b = $('.chart-b', fig), t = $('.chart-table', fig), on = t.hidden;
  t.hidden = !on; b.hidden = on;
  el.setAttribute('aria-pressed', String(on));
  el.textContent = on ? 'Diagram' : 'Tabell';
  if (!on) { $$('[data-chart]', fig).forEach(c => { c.dataset.w = ''; }); drawCharts(); }
};
function chartCard({ title, sub = '', body, table = '', cls = '', tour = '' }) {
  return html`<figure class="chart ${cls}" ${tour ? raw(`data-tour="${tour}"`) : ''}>
    <div class="chart-h"><div><div class="chart-t">${title}</div>${sub ? html`<div class="chart-s">${sub}</div>` : ''}</div>${table ? html`<button class="btn btn-s btn-quiet" data-act="vizTable" aria-pressed="false">Tabell</button>` : ''}</div>
    <div class="chart-b">${body}</div>${table ? html`<div class="chart-table table-wrap" hidden>${table}</div>` : ''}</figure>`;
}
function dashTpl(st) {
  const devs = devices(), name = id => (deviceById(id) || {}).name || 'Okänd enhet';
  const pct = st.total ? Math.round(st.answered / st.total * 100) : 0;
  const hours = st.answered * S.settings.minutesPerAnswer / 60;
  const openFlags = flags().filter(f => f.status === 'open');
  const old = devs.map(d => ({ d, m: manualFor(d), s: manualStatus(manualFor(d)) })).filter(x => x.s.key !== 'ok');
  const a7 = sum(st.perDay.slice(-8, -1)), b7 = st.days >= 15 ? sum(st.perDay.slice(-15, -8)) : 0, trend = b7 ? Math.round((a7 - b7) / b7 * 100) : null;
  const nightN = st.byHour.reduce((s, v, h) => s + (h >= 22 || h < 6 ? v : 0), 0), nightPct = st.total ? Math.round(nightN / st.total * 100) : 0;
  const byDev = [...st.byDev].sort((a, b) => b[1] - a[1]), maxDev = byDev.length ? byDev[0][1] : 1;
  const topQ = [...st.qs.values()].sort((a, b) => b.n - a.n).slice(0, 7), maxQ = topQ.length ? topQ[0].n : 1;
  const gaps = [...st.qs.values()].filter(q => q.miss > 0 && !S.settings.gapsDone[q.key]).sort((a, b) => b.miss - a.miss);
  const kinds = Object.keys(KINDS), kindTot = sum(kinds.map(k => st.byKind[k])) || 1;
  const heatMax = Math.max(1, ...st.heat.values());
  const step = v => (v <= 0 ? 0 : clamp(Math.ceil(v / heatMax * 5), 1, 5));
  return html`
    <div class="kpis" data-tour="kpis">
      <div class="kpi"><span class="kpi-label">Frågor, ${st.days} dagar</span><span class="kpi-value">${nf(st.total)}</span>${trend !== null ? html`<span class="kpi-sub ${trend > 0 ? 'up' : ''}">${trend > 0 ? '+' : ''}${trend} % mot veckan före</span>` : html`<span class="kpi-sub">${nf(st.real)} ställda i den här appen</span>`}${sparkSvg(st.perDay)}</div>
      <div class="kpi"><span class="kpi-label">Besvarade direkt ur manualen</span><span class="kpi-value">${pct}<small>%</small></span><span class="kpi-sub">${nf(st.missing)} frågor saknade svar i manualen</span></div>
      <div class="kpi"><span class="kpi-label">Uppskattad sparad tid</span><span class="kpi-value">${hours >= 10 ? nf(Math.round(hours)) : nf(Math.round(hours * 10) / 10)}<small>timmar</small></span><span class="kpi-sub">${nf(st.answered)} svar à ${S.settings.minutesPerAnswer} min</span></div>
      <a class="kpi ${openFlags.length ? 'attn' : ''}" href="#granska"><span class="kpi-label">Flaggade svar att granska</span><span class="kpi-value">${openFlags.length}</span><span class="kpi-sub">${nf(st.up)} tummar upp, ${nf(st.down)} ned</span></a>
      <a class="kpi ${old.length ? 'attn' : ''}" href="#manualer"><span class="kpi-label">Manualer att se över</span><span class="kpi-value">${old.length}</span><span class="kpi-sub">av ${devs.length} enheter</span></a>
    </div>
    <div class="dash">
      ${chartCard({ cls: 'w7', title: 'Frågor per dag', sub: `Senaste ${st.days} dagarna`, body: raw('<div data-chart="line"></div>'),
        table: html`<table class="table"><thead><tr><th>Dag</th><th class="r">Frågor</th></tr></thead><tbody>${st.dates.map((d, i) => html`<tr><td>${dayKey(d)}</td><td class="r num">${st.perDay[i]}</td></tr>`).reverse()}</tbody></table>` })}
      ${chartCard({ cls: 'w5', title: 'Mest efterfrågade enheter', sub: 'Antal frågor per enhet', body: byDev.length ? html`<div class="meters">${byDev.map(([id, n]) => html`<div class="meter" tabindex="0" data-tip="${n} frågor|${name(id)}"><span class="meter-name">${name(id)}</span><span class="meter-val">${nf(n)}</span><div class="meter-bar" style="width:${Math.max(1, n / maxDev * 100)}%"></div></div>`)}</div>` : html`<p class="muted">Inga frågor än.</p>` })}
      ${chartCard({ cls: 'w7', title: 'Vanligaste frågorna', sub: 'Det här frågar personalen oftast om. Underlag för utbildning och snabbkort.', body: topQ.length ? html`<div class="meters">${topQ.map(q => html`<div class="meter"><span class="meter-name">${q.q}<small>${name(q.d)}${q.miss ? ', saknas i manualen' : ''}</small></span><span class="meter-val">${nf(q.n)}</span><div class="meter-bar" style="width:${Math.max(1, q.n / maxQ * 100)}%"></div></div>`)}</div>` : html`<p class="muted">Inga frågor än.</p>` })}
      <div class="dash-col w5">
      ${chartCard({ title: 'Vad frågorna gäller', sub: 'Fördelning per typ av fråga',
        body: html`<div class="segbar" role="img" aria-label="${kinds.map(k => `${KINDS[k]} ${Math.round(st.byKind[k] / kindTot * 100)} procent`).join(', ')}">${kinds.map((k, i) => { const p = st.byKind[k] / kindTot * 100; return p > 0 ? html`<div tabindex="0" style="flex:${p} 1 0;background:var(--viz-${i + 1})" data-tip="${Math.round(p)} %|${KINDS[k]}, ${st.byKind[k]} frågor">${p >= 11 ? Math.round(p) + ' %' : ''}</div>` : ''; })}</div>
          <div class="legend mt14">${kinds.map((k, i) => html`<span><i style="background:var(--viz-${i + 1})"></i>${KINDS[k]}</span>`)}</div>
          <p class="chart-s mt14">${nf(st.alarmQ)} frågor gällde larm eller fel. ${nf(Math.max(0, st.alarmQ - st.mt))} av dem löstes med manualens åtgärd utan hänvisning till MT.</p>`,
        table: html`<table class="table"><thead><tr><th>Typ</th><th class="r">Frågor</th><th class="r">Andel</th></tr></thead><tbody>${kinds.map(k => html`<tr><td>${KINDS[k]}</td><td class="r num">${st.byKind[k]}</td><td class="r num">${Math.round(st.byKind[k] / kindTot * 100)} %</td></tr>`)}</tbody></table>` })}
      ${chartCard({ title: 'När på dygnet frågorna ställs', sub: `${nightPct} % ställs mellan 22 och 06, när MT och support har stängt`,
        body: html`<div data-chart="hours"></div><div class="legend"><span><i style="background:var(--viz-1)"></i>Natt, 22 till 06</span><span><i style="background:var(--viz-mute)"></i>Dag och kväll</span></div>`,
        table: html`<table class="table"><thead><tr><th>Timme</th><th class="r">Frågor</th></tr></thead><tbody>${st.byHour.map((v, h) => html`<tr><td>${pad(h)}–${pad((h + 1) % 24)}</td><td class="r num">${v}</td></tr>`)}</tbody></table>` })}
      </div>
      ${chartCard({ cls: 'w7', title: 'Utbildningsbehov', sub: 'Frågor per enhet och typ. Mörkare ruta betyder fler frågor.',
        body: html`<div style="overflow-x:auto"><table class="heat"><thead><tr><th></th>${kinds.map(k => html`<th>${KINDS[k]}</th>`)}</tr></thead><tbody>${byDev.map(([id]) => html`<tr><th>${name(id)}</th>${kinds.map(k => { const v = st.heat.get(id + '|' + k) || 0; return html`<td class="s${step(v)}" tabindex="0" data-tip="${v} frågor|${name(id)}, ${KINDS[k].toLowerCase()}">${v || ''}</td>`; })}</tr>`)}</tbody></table></div>
          <div class="scale mt8"><span>Färre</span>${[1, 2, 3, 4, 5].map(i => raw(`<i style="background:var(--seq-${i})"></i>`))}<span>Fler</span></div>` })}
      <div class="panel w5"><div class="panel-h"><h2 class="h3">Manualer att se över</h2><a href="#manualer">Visa manualer</a></div>
        ${old.length ? html`<div class="stack">${old.slice(0, 5).map(x => html`<div class="rowflex"><span class="grow"><strong>${x.d.name}</strong><div class="small muted">${x.m ? `${verLine(x.m)}${x.s.months !== null ? ', ' + ageLabel(x.s.months) + ' gammal' : ''}` : 'Ingen manual uppladdad'}</div></span><span class="badge ${x.s.cls}">${icon(x.s.ic)}${x.s.label}</span></div>`)}</div>` : html`<p class="muted">Alla manualer är aktuella.</p>`}</div>
      <div class="panel w7"><div class="panel-h"><h2 class="h3">Kunskapsluckor: frågor som manualen inte besvarar</h2><a href="#granska" data-act="revTab" data-tab="gaps">Hantera</a></div>
        ${gaps.length ? html`<div class="stack">${gaps.slice(0, 4).map(q => html`<div class="rowflex"><span class="badge b-warn num">${q.miss} gånger</span><span class="grow">${q.q} <span class="muted small">${name(q.d)}</span></span></div>`)}</div>` : html`<p class="muted">Inga obesvarade frågor under perioden.</p>`}</div>
      <div class="panel w5"><div class="panel-h"><h2 class="h3">Flaggade svar</h2><a href="#granska" data-act="revTab" data-tab="flags">Granska</a></div>
        ${openFlags.length ? html`<div class="stack">${openFlags.slice(0, 3).map(f => html`<div><strong>${trunc(f.q, 80)}</strong><div class="small muted">${name(f.deviceId)}, ${f.reason.toLowerCase()}, ${fmtWhen(f.createdAt)}</div></div>`)}</div>` : html`<p class="muted">Inga flaggade svar väntar.</p>`}</div>
    </div>
    <p class="assume">${st.demo ? 'Siffrorna är exempeldata som blandas med de frågor som ställs i den här appen. ' : ''}Sparad tid är en uppskattning: antal besvarade frågor gånger ${S.settings.minutesPerAnswer} minuter, den tid det antas ta att leta i en pärm eller nå en kollega. Antagandet ändras under Inställningar.</p>`;
}
V.oversikt = {
  title: 'Översikt',
  async render(el) {
    if (adminGate(el)) return;
    setHTML(el, html`<div class="page-head"><h1 class="h1">Översikt</h1>${S.settings.demoMode ? html`<span class="badge b-demo">Exempeldata</span>` : ''}
      <div class="seg" role="group" aria-label="Period">${[7, 30].map(n => html`<button class="${DASH.days === n ? 'is-on' : ''}" data-act="dashDays" data-n="${n}">${n} dagar</button>`)}</div></div>
      <div id="dashBody"><div class="skel" style="height:120px"></div><div class="skel mt14" style="height:260px"></div></div>`);
    await this.load();
  },
  async load() {
    const st = await gatherStats(DASH.days);
    const body = $('#dashBody');
    if (!body || ROUTE.name !== 'oversikt') return;
    DASH.st = st;
    setHTML(body, dashTpl(st));
    drawCharts();
  },
  update() { if ($('#dashBody') && isAdmin()) this.load(); }
};
ACT.dashDays = el => { DASH.days = Number(el.dataset.n); V.oversikt.render($('#view')); };

/* ----- Granska: tips, flaggade svar, felanmälningar och kunskapsluckor ----- */
UI.revTab = 'tips';
UI.gaps = null;
function askNote({ title, label, placeholder = '', ok = 'Spara', required = false }) {
  return new Promise(resolve => {
    let done = false;
    const m = modal(html`<form><div class="modal-h"><h2 class="h2">${title}</h2></div>
      <div class="modal-b"><div class="field"><label for="noteTxt">${label}</label><textarea class="textarea" id="noteTxt" maxlength="500" placeholder="${placeholder}" ${required ? 'required' : ''} autofocus></textarea></div></div>
      <div class="modal-f"><button type="button" class="btn" data-x="no">Avbryt</button><button class="btn btn-primary">${ok}</button></div></form>`, { onClose: () => { if (!done) resolve(null); } });
    const f = $('form', m.body);
    f.addEventListener('submit', e => {
      e.preventDefault(); e.stopPropagation();
      const v = $('#noteTxt', f).value.trim();
      if (findPNR(v).length) { toast('Texten ser ut att innehålla ett personnummer. Ta bort det.', 'crit'); return; }
      done = true; m.close(); resolve(v);
    });
    f.addEventListener('click', e => { if (e.target.closest('[data-x="no"]')) { done = true; m.close(); resolve(null); } });
  });
}
V.granska = {
  title: 'Granska',
  render(el) {
    if (adminGate(el)) return;
    setHTML(el, html`<div class="page-head"><h1 class="h1">Granska</h1></div>
      <p class="page-sub">Det personalen har skickat in och det som ${BRAND} inte kunde svara på. Inget lokalt innehåll visas för personalen förrän du har godkänt det.</p>
      <div class="tabs" role="tablist" id="revTabs" data-tour="review"></div><div id="revBody"></div>`);
    this.update();
    gatherStats(30).then(st => { UI.gaps = [...st.qs.values()].filter(q => q.miss > 0); if (ROUTE.name === 'granska') this.update(); });
  },
  update() {
    const body = $('#revBody');
    if (!body) return;
    const name = id => (deviceById(id) || {}).name || 'Okänd enhet';
    const pend = tips().filter(t => t.status === 'pending'), fl = flags(), rp = reports();
    const openF = fl.filter(f => f.status === 'open'), openR = rp.filter(r => r.status === 'open');
    const gaps = (UI.gaps || []).filter(q => !S.settings.gapsDone[q.key]).sort((a, b) => b.miss - a.miss);
    const tabs = [['tips', 'Tips', pend.length], ['flags', 'Flaggade svar', openF.length], ['reports', 'Felanmälningar', openR.length], ['gaps', 'Kunskapsluckor', gaps.length]];
    setHTML($('#revTabs'), tabs.map(([k, label, n]) => html`<button role="tab" aria-selected="${UI.revTab === k}" class="${UI.revTab === k ? 'is-on' : ''}" data-act="revTab" data-tab="${k}">${label}<span class="count num ${n && k !== 'gaps' ? 'hot' : ''}">${n}</span></button>`));
    let out;
    if (UI.revTab === 'tips') {
      const decided = tips().filter(t => t.status !== 'pending' && t.decidedAt).sort((a, b) => b.decidedAt - a.decidedAt).slice(0, 5);
      out = html`${pend.length ? html`<div class="rows">${pend.map(t => html`<div class="row wrap-s stack-s"><div class="row-main"><strong>${name(t.deviceId)}</strong><span>${t.text}</span><span class="row-sub">Inskickat ${fmtWhen(t.createdAt)}</span></div>
          <div class="row-meta"><button class="btn btn-s btn-primary" data-act="tipDecide" data-id="${t.id}" data-v="approved">${icon('check', 'ic-s')}Godkänn</button><button class="btn btn-s" data-act="tipDecide" data-id="${t.id}" data-v="rejected">Avslå</button></div></div>`)}</div>` : html`<div class="empty"><p>Inga tips väntar på godkännande.</p></div>`}
        ${decided.length ? html`<section class="sect"><div class="sect-head"><h2 class="h2">Senast avgjorda</h2></div><div class="rows">${decided.map(t => html`<div class="row"><div class="row-main"><span>${t.text}</span><span class="row-sub">${name(t.deviceId)}, ${fmtDate(t.decidedAt)}</span></div><span class="badge ${t.status === 'approved' ? 'b-ok' : ''}">${t.status === 'approved' ? 'Godkänt' : 'Avslaget'}</span></div>`)}</div></section>` : ''}`;
    } else if (UI.revTab === 'flags') {
      const flagTpl = f => html`<div class="panel stack"><div class="rowflex"><strong class="grow">${name(f.deviceId)}</strong><span class="badge ${f.status === 'open' ? 'b-warn' : 'b-ok'}">${f.status === 'open' ? f.reason : 'Åtgärdat'}</span></div>
        <dl class="kv"><dt>Fråga</dt><dd>${f.q}</dd><dt>Svar</dt><dd>${trunc(plainAnswer(f.a), 420)}</dd>${f.note ? html`<dt>Kommentar</dt><dd>${f.note}</dd>` : ''}<dt>Underlag</dt><dd>${f.version || 'Version okänd'}${f.sida ? ', sida ' + f.sida : ''}, flaggat ${fmtWhen(f.createdAt)}</dd>${f.resolution ? html`<dt>Åtgärd</dt><dd>${f.resolution}</dd>` : ''}</dl>
        ${f.status === 'open' ? html`<div class="rowflex"><button class="btn btn-s btn-primary" data-act="flagResolve" data-id="${f.id}">${icon('check', 'ic-s')}Markera som åtgärdat</button>${f.sida && manualFor(deviceById(f.deviceId)) ? html`<button class="btn btn-s" data-act="openPage" data-m="${manualFor(deviceById(f.deviceId)).id}" data-p="${f.sida}" data-s="">${icon('book', 'ic-s')}Visa sidan i manualen</button>` : ''}<button class="btn btn-s" data-act="gapTip" data-dev="${f.deviceId}" data-q="${f.q}">Svara med lokalt tips</button></div>` : ''}</div>`;
      out = html`${openF.length ? html`<div class="stack">${openF.map(flagTpl)}</div>` : html`<div class="empty"><p>Inga flaggade svar väntar på granskning.</p></div>`}
        ${fl.some(f => f.status !== 'open') ? html`<section class="sect"><div class="sect-head"><h2 class="h2">Åtgärdade</h2></div><div class="stack">${fl.filter(f => f.status !== 'open').slice(0, 4).map(flagTpl)}</div></section>` : ''}`;
    } else if (UI.revTab === 'reports') {
      const repTpl = r => html`<div class="panel stack"><div class="rowflex"><strong class="grow">${name(r.deviceId)}${r.code ? html` <span class="code">${r.code}</span>` : ''}</strong>${r.outOfService ? html`<span class="badge b-crit">Tagen ur drift</span>` : ''}<span class="badge ${r.status === 'open' ? 'b-warn' : 'b-ok'}">${r.status === 'open' ? 'Öppen' : 'Avslutad'}</span></div>
        <dl class="kv"><dt>Anmält</dt><dd>${fmtWhen(r.createdAt)}</dd><dt>Beskrivning</dt><dd>${r.what}</dd>${r.tried && r.tried.length ? html`<dt>Provat</dt><dd>${r.tried.join('; ')}</dd>` : ''}${r.resolution ? html`<dt>Åtgärd</dt><dd>${r.resolution}</dd>` : ''}</dl>
        <div class="rowflex">${r.status === 'open' ? html`<button class="btn btn-s btn-primary" data-act="reportClose" data-id="${r.id}">${icon('check', 'ic-s')}Avsluta felanmälan</button>` : ''}<button class="btn btn-s" data-act="reportCopy" data-id="${r.id}">${icon('copy', 'ic-s')}Kopiera sammanfattning</button></div></div>`;
      out = html`${openR.length ? html`<div class="stack">${openR.map(repTpl)}</div>` : html`<div class="empty"><p>Inga öppna felanmälningar.</p></div>`}
        ${rp.some(r => r.status !== 'open') ? html`<section class="sect"><div class="sect-head"><h2 class="h2">Avslutade</h2></div><div class="stack">${rp.filter(r => r.status !== 'open').slice(0, 4).map(repTpl)}</div></section>` : ''}`;
    } else {
      out = UI.gaps === null ? html`<div class="skel"></div>` : gaps.length ? html`<div class="rows">${gaps.map(q => html`<div class="row wrap-s stack-s"><div class="row-main"><strong>${q.q}</strong><span class="row-sub">${name(q.d)}. Ställd ${q.miss} ${q.miss === 1 ? 'gång' : 'gånger'} utan att manualen gav svar.</span></div>
        <div class="row-meta"><button class="btn btn-s btn-primary" data-act="gapTip" data-dev="${q.d}" data-q="${q.q}" data-key="${q.key}">Svara med lokalt tips</button><button class="btn btn-s" data-act="gapDone" data-key="${q.key}">Avfärda</button></div></div>`)}</div>
        <p class="hint mt14">Kunskapsluckorna visar var manualen inte räcker till. De är underlag för lokala rutiner, utbildning och återkoppling till tillverkaren.</p>` : html`<div class="empty"><p>Inga obesvarade frågor de senaste 30 dagarna.</p></div>`;
    }
    setHTML(body, out);
  }
};
ACT.revTab = el => { UI.revTab = el.dataset.tab; if (ROUTE.name === 'granska') V.granska.update(); };
ACT.flagResolve = async el => {
  const note = await askNote({ title: 'Markera som åtgärdat', label: 'Vad gjordes? Syns i händelseloggen.', placeholder: 'Till exempel: manualen kontrollerad, svaret stämmer.' });
  if (note === null) return;
  const f = flags().find(x => x.id === el.dataset.id);
  if (!f) return;
  await saveDoc('flags', f.id, { status: 'resolved', resolution: note, decidedAt: Date.now(), decidedBy: S.uid || '' });
  audit('flag', f.deviceId, 'Flaggat svar åtgärdat av ansvarig.' + (note ? ' ' + note : ''));
  toast('Flaggan är åtgärdad.');
};
ACT.reportClose = async el => {
  const note = await askNote({ title: 'Avsluta felanmälan', label: 'Åtgärd', placeholder: 'Till exempel: enheten hämtad för service, lånepump utlämnad.' });
  if (note === null) return;
  const r = reports().find(x => x.id === el.dataset.id);
  if (!r) return;
  await saveDoc('reports', r.id, { status: 'closed', resolution: note, decidedAt: Date.now(), decidedBy: S.uid || '' });
  audit('report', r.deviceId, 'Felanmälan avslutad.' + (note ? ' ' + note : ''));
  toast('Felanmälan är avslutad.');
};
ACT.reportCopy = el => { const r = reports().find(x => x.id === el.dataset.id), d = r && deviceById(r.deviceId); if (d) copyText(reportSummary(r, d), 'Sammanfattningen är kopierad'); };
ACT.gapDone = async el => { await saveSettings({ gapsDone: { [el.dataset.key]: Date.now() } }); toast('Frågan är avfärdad.'); if (ROUTE.name === 'granska') V.granska.update(); };
ACT.gapTip = async el => {
  const d = deviceById(el.dataset.dev);
  if (!d) { toast('Frågan är inte kopplad till en enhet.'); return; }
  const text = await askNote({ title: 'Svara med ett lokalt tips', label: `Fråga: ${el.dataset.q}`, placeholder: 'Skriv den lokala rutinen eller var svaret finns. Tipset märks som ej från tillverkaren.', ok: 'Publicera tipset', required: true });
  if (!text) return;
  await addDoc('tips', { deviceId: d.id, text, status: 'approved', by: S.uid || '', createdAt: Date.now(), decidedAt: Date.now(), fromQuestion: el.dataset.q });
  if (el.dataset.key) await saveSettings({ gapsDone: { [el.dataset.key]: Date.now() } });
  audit('tip', d.id, 'Lokalt tips publicerat som svar på en obesvarad fråga.');
  toast('Tipset är publicerat på enhetens sida.');
  if (ROUTE.name === 'granska') V.granska.update();
};

/* ----- Manualer och versioner ----- */
V.manualer = {
  title: 'Manualer',
  render(el) {
    if (adminGate(el)) return;
    setHTML(el, html`<div class="page-head"><h1 class="h1">Manualer och versioner</h1><button class="btn btn-primary" data-act="upload" data-tour="upload">${icon('plus')}Lägg till enhet</button></div>
      <p class="page-sub">Varje svar visar vilken version det bygger på. ${BRAND} varnar när en manual är äldre än ${S.settings.staleMonths} månader. <a href="#installningar">Ändra gränsen</a></p>
      <div id="manList"></div>`);
    this.update();
  },
  update() {
    const el = $('#manList');
    if (!el) return;
    const rows = devices().map(d => ({ d, m: manualFor(d), s: manualStatus(manualFor(d)) })).sort((a, b) => ({ none: 0, unknown: 1, stale: 2, ok: 3 }[a.s.key] - { none: 0, unknown: 1, stale: 2, ok: 3 }[b.s.key]));
    setHTML(el, rows.length ? html`<div class="rows" data-tour="manuals">${rows.map(({ d, m, s }) => html`<div class="row wrap-s">${devIcon(d)}
      <div class="row-main"><a class="tile-name" href="#enhet-${d.id}">${d.name}</a><span class="row-sub">${m ? html`${verLine(m)}${s.months !== null ? ', ' + ageLabel(s.months) + ' gammal' : ''}. ${m.pageCount || (m.pages ? m.pages.length : 0)} sidor på ${LANG[m.lang || '']}${m.ocrPages ? ', varav ' + m.ocrPages + ' tolkade med OCR' : ''}.` : 'Ingen manual uppladdad.'}</span></div>
      <div class="row-meta"><span class="badge ${s.cls}">${icon(s.ic)}${s.label}</span>${demoBadge(d)}<button class="btn btn-s" data-act="upload" data-id="${d.id}">${icon('upload', 'ic-s')}${m ? 'Ny version' : 'Ladda upp'}</button><button class="btn btn-s btn-icon" data-act="editDevice" data-id="${d.id}" aria-label="Redigera ${d.name}">${icon('edit', 'ic-s')}</button></div></div>`)}</div>` : html`<div class="empty"><h3 class="h3">Inga enheter än</h3><p>Lägg till den första enheten genom att ladda upp tillverkarens bruksanvisning som PDF.</p></div>`);
  }
};

/* ----- Logg ----- */
UI.logTab = 'q'; UI.logDev = ''; UI.logSt = '';
const ST_LABEL = { ok: ['Ur manualen', 'b-ok'], delvis: ['Delvis', 'b-warn'], saknas: ['Saknas i manualen', 'b-warn'], avvisad: ['Avvisad, klinisk fråga', 'b-crit'], reserv: ['Reservläge', ''] };
const AUDIT_LABEL = { manual: 'Manual', tip: 'Tips', card: 'Snabbkort', flag: 'Flagga', report: 'Felanmälan', settings: 'Inställning', device: 'Enhet' };
async function logRows() {
  const rows = (await loadLogs()).map(r => ({ ...r }));
  if (S.settings.demoMode && DEMO.stats) DEMO.stats.recent.forEach(r => rows.push({ t: relToMs(r), d: r.d, q: r.q, k: r.k, st: r.st, fb: r.fb, mt: r.mt, demo: true }));
  return rows.sort((a, b) => b.t - a.t);
}
V.logg = {
  title: 'Logg',
  async render(el) {
    if (adminGate(el)) return;
    setHTML(el, html`<div class="page-head"><h1 class="h1">Logg</h1><button class="btn btn-s" data-act="logCsv">${icon('download', 'ic-s')}Hämta som CSV</button></div>
      <p class="page-sub">Frågeloggen är anonym: den sparar frågan, enheten och utfallet, aldrig vem som frågade. Personnummer stoppas innan frågan skickas.</p>
      <div class="tabs" role="tablist"><button role="tab" class="${UI.logTab === 'q' ? 'is-on' : ''}" data-act="logTab" data-tab="q">Ställda frågor</button><button role="tab" class="${UI.logTab === 'a' ? 'is-on' : ''}" data-act="logTab" data-tab="a">Händelser</button></div>
      <div id="logBody"><div class="skel"></div></div>`);
    await this.load();
  },
  async load() {
    const name = id => (deviceById(id) || {}).name || (id ? 'Borttagen enhet' : 'Alla enheter');
    if (UI.logTab === 'a') {
      const rows = await loadAudit(), body = $('#logBody');
      if (!body) return;
      setHTML(body, rows.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th>Tid</th><th>Typ</th><th>Enhet</th><th>Händelse</th></tr></thead><tbody>${rows.slice(0, 200).map(r => html`<tr><td class="nowrap">${fmtWhen(r.t)}</td><td>${AUDIT_LABEL[r.type] || r.type}</td><td>${r.d ? name(r.d) : ''}</td><td>${r.text}${r.demo ? html` <span class="badge b-demo">Exempel</span>` : ''}</td></tr>`)}</tbody></table></div>
        <p class="hint mt8">Händelseloggen visar vad som har ändrats och när: manualversioner, godkända tips och snabbkort, flaggor och felanmälningar.</p>` : html`<div class="empty"><p>Inga händelser än.</p></div>`);
      return;
    }
    const all = await logRows(), body = $('#logBody');
    if (!body) return;
    UI.logCache = all;
    const rows = all.filter(r => (!UI.logDev || r.d === UI.logDev) && (!UI.logSt || r.st === UI.logSt));
    setHTML(body, html`<div class="rowflex" style="margin-bottom:12px">
        <select class="select" style="width:auto" data-change="logDev" aria-label="Filtrera på enhet"><option value="">Alla enheter</option>${devices().map(d => html`<option value="${d.id}" ${UI.logDev === d.id ? 'selected' : ''}>${d.name}</option>`)}</select>
        <select class="select" style="width:auto" data-change="logSt" aria-label="Filtrera på utfall"><option value="">Alla utfall</option>${Object.entries(ST_LABEL).map(([k, v]) => html`<option value="${k}" ${UI.logSt === k ? 'selected' : ''}>${v[0]}</option>`)}</select>
        <span class="muted small num">${rows.length} frågor</span></div>
      ${rows.length ? html`<div class="table-wrap"><table class="table"><thead><tr><th>Tid</th><th>Enhet</th><th>Fråga</th><th>Typ</th><th>Utfall</th><th>Omdöme</th></tr></thead><tbody>
        ${rows.slice(0, 300).map(r => { const s = ST_LABEL[r.st] || ST_LABEL.ok; return html`<tr><td class="nowrap">${fmtWhen(r.t)}</td><td>${name(r.d)}</td><td class="q">${r.q}${r.demo ? html` <span class="badge b-demo">Exempel</span>` : ''}</td><td>${KINDS[r.k] || 'Övrigt'}</td><td><span class="badge ${s[1]}">${s[0]}</span>${r.mt ? html` <span class="badge b-crit">MT</span>` : ''}</td><td>${r.flag ? html`<span class="badge b-warn">Flaggat</span>` : r.fb === 1 ? icon('thumb-up', 'ic-s') : r.fb === -1 ? icon('thumb-down', 'ic-s') : ''}</td></tr>`; })}
      </tbody></table></div>` : html`<div class="empty"><p>Inga frågor matchar filtret.</p></div>`}`);
  },
  update() { /* loggen laddas om vid tabbyte och filter, inte vid varje ändring */ }
};
ACT.logTab = el => { UI.logTab = el.dataset.tab; V.logg.render($('#view')); };
CHANGE.logDev = el => { UI.logDev = el.value; V.logg.load(); };
CHANGE.logSt = el => { UI.logSt = el.value; V.logg.load(); };
ACT.logCsv = async () => {
  const rows = await logRows(), q = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
  const csv = '﻿' + ['Tid;Enhet;Fråga;Typ;Utfall;MT-hänvisning;Omdöme;Exempeldata'].concat(rows.map(r => [dayKey(new Date(r.t)) + ' ' + fmtTime(r.t), (deviceById(r.d) || {}).name || '', r.q, KINDS[r.k] || 'Övrigt', (ST_LABEL[r.st] || ST_LABEL.ok)[0], r.mt ? 'Ja' : '', r.fb === 1 ? 'Upp' : r.fb === -1 ? 'Ned' : '', r.demo ? 'Ja' : ''].map(q).join(';'))).join('\r\n');
  saveFile('lotsa-fragelogg.csv', csv, () => copyText(csv, 'Loggen är kopierad som CSV'));
};

/* ----- Inställningar ----- */
V.installningar = {
  title: 'Inställningar',
  render(el) {
    if (adminGate(el)) return;
    const s = S.settings;
    setHTML(el, html`<div class="page-head"><h1 class="h1">Inställningar</h1></div>
      <form class="stack" data-form="settings" style="gap:16px;max-width:820px">
        <div class="panel"><div class="panel-h"><h2 class="h3">Verksamhet och kontakt</h2></div><div class="formgrid">
          <div class="field full"><label for="sOrg">Verksamhetens namn</label><input class="input" id="sOrg" name="orgName" value="${s.orgName}" maxlength="80"></div>
          <div class="field"><label for="sMtN">MT-jour, namn</label><input class="input" id="sMtN" name="mtName" value="${s.mtName}" maxlength="60"></div>
          <div class="field"><label for="sMtP">MT-jour, telefon</label><input class="input" id="sMtP" name="mtPhone" value="${s.mtPhone}" inputmode="tel" maxlength="30"><span class="hint">Används för enheter som saknar eget nummer.</span></div>
          <div class="field full"><label for="sMtH">MT-jour, tider</label><input class="input" id="sMtH" name="mtHours" value="${s.mtHours}" maxlength="60" placeholder="Till exempel dygnet runt"></div></div></div>
        <div class="panel"><div class="panel-h"><h2 class="h3">Manualer och svar</h2></div><div class="formgrid">
          <div class="field"><label for="sStale">Varna när manualen är äldre än</label><select class="select" id="sStale" name="staleMonths">${[12, 24, 36, 48, 60].map(n => html`<option value="${n}" ${s.staleMonths === n ? 'selected' : ''}>${n} månader</option>`)}</select></div>
          <div class="field"><label for="sTier">AI-svar</label><select class="select" id="sTier" name="aiTier"><option value="quick" ${s.aiTier === 'quick' ? 'selected' : ''}>Snabba svar (rekommenderas)</option><option value="default" ${s.aiTier === 'default' ? 'selected' : ''}>Noggranna svar, tar längre tid</option></select><span class="hint">Oavsett val kontrolleras varje citat mot manualtexten.</span></div>
          <div class="field"><label for="sMin">Sparad tid per besvarad fråga</label><select class="select" id="sMin" name="minutesPerAnswer">${[3, 4, 5, 6, 8, 10, 15].map(n => html`<option value="${n}" ${s.minutesPerAnswer === n ? 'selected' : ''}>${n} minuter</option>`)}</select><span class="hint">Antagande bakom översiktens tidsbesparing.</span></div>
          <div class="field"><label for="sUrl">Appens adress för QR-koder</label><input class="input" id="sUrl" name="baseUrl" value="${s.baseUrl || ARTIFACT_URL}" placeholder="https://..." inputmode="url"><span class="hint">Länken du delar till appen. QR-koderna pekar hit.</span></div></div></div>
        <div class="rowflex"><button class="btn btn-primary">Spara inställningarna</button></div>
      </form>
      <div class="panel mt20" style="max-width:820px"><div class="panel-h"><h2 class="h3">Exempeldata</h2><span class="badge b-demo">Fiktiv</span></div>
        <label class="switch"><input type="checkbox" data-change="demoMode" ${s.demoMode ? 'checked' : ''}><span>Visa exempelenheter, exempelmanualer och exempelstatistik</span></label>
        <p class="hint mt8">Stäng av när ni börjar med egna manualer. Exempeldatan ligger kvar och kan slås på igen.</p>
        <div class="rowflex mt14"><button class="btn" data-act="resetDemo">Återställ exempeldatan</button><button class="btn btn-danger" data-act="wipeOwn">Radera allt som lagts till</button></div></div>
      <div class="panel mt20" style="max-width:820px"><div class="panel-h"><h2 class="h3">Om den här visningen</h2></div>
        <dl class="kv"><dt>Lagring</dt><dd>${STANDALONE && S.live ? 'Sparas i den här webbläsaren på den här datorn. Andra datorer har sin egen data.' : S.live ? (S.readOnly ? 'Skrivskyddad. Ändringar gäller tills sidan stängs.' : 'Sparas mellan besök') : 'Ingen databas nås. Ändringar gäller tills sidan stängs.'}</dd>
          <dt>AI-svar</dt><dd>${STANDALONE ? html`${STANDALONE.hasKey() ? `Via Anthropic API med nyckeln ${STANDALONE.keyHint()}` : 'Ingen API-nyckel inlagd'} <button type="button" class="btn btn-s" data-act="apiKey">${STANDALONE.hasKey() ? 'Byt nyckel' : 'Lägg in nyckel'}</button>` : (aiReady() ? 'Tillgängliga via ditt Claude-konto' : 'Inte tillgängliga här')}</dd>
          <dt>Röstinmatning</dt><dd>${S.caps.dictation ? 'Tillgänglig' : 'Inte tillgänglig i den här webbläsaren eller appen. Använd tangentbordets mikrofon.'}</dd>
          <dt>Nedladdning</dt><dd>${S.caps.downloads ? 'Tillgänglig' : 'Inte tillgänglig här'}</dd>
          <dt>Roller</dt><dd>Rollbytet i menyn är ett demoläge. I en skarp tjänst styrs rollen av inloggningen.</dd></dl></div>`);
  },
  update() {}
};
FORM.settings = async f => {
  const fd = formData(f);
  if (fd.baseUrl && !/^https:\/\//i.test(fd.baseUrl)) { toast('Appens adress ska börja med https://', 'crit'); return; }
  try {
    await saveSettings({ orgName: fd.orgName, mtName: fd.mtName, mtPhone: fd.mtPhone, mtHours: fd.mtHours, staleMonths: Number(fd.staleMonths), aiTier: fd.aiTier, minutesPerAnswer: Number(fd.minutesPerAnswer), baseUrl: fd.baseUrl === ARTIFACT_URL ? '' : fd.baseUrl });
    toast('Inställningarna är sparade.');
  } catch (e) { toast('Inställningarna kunde inte sparas.', 'crit'); }
};
CHANGE.demoMode = async el => { await saveSettings({ demoMode: el.checked }); toast(el.checked ? 'Exempeldatan visas.' : 'Exempeldatan är dold.'); emit(); };
ACT.resetDemo = async () => {
  if (!await confirmBox({ title: 'Återställ exempeldatan?', text: 'Ändringar i exemplen tas bort: godkända exempeltips, avslutade exempelärenden, redigerade exempelenheter och uppladdade versioner av exempelmanualer. Det du själv har lagt till påverkas inte.', ok: 'Återställ' })) return;
  await resetDemo(); CHATS.clear();
  toast('Exempeldatan är återställd.');
};
ACT.wipeOwn = async () => {
  if (!await confirmBox({ title: 'Radera allt som lagts till?', text: 'Egna enheter, manualer, tips, flaggor, felanmälningar, frågeloggen och händelseloggen raderas. Det går inte att ångra.', ok: 'Radera', danger: true })) return;
  await wipeOwn(); CHATS.clear();
  toast('Allt som lagts till är raderat.');
};

/* ----- Redigera enhet ----- */
ACT.editDevice = el => {
  const d = deviceById(el.dataset.id);
  if (!d) return;
  const m = manualFor(d), c = d.contacts || {}, mt = c.mt || {}, sp = c.support || {};
  modal(html`<form data-form="device" data-id="${d.id}">
    <div class="modal-h"><h2 class="h2">Redigera ${d.name}</h2><button type="button" class="btn btn-icon btn-quiet" data-act="closeOverlay" aria-label="Stäng">${icon('x')}</button></div>
    <div class="modal-b"><div class="formgrid">
      <div class="field full"><label for="edName">Namn</label><input class="input" id="edName" name="name" value="${d.name}" required maxlength="80"></div>
      <div class="field"><label for="edMan">Tillverkare</label><input class="input" id="edMan" name="manufacturer" value="${d.manufacturer || ''}" maxlength="60"></div>
      <div class="field"><label for="edMod">Modell</label><input class="input" id="edMod" name="model" value="${d.model || ''}" maxlength="60"></div>
      <div class="field"><label for="edCat">Typ</label><select class="select" id="edCat" name="category">${Object.entries(CATS).map(([k, v]) => html`<option value="${k}" ${d.category === k ? 'selected' : ''}>${v}</option>`)}</select></div>
      <div class="field"><label for="edDept">Avdelning</label><input class="input" id="edDept" name="dept" value="${d.dept || ''}" list="deptList" required maxlength="60"><datalist id="deptList">${depts().map(x => html`<option value="${x}"></option>`)}</datalist></div>
      <div class="field full"><label for="edInv">Inventarienummer</label><input class="input" id="edInv" name="inventoryNo" value="${d.inventoryNo || ''}" maxlength="40"></div>
      ${m ? html`<div class="field"><label for="edVer">Manualens version</label><input class="input" id="edVer" name="version" value="${m.version || ''}" maxlength="40"></div>
      <div class="field"><label for="edIss">Manualen utgiven</label><input class="input" id="edIss" name="issued" type="date" value="${m.issued || ''}"></div>` : ''}
      <div class="field"><label for="edMtN">MT-kontakt, namn</label><input class="input" id="edMtN" name="mtName" value="${mt.name || ''}" maxlength="60"></div>
      <div class="field"><label for="edMtP">MT-kontakt, telefon</label><input class="input" id="edMtP" name="mtPhone" value="${mt.phone || ''}" inputmode="tel" maxlength="30"></div>
      <div class="field"><label for="edSpN">Tillverkarens support, namn</label><input class="input" id="edSpN" name="spName" value="${sp.name || ''}" maxlength="60"></div>
      <div class="field"><label for="edSpP">Tillverkarens support, telefon</label><input class="input" id="edSpP" name="spPhone" value="${sp.phone || ''}" inputmode="tel" maxlength="30"></div>
      <div class="field"><label for="edSpE">Tillverkarens support, e-post</label><input class="input" id="edSpE" name="spEmail" value="${sp.email || ''}" inputmode="email" maxlength="80"></div>
      <div class="field"><label for="edSpH">Tillverkarens support, tider</label><input class="input" id="edSpH" name="spHours" value="${sp.hours || ''}" maxlength="60"></div>
    </div>${d.demo ? html`<p class="hint">Det här är en exempelenhet. Ändringarna kan återställas under Inställningar.</p>` : ''}</div>
    <div class="modal-f">${d.demo ? '' : html`<button type="button" class="btn btn-danger" data-act="deleteDevice" data-id="${d.id}" style="margin-right:auto">Ta bort enheten</button>`}<button type="button" class="btn" data-act="closeOverlay">Avbryt</button><button class="btn btn-primary">Spara</button></div>
  </form>`, { wide: true });
};
FORM.device = async f => {
  const fd = formData(f), d = deviceById(f.dataset.id);
  if (!d) return;
  try {
    await saveDoc('devices', d.id, { name: fd.name, manufacturer: fd.manufacturer, model: fd.model, category: fd.category, dept: fd.dept, inventoryNo: fd.inventoryNo,
      contacts: { mt: { name: fd.mtName, phone: fd.mtPhone, hours: ((d.contacts || {}).mt || {}).hours || '' }, support: { name: fd.spName, phone: fd.spPhone, email: fd.spEmail, hours: fd.spHours } } });
    const m = manualFor(d);
    if (m && (fd.version !== undefined) && (fd.version !== (m.version || '') || fd.issued !== (m.issued || ''))) {
      await saveDoc('manuals', m.id, { version: fd.version, issued: fd.issued });
      audit('manual', d.id, `Versionsuppgifter ändrade till ${fd.version || 'okänd version'}${fd.issued ? ', utgiven ' + fd.issued : ''}.`);
    }
  } catch (e) { toast('Ändringarna kunde inte sparas.', 'crit'); return; }
  ACT.closeOverlay();
  toast('Enheten är uppdaterad.');
};
ACT.deleteDevice = async el => {
  const d = deviceById(el.dataset.id);
  if (!d) return;
  if (!await confirmBox({ title: `Ta bort ${d.name}?`, text: 'Enheten, manualen, tipsen och felanmälningarna tas bort. Frågeloggen behålls. Det går inte att ångra.', ok: 'Ta bort', danger: true })) return;
  closeAllOverlays();
  await removeDevice(d.id);
  audit('device', d.id, `Enheten ${d.name} borttagen.`);
  toast('Enheten är borttagen.');
  if (ROUTE.name === 'enhet') location.hash = '#enheter';
};
