import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/* Sökvägar räknas från testmappen. Playwright och Chrome kan pekas ut med PLAYWRIGHT och CHROME. */
const TEST = dirname(fileURLToPath(import.meta.url)), ROOT = dirname(TEST);
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright').catch(() => import('/opt/npm-tools/node_modules/playwright/index.mjs'));
const DIST = pathToFileURL(join(ROOT, 'dist/index.html')).href;
const SHOTS = join(TEST, 'shots');
mkdirSync(SHOTS, { recursive: true });
const nm = p => join(TEST, 'node_modules', p);
/* Anthropic-SDK:n hämtas från jsDelivr i webbläsaren. I testerna buntas samma version lokalt. */
const SDK_BUNDLE = nm('.cache/anthropic-sdk.mjs');
if (!existsSync(SDK_BUNDLE)) execFileSync(nm('.bin/esbuild'), [nm('@anthropic-ai/sdk/index.mjs'), '--bundle', '--format=esm', '--platform=browser', '--log-level=warning', '--outfile=' + SDK_BUNDLE]);
const LIB = [
  [/jsdelivr.*@anthropic-ai\/sdk/, SDK_BUNDLE],
  [/pdf\.worker\.min\.js/, nm('pdfjs-dist/build/pdf.worker.min.js')],
  [/pdf\.min\.js/, nm('pdfjs-dist/build/pdf.min.js')],
  [/jspdf\.umd\.min\.js/, nm('jspdf/dist/jspdf.umd.min.js')],
  [/jsdelivr.*qrcode/, nm('qrcode-generator/qrcode.js')],
  [/jsQR/i, nm('jsqr/dist/jsQR.js')]
];
const only = process.argv[2] || '';
const results = [];
let errors = [];

async function makePdf() {
  const doc = await PDFDocument.create(), font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = [
    ['Testpump X1', 'Bruksanvisning Rev A', 'Utgiven 2025-06-01', 'Testbolaget AB', '', 'Den har manualen ar skriven for test av uppladdning och innehaller start, larm och rengoring.'],
    ['3 Uppstart', '1. Anslut natkabeln och kontrollera att lampan lyser.', '2. Tryck pa START i tva sekunder.', '3. Vanta pa sjalvtestet och kontrollera att displayen visar KLAR.', 'Det ar viktigt att och for att pumpen ska vara rengjord med duk som inte ar blot.'],
    ['5 Larmkoder', 'Z-1 SENSORFEL (medelhog prioritet)', 'Orsak: Sensorn ar smutsig eller har lossnat.', 'Atgard: Torka av sensorn och starta om pumpen.', 'Z-2 BATTERI SVAGT', 'Orsak: Mindre an 20 minuter kvar.', 'Atgard: Anslut natkabeln.'],
    []
  ];
  for (const lines of pages) {
    const page = doc.addPage([420, 595]);
    if (!lines.length) page.drawRectangle({ x: 60, y: 200, width: 300, height: 200, color: rgb(0.8, 0.8, 0.8) });
    lines.forEach((t, i) => page.drawText(t, { x: 40, y: 540 - i * 26, size: i === 0 ? 18 : 11, font }));
  }
  const bytes = await doc.save();
  writeFileSync(join(TEST, 'testpump.pdf'), bytes);
}

async function open(browser, { mock = {}, noClaude = false, viewport = { width: 1280, height: 860 }, theme = '', hash = '', api = null, ctx: given = null } = {}) {
  const ctx = given || await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: theme === 'dark' ? 'dark' : 'light' });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED/.test(m.text())) errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
  await page.route(/^https?:\/\//, route => {
    const url = route.request().url();
    if (api && /api\.anthropic\.com/.test(url)) return api(route);
    for (const [re, file] of LIB) if (re.test(url) && existsSync(file)) return route.fulfill({ path: file, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' } });
    if (/fonts\.googleapis/.test(url)) return route.fulfill({ body: '', contentType: 'text/css' });
    return route.abort();
  });
  await page.exposeFunction('__saveFile', (name, b64) => { writeFileSync(SHOTS + '/' + name.replace(/[^\w.-]+/g, '_'), Buffer.from(b64, 'base64')); return true; });
  if (!noClaude) { await page.addInitScript(o => { window.__MOCK_OPTS = o; }, mock); await page.addInitScript({ path: join(TEST, 'mock.js') }); }
  await page.goto(DIST + hash);
  await page.waitForFunction(() => !document.querySelector('#view > .skel'), null, { timeout: 15000 });
  await page.waitForTimeout(150);
  return { ctx, page };
}
async function test(name, fn) {
  if (only && !name.includes(only)) return;
  errors = [];
  const t0 = Date.now();
  try { await fn(); results.push([errors.length ? 'ERRORS' : 'ok', name, Date.now() - t0, errors.slice()]); }
  catch (e) { results.push(['FAIL', name, Date.now() - t0, [String(e && e.stack || e).split('\n').slice(0, 6).join('\n'), ...errors]]); }
}
const expect = (cond, msg) => { if (!cond) throw new Error('Förväntan: ' + msg); };
const txt = async (page, sel) => (await page.locator(sel).first().innerText()).trim();
const go = async (page, hash) => { await page.evaluate(h => { location.hash = h; }, hash); await page.waitForTimeout(120); };

await makePdf();
const CHROME = process.env.CHROME || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : '');
const browser = await chromium.launch(CHROME ? { executablePath: CHROME, args: ['--no-sandbox'] } : {});

