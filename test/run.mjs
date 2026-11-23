import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/* Sökvägar räknas från testmappen. Playwright och Chrome kan pekas ut med PLAYWRIGHT och CHROME. */
const TEST = dirname(fileURLToPath(import.meta.url)), ROOT = dirname(TEST);
const DIST = pathToFileURL(join(ROOT, 'dist/index.html')).href;
const SHOTS = join(TEST, 'shots');
mkdirSync(SHOTS, { recursive: true });
const nm = p => join(TEST, 'node_modules', p);
/* Anthropic-SDK:n hämtas från jsDelivr i webbläsaren. I testerna buntas samma version lokalt. */
const SDK_BUNDLE = nm('.cache/anthropic-sdk.mjs');
/* esbuild anropas via sitt JavaScript-gränssnitt, så att det fungerar på Windows, Mac och Linux. */
if (!existsSync(SDK_BUNDLE)) {
  const esbuild = await import('esbuild');
  await esbuild.build({ entryPoints: [nm('@anthropic-ai/sdk/index.mjs')], bundle: true, format: 'esm', platform: 'browser', logLevel: 'warning', outfile: SDK_BUNDLE });
}
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
    if (api && /api\.anthropic\.com|127\.0\.0\.1:9999/.test(url)) return api(route);
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
  if (only === '--enhet' ? !name.endsWith('-enhet') : only && !name.includes(only)) return;
  errors = [];
  const t0 = Date.now();
  try { await fn(); results.push([errors.length ? 'ERRORS' : 'ok', name, Date.now() - t0, errors.slice()]); }
  catch (e) { results.push(['FAIL', name, Date.now() - t0, [String(e && e.stack || e).split('\n').slice(0, 6).join('\n'), ...errors]]); }
}
const expect = (cond, msg) => { if (!cond) throw new Error('Förväntan: ' + msg); };
const txt = async (page, sel) => (await page.locator(sel).first().innerText()).trim();
const go = async (page, hash) => { await page.evaluate(h => { location.hash = h; }, hash); await page.waitForTimeout(120); };

/* Enhetens skiftläge räknas: "mA" i manualen godtas inte som "MA" i citatet, och tvärtom. */
await test('lokal-enhet', async () => {
  const vm = await import('node:vm'), box = {};
  vm.runInNewContext(readFileSync(join(TEST, '..', 'src/js/03-text.js'), 'utf8') + ';this.strictSpan = strictSpan;', box);
  const r = [box.strictSpan('Ström högst 10 mA vid test.', 'Ström högst 10 MA vid test'), box.strictSpan('Ström högst 10 mA vid test.', 'ström högst 10 mA vid test'), box.strictSpan('Använd inte larmet!', 'Använd inte larmet?'), box.strictSpan('mA är inställd enhet.', 'MA är inställd enhet'), box.strictSpan('Temperatur −10 till 40 °C.', 'Temperatur -10 till 40 °C'), box.strictSpan('Temperatur −10 till 40 °C.', 'Temperatur −10 till 40 °C')];
  expect(r[0] === null, 'mA och MA skiljs åt');
  expect(r[1] === null, 'skiftläget gäller även första bokstaven');
  expect(r[2] === null, 'skiljetecken i slutet måste stämma');
  expect(r[3] === null, 'MA godtas inte för mA i början av citatet');
  expect(r[4] === null, 'bindestreck godtas inte för minustecken');
  expect(r[5] && r[5].start === 0, 'korrekt minustecken godtas');
  const page = 'Håll avståndet minst 1,5 meter från patienten.';
  expect(box.strictSpan(page, 'Håll avståndet minst 1', 0, 22) === null, 'ett utdrag som slutar mitt i 1,5 ger inget citat');
  expect(box.strictSpan(page, 'Håll avståndet minst 1,5 meter', 0, 40) !== null, 'hela talet inom fönstret godtas');
});

await test('a456-enhet', async () => {
  const vm = await import('node:vm');
  const events = { addEventListener() {} };
  const box = { V: {}, UI: {}, S: { caps: {} }, STANDALONE: null, document: events, window: events };
  for (const file of ['01-util', '03-text', '04-ai', '05-ui', '07-admin']) {
    vm.runInNewContext(readFileSync(join(ROOT, 'src/js', file + '.js'), 'utf8'), box);
  }
  const { findPNR, matchAlarm, codeRegex, csvCell, alarmEvidence, isCodeQuery } = box;
  const looksLikeCode = vm.runInNewContext('looksLikeCode', box);
  const maskPNR = vm.runInNewContext('maskPNR', box);
  const masked = maskPNR('Patient 19900101-0017 och −20 °C, 900101–0017.');
  expect(masked.count === 2 && !findPNR(masked.text).length && masked.text.includes('−20 °C'), 'personnummer maskeras och minustecknet behålls: ' + masked.text);
  for (const value of ['９００１０１－００１７', '199001010017', '9001010017', '1990-01-01-0000',
    ...['–', '—', '‑', '−', '.', '/', ' ', '+'].map(s => '900101' + s + '0000')]) {
    expect(findPNR('Text: ' + value + '.').length === 1, 'spärrar formatet ' + value);
  }
  expect(findPNR('1990-01-01, 9001010000 och 1900101001700').length === 0, 'datum, kompakt tal med fel kontrollsiffra och längre tal släpps igenom');
  const alarms = { 'E-07': { label: 'Testlarm' } };
  for (const code of ['E7', 'E-7', 'E-07']) {
    expect(matchAlarm(alarms, code)?.key === 'E-07', 'registret matchar ' + code);
    expect(codeRegex(code).test('Larm E-07: testlarm'), 'manualen matchar ' + code);
    expect(!codeRegex(code).test('Larm E-070, XE-07 och E-07A'), 'hela koden måste matcha');
  }
  /* E7 och E-07 med olika betydelse i samma register: exakt kod vinner, annars ingen gissning. */
  const both = { 'E-07': { label: 'Sju med nolla' }, 'E7': { label: 'Sju utan nolla' } };
  expect(matchAlarm(both, 'E7')?.key === 'E7' && matchAlarm(both, 'E-07')?.key === 'E-07', 'exakt kod väljs före nollnormalisering');
  expect(matchAlarm(both, 'E007') === null, 'tvetydig nollnormalisering ger ingen träff');
  expect(matchAlarm(alarms, 'E-8') === null, 'saknad kod i registret');
  for (const value of ['PEEP 5', 'sida 12', '123']) expect(!looksLikeCode(value), 'ingen kod för ' + value);
  const device = { name: 'Infusionspump Flow 300', model: 'Flow 300' };
  Object.assign(box, {
    devices: () => [device], manualFor: () => ({}),
    pagesOf: async () => [{ n: 1, text: 'E-07: Testlarm' }]
  });
  const messages = [];
  const fields = new Map([['what', 'Testfel'], ['code', '１９９０‑０１‑０１／００００']]);
  Object.assign(box, {
    FormData: function () { return fields; },
    deviceById: () => device,
    addDoc: () => { throw new Error('Felanmälan får inte sparas med personnummer i kodfältet'); }
  });
  vm.runInNewContext('toast = msg => messages.push(msg)', Object.assign(box, { messages }));
  await vm.runInNewContext("FORM.report({ dataset: { id: 'test' } })", box);
  expect(messages.some(msg => msg.includes('personnummer')), 'felanmälans kodfält kontrolleras före lagring');
  expect(!isCodeQuery('Flow 300'), 'modellen behandlas som enhet');
  expect((await alarmEvidence('E7')).textHits?.length === 1, 'en kod i manualen räcker som belägg');
  expect((await alarmEvidence('E8')).notFound, 'saknad kod ger inget belägg');
  box.manualFor = () => ({ alarms: both });
  expect((await alarmEvidence('E7')).results[0]?.key === 'E7' && (await alarmEvidence('E-07')).results[0]?.key === 'E-07', 'larmuppslaget väljer exakt kod när E7 och E-07 båda finns');
  box.manualFor = () => ({});
  for (const value of ['=1+2', '  +1', '-1', '@SUM(A1)', '＝1', '\ttext', '\rtext', '\ntext']) {
    expect(csvCell(value) === '"' + "'" + value + '"', 'CSV neutraliserar ' + JSON.stringify(value));
  }
  expect(csvCell('Text;"citat"') === '"Text;""citat"""', 'CSV behåller avgränsare och citattecken i samma cell');
});

