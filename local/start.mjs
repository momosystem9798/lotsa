// Startar Lotsa lokalt: llama-server laddar språkmodellen och serverar appen på samma adress.
// Allt körs på den egna datorn och bara på 127.0.0.1. Inget går ut på nätet.
//
//   node local/start.mjs --model sökväg/till/modell.gguf [--llama sökväg/till/llama-server]
//                        [--port 8080] [--ctx 4096] [--threads 4]
//
// Sökvägarna kan också anges med miljövariablerna LOTSA_MODEL och LLAMA_SERVER.
// Det här är prototypens startskript. I skrivbordsappen (Tauri) gör skalet samma sak.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cpus } from 'node:os';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : def; };
const model = arg('model', process.env.LOTSA_MODEL);
const llama = arg('llama', process.env.LLAMA_SERVER || 'llama-server');
const port = arg('port', '8080');
const ctx = arg('ctx', '4096');
/* Fysiska kärnor ger bäst fart. Utan uppgift används antalet logiska kärnor, högst 8. */
const threads = arg('threads', String(Math.min(8, cpus().length)));
const dist = join(ROOT, 'dist');

if (!model || !existsSync(model)) { console.error('Ange modellfilen med --model eller LOTSA_MODEL. Hittade inte: ' + (model || '(ingen)')); process.exit(1); }
if (!existsSync(join(dist, 'index.html'))) { console.error('dist/index.html saknas. Kör först: node build.mjs'); process.exit(1); }

const args = [
  '-m', resolve(model),
  '--host', '127.0.0.1', '--port', port,
  '-c', ctx, '-t', threads,
  '--jinja',                 /* modellens egen chattmall, krävs för JSON-schema */
  '--reasoning', 'off',      /* inget tänkläge: det tar för lång tid utan grafikkort */
  '--path', dist,            /* servera appen i stället för llama.cpp:s eget webbgränssnitt */
  '--load-mode', 'mmap+mlock', /* håll modellen i minnet så att svaren inte blir långsamma när annat körs */
  '-np', '1'                 /* en fråga i taget: en användare per dator */
];
console.log('Startar llama-server: ' + llama + ' ' + args.join(' '));
const child = spawn(llama, args, { stdio: ['ignore', 'inherit', 'inherit'] });
child.on('error', e => { console.error('Kunde inte starta llama-server: ' + e.message); process.exit(1); });
child.on('exit', code => process.exit(code ?? 0));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));

/* Säg till när modellen är laddad. */
const url = `http://127.0.0.1:${port}`;
for (let i = 0; i < 600; i++) {
  await new Promise(r => setTimeout(r, 1000));
  try { const r = await fetch(url + '/health'); if (r.ok) { console.log(`\nLotsa är redo: öppna ${url}/ i webbläsaren.\n`); break; } } catch (e) { /* laddar fortfarande */ }
}