await test('hem-desktop', async () => {
  const { ctx, page } = await open(browser);
  expect((await txt(page, '.h1')).includes('Vad behöver du'), 'rubrik på hem');
  expect(await page.locator('.tile').count() >= 2, 'favoriter visas');
  await page.screenshot({ path: SHOTS + '/01-hem.png' });
  await page.fill('#omni', 'E-23');
  await page.waitForTimeout(80);
  expect((await txt(page, '#omniSug')).includes('OCKLUSION'), 'omni hittar larmkod');
  await page.fill('#omni', 'vent');
  await page.waitForTimeout(80);
  expect((await txt(page, '#omniSug')).includes('Ventilator'), 'omni hittar enhet');
  await ctx.close();
});

await test('bibliotek', async () => {
  const { ctx, page } = await open(browser, { hash: '#enheter' });
  expect(await page.locator('.tile').count() === 6, 'sex enheter, fick ' + await page.locator('.tile').count());
  await page.click('.chip:has-text("IVA")');
  expect(await page.locator('.tile').count() === 2, 'två på IVA');
  await page.fill('#devSearch', 'sug');
  await page.waitForTimeout(60);
  expect(await page.locator('.tile').count() === 0, 'sug finns inte på IVA');
  await page.click('[data-act="clearFilters"]');
  expect(await page.locator('.tile').count() === 6, 'filter rensade');
  await page.screenshot({ path: SHOTS + '/02-enheter.png' });
  await page.click('.tile .star >> nth=2');
  await page.waitForTimeout(100);
  await ctx.close();
});

await test('chatt-svar-kalla', async () => {
  const { ctx, page } = await open(browser, { hash: '#enhet-flow300' });
  expect((await txt(page, '.dev-head .h1')).includes('Flow 300'), 'enhetsrubrik');
  await page.click('.shortcut >> nth=0');
  await page.waitForSelector('.msg-a .a-actions', { timeout: 8000 });
  const body = await txt(page, '.msg-a');
  expect(body.includes('Så här gör du'), 'svaret visas: ' + body.slice(0, 80));
  expect(await page.locator('.msg-a .a-body ol li').count() === 3, 'tre steg');
  expect(await page.locator('.src').count() === 2, 'två källor');
  expect((await txt(page, '.src >> nth=0')).includes('Citat kontrollerat'), 'första citatet verifierat');
  expect((await txt(page, '.src >> nth=1')).includes('Citatet hittades inte'), 'påhittat citat upptäcks');
  await page.screenshot({ path: SHOTS + '/03-chatt.png' });
  await page.click('.cite >> nth=0');
  await page.waitForSelector('.drawer .paper mark');
  expect((await txt(page, '.drawer .paper-head')).includes('Citatet står här'), 'källvisare markerar citat');
  await page.screenshot({ path: SHOTS + '/04-kalla.png' });
  await page.click('.drawer [data-pg="1"]');
  await page.keyboard.press('Escape');
  await page.click('[data-act="stepsMsg"]');
  await page.waitForSelector('.steps .steps-t');
  await page.screenshot({ path: SHOTS + '/05-steg.png' });
  await page.click('.steps [data-s="n"]'); await page.click('.steps [data-s="n"]'); await page.click('.steps [data-s="n"]');
  expect(await page.locator('.steps').count() === 0, 'stegläge stängs efter sista steget');
  await page.click('[data-act="fb"][data-v="1"]');
  await page.waitForTimeout(150);
  expect(await page.locator('[data-act="fb"][data-v="1"].is-on').count() === 1, 'tumme upp markerad');
  // flagga
  await page.click('[data-act="flag"]');
  await page.fill('#flNote', 'Stämmer inte med sidan 4');
  await page.click('.modal .btn-primary');
  await page.waitForTimeout(200);
  expect((await txt(page, '[data-act="flag"]')).includes('Flaggat'), 'flaggat');
  // följdfråga: saknas i manualen
  await page.fill('.composer textarea', 'Hur byter jag säkring?');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.a-status.saknas');
  expect((await txt(page, '.msg-a >> nth=1')).includes('Det står inte i manualen'), 'saknas-svar');
  expect(await page.locator('.msg-a >> nth=1').locator('.mtcard').count() === 1, 'MT-kort vid saknas');
  // klinisk fråga
  await page.fill('.composer textarea', 'Vilken dos ska patienten ha?');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.a-status.avvisad');
  // personnummer
  await page.fill('.composer textarea', 'Patient 19121212-1212 har larm');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.notice.crit');
  expect((await page.inputValue('.composer textarea')).includes('1212'), 'texten ligger kvar efter spärr');
  // MT-hänvisning
  await page.fill('.composer textarea', 'Pumpen visar tekniskt fel');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.mtcard:not(.soft)');
  await page.screenshot({ path: SHOTS + '/06-chatt-mt.png', fullPage: false });
  const docs = await page.evaluate(() => [...window.__mockDocs.keys()]);
  expect(docs.some(k => k.startsWith('logs/')), 'frågelogg skriven: ' + docs.join(','));
  expect(docs.some(k => k.startsWith('flags/')), 'flagga sparad');
  const log = await page.evaluate(() => Object.values([...window.__mockDocs].find(([k]) => k.startsWith('logs/'))[1].entries));
  expect(log.length === 4, '4 loggposter, fick ' + log.length);
  expect(log.some(e => e.fb === -1 && e.flag === 1), 'omdöme och flagga i loggen');
  await ctx.close();
});