if (only === '--enhet' || only.endsWith('-enhet')) finish();
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright').catch(() => import('/opt/npm-tools/node_modules/playwright/index.mjs'));
await makePdf();
const CHROME = process.env.CHROME || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : '');
const browser = await chromium.launch(CHROME ? { executablePath: CHROME, args: ['--no-sandbox'] } : {});

await test('a5-omnisök', async () => {
  const { ctx, page } = await open(browser);
  for (const query of ['Vac 20', 'Flow 300', 'Aer 5', 'PEEP 5', 'sida 12', '123', 'Q-9999']) {
    await page.fill('#omni', query);
    await page.waitForSelector('#omniSug .omni-sug');
    expect(await page.locator('#omniSug [data-act="omniCode"]').count() === 0, 'inget larmuppslag för ' + query);
  }
  await page.fill('#omni', 'Vac 20');
  await page.keyboard.press('Enter');
  await page.waitForURL(/#enhet-vac20$/);
  await ctx.close();
});

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
  /* Svaret är manualens egen text: ett utdrag med källrad och markerade rader, ingen AI-text. */
  const body = await txt(page, '.msg-a');
  expect(await page.locator('.msg-a .excerpt').count() >= 1, 'utdrag ur manualen visas: ' + body.slice(0, 80));
  expect(await page.locator('.msg-a .excerpt mark').count() >= 1, 'raderna som besvarar frågan är markerade');
  expect((await txt(page, '.msg-a .ex-ref')).includes('Sida'), 'källraden anger sida');
  expect(!/AI:n har valt|formulerat av AI|Urval gjort av AI|Så här gör du/.test(body), 'ingen AI-text eller AI-märke i svaret');
  expect(!(await page.locator('[data-act="deeper"], [data-act="stepsMsg"], .a-body').count()), 'ingen AI-skriven text, inga knappar för AI-svar');
  await page.screenshot({ path: SHOTS + '/03-chatt.png' });
  await page.click('.msg-a .excerpt >> nth=0');
  await page.waitForSelector('.drawer .paper mark');
  expect((await txt(page, '.drawer .paper-head')).includes('Citatet står här'), 'källvisare markerar utdraget');
  await page.screenshot({ path: SHOTS + '/04-kalla.png' });
  await page.click('.drawer [data-pg="1"]');
  await page.keyboard.press('Escape');
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
  const none = await txt(page, '.msg-a >> nth=1');
  expect(none.includes('Inget utdrag i manualen besvarar frågan') && !(await page.locator('.msg-a >> nth=1').locator('.excerpt').count()), 'saknas: fast rad och inget utdrag: ' + none.slice(0, 80));
  expect(await page.locator('.msg-a >> nth=1').locator('.mtcard').count() === 1, 'MT-kort vid saknas');
  // klinisk fråga
  await page.fill('.composer textarea', 'Vilken dos ska patienten ha?');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.a-status.avvisad');
  /* Patientfrågan stoppas före larmuppslag, sökträffar och AI. */
  const av = page.locator('.msg-a').filter({ has: page.locator('.a-status.avvisad') });
  expect(!(await av.locator('.fallback-hit, .hits-more').count()), 'inga sökträffar efter en patientfråga');
  expect(!(await page.evaluate(() => window.__aiCalls.some(c => JSON.stringify(c.input).includes('Vilken dos')))), 'patientfrågan skickas inte till AI');
  // personnummer
  await page.fill('.composer textarea', 'Patient 19121212-1212 har larm');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.notice.crit');
  expect((await page.inputValue('.composer textarea')).includes('1212'), 'texten ligger kvar efter spärr');
  // AI:n gör ingen egen MT-bedömning: svaret är utdrag eller en fast rad med kontakt till MT
  await page.fill('.composer textarea', 'Pumpen visar tekniskt fel');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelectorAll('.msg-a .a-actions').length === 4, null, { timeout: 8000 });
  expect(!(await page.locator('.mtcard:not(.soft)').count()), 'inget AI-bedömt MT-kort');
  expect(!(await page.evaluate(() => window.__aiCalls.some(c => JSON.stringify(c.input).includes('Vilken dos')))), 'den avvisade patientfrågan följer inte med som tidigare fråga');
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
  /* Larmkortet visar manualens larmstycke, inte registrets omskrivning. */
  const at = await txt(page, '.alarm-card');
  expect(at.includes('Orsak: Stängd rullklämma') && at.includes('enligt lokal rutin') && !at.includes('Det är stopp i slangen'), 'larmkortet är ordagrant: ' + at.slice(0, 160));
  await page.screenshot({ path: SHOTS + '/07-larm.png' });
  /* Steg för steg ur ett granskat larmregister. */
  await page.click('[data-act="alarmSteps"]');
  await page.waitForSelector('.steps .steps-t');
  await page.screenshot({ path: SHOTS + '/05-steg.png' });
  for (let i = 0; i < 12 && (await page.locator('.steps').count()); i++) await page.click('.steps [data-s="n"]');
  expect(await page.locator('.steps').count() === 0, 'stegläge stängs efter sista steget');
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
  await page.fill('#rpCode', '１９９０‑０１‑０１／００００');
  const submit = page.locator('.modal .btn-primary');
  await submit.focus();
  await page.keyboard.press('Tab');
  expect(await page.locator('.modal [aria-label="Stäng"]').evaluate(el => el === document.activeElement), 'Tab stannar i dialogen');
  await page.keyboard.press('Shift+Tab');
  expect(await submit.evaluate(el => el === document.activeElement), 'Skift+Tab går till dialogens sista knapp');
  await submit.click();
  await page.waitForSelector('.toast.crit');
  expect(await page.locator('form[data-form="report"]').count() === 1, 'personnummer i kodfältet stoppar felanmälan');
  await page.fill('#rpCode', 'Err 11');
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
  /* Exempelkortet består av manualens egna rader. */
  const qt = await txt(page, '.qcard');
  expect(qt.includes('Anslut nätkabeln och kontrollera att nätlampan lyser.') && !qt.includes('Nätlampan ska lysa.'), 'exempelkortet är ordagrant: ' + qt.slice(0, 200));
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

