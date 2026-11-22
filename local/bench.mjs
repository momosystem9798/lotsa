// Mäter hur snabb den lokala AI:n är på den här datorn. Det är fas 0:s viktigaste mätning:
// på en dator utan grafikkort avgör inläsningen av underlaget (prefill) hur länge man väntar.
//
//   1. Starta servern: node local/start.mjs --model ...
//   2. Kör:            node local/bench.mjs [--url http://127.0.0.1:8080] [--sizes 512,2048,4096] [--gen 128]
//
// Resultatet skrivs till local/resultat/ som Markdown och JSON.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : def; };
const url = arg('url', 'http://127.0.0.1:8080');
const sizes = arg('sizes', '512,2048,4096').split(',').map(Number);
const gen = Number(arg('gen', '128'));
const label = arg('label', os.hostname());

const post = async (path, body) => {
  const r = await fetch(url + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(path + ': ' + r.status + ' ' + await r.text());
  return r.json();
};
const props = await (await fetch(url + '/props')).json();
const model = String(props.model_path || '').split(/[\\/]/).pop();

/* Underlaget är exempelmanualernas text, upprepad tills den når rätt antal tokens. */
global.window = {};
eval(readFileSync(join(ROOT, 'src/demo.js'), 'utf8'));
const corpus = window.LOTSA_DEMO.manuals.flatMap(m => m.pages.map(p => p.text)).join('\n\n');
async function promptOf(n) {
  const toks = (await post('/tokenize', { content: corpus })).tokens;
  let all = [];
  while (all.length < n) all = all.concat(toks);
  return (await post('/detokenize', { tokens: all.slice(0, n - 30) })).content + '\n\nSammanfatta texten ovan på svenska i några meningar.';
}

const rows = [];
await post('/completion', { prompt: 'Hej', n_predict: 4, cache_prompt: false }); /* uppvärmning */
for (const n of sizes) {
  const prompt = await promptOf(n);
  const r = await post('/completion', { prompt, n_predict: gen, cache_prompt: false, temperature: 0, ignore_eos: true });
  const t = r.timings;
  const row = {
    tokens: t.prompt_n, prefill_tok_s: +t.prompt_per_second.toFixed(1), prefill_s: +(t.prompt_ms / 1000).toFixed(1),
    gen_tokens: t.predicted_n, gen_tok_s: +t.predicted_per_second.toFixed(1),
    svar_300_tokens_s: +((t.prompt_ms + 300 * 1000 / t.predicted_per_second) / 1000).toFixed(1)
  };
  rows.push(row);
  console.log(row);
}

const cpu = os.cpus()[0] ? os.cpus()[0].model : 'okänd';
const info = { datum: new Date().toISOString(), etikett: label, modell: model, cpu, logiska_karnor: os.cpus().length, ram_gb: +(os.totalmem() / 2 ** 30).toFixed(1), plattform: `${os.platform()} ${os.release()}`, ctx: props.default_generation_settings && props.default_generation_settings.n_ctx, rader: rows };
mkdirSync(join(ROOT, 'local/resultat'), { recursive: true });
const base = join(ROOT, 'local/resultat', `bench-${label}-${model.replace(/\.gguf$/i, '')}`.replace(/[^\w.-]+/g, '_'));
writeFileSync(base + '.json', JSON.stringify(info, null, 2));
writeFileSync(base + '.md', `# Hastighetsmätning: ${model}

- Dator: ${label}, ${cpu}, ${info.logiska_karnor} logiska kärnor, ${info.ram_gb} GB RAM, ${info.plattform}
- Datum: ${info.datum}
- Kontext: ${info.ctx} tokens

| Underlag (tokens) | Inläsning (tokens/s) | Inläsning (s) | Generering (tokens/s) | Uppskattad tid för ett svar på 300 tokens (s) |
|---|---|---|---|---|
${rows.map(r => `| ${r.tokens} | ${r.prefill_tok_s} | ${r.prefill_s} | ${r.gen_tok_s} | ${r.svar_300_tokens_s} |`).join('\n')}

Uppskattad svarstid = inläsning + 300 tokens / genereringsfart. Ett vanligt Lotsa-svar är 150–400 tokens.
`);
console.log('Sparat: ' + base + '.md');