await test('larm', async () => {
  const { ctx, page } = await open(browser, { hash: '#larm' });
  await page.fill('#alCode', 'e23');
  await page.click('.alarm-form .btn-primary');
  await page.waitForSelector('.alarm-card');
  expect((await txt(page, '.alarm-card')).includes('OCKLUSION NEDSTRÖMS'), 'E-23 hittas utan bindestreck');
  await page.screenshot({ path: SHOTS + '/07-larm.png' });
  await page.click('[data-act="alarmSrc"]');
  await page.waitForSelector('.drawer .paper mark');
  const mark = await txt(page, '.drawer .paper mark');
  expect(mark.startsWith('E-23') && mark.includes('lokal rutin') && !mark.includes('E-24'), 'larmstycket markeras: ' + mark.slice(0, 60));
  await page.keyboard.press('Escape');
  await page.fill('#alCode', 'E-95');
  await page.click('.alarm-form .btn-primary');
  await page.waitForSelector('.alarm-card .mtcard');
  expect((await txt(page, '.alarm-code')) === 'E-95', 'intervallkod visas som inmatad');
  await page.fill('#alCode', 'Q-77');
  await page.click('.alarm-form .btn-primary');
  await page.waitForSelector('.a-status.saknas');
  await page.fill('#alCode', 'err 11');
  await page.click('.alarm-form .btn-primary');
  await page.waitForSelector('.alarm-card');
  expect((await txt(page, '.alarm-card')).includes('NEUTRAL ELECTRODE'), 'Err 11 hittas');
  await page.click('[data-act="alarmSrc"]');
  await page.waitForSelector('.drawer .paper mark');
  expect((await txt(page, '.drawer .paper mark')).startsWith('Err 11'), 'engelskt larmstycke markeras');
  await page.keyboard.press('Escape');
  await page.click('[data-act="alarmReport"]');
  await page.fill('#rpWhat', 'REM-indikatorn lyser rött trots ny elektrod');
  await page.check('input[name="tried"] >> nth=0');
  await page.click('.modal .btn-primary');
  await page.waitForSelector('.modal textarea[readonly]');
  expect((await page.inputValue('.modal textarea[readonly]')).includes('Diatermi Arc 200'), 'sammanfattning av felanmälan');
  await page.screenshot({ path: SHOTS + '/08-felanmalan.png' });
  await ctx.close();
});

await test('snabbkort-qr-pdf', async () => {
  const URL0 = 'https://claude.ai/artifact/TESTtestTEST1234567890';
  const { ctx, page } = await open(browser, { hash: '#enhet-flow300', mock: { seed: { 'settings/app': { baseUrl: URL0 } } } });
  await page.click('[data-tab="kort"]');
  await page.waitForSelector('.qcard');
  await page.screenshot({ path: SHOTS + '/09-snabbkort.png' });
  await page.click('[data-act="cardPdf"]');
  await page.waitForTimeout(1500);
  expect(existsSync(SHOTS + '/Snabbkort_infusionspump-flow-300.pdf'), 'snabbkort-PDF sparad');
  await page.click('[data-act="cardSrc"] >> nth=0');
  await page.waitForSelector('.drawer .paper mark');
  await page.waitForTimeout(350);
  await page.screenshot({ path: SHOTS + '/04b-kalla.png' });
  await page.keyboard.press('Escape');
  await page.click('[data-tab="info"]');
  await page.waitForSelector('.qr svg');
  await page.screenshot({ path: SHOTS + '/10-qr.png' });
  const png = await page.evaluate(async () => {
    const svg = document.querySelector('.qr svg'), xml = new XMLSerializer().serializeToString(svg).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" ');
    const img = new Image();
    await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml); });
    const c = document.createElement('canvas'); c.width = 520; c.height = 520;
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 520, 520); x.drawImage(img, 60, 60, 400, 400);
    return c.toDataURL('image/png');
  });
  writeFileSync(SHOTS + '/qr-test.png', Buffer.from(png.split(',')[1], 'base64'));
  await page.click('[data-act="labelPdf"]');
  await page.waitForTimeout(1200);
  expect(existsSync(SHOTS + '/QR-etikett_infusionspump-flow-300.pdf'), 'etikett-PDF sparad');
  await go(page, '#hem');
  const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.click('[data-act="scanQR"]')]);
  await chooser.setFiles(SHOTS + '/qr-test.png');
  await page.waitForFunction(() => location.hash === '#enhet-flow300', null, { timeout: 8000 });
  await page.click('[data-tab="larm"]');
  await page.click('.codechip >> nth=2');
  await page.waitForSelector('.alarm-card');
  await page.click('[data-tab="manual"]');
  await page.fill('[data-input="manualSearch"]', 'batteri');
  await page.waitForSelector('#msOut-flow300 .fallback-hit');
  expect(await page.locator('#msOut-flow300 .fallback-hit').count() >= 2, 'sökträffar i manualen');
  await page.screenshot({ path: SHOTS + '/11-manual.png' });
  await ctx.close();
});

await test('tips-och-granska', async () => {
  const { ctx, page } = await open(browser, { hash: '#enhet-vac20' });
  await page.click('[data-tab="tips"]');
  await page.fill('textarea[name="text"]', 'Reservsugen står i akutrum 2.');
  await page.click('form[data-form="tip"] .btn-primary');
  await page.waitForTimeout(250);
  expect((await txt(page, '#devPanel')).includes('Väntar på godkännande'), 'eget tips väntar');
  await page.screenshot({ path: SHOTS + '/12-tips.png' });
  await page.click('.rail [data-role="admin"]');
  await go(page, '#granska');
  await page.waitForSelector('#revBody .row');
  const n0 = await page.locator('#revBody .rows >> nth=0').locator('.row').count();
  expect(n0 === 3, 'tre tips väntar (2 exempel + 1 nytt), fick ' + n0);
  await page.screenshot({ path: SHOTS + '/13-granska.png' });
  await page.click('[data-act="tipDecide"][data-v="approved"] >> nth=0');
  await page.waitForTimeout(250);
  expect(await page.locator('#revBody .rows >> nth=0').locator('.row').count() === 2, 'ett tips godkänt');
  await page.click('[data-act="revTab"][data-tab="flags"]');
  await page.waitForSelector('#revBody .panel');
  await page.click('[data-act="flagResolve"]');
  await page.fill('#noteTxt', 'Kontrollerat mot manualen.');
  await page.click('.modal .btn-primary');
  await page.waitForTimeout(250);
  await page.click('[data-act="revTab"][data-tab="reports"]');
  await page.waitForSelector('#revBody .panel');
  await page.click('[data-act="revTab"][data-tab="gaps"]');
  await page.waitForSelector('#revBody .row');
  expect(await page.locator('#revBody .row').count() === 4, 'fyra kunskapsluckor');
  await page.click('[data-act="gapDone"] >> nth=0');
  await page.waitForTimeout(300);
  expect(await page.locator('#revBody .row').count() === 3, 'en lucka avfärdad');
  await page.screenshot({ path: SHOTS + '/14-luckor.png' });
  await ctx.close();
});