/* Ett personnummer inne i en uppladdad textfil tas bort innan texten används. */
await test('uppladdning-pnr', async () => {
  const { ctx, page } = await open(browser, { hash: '#manualer' });
  await page.evaluate(() => { document.querySelector('.rail [data-role="admin"]').click(); });
  await page.waitForTimeout(150);
  await go(page, '#manualer');
  await page.click('.page-head [data-act="upload"]');
  await page.setInputFiles('#upFile', { name: 'manual.txt', mimeType: 'text/plain', buffer: Buffer.from('Bruksanvisning Testpump\n\nAnslut nätkabeln. Testad på patient 19900101-0017 vid avdelning 4.\n\nRengör med fuktig duk.') });
  await page.waitForSelector('.up-root .filecard', { timeout: 20000 });
  const t = await txt(page, '.up-root .modal-b');
  expect(t.includes('Personnummer togs bort ur texten') && !t.includes('19900101-0017'), 'användaren ser att personnumret togs bort: ' + t.slice(0, 200));
  await page.screenshot({ path: SHOTS + '/41-pnr-uppladdning.png' });
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
  /* Varje rad på kortet ska stå ordagrant i den uppladdade manualen. */
  const cardRows = await page.locator('.qcard li').allInnerTexts();
  const manText = await page.evaluate(() => [...window.__mockDocs].filter(([k]) => /^manuals\/m-testpump[^/]+\/parts\//.test(k)).map(([, v]) => JSON.stringify(v)).join(' '));
  const norm = x => x.replace(/\s+/g, ' ').replace(/ ?Manual sida \d+(, OCR)?$/, '').replace(/ \(OCR\)$/, '').trim();
  expect(cardRows.length > 0, 'kortet har rader');
  for (const r of cardRows) expect(norm(manText.replace(/\\n/g, ' ')).includes(norm(r)), 'raden finns ordagrant i manualen: ' + r);
  /* Personalen ser inte AI-skrivna utkast. */
  await page.click('.rail [data-role="staff"]');
  await page.waitForTimeout(200);
  expect(!(await page.locator('.qcard').count()) && (await txt(page, '#devPanel')).includes('Snabbkortet granskas'), 'utkastet döljs för personal');
  await page.click('.rail [data-role="admin"]');
  await page.waitForSelector('.qcard');
  await page.click('[data-act="cardApprove"]');
  await page.waitForTimeout(300);
  expect((await txt(page, '.qcard-head')).includes('Granskat'), 'kort godkänt');
  // fråga mot uppladdad manual
  await page.click('[data-tab="fraga"]');
  await page.click('.shortcut >> nth=0');
  await page.waitForSelector('.msg-a .a-actions', { timeout: 8000 });
  expect((await txt(page, '.msg-a .excerpt >> nth=0')).includes('Testpump'), 'utdraget kommer ur den uppladdade manualen: ' + (await txt(page, '.msg-a')).slice(0, 120));
  // larm som inte finns i registret -> manualens egen text, ingen AI-tolkning och inget sparas
  await page.click('[data-tab="larm"]');
  await page.fill('.alarm-input', 'Z-1');
  await page.click('.alarm-form .btn-primary');
  await page.waitForSelector('#devPanel .fallback-hit', { timeout: 8000 });
  const zt = await txt(page, '#devPanel .fallback-hit');
  expect(zt.includes('SENSORFEL') && zt.includes('Torka av sensorn'), 'larmstycket visas ordagrant: ' + zt.slice(0, 80));
  expect(!(await page.locator('#devPanel .alarm-card').count()), 'inget AI-tolkat larmkort');
  await page.waitForTimeout(300);
  const man = await page.evaluate(() => [...window.__mockDocs].find(([k]) => /^manuals\/m-testpump[^/]+$/.test(k))[1]);
  expect(!man.alarms || !Object.keys(man.alarms).length, 'inget sparas i larmregistret: ' + JSON.stringify(man.alarms));
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
  expect(/Infusionspump|Patientmonitor/.test(await txt(page, '.msg-a .ex-ref >> nth=0')), 'källraden namnger enheten i alla-läget: ' + await txt(page, '.msg-a'));
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
  /* Utan AI: sökträffar ur manualen, aldrig förinspelade eller egenskrivna svar. */
  await page.click('.shortcut >> nth=0');
  await page.waitForSelector('.msg-a .fallback-hit');
  expect((await txt(page, '.msg-a')).includes('Sökning utan AI') && !(await page.locator('.msg-a .a-body').count()), 'sökträffar utan AI-text');
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
    if (status !== 200) {
      const error = status === 401 ? { type: 'authentication_error', message: 'invalid x-api-key' }
        : status === 4001 ? { type: 'invalid_request_error', message: 'Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits.' }
        : { type: 'invalid_request_error', message: 'testfel: okänd parameter' };
      return route.fulfill({ status: status === 4001 ? 400 : status, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify({ type: 'error', error }) });
    }
    const last = body.messages[body.messages.length - 1].content.map(b => b.text || '').join('\n');
    const all = body.messages.map(mm => mm.content.map(b => b.text || '').join('\n')).join('\n');
    const line = (all.match(/^\[(S\d+)\] [^\n]*Anslut nätkabeln[^\n]*$/m) || [])[1];
    const out = /Ge sökord/.test(last) ? { sv: ['starta'], en: ['start'] }
      : { status: 'besvarad', rader: line ? [line] : [] };
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
  expect((await txt(page, '.msg-a .excerpt mark')).includes('Anslut nätkabeln'), 'utdrag med raden som API:t pekade ut: ' + (await txt(page, '.msg-a')).slice(0, 120));
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
  // kreditfel (Anthropic svarar 400) ger ett tydligt meddelande
  status = 4001;
  await page.fill('.composer textarea', 'Hur byter jag slangen?');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => /saknar krediter/.test(document.body.innerText), null, { timeout: 8000 });
  // okänt fel visar tjänstens eget felmeddelande
  status = 400;
  await page.fill('.composer textarea', 'Hur stänger jag av pumpen?');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => /Fel från tjänsten: .*testfel/.test(document.body.innerText), null, { timeout: 8000 });
  /* webbläsaren loggar de avsiktliga felsvaren */
  errors = errors.filter(e => !/status of 40[01]/.test(e));
  await ctx.close();
});

/* Skrivbordsversionen: appen hittar en lokal llama-server och skickar frågan dit, aldrig till internet.
   localApi bygger en låtsasserver. make(text, utdragsId) ger modellens JSON (objekt) eller en råsträng,
   till exempel avbruten JSON. */
