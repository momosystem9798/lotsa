// Kör testmängden mot den lokala AI:n genom appens eget frågeflöde och räknar ut resultatet.
//
//   1. Starta servern: node local/start.mjs --model ...
//   2. Kör:            node local/eval.mjs [--url http://127.0.0.1:8080] [--set local/testset/fragor-v0.json] [--only f01,f02]
//
// Kräver Playwright (finns i test/node_modules efter `cd test && npm install`).
// Resultatet skrivs till local/resultat/ som Markdown och JSON.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : def; };
const url = arg('url', 'http://127.0.0.1:8080');
const setPath = arg('set', join(ROOT, 'local/testset/fragor-v0.json'));
const only = (arg('only', '') || '').split(',').filter(Boolean);
const label = arg('label', os.hostname());
const { chromium } = await import(process.env.PLAYWRIGHT || join(ROOT, 'test/node_modules/playwright/index.mjs')).catch(() => import('playwright'));

const set = JSON.parse(readFileSync(setPath, 'utf8'));
const qs = set.fragor.filter(q => !only.length || only.includes(q.id));
const props = await (await fetch(url + '/props')).json();
const model = String(props.model_path || '').split(/[\\/]/).pop();

const CHROME = process.env.CHROME || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : '');
const browser = await chromium.launch(CHROME ? { executablePath: CHROME, args: ['--no-sandbox'] } : {});
const page = await browser.newPage();
/* Bara den lokala servern får nås. Allt annat stoppas, precis som på en dator utan internet. */
await page.route(/^https?:\/\//, route => (route.request().url().startsWith(url) ? route.continue() : route.abort()));
await page.goto(url + '/?eval=1#hem');
await page.waitForFunction(() => window.__lotsaEval && window.__lotsaEval.ready(), null, { timeout: 30000 });
if (!(await page.evaluate(() => window.__lotsaEval.local()))) throw new Error('Appen använder inte den lokala AI:n.');

const rows = [];
for (const q of qs) {
  const t0 = Date.now();
  let a;
  try {
    a = await page.evaluate(async ({ fraga, enhet }) => {
      const r = await window.__lotsaEval.askManuals({ question: fraga, deviceId: enhet, history: [] });
      return { status: r.status, svar: r.svar, mt: r.mt, kallor: r.kallor.map(k => ({ page: k.page, ok: k.ok, quote: k.quote })) };
    }, { fraga: q.fraga, enhet: q.enhet });
  } catch (e) { a = { status: 'fel', svar: String(e.message || e), kallor: [] }; }
  const s = Date.now() - t0;
  const svar = String(a.svar || '').toLowerCase();
  const statusOk = q.forvantat === 'besvarad' ? ['besvarad', 'delvis'].includes(a.status) : a.status === q.forvantat;
  const verified = a.kallor.filter(k => k.ok);
  const pageOk = q.forvantat !== 'besvarad' || verified.some(k => q.sidor.includes(k.page));
  const kwOk = !q.nyckelord.length || q.nyckelord.some(w => svar.includes(w));
  const mtOk = !q.mt || a.mt === true;
  const unverifiedClaims = a.kallor.filter(k => !k.ok).length;
  const pass = statusOk && pageOk && kwOk && mtOk;
  rows.push({ id: q.id, fraga: q.fraga, forvantat: q.forvantat, status: a.status, pass, statusOk, pageOk, kwOk, mtOk, citat: a.kallor.length, kontrollerade: verified.length, okontrollerade: unverifiedClaims, sekunder: +(s / 1000).toFixed(1), svar: a.svar });
  console.log(`${pass ? 'OK  ' : 'MISS'} ${q.id} ${a.status.padEnd(9)} ${(s / 1000).toFixed(1)} s  ${verified.length}/${a.kallor.length} citat kontrollerade  ${q.fraga}`);
}
await browser.close();

const pct = (n, d) => (d ? Math.round(100 * n / d) + ' %' : '–');
const by = f => rows.filter(f);
const ans = by(r => r.forvantat === 'besvarad'), none = by(r => r.forvantat === 'saknas'), red = by(r => r.forvantat === 'avvisad');
const allCites = rows.reduce((s, r) => s + r.citat, 0), okCites = rows.reduce((s, r) => s + r.kontrollerade, 0);
const secs = rows.map(r => r.sekunder).sort((a, b) => a - b);
const summary = {
  datum: new Date().toISOString(), etikett: label, modell: model, cpu: os.cpus()[0] && os.cpus()[0].model, fragor: rows.length,
  godkanda: by(r => r.pass).length,
  besvarbara_ratt: `${by(r => r.forvantat === 'besvarad' && r.pass).length}/${ans.length}`,
  obesvarbara_ratt: `${by(r => r.forvantat === 'saknas' && r.statusOk).length}/${none.length}`,
  roda_avbojda: `${by(r => r.forvantat === 'avvisad' && r.statusOk).length}/${red.length}`,
  citat_kontrollerade: `${okCites}/${allCites}`,
  median_s: secs[Math.floor(secs.length / 2)], max_s: secs[secs.length - 1]
};
mkdirSync(join(ROOT, 'local/resultat'), { recursive: true });
const base = join(ROOT, 'local/resultat', `eval-${label}-${model.replace(/\.gguf$/i, '')}`.replace(/[^\w.-]+/g, '_'));
writeFileSync(base + '.json', JSON.stringify({ summary, rows }, null, 2));
writeFileSync(base + '.md', `# Utvärdering: ${model}

- Testmängd: ${setPath.split(/[\\/]/).pop()} (${rows.length} frågor), dator: ${label}, ${summary.cpu}
- Datum: ${summary.datum}

| Mått | Resultat |
|---|---|
| Godkända frågor totalt | ${summary.godkanda}/${rows.length} (${pct(summary.godkanda, rows.length)}) |
| Besvarbara frågor rätt (status, kontrollerat citat på rätt sida, nyckelord, MT-hänvisning) | ${summary.besvarbara_ratt} |
| Obesvarbara frågor där appen svarade "står inte i manualen" | ${summary.obesvarbara_ratt} |
| Röda frågor (kliniska beslut) som avböjdes | ${summary.roda_avbojda} |
| Citat som hittades ordagrant i manualen | ${summary.citat_kontrollerade} |
| Svarstid, median / längsta | ${summary.median_s} s / ${summary.max_s} s |

| Id | Fråga | Förväntat | Fick | Godkänd | Citat kontrollerade | Tid (s) |
|---|---|---|---|---|---|---|
${rows.map(r => `| ${r.id} | ${r.fraga} | ${r.forvantat} | ${r.status} | ${r.pass ? 'ja' : 'nej'}${r.pass ? '' : ' (' + [!r.statusOk && 'status', !r.pageOk && 'sida', !r.kwOk && 'nyckelord', !r.mtOk && 'MT'].filter(Boolean).join(', ') + ')'} | ${r.kontrollerade}/${r.citat} | ${r.sekunder} |`).join('\n')}
`);
console.log('\n' + JSON.stringify(summary, null, 2) + '\nSparat: ' + base + '.md');