await test('admin-vyer', async () => {
  const { ctx, page } = await open(browser, { hash: '#hem' });
  await page.click('.rail [data-role="admin"]');
  await go(page, '#oversikt');
  await page.waitForSelector('.kpis');
  await page.waitForSelector('[data-chart="line"] svg');
  expect((await txt(page, '.kpi-value >> nth=0')).replace(/\D/g, '') === '412', 'KPI visar 412 frågor: ' + await txt(page, '.kpi-value >> nth=0'));
  await page.screenshot({ path: SHOTS + '/15-oversikt.png', fullPage: false });
  await page.evaluate(() => { document.querySelector('#main').scrollTop = 620; });
  await page.waitForTimeout(100);
  await page.screenshot({ path: SHOTS + '/16-oversikt-2.png' });
  await page.evaluate(() => { document.querySelector('#main').scrollTop = 1500; });
  await page.waitForTimeout(100);
  await page.screenshot({ path: SHOTS + '/17-oversikt-3.png' });
  await page.hover('[data-chart="line"] svg');
  await page.click('[data-act="vizTable"] >> nth=0');
  await page.click('[data-act="vizTable"] >> nth=0');
  await page.click('[data-act="dashDays"][data-n="7"]');
  await page.waitForSelector('.kpis');
  await go(page, '#manualer');
  await page.waitForSelector('#manList .row');
  await page.screenshot({ path: SHOTS + '/18-manualer.png' });
  await go(page, '#logg');
  await page.waitForSelector('#logBody table');
  await page.screenshot({ path: SHOTS + '/19-logg.png' });
  await page.click('[data-act="logCsv"]');
  await page.waitForTimeout(300);
  expect(existsSync(SHOTS + '/lotsa-fragelogg.csv'), 'CSV sparad');
  await page.click('[data-act="logTab"][data-tab="a"]');
  await page.waitForSelector('#logBody table');
  await go(page, '#installningar');
  await page.selectOption('#sStale', '24');
  await page.fill('#sOrg', 'Testsjukhuset');
  await page.click('form[data-form="settings"] .btn-primary');
  await page.waitForTimeout(300);
  const s = await page.evaluate(() => window.__mockDocs.get('settings/app'));
  expect(s && s.staleMonths === 24 && s.orgName === 'Testsjukhuset', 'inställningar sparade: ' + JSON.stringify(s));
  await page.screenshot({ path: SHOTS + '/20-installningar.png' });
  await ctx.close();
});