function localApi(make, { finish = 'stop', nCtx = 4096, tooLarge = 0 } = {}) {
  const reqs = [], other = [];
  const api = async route => {
    const r = route.request(), u = r.url();
    if (/api\.anthropic\.com/.test(u)) { other.push(u); return route.abort(); }
    if (r.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    if (u.endsWith('/props')) return route.fulfill({ status: 200, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify({ model_path: '/modeller/Testmodell-4B-Q4_K_M.gguf', default_generation_settings: { n_ctx: nCtx } }) });
    const body = r.postDataJSON();
    reqs.push(body);
    /* Låtsas att servern har mindre kontext än den uppgav: längre prompter avvisas. */
    if (tooLarge && body.messages[0].content.length > tooLarge) return route.fulfill({ status: 400, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify({ error: { message: 'the request exceeds the available context size' } }) });
    const text = body.messages.map(m => m.content).join('\n');
    /* Id för den rad i prompten som innehåller en viss text, och alla id:n i samma stycke. */
    const idOf = needle => { const m = text.split('\n').find(l => /^\[S\d+\] /.test(l) && l.includes(needle)); return m ? m.match(/^\[(S\d+)\]/)[1] : 'S1'; };
    idOf.block = needle => { const blk = text.split(/\n(?=--- )/).find(b => b.includes(needle)) || ''; return [...blk.matchAll(/^\[(S\d+)\] (.*)$/gm)].map(m => ({ id: m[1], text: m[2] })); };
    const out = body.max_tokens === 1 ? 'x' : make(text, idOf);
    const js = typeof out === 'string' ? out : JSON.stringify(out), half = Math.ceil(js.length / 2);
    const ev = d => 'data: ' + JSON.stringify({ choices: [{ delta: { content: d }, finish_reason: null }] }) + '\n\n';
    const fin = typeof finish === 'function' ? finish() : finish;
    const end = fin === null ? '' : 'data: ' + JSON.stringify({ choices: [{ delta: {}, finish_reason: fin }] }) + '\n\ndata: [DONE]\n\n';
    return route.fulfill({ status: 200, headers: { ...CORS, 'content-type': 'text/event-stream' }, body: ev(js.slice(0, half)) + ev(js.slice(half)) + end });
  };
  return { api, reqs, other };
}
async function localPage(api, { key = '', override = 'http://127.0.0.1:9999', hash = '#enhet-flow300', setup = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1 });
  if (setup) await setup(ctx);
  await ctx.addInitScript(o => { try { if (o.override) localStorage.setItem('lotsa:localAi', o.override); if (o.key) localStorage.setItem('lotsa:apiKey', o.key); } catch (e) { /* inget */ } }, { override, key });
  const { page } = await open(browser, { noClaude: true, hash, api, ctx });
  return { ctx, page };
}
/* Ställer en fråga i enhetens chatt och väntar tills svaret (eller reservläget) är klart. */
async function askChat(page, q) {
  const n = await page.locator('.msg-a').count();
  if (!(await page.locator('.composer textarea').count())) await page.click('[data-tab="fraga"]');
  await page.fill('.composer textarea', q);
  await page.keyboard.press('Enter');
  await page.waitForFunction(n => document.querySelectorAll('.msg-a').length > n && !document.querySelector('.msg-a .typing'), n, { timeout: 8000 });
  return page.locator('.msg-a').last();
}
const ok = (ids, extra = {}) => ({ status: 'besvarad', rader: [].concat(ids), ...extra });

await test('lokal', async () => {
  const { api, reqs, other } = localApi((text, idOf) => ok([idOf('Anslut nätkabeln och kontrollera'), idOf('Tryck på PÅ/AV')]));
  const { ctx, page } = await localPage(api);
  expect(!(await txt(page, '#banner').catch(() => '')).includes('API-nyckel'), 'ingen banner om API-nyckel i lokalt läge');
  await page.waitForTimeout(200);
  const warm = reqs.find(r => r.max_tokens === 1);
  expect(warm, 'manualen läses in i förväg när enheten öppnas');
  await page.click('.shortcut >> nth=0');
  await page.waitForSelector('.msg-a .a-actions', { timeout: 8000 });
  const shown = await txt(page, '.msg-a');
  expect(shown.includes('Text ur tillverkarens bruksanvisning, oförändrad') && !/Urval gjort av AI|AI:n har valt/.test(shown), 'utdraget är märkt som tillverkarens text, utan AI-märken');
  expect((await txt(page, '.msg-a .excerpt mark >> nth=0')).startsWith('Anslut nätkabeln'), 'vald rad markeras i stycket');
  expect((await page.locator('.msg-a .excerpt mark:not(.warn)').count()) === 2, 'två valda rader markeras');
  expect((await txt(page, '.msg-a .ex-ref')).includes('Sida 4'), 'källraden anger sidan');
  expect(await page.locator('.msg-a details.hits-more').count() === 1, 'sökträffarna finns kvar under svaret');
  const main = reqs.filter(r => r.max_tokens !== 1).pop();
  const schema = main.response_format && main.response_format.json_schema && main.response_format.json_schema.schema;
  expect(schema && schema.properties.rader.items.enum.length > 20 && !schema.properties.svar, 'modellen får bara välja rad-id:n, ingen egen text');
  expect(main.max_tokens <= 200, 'kort utdata: ' + main.max_tokens);
  expect(main.messages[0].content.length / 2.4 + main.max_tokens < 4096, 'prompten ryms i serverns kontext (4096): ' + main.messages[0].content.length);
  expect(main.messages[0].content.startsWith(warm.messages[0].content.replace(/Fråga: $/, '')), 'samma prompt som förvärmningen, så inläsningen återanvänds');
  expect(main.chat_template_kwargs && main.chat_template_kwargs.enable_thinking === false, 'tänkläge av');
  expect(other.length === 0, 'inga anrop till Anthropic');
  await page.screenshot({ path: SHOTS + '/38-lokal.png' });
  await page.click('.rail [data-role="admin"]');
  await go(page, '#installningar');
  const kv = await txt(page, '.kv');
  expect(kv.includes('Lokal AI på den här datorn (Testmodell-4B-Q4_K_M)'), 'inställningarna visar den lokala modellen');
  expect(kv.includes('Röstinmatning') && kv.includes('Inte tillgänglig'), 'webbläsarens taligenkänning är avstängd i lokalt läge');
  await ctx.close();
});

/* Motsägelser och ogiltiga id:n ger reservläget. Varningar i stycket markeras alltid. */
await test('lokal-strikt', async () => {
  let mode = 'tom';
  const { api, other } = localApi((text, idOf) => {
    if (mode === 'tom') return ok([]);
    if (mode === 'okant') return ok(['S9999']);
    if (mode === 'blandat') return ok([idOf('MR-miljö'), 'S9999']);
    if (mode === 'motsagelse') return { status: 'saknas', rader: [idOf('MR-miljö')] };
    if (mode === 'avvisad') return { status: 'avvisad', rader: [] };
    if (mode === 'saknas') return { status: 'saknas', rader: [] };
    /* En annan rad i samma stycke som OBS-raden om MR: OBS-raden ska ändå synas som varning. */
    const blk = idOf.block('MR-miljö'), other = blk.find(x => !x.text.includes('MR-miljö'));
    return ok(mode === 'granne' ? [other.id] : [idOf('MR-miljö')]);
  });
  const { ctx, page } = await localPage(api);
  const fallback = async (q, what) => {
    const t = await (await askChat(page, q)).innerText();
    expect(t.includes('Sökning utan AI') && !(await page.locator('.msg-a').last().locator('.excerpt').count()), what + ': sökning utan AI visas');
  };
  await fallback('Får pumpen användas vid MR-undersökning?', 'besvarad utan rader');
  mode = 'okant'; await fallback('Får pumpen användas vid MR?', 'okänt id');
  mode = 'motsagelse'; await fallback('Får pumpen användas i MR-miljö?', 'saknas med rader');
  mode = 'avvisad';
  let t = await (await askChat(page, 'Vilken hastighet ska min patient ha?')).innerText();
  expect(t.includes('Lotsa gör inga kliniska bedömningar'), 'fast text vid avvisad fråga');
  mode = 'saknas';
  t = await (await askChat(page, 'Hur kopplar jag pumpen till wifi?')).innerText();
  expect(t.includes('Inget utdrag i manualen besvarar frågan'), 'fast text vid saknas');
  mode = 'ratt';
  t = await (await askChat(page, 'Får pumpen användas i MR-miljö?')).innerText();
  expect(t.includes('Text ur tillverkarens bruksanvisning') && t.includes('får inte användas i MR-miljö'), 'rätt rad visas: ' + t.slice(0, 120));
  mode = 'blandat';
  await fallback('Får pumpen användas nära MR?', 'ett giltigt och ett okänt id');
  mode = 'granne';
  const a = await askChat(page, 'Vad säger manualen om anestesigaser?');
  expect((await a.locator('.excerpt mark.warn').count()) >= 1, 'OBS-raden i stycket markeras som varning');
  await a.scrollIntoViewIfNeeded();
  await page.screenshot({ path: SHOTS + '/40-lokal-varning.png' });
  expect(other.length === 0, 'inga anrop till Anthropic');
  await ctx.close();
});

/* Liten kontext: bara utvalda stycken skickas. Avvisar servern prompten ändå provas ett mindre urval. */
await test('lokal-kontext', async () => {
  const pick = (text, idOf) => ok([idOf('MR-miljö')]);
  let r = localApi(pick, { nCtx: 1200 });
  let { ctx, page } = await localPage(r.api);
  let t = await (await askChat(page, 'Får pumpen användas i MR-miljö?')).innerText();
  const main = r.reqs.filter(x => x.max_tokens !== 1);
  expect(t.includes('får inte användas i MR-miljö') && !r.reqs.some(x => x.max_tokens === 1), 'urval utan förvärmning vid liten kontext: ' + r.reqs.map(x => x.max_tokens).join(',') + ' ' + t.slice(0, 160));
  expect(main[0].messages[0].content.length < 3000, 'prompten krymper efter kontexten: ' + main[0].messages[0].content.length);
  await ctx.close();
  r = localApi(pick, { tooLarge: 6500 });
  ({ ctx, page } = await localPage(r.api));
  t = await (await askChat(page, 'Får pumpen användas i MR-miljö?')).innerText();
  expect(t.includes('får inte användas i MR-miljö') && !t.includes('Sökning utan AI'), 'kontextfel ger ett nytt försök med mindre urval: ' + t.slice(0, 120));
  errors = errors.filter(e => !/status of 400/.test(e)); /* det avsiktliga kontextfelet */
  await ctx.close();
  /* Styckning: en fristående VARNING-rad är ingen rubrik, och raden efter är en varning. */
  const vm = await import('node:vm'), box = { S: { caps: {} } };
  const ai = readFileSync(join(ROOT, 'src/js/04-ai.js'), 'utf8');
  vm.runInNewContext(ai.slice(ai.indexOf('const WARN_RE'), ai.indexOf('async function buildLocalContext')) + ';this.c = chunksOf; this.u = unitsOf;', box);
  const page4 = { n: 4, text: '4 Rengöring\n\nVARNING\nKoppla bort nätkabeln före rengöring.\n\nTorka pumpen med en fuktig duk.' };
  const cs = box.c({ id: 'x' }, [page4]);
  const units = cs.flatMap(c => box.u(c, page4.text));
  expect(cs.every(c => c.section === '4 Rengöring'), 'VARNING blir inte en avsnittsrubrik');
  expect(units.find(u => u.text.startsWith('Koppla bort')).warn && !units.find(u => u.text.startsWith('Torka')).warn, 'raden efter VARNING märks som varning');
  const page5 = { n: 5, text: 'Rengöring av slangen sker enligt följande.\nVARNING\nKoppla bort nätkabeln före rengöring.\nDet gäller även batteridrift.\n\nTorka av.' };
  const u5 = box.u({ start: page5.text.indexOf('Koppla'), end: page5.text.length }, page5.text);
  expect(u5[0].warn && u5[1].warn && !u5[u5.length - 1].warn, 'etikett i föregående stycke och flerradig varning till tomraden: ' + JSON.stringify(u5.map(u => u.warn)));

});

await test('lokal-avbruten', async () => {
  /* Avbruten JSON, ett komplett objekt som ändå avbröts, slut utan slutbesked och text runt objektet. */
  const full = idOf => ok([idOf('MR-miljö')]);
  const cases = [
    ['avbruten JSON', idOf => JSON.stringify(full(idOf)).slice(0, 20), 'length'],
    ['komplett objekt men length', idOf => full(idOf), 'length'],
    ['inget slutbesked', idOf => full(idOf), null],
    ['text runt objektet', idOf => 'Här är svaret: ' + JSON.stringify(full(idOf)) + ' Klart.', 'stop']
  ];
  let i = 0;
  const { api } = localApi((text, idOf) => cases[i][1](idOf), { finish: () => cases[i][2] });
  const { ctx, page } = await localPage(api);
  for (; i < cases.length; i++) {
    const t = await (await askChat(page, 'Får pumpen användas i MR-miljö?')).innerText();
    expect(t.includes('Sökning utan AI') && !t.includes('Text ur tillverkarens bruksanvisning'), cases[i][0] + ' ger sökning utan AI');
  }
  await ctx.close();
});


/* Lokalt läge utan svarande server: molnet används aldrig, inte ens med en sparad nyckel.
   En adress utanför datorn i lotsa:localAi godtas inte. */
await test('lokal-nere', async () => {
  const other = [], ext = [];
  const api = async route => {
    const u = route.request().url();
    if (/api\.anthropic\.com/.test(u)) other.push(u);
    return route.abort();
  };
  let { ctx, page } = await localPage(api, { key: 'sk-ant-test-0000000000' });
  const t = await (await askChat(page, 'Hur rengör jag pumpen?')).innerText();
  expect(t.includes('lokala AI:n svarar inte'), 'felet säger att den lokala AI:n inte svarar: ' + t.slice(0, 100));
  expect(other.length === 0, 'inga anrop till Anthropic trots sparad nyckel');
  await ctx.close();
  ({ ctx, page } = await localPage(api, { override: 'http://extern.example:8080', setup: c => c.route(/extern\.example/, route => { ext.push(route.request().url()); return route.abort(); }) }));
  await page.waitForTimeout(400);
  expect(ext.length === 0, 'extern adress anropas inte');
  expect((await txt(page, '#banner').catch(() => '')).includes('API-nyckel'), 'extern adress ger inte lokalt läge');
  await ctx.close();
});