await test('uppladdning', async () => {
  const { ctx, page } = await open(browser, { hash: '#manualer' });
  await page.evaluate(() => { document.querySelector('.rail [data-role="admin"]').click(); });
  await page.waitForTimeout(150);
  await go(page, '#manualer');
  await page.click('.page-head [data-act="upload"]');
  await page.setInputFiles('#upFile', join(TEST, 'testpump.pdf'));
  await page.waitForSelector('.up-root .filecard', { timeout: 20000 });
  const sum = await txt(page, '.up-root .modal-b');
  expect(sum.includes('4 sidor'), 'fyra sidor lästa: ' + sum.slice(0, 200));
  expect(sum.includes('1 sida saknar'), 'skannad sida upptäckt');
  await page.screenshot({ path: SHOTS + '/21-uppladdning.png' });
  await page.click('[data-u="ocr"]');
  await page.waitForSelector('.up-root .notice.ok', { timeout: 20000 });
  expect((await txt(page, '.up-root .notice.ok')).includes('4 av 4'), 'OCR fyllde sista sidan: ' + await txt(page, '.up-root .notice.ok'));
  await page.click('[data-u="next"]');
  await page.click('[data-u="autofill"]');
  await page.waitForFunction(() => document.querySelector('#upName') && document.querySelector('#upName').value === 'Testpump X1', null, { timeout: 8000 });
  expect(await page.inputValue('#upVer') === 'Rev A', 'version gissad: ' + await page.inputValue('#upVer'));
  expect(await page.inputValue('#upIss') === '2025-06-01', 'datum gissat: ' + await page.inputValue('#upIss'));
  await page.fill('#upDept', 'Avdelning 24');
  await page.screenshot({ path: SHOTS + '/22-uppgifter.png' });
  await page.click('.up-root form .btn-primary');
  await page.waitForSelector('.up-root .notice.ok', { timeout: 8000 });
  const keys = await page.evaluate(() => [...window.__mockDocs.keys()]);
  expect(keys.some(k => k.startsWith('devices/testpump-x1')), 'enhet sparad: ' + keys.join(', '));
  expect(keys.some(k => /manuals\/m-testpump-x1-\w+\/parts\//.test(k)), 'manualdelar sparade');
  await page.click('[data-u="open"][data-tab="kort"]');
  await page.waitForSelector('[data-act="cardMake"]');
  await page.click('[data-act="cardMake"]');
  await page.waitForSelector('.qcard', { timeout: 8000 });
  expect((await txt(page, '.qcard-head')).includes('Utkast'), 'nytt kort är utkast');
  await page.click('[data-act="cardApprove"]');
  await page.waitForTimeout(300);
  expect((await txt(page, '.qcard-head')).includes('Granskat'), 'kort godkänt');
  // fråga mot uppladdad manual
  await page.click('[data-tab="fraga"]');
  await page.click('.shortcut >> nth=0');
  await page.waitForSelector('.msg-a .a-actions', { timeout: 8000 });
  expect((await txt(page, '.src >> nth=0')).includes('Citat kontrollerat'), 'citat verifieras mot uppladdad text');
  // larm som inte finns i registret -> textsökning + AI
  await page.click('[data-tab="larm"]');
  await page.fill('.alarm-input', 'Z-1');
  await page.click('.alarm-form .btn-primary');
  await page.waitForSelector('.alarm-card', { timeout: 8000 });
  expect((await txt(page, '.alarm-card')).includes('SENSORFEL'), 'AI-tolkat larm');
  await page.waitForTimeout(300);
  const man = await page.evaluate(() => [...window.__mockDocs].find(([k]) => /^manuals\/m-testpump[^/]+$/.test(k))[1]);
  expect(man.alarms && Object.keys(man.alarms).length === 1, 'larm sparat i registret: ' + JSON.stringify(man.alarms));
  expect(man.card && man.card.status === 'approved', 'kortstatus sparad');
  // ny version på exempelenhet
  await go(page, '#enhet-vac20');
  await page.click('[data-tab="manual"]');
  await page.click('#devPanel [data-act="upload"]');
  await page.setInputFiles('#upFile', join(TEST, 'testpump.pdf'));
  await page.waitForSelector('.up-root .filecard', { timeout: 20000 });
  await page.click('[data-u="next"]');
  await page.waitForSelector('#upVer');
  expect((await txt(page, '.up-root .modal-b')).includes('Nya larmkoder'), 'larmkodsjämförelse visas: ' + (await txt(page, '.up-root .modal-b')).slice(-300));
  await page.screenshot({ path: SHOTS + '/23-ny-version.png' });
  await page.fill('#upVer', 'Utgåva 3');
  await page.fill('#upIss', '2026-10-01');
  await page.click('.up-root form .btn-primary');
  await page.waitForSelector('.up-root .notice.ok', { timeout: 8000 });
  await page.click('.up-root [data-act="closeOverlay"] >> nth=0');
  await page.waitForTimeout(200);
  expect((await txt(page, '#devPanel')).includes('Utgåva 3'), 'ny version visas');
  expect((await txt(page, '#devPanel')).includes('Utgåva 2'), 'historik visar gamla versionen');
  await ctx.close();
});

await test('ovrigt', async () => {
  const { ctx, page } = await open(browser, { hash: '#fraga' });
  await page.click('[data-act="exampleQ"] >> nth=0');
  await page.waitForSelector('.msg-a .a-actions', { timeout: 8000 });
  expect(/Infusionspump|Patientmonitor/.test(await txt(page, '.src >> nth=0')), 'källan namnger enheten i alla-läget: ' + await txt(page, '.src >> nth=0'));
  await page.click('[data-act="deeper"]');
  await page.waitForFunction(() => document.querySelectorAll('.msg-a .a-actions').length === 2, null, { timeout: 8000 });
  const tiers = await page.evaluate(() => window.__aiCalls.map(c => c.tier));
  expect(tiers.includes('default'), 'noggrannare svar använder standardmodellen: ' + tiers.join(','));
  await page.click('[data-act="clearChat"]');
  expect(await page.locator('.msg-q').count() === 0, 'ny konversation');
  // omni
  await go(page, '#hem');
  await page.fill('#omni', 'ventilator');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => location.hash === '#enhet-aer5');
  // kort fråga med kod besvaras ur registret utan AI
  const before = await page.evaluate(() => window.__aiCalls.length);
  await page.fill('.composer textarea', 'Vad betyder V-215 och vad gör jag?');
  await page.keyboard.press('Enter');
  await page.waitForSelector('#devPanel .alarm-card');
  expect((await txt(page, '#devPanel .alarm-card')).includes('FLÖDESSENSOR FEL'), 'registersvar i chatten');
  expect(await page.evaluate(() => window.__aiCalls.length) === before, 'inget AI-anrop för registerkod');
  await go(page, '#hem');
  await page.fill('#omni', 'E-23');
  await page.keyboard.press('Enter');
  await page.waitForSelector('#alOut .alarm-card');
  await go(page, '#hem');
  await page.fill('#omni', 'hur rengör jag sugen efter användning');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.msg-a .a-actions', { timeout: 8000 });
  expect(await page.evaluate(() => location.hash) === '#fraga', 'omni ställer frågan i alla manualer');
  // ansvarig: redigera enhet
  await page.click('.rail [data-role="admin"]');
  await go(page, '#enhet-cardio12');
  expect((await txt(page, '#devPanel')).includes('Ingen manual är uppladdad'), 'enhet utan manual');
  await page.click('[data-act="editDevice"]');
  await page.fill('#edDept', 'Hjärtmottagning');
  await page.fill('#edMtP', '08-465 004 99');
  await page.click('.modal .btn-primary');
  await page.waitForTimeout(300);
  expect((await txt(page, '#devHead')).includes('Hjärtmottagning'), 'avdelning ändrad');
  expect((await txt(page, '#devHead')).includes('08-465 004 99'), 'MT-nummer ändrat');
  await go(page, '#enheter');
  expect((await txt(page, '#deptChips')).includes('Hjärtmottagning'), 'ny avdelning i filtret');
  // felanmälan avslutas, lucka besvaras med tips
  await go(page, '#granska');
  await page.click('[data-act="revTab"][data-tab="reports"]');
  await page.click('[data-act="reportClose"]');
  await page.fill('#noteTxt', 'Enheten hämtad för service.');
  await page.click('.modal .btn-primary');
  await page.waitForTimeout(300);
  expect((await txt(page, '#revBody')).includes('Inga öppna felanmälningar'), 'felanmälan avslutad');
  await page.click('[data-act="revTab"][data-tab="gaps"]');
  await page.waitForSelector('[data-act="gapTip"]');
  await page.click('[data-act="gapTip"] >> nth=0');
  await page.fill('#noteTxt', 'Beställs via förrådet, artikel 4471.');
  await page.click('.modal .btn-primary');
  await page.waitForTimeout(400);
  expect(await page.locator('#revBody .row').count() === 3, 'lucka besvarad');
  await go(page, '#enhet-vac20');
  await page.click('[data-tab="tips"]');
  expect((await txt(page, '#devPanel')).includes('artikel 4471'), 'tipset syns på enheten');
  expect(!(await txt(page, '#devHead')).includes('Öppen felanmälan'), 'ingen öppen felanmälan kvar på enheten');
  // exempeldata av och på, återställning
  await go(page, '#installningar');
  await page.click('[data-change="demoMode"]');
  await page.waitForTimeout(300);
  await go(page, '#enheter');
  expect(await page.locator('.tile').count() === 0, 'exempeldata dold');
  await page.screenshot({ path: SHOTS + '/37-tomt.png' });
  await go(page, '#oversikt');
  await page.waitForSelector('.kpis');
  await go(page, '#installningar');
  await page.click('[data-change="demoMode"]');
  await page.waitForTimeout(300);
  await page.click('[data-act="resetDemo"]');
  await page.click('.modal [data-x="yes"]');
  await page.waitForTimeout(500);
  await go(page, '#enhet-cardio12');
  expect((await txt(page, '#devHead')).includes('Akutmottagning'), 'exempelenhet återställd');
  const keys = await page.evaluate(() => [...window.__mockDocs.keys()]);
  expect(!keys.some(k => k === 'devices/cardio12'), 'överlagring borttagen: ' + keys.join(', '));
  expect(keys.some(k => k.startsWith('tips/')), 'eget tips finns kvar');
  await go(page, '#installningar');
  await page.click('[data-act="wipeOwn"]');
  await page.click('.modal [data-x="yes"]');
  await page.waitForTimeout(500);
  const keys2 = await page.evaluate(() => [...window.__mockDocs.keys()]);
  expect(!keys2.some(k => /^(tips|logs|audit|flags|reports)\//.test(k)), 'allt eget raderat: ' + keys2.join(', '));
  await ctx.close();
});

await test('pdf-utan-bakgrundstrad', async () => {
  // En bakgrundstråd som aldrig svarar: appen ska gå över till tolkning i sidans egen tråd.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.route(/^https?:\/\//, route => {
    const url = route.request().url();
    for (const [re, file] of LIB) if (re.test(url) && existsSync(file)) return route.fulfill({ path: file, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' } });
    if (/fonts\.googleapis/.test(url)) return route.fulfill({ body: '', contentType: 'text/css' });
    return route.abort();
  });
  await page.addInitScript(() => { window.Worker = class { constructor() {} postMessage() {} addEventListener() {} removeEventListener() {} terminate() {} }; });
  await page.addInitScript(o => { window.__MOCK_OPTS = o; }, {});
  await page.addInitScript({ path: join(TEST, 'mock.js') });
  await page.goto(DIST + '#manualer');
  await page.waitForFunction(() => !document.querySelector('#view > .skel'));
  await page.evaluate(() => { document.querySelector('.rail [data-role="admin"]').click(); });
  await page.waitForTimeout(200);
  await go(page, '#manualer');
  await page.click('.page-head [data-act="upload"]');
  await page.setInputFiles('#upFile', join(TEST, 'testpump.pdf'));
  await page.waitForSelector('.up-root .filecard', { timeout: 30000 });
  expect((await txt(page, '.up-root .modal-b')).includes('4 sidor'), 'PDF läst i sidans egen tråd');
  await ctx.close();
});

await test('natt-mobil', async () => {
  const { ctx, page } = await open(browser, { viewport: { width: 390, height: 800 }, hash: '#natt' });
  await page.waitForSelector('.ngrid');
  await page.screenshot({ path: SHOTS + '/24-natt.png' });
  await page.click('.nbtn >> nth=0');
  await page.waitForSelector('#nOut .a-body ol');
  await page.screenshot({ path: SHOTS + '/25-natt-start.png' });
  await page.click('.nbtn >> nth=1');
  await page.fill('#nCode', 'E-07');
  await page.click('#nOut .btn-primary');
  await page.waitForSelector('#nAl .alarm-card');
  await page.screenshot({ path: SHOTS + '/26-natt-larm.png' });
  await page.fill('#nQ', 'Hur låser jag knapparna?');
  await page.click('form[data-form="nAsk"] .btn-primary');
  await page.waitForSelector('#nOut .a-actions');
  await page.click('[data-act="nChange"]');
  await page.waitForSelector('.npick');
  await page.click('.npick button >> nth=1');
  await page.waitForSelector('.ngrid');
  await page.click('.nhead a');
  await page.waitForTimeout(150);
  expect(!(await page.evaluate(() => document.documentElement.classList.contains('night'))), 'nattklass tas bort');
  await page.screenshot({ path: SHOTS + '/27-hem-mobil.png' });
  await page.click('[data-act="more"]');
  await page.waitForSelector('.sheet');
  await page.screenshot({ path: SHOTS + '/28-mer.png' });
  await page.click('.sheet [data-role="admin"]');
  await go(page, '#oversikt');
  await page.waitForSelector('[data-chart="line"] svg');
  await page.screenshot({ path: SHOTS + '/29-oversikt-mobil.png', fullPage: false });
  await go(page, '#enhet-vistam5');
  await page.screenshot({ path: SHOTS + '/30-enhet-mobil.png' });
  await ctx.close();
});

await test('rundtur', async () => {
  const { ctx, page } = await open(browser);
  await page.click('.intro [data-act="tour"]');
  for (let i = 0; i < 11; i++) {
    await page.waitForSelector('.tour-pop .tour-prog');
    await page.waitForFunction(n => document.querySelector('.tour-pop .tour-prog').textContent.startsWith(String(n) + ' '), i + 1, { timeout: 6000 });
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${SHOTS}/t${String(i + 1).padStart(2, '0')}.png` });
    const hole = await page.evaluate(() => { const h = document.querySelector('.tour-hole'); return [h.offsetWidth, h.offsetHeight]; });
    if (i < 10) expect(hole[0] > 30 && hole[1] > 20, `steg ${i + 1} pekar på något: ${hole}`);
    await page.click('.tour-pop [data-t="next"]');
  }
  await page.waitForTimeout(300);
  expect(await page.locator('.tour-pop').count() === 0, 'rundturen avslutas');
  await ctx.close();
});

await test('rundtur-mobil', async () => {
  const { ctx, page } = await open(browser, { viewport: { width: 390, height: 800 } });
  await page.click('#topbarRight [data-act="tour"]');
  for (let i = 0; i < 11; i++) {
    await page.waitForFunction(n => document.querySelector('.tour-pop .tour-prog') && document.querySelector('.tour-pop .tour-prog').textContent.startsWith(String(n) + ' '), i + 1, { timeout: 6000 });
    await page.waitForTimeout(420);
    await page.screenshot({ path: `${SHOTS}/tm${String(i + 1).padStart(2, '0')}.png` });
    const box = await page.evaluate(() => { const p = document.querySelector('.tour-pop').getBoundingClientRect(); return [p.left, p.top, p.right, p.bottom, innerWidth, innerHeight]; });
    expect(box[0] >= 0 && box[1] >= 0 && box[2] <= box[4] + 1 && box[3] <= box[5] + 1, `steg ${i + 1}: rutan ligger inom skärmen ${box.map(Math.round)}`);
    await page.click('.tour-pop [data-t="next"]');
  }
  await page.waitForTimeout(300);
  expect(await page.locator('.tour-pop').count() === 0, 'rundturen avslutas');
  await ctx.close();
});

await test('utan-claude', async () => {
  const { ctx, page } = await open(browser, { noClaude: true, hash: '#enhet-aer5' });
  expect((await txt(page, '#banner')).includes('API-nyckel'), 'banner om API-nyckel');
  await page.click('.shortcut >> nth=0');
  await page.waitForSelector('.msg-a .a-actions');
  expect((await txt(page, '.msg-a')).includes('Förinspelat exempelsvar'), 'exempelsvar utan AI');
  expect((await txt(page, '.src')).includes('Citat kontrollerat'), 'exempelcitat verifierat');
  await page.fill('.composer textarea', 'Hur kalibrerar jag syrgascellen?');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.fallback-hit');
  await page.screenshot({ path: SHOTS + '/31-reservlage.png' });
  await page.click('[data-tab="kort"]');
  await page.click('[data-act="cardPdf"]');
  await page.waitForTimeout(800);
  await ctx.close();
});

/* Fristående läge: ingen Claude-miljö, lagring i webbläsaren och AI via Anthropic API (simulerat här). */
const sse = (text, stop = 'end_turn') => {
  const ev = (type, data) => `event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`;
  const parts = [text.slice(0, Math.ceil(text.length / 2)), text.slice(Math.ceil(text.length / 2))];
  return ev('message_start', { message: { id: 'msg_test', type: 'message', role: 'assistant', model: 'claude-opus-5-5', content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 1 } } })
    + ev('content_block_start', { index: 0, content_block: { type: 'text', text: '' } })
    + parts.map(t => ev('content_block_delta', { index: 0, delta: { type: 'text_delta', text: t } })).join('')
    + ev('content_block_stop', { index: 0 })
    + ev('message_delta', { delta: { stop_reason: stop, stop_sequence: null }, usage: { output_tokens: 50 } })
    + ev('message_stop', {});
};
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST, OPTIONS' };
await test('fristaende', async () => {
  const reqs = [];
  let status = 200;
  const api = async route => {
    const r = route.request();
    if (r.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    const body = r.postDataJSON(), h = await r.allHeaders();
    reqs.push({ body, key: h['x-api-key'] || String(h.authorization || '').replace(/^Bearer /, ''), browser: h['anthropic-dangerous-direct-browser-access'], beta: h['anthropic-beta'] });
    if (status !== 200) return route.fulfill({ status, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify({ type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } }) });
    const last = body.messages[body.messages.length - 1].content.map(b => b.text || '').join('\n');
    const out = /Ge sökord/.test(last) ? { sv: ['starta'], en: ['start'] }
      : { status: 'besvarad', svar: 'Så här startar du pumpen:\n1. Anslut nätkabeln och kontrollera att nätlampan lyser. [1]', kallor: [{ n: 1, manual: 'M1', sida: 4, avsnitt: '3.2 Starta pumpen', citat: '1. Anslut nätkabeln och kontrollera att nätlampan lyser' }], kontakta_mt: false, mt_orsak: '', typ: 'procedur' };
    return route.fulfill({ status: 200, headers: { ...CORS, 'content-type': 'text/event-stream' }, body: sse(JSON.stringify(out)) });
  };
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1 });
  let { page } = await open(browser, { noClaude: true, hash: '#enhet-flow300', api, ctx });
  expect((await txt(page, '#banner')).includes('API-nyckel'), 'banner ber om nyckel');
  await page.click('#banner [data-act="apiKey"]');
  await page.fill('#akKey', 'inte-en-nyckel');
  await page.click('.modal .btn-primary');
  expect(await page.locator('.modal').count() === 1, 'felaktig nyckel avvisas');
  await page.fill('#akKey', 'sk-ant-test-0000000000000000');
  await page.click('.modal .btn-primary');
  await page.waitForTimeout(150);
  expect(await page.locator('#banner .banner').count() === 0, 'bannern försvinner när nyckeln finns');
  await page.click('.shortcut >> nth=0');
  await page.waitForSelector('.msg-a .a-actions', { timeout: 8000 });
  expect((await txt(page, '.msg-a')).includes('Så här startar du pumpen'), 'svar från API visas');
  expect((await txt(page, '.src')).includes('Citat kontrollerat'), 'citatet kontrolleras mot manualen');
  const main = reqs.find(r => r.body.messages[0].content.length > 1);
  expect(main && main.key === 'sk-ant-test-0000000000000000' && main.browser === 'true', 'nyckel och webbläsarhuvud skickas');
  expect(main.body.model === 'claude-opus-5-5' && main.body.stream === true && main.body.fallbacks === 'default', 'modell, strömning och reservmodell: ' + JSON.stringify({ m: main.body.model, s: main.body.stream, f: main.body.fallbacks }));
  expect(/server-side-fallback-2026-07-01/.test(main.beta || ''), 'beta-huvud för reservmodell');
  expect(main.body.messages.length === 1 && main.body.messages[0].content[0].cache_control, 'två användarblock blir ett meddelande med cache på manualutdraget');
  await page.screenshot({ path: SHOTS + '/37-fristaende.png' });
  // inställning sparas i webbläsaren och finns kvar efter omladdning
  await page.click('.rail [data-role="admin"]');
  await go(page, '#installningar');
  await page.fill('#sOrg', 'Fristående sjukhuset');
  await page.click('form[data-form="settings"] .btn-primary');
  await page.waitForTimeout(1200); /* rollvalet sparas med fördröjning */
  await page.reload();
  await page.waitForFunction(() => !document.querySelector('#view > .skel'), null, { timeout: 15000 });
  await page.waitForTimeout(200);
  expect((await page.inputValue('#sOrg')) === 'Fristående sjukhuset', 'inställningen finns kvar efter omladdning');
  expect((await txt(page, '.kv')).includes('sk-ant-tes'), 'nyckeln finns kvar efter omladdning');
  // nyckel som inte godtas
  status = 401;
  await go(page, '#enhet-flow300');
  await page.fill('.composer textarea', 'Hur rengör jag pumpen?');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => /API-nyckeln godtogs inte/.test(document.body.innerText), null, { timeout: 8000 });
  errors = errors.filter(e => !/status of 401/.test(e)); /* webbläsaren loggar det avsiktliga 401-svaret */
  await ctx.close();
});

await test('skrivskyddad-och-aifel', async () => {
  const { ctx, page } = await open(browser, { mock: { readOnly: true, aiError: 'rate_limited' }, hash: '#enhet-vistam5' });
  expect((await txt(page, '#banner')).includes('Skrivskyddad'), 'banner om skrivskydd');
  await page.click('[data-tab="tips"]');
  await page.fill('textarea[name="text"]', 'Testtips i skrivskyddat läge');
  await page.click('form[data-form="tip"] .btn-primary');
  await page.waitForTimeout(250);
  expect((await txt(page, '#devPanel')).includes('Testtips'), 'tips finns i minnet');
  await page.click('[data-tab="fraga"]');
  await page.fill('.composer textarea', 'How do I clean the screen?');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.notice.warn');
  expect((await txt(page, '.msg-a')).includes('för många frågor'), 'felmeddelande vid rate limit');
  await ctx.close();
});

await test('morkt-tema', async () => {
  const { ctx, page } = await open(browser, { theme: 'dark', hash: '#enhet-flow300' });
  await page.click('.shortcut >> nth=0');
  await page.waitForSelector('.msg-a .a-actions');
  await page.screenshot({ path: SHOTS + '/32-morkt.png' });
  await go(page, '#om');
  await page.screenshot({ path: SHOTS + '/33-om-morkt.png' });
  await ctx.close();
});

await test('om-ljust', async () => {
  const { ctx, page } = await open(browser, { hash: '#om' });
  await page.screenshot({ path: SHOTS + '/34-om.png' });
  await page.evaluate(() => { document.querySelector('#main').scrollTop = 700; });
  await page.screenshot({ path: SHOTS + '/35-om-2.png' });
  await page.evaluate(() => { document.querySelector('#main').scrollTop = 1500; });
  await page.screenshot({ path: SHOTS + '/36-om-3.png' });
  await ctx.close();
});

await browser.close();
let bad = 0;
for (const [st, name, ms, errs] of results) {
  console.log(`${st.padEnd(7)} ${name} (${ms} ms)`);
  if (st !== 'ok') { bad++; errs.forEach(e => console.log('   ' + e.split('\n').join('\n   '))); }
}
console.log(bad ? `\n${bad} test med problem` : '\nAlla tester gick igenom');
process.exit(bad ? 1 : 0);