/* Molnläget: samma utdragsflöde som lokalt. Ingen AI-text, okända id:n och ogiltig JSON ger sökning utan AI. */
await test('moln-strikt', async () => {
  const { ctx, page } = await open(browser, { hash: '#enhet-flow300', mock: { slow: 1500 } });
  await page.click('[data-tab="fraga"]');
  await page.fill('.composer textarea', 'Hur startar jag pumpen?');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  expect((await page.locator('.msg-a .typing').count()) === 1, 'vänteläge medan urvalet görs');
  await page.waitForSelector('.msg-a .typing ~ .hits-live .fallback-hit', { timeout: 3000 });
  expect((await page.locator('.msg-a .hits-live .fallback-hit').count()) >= 1, 'sökträffar visas medan AI:n arbetar');
  await page.screenshot({ path: SHOTS + '/42-soktraffar-medan.png' });
  await page.waitForSelector('.msg-a .a-actions', { timeout: 8000 });
  let t = await txt(page, '.msg-a');
  expect(await page.locator('.msg-a .excerpt').count() >= 1 && !(await page.locator('.msg-a .a-body').count()), 'molnet visar utdrag ur manualen, ingen AI-text: ' + t.slice(0, 120));
  const calls = await page.evaluate(() => window.__aiCalls.map(c => Array.isArray(c.input) ? c.input.map(x => x.content).join('\n') : String(c.input)));
  expect(calls.some(c => /\[S\d+\] /.test(c) && c.includes('"rader"')), 'molnet får manualens rader med id och svarar med rad-id:n');
  /* Ett påhittat rad-id visar inget utdrag. */
  await page.fill('.composer textarea', 'Ge ett påhittat id');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.msg-a >> nth=1 >> .notice', { timeout: 8000 });
  t = await txt(page, '.msg-a >> nth=1');
  expect(t.includes('Sökning utan AI') && !(await page.locator('.msg-a >> nth=1 >> .excerpt').count()), 'okänt id ger sökning utan AI: ' + t.slice(0, 120));
  /* Står det inte i manualen: ingen AI-text, en fast rad, sökträffar och MT. */
  await page.fill('.composer textarea', 'Hur byter jag säkring?');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.msg-a >> nth=2 >> .a-status.saknas', { timeout: 8000 });
  t = await txt(page, '.msg-a >> nth=2');
  expect(t.includes('Inget utdrag i manualen besvarar frågan') && !(await page.locator('.msg-a >> nth=2 >> .excerpt').count()), 'saknas: fast rad, inget utdrag: ' + t.slice(0, 120));
  await page.locator('.msg-a >> nth=2').scrollIntoViewIfNeeded();
  await page.screenshot({ path: SHOTS + '/39-inget-utdrag.png' });
  await page.fill('.composer textarea', 'Ge mig trasig json');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.msg-a >> nth=3 >> .notice', { timeout: 8000 });
  t = await txt(page, '.msg-a >> nth=3');
  expect(t.includes('Sökning utan AI') && !t.includes('MOLNTEXT-9Z'), 'ogiltig JSON ger sökning utan AI-text: ' + t.slice(0, 120));
  await ctx.close();
  /* Enhetstest av strictQuote: alla delar av ett citat med ellips måste stå i ordning på sidan. */
  const vm = await import('node:vm'), box = {};
  const ai = readFileSync(join(ROOT, 'src/js/04-ai.js'), 'utf8'), fn = ai.slice(ai.indexOf('const ELLIPS_GAP'), ai.indexOf('/* ===== Frågor'));
  vm.runInNewContext(readFileSync(join(ROOT, 'src/js/03-text.js'), 'utf8') + ';' + fn + ';this.q = strictQuote; this.cc = claimConflicts;', box);
  const pages = [{ n: 1, text: 'Förvaring: -20 °C till 40 °C.' }, { n: 2, text: 'Håll avståndet minst 1,5 meter. Rengör med 70 % alkohol och låt ytan torka helt.' }];
  expect(!box.q(pages, 1, 'Förvaring: 20 °C till 40 °C').ok, 'minustecknet måste stämma');
  expect(!box.q(pages, 2, 'Håll avståndet minst 15 meter').ok, '15 godtas inte för 1,5');
  expect(!box.q(pages, 2, 'Rengör med 70 % alkohol ... spädd med vatten 1:10').ok, 'påhittad del efter ellips underkänns');
  const okq = box.q(pages, 1, 'Rengör med 70 % alkohol ... låt ytan torka helt');
  expect(okq.ok && okq.page === 2 && okq.text === 'Rengör med 70 % alkohol och låt ytan torka helt.', 'äkta citat med ellips godkänns, flyttas till rätt sida och visas som hela meningen');
  /* Omgång 11: hela meningen visas alltid, även över kolon och radbrytning, och gränsen 7000 tecken klipper inget tal. */
  const v12 = box.q([{ n: 1, text: 'Never: start the test sequence while charging.' }], 1, '… start the test sequence while charging.');
  expect(v12.ok && v12.text.startsWith('Never:'), 'citat som börjar mitt i en mening visas med början (Never:)');
  const v13 = box.q([{ n: 1, text: 'Start the test sequence\nonly when the lid is closed.' }], 1, 'Start the test sequence …');
  expect(v13.ok && v13.text.endsWith('lid is closed.'), 'villkor på nästa rad visas');
  const long = 'x '.repeat(3480) + 'The maximum flow is 1 200 mL/h.', at = long.indexOf('1 200');
  expect(!box.q([{ n: 1, text: long }], 1, 'The maximum flow is 1', at + 1).ok, 'tal som kapas av teckengränsen godkänns inte');
  /* Omgång 12: förkortningar avslutar inte meningen, och en mening som inte ryms underkänns hellre än klipps. */
  const v14 = box.q([{ n: 1, text: 'Ställ in väntetiden på 5 sek.\nendast när locket är stängt.' }], 1, 'Ställ in väntetiden på 5 sek.');
  expect(v14.ok && v14.text.endsWith('locket är stängt.'), 'punkt i en förkortning avslutar inte meningen');
  const huge = 'Intro. Never start the test with any of these: ' + 'adapter, '.repeat(200) + 'or the cradle.';
  expect(!box.q([{ n: 1, text: huge }], 1, 'adapter, adapter, or the cradle.').ok, 'citat ur en mening som är för lång för att visas hel underkänns');
  expect(box.cc('Anslut nätkabeln. [1]', [{ n: 1, ok: true, quote: 'Anslut nätkabeln, men starta inte testet.' }]).length === 0, 'negation i en annan sats ger ingen falsk varning');
  /* Omgång 13: förkortningar före siffra eller versal, och negation som flyttats till fel sats. */
  const v15 = box.q([{ n: 1, text: 'Kör testet i ca. 5 minuter och endast när locket är stängt.' }], 1, 'Kör testet i ca.');
  expect(!v15.ok || v15.text.endsWith('locket är stängt.'), '"ca." avslutar inte meningen');
  const qs = [{ n: 1, ok: true, quote: 'Anslut nätkabeln, men starta inte testsekvensen.' }];
  expect(box.cc('Koppla inte in sladden och starta testsekvensen. [1]', qs).length === 1, 'negation som flyttats till fel sats upptäcks');
  expect(box.cc('Anslut nätkabeln och vänta, men starta inte testsekvensen. [1]', qs).length === 0, 'rätt negation i rätt sats godkänns');
  /* Omgång 14: okänd förkortning, och ordagrann återgivning med "och" och blandad polaritet. */
  const v16 = box.q([{ n: 1, text: 'Använd i serviceläget alt. A endast när locket är stängt.' }], 1, 'Använd i serviceläget alt.');
  expect(!v16.ok || v16.text.endsWith('locket är stängt.'), 'kort ord med punkt avslutar inte meningen');
  expect(box.cc('Anslut nätkabeln och starta inte testsekvensen. [1]', [{ n: 1, ok: true, quote: 'Anslut nätkabeln och starta inte testsekvensen.' }]).length === 0, 'ordagrann återgivning med blandad polaritet ger ingen falsk varning');
  /* Omgång 10: ellipsen får inte dölja ett förbud, och citatet får inte klippa ett tal. */
  const q1 = (text, quote) => box.q([{ n: 1, text }], 1, quote);
  const p10 = 'Connect the power cable. No start is permitted during charging. Start the test sequence.';
  const v10 = q1(p10, 'Connect the power cable … Start the test sequence.');
  expect(!v10.ok || v10.text === p10, 'ellips över ett förbud underkänns eller visas med hela texten');
  expect(!q1('Håll knappen intryckt i minst 10 sekunder. Släpp sedan knappen.', 'Håll knappen intryckt … Släpp sedan knappen.').ok, 'ellips över ett tal underkänns');
  const v11 = q1('Start the test sequence only when the lid is closed.', 'Start the test sequence …');
  expect(v11.ok && v11.text === 'Start the test sequence only when the lid is closed.', 'ellips sist förlängs till meningens slut');
  expect(!q1('The maximum flow is 1 200 mL/h.', 'The maximum flow is 1').ok, 'citatet får inte sluta mitt i ett tusentalsgrupperat tal');
  expect(!q1('The range starts at 10 - 20 V on this model.', 'The range starts at 10').ok, 'citatet får inte klippa ett intervall');
  expect(q1('Larmgränsen är 120. Tryck OK.', 'Larmgränsen är 120').ok, 'tal som avslutar meningen godkänns');
  expect(q1('Connect the power cable. Do not run the test. Start the test sequence. Connect the power cable. Check the light. Start the test sequence.', 'Connect the power cable … Start the test sequence.').ok, 'en giltig senare träff prövas när den första underkänns');
  const p3 = [{ n: 3, text: 'Koppla bort nätkabeln. Starta inte om pumpen förrän service har kontrollerat den. Starta om pumpen.' }];
  expect(!box.q(p3, 3, 'Koppla bort nätkabeln ... Starta om pumpen').ok, 'ellips över en negation underkänns');
  const p4 = [{ n: 4, text: 'Tryck på PÅ/AV-knappen i två sekunder. ' + 'Lång text om något annat här. '.repeat(10) + 'Displayen tänds och visar startbilden.' }];
  expect(!box.q(p4, 4, 'Tryck på PÅ/AV-knappen ... Displayen tänds och visar').ok, 'ellips över för lång text underkänns');
  /* Andra kontrollen: påståendet får inte säga emot citatet. */
  const k = [{ n: 1, ok: true, quote: 'Pumpen får inte användas i MR-miljö.' }, { n: 2, ok: true, quote: 'Hastighet: 0,1 till 1 200 ml/h.' }];
  expect(box.cc('Pumpen får användas i MR-miljö. [1]', k).length === 1, 'motsägelse (negation saknas) upptäcks');
  expect(box.cc('Pumpen får inte användas i MR-miljö. [1]', k).length === 0, 'rätt återgivning godkänns');
  expect(box.cc('Högsta hastighet är 1 500 ml/h. [2]', k).length === 1, 'tal som inte står i citatet upptäcks');
  expect(box.cc('1. Hastigheten kan ställas från 0,1 till 1 200 ml/h, se sidan 9. [2]', k).length === 0, 'stegnummer och sidhänvisning räknas inte som tal');
  const k2 = [{ n: 1, ok: true, quote: 'Förvaring: −20 °C till 40 °C.' }, { n: 2, ok: true, quote: 'Anslut nätkabeln. Starta inte pumpen ännu.' }];
  expect(box.cc('Förvara pumpen vid +20 °C. [1]', k2).length === 1, 'tecknet på talet räknas (+20 mot −20)');
  expect(box.cc('Förvara pumpen från −20 °C. [1]', k2).length === 0, 'rätt tecken godkänns');
  expect(box.cc('Anslut först nätkabeln. [2]', k2).length === 0, 'negation i en annan mening i citatet ger ingen falsk varning');
  const k3 = [{ n: 1, ok: true, quote: 'Ställ in 10 ml/h och kontrollera efter 5 min.' }];
  const k4 = [{ n: 1, ok: true, quote: 'Larm E-23: kontrollera 10 mV och 120\u2009mmHg efter 10 minuter.' }];
  const c1 = (claim, quote) => box.cc(claim + ' [1]', [{ n: 1, ok: true, quote }]).length;
  expect(c1('Förvara vid 20 °C.', 'Förvara vid − 20 °C.') === 1, 'minustecken med mellanslag räknas');
  expect(c1('Store at +20 °C.', 'Store at 20 °C.') === 0, '+20 är samma tal som 20');
  expect(c1('Larm E\u201123 visas.', 'Larm F\u201123 visas.') === 1, 'koder med hårt bindestreck skiljs åt');
  expect(c1('Flödet ökas i steg 1  200 ml/h.', 'Flödet ökas i steg 2  200 ml/h.') === 1, 'dubbla mellanslag i tusental');
  expect(c1('Använd 0,50 kg.', 'Använd 0,5 kg.') === 0, 'avslutande decimalnolla ger samma tal');
  expect(c1('Alarm E-2.10 indicates a fault.', 'Alarm E-2.1 indicates a fault.') === 1, 'decimalnollan i en larmkod räknas');
  expect(c1('Set the delay to 5 msec.', 'Set the delay to 5 s.') === 1 && c1('Wait 5 minutes.', 'Wait 5 min.') === 0, 'engelska enhetsord');
  expect(c1('Open the service cover.', 'Opening the service cover is prohibited.') === 1 && c1('Öppna panelen.', 'Panelen får icke öppnas.') === 1, 'prohibited och icke är negationer');
  expect(box.cc('Ställ in 10 ml / min. [1]', k3).length === 1, 'fel enhet med mellanslag runt snedstrecket upptäcks');
  expect(box.cc('Kontrollera 10 V. [1]', k4).length === 1, 'mV och V är olika enheter');
  expect(box.cc('Larm F-23 betyder att 10 mV ska kontrolleras. [1]', k4).length === 1, 'E-23 och F-23 är olika koder');
  expect(box.cc('Vid E-23: kontrollera 10 mV och 120 mmHg efter 10min. [1]', k4).length === 0, 'kod, tunt mellanslag och 10min/10 minuter godkänns');
  /* Vanlig svensk meningsbyggnad får inte ge falska varningar. */
  const k5 = [{ n: 1, ok: true, quote: 'Välj läge 2 på displayen. Tryck 3 ggr på OK. Trycket ska vara 120 mmHg.' }];
  expect(box.cc('Läge 2 aktiverar testet. [1]', k5).length === 0, 'ett vanligt ord efter talet är ingen enhet');
  expect(box.cc('Tryck 3 gånger på OK. [1]', k5).length === 0, '3 gånger och 3 ggr är samma');
  expect(box.cc('Trycket ska vara 120  cmHg. [1]', k5).length === 1, 'fel enhet efter två mellanslag upptäcks');
  const k6 = [{ n: 1, ok: true, quote: 'Välj port 2 (A). Dosen är 10 mg/m² och spänningen 10 mV. Fyll 5 mL.' }];
  expect(box.cc('Välj port 2 A. [1]', k6).length === 0, 'bokstavsbeteckning efter talet ger ingen falsk varning');
  expect(box.cc('Dosen är 10 mg/cm². [1]', k6).length === 1, 'mg/cm² och mg/m² skiljs');
  expect(box.cc('Spänningen är 10 MV. [1]', k6).length === 1, 'MV och mV skiljs');
  expect(box.cc('Fyll 5 ml och välj 10 mg/m2. [1]', k6).length === 0, 'ml = mL och m2 = m²');
  const k7 = [{ n: 1, ok: true, quote: 'Vänta 5 min. Kalium 10 mmol. Koncentration 10 mg/mL².' }];
  expect(box.cc('Vänta 5 h. [1]', k7).length === 1, 'h och min skiljs');
  expect(box.cc('Kalium 10 Mmol. [1]', k7).length === 1, 'Mmol och mmol skiljs');
  expect(box.cc('Koncentration 10 mg/ml². [1]', k7).length === 0, 'mL² = ml²');
  expect(box.cc('Vänta 5 minuter. Kalium 10 mmol. [1]', k7).length === 0, 'minuter = min');
  expect(box.cc('Flödet ökas i steg 5 ml/min. [1]', [{ n: 1, ok: true, quote: 'Flödet ökas i steg 5 ml/h.' }]).length === 1, 'steg med enhet är ett mätvärde');
  expect(box.cc('Flödet ökas i steg 1 200 ml/h. [1]', [{ n: 1, ok: true, quote: 'Flödet ökas i steg 2 200 ml/h.' }]).length === 1, 'tusentalsavgränsat tal efter steg är ett mätvärde');
  expect(box.cc('Gör steg 3 igen. [1]', [{ n: 1, ok: true, quote: '3. Kontrollera displayen.' }]).length === 0, 'steg 3 är en hänvisning');
  expect(box.cc('Ställ in 10 ml/min. [1]', k3).length === 1, 'fel enhet (ml/min mot ml/h) upptäcks');
  expect(box.cc('Ställ in 10 ml/h och vänta 5 min. [1]', k3).length === 0, 'rätt tal och enheter godkänns');
  expect(box.cc('Ställ in 10 och kontrollera. [1]', k3).length === 0, 'tal utan enhet jämförs bara som tal');
  expect(!box.q([{ n: 6, text: 'Starta om pumpen förutsatt att teknikern har godkänt det och kontrollera sedan displayen.' }], 6, 'Starta om pumpen ... kontrollera sedan displayen').ok, 'ellips över förutsatt underkänns');
  expect(!box.q([{ n: 5, text: 'Starta om pumpen om teknikern har godkänt det och kontrollera sedan displayen.' }], 5, 'Starta om pumpen ... kontrollera sedan displayen').ok, 'ellips över ett om-villkor underkänns');
});

/* Larm: AI-tolkade poster som ingen granskat visas inte, och uppslag sparar aldrig något. */
/* Ett godkänt snabbkort från en tidigare uppladdning av manualen får inte skrivas ut eller visas steg för steg. */
await test('snabbkort-inaktuellt', async () => {
  const { ctx, page } = await open(browser, { hash: '#enhet-flow300', mock: { seed: { 'manuals/m-flow300': { card: { status: 'approved', verbatim: true, version: 'Rev D', rev: 12345, madeAt: 1, approvedAt: 2, uppstart: { steg: ['Anslut nätkabeln.', 'Tryck på PÅ/AV.'], sida: 4, avsnitt: '3.2', citat: '' }, rengoring: { steg: ['Torka av.'], sida: 9, avsnitt: '7', citat: '' }, larm: [], viktigt: [] } } } } });
  await page.click('[data-tab="kort"]');
  await page.waitForSelector('.qcard');
  const t = await page.locator('main').innerText();
  expect(t.includes('Kortet bygger på en äldre manual'), 'varning för inaktuellt kort: ' + t.slice(0, 200));
  expect(await page.locator('[data-act="cardPdf"][disabled]').count() === 1, 'utskrift spärrad');
  expect(await page.locator('.qcard ~ * [data-act="cardSteps"], [data-act="cardSteps"]').count() === 0, 'ingen stegvisning');
  await ctx.close();
});

/* Ett kort från en tidigare version (egna formuleringar, ingen verbatim-markering) visas inte och kan inte skrivas ut. */
await test('snabbkort-aldre-format', async () => {
  const { ctx, page } = await open(browser, { hash: '#enhet-flow300', mock: { seed: { 'manuals/m-flow300': { card: { status: 'approved', version: 'Rev D', madeAt: 1, approvedAt: 2, uppstart: { steg: ['OMSKRIVET-STEG-7Q'], sida: 4, avsnitt: '3.2', citat: '' }, rengoring: { steg: [], sida: 9, avsnitt: '', citat: '' }, larm: [], viktigt: [] } } } } });
  await page.click('[data-tab="kort"]');
  await page.waitForSelector('#devPanel .empty');
  const t = await txt(page, '#devPanel');
  expect(t.includes('Snabbkortet behöver skapas om') && !t.includes('OMSKRIVET-STEG-7Q'), 'äldre kort döljs: ' + t.slice(0, 160));
  expect(!(await page.locator('.qcard, [data-act="cardPdf"], [data-act="cardSteps"]').count()), 'ingen visning, utskrift eller stegvisning');
  await ctx.close();
});

await test('larm-utan-ai', async () => {
  /* Som om en äldre version hade sparat en AI-tolkad post över den granskade E-23. */
  const { ctx, page } = await open(browser, { hash: '#larm', mock: { seed: { 'manuals/m-flow300': { alarms: { 'E-23': { kod: 'E-23', label: 'FALSK AI-POST', prio: 'låg', atgard: ['Ignorera larmet.'], ai: true, verified: true, sida: 7 } } } } } });
  await page.fill('.alarm-input', 'E23');
  await page.click('.alarm-form .btn-primary');
  await page.waitForSelector('#alOut .msg-a, #alOut .alarm-card', { timeout: 8000 }).catch(() => {});
  const t = await page.locator('main').innerText();
  expect(!t.includes('FALSK AI-POST') && !t.includes('Ignorera larmet'), 'ogranskad AI-post visas inte');
  expect(t.includes('OCKLUSION'), 'manualens egen text för E-23 visas: ' + t.slice(0, 200));
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
finish();

function finish() {
  let bad = 0;
  for (const [st, name, ms, errs] of results) {
    console.log(`${st.padEnd(7)} ${name} (${ms} ms)`);
    if (st !== 'ok') { bad++; errs.forEach(e => console.log('   ' + e.split('\n').join('\n   '))); }
  }
  console.log(bad ? `\n${bad} test med problem` : '\nAlla tester gick igenom');
  process.exit(bad ? 1 : 0);
}
