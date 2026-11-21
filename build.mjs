// Bygger en enda index.html av källfilerna i src/.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src');
const read = p => readFileSync(join(src, p), 'utf8');
const safe = s => s.replace(/<\/script/gi, '<\\/script');

const js = readdirSync(join(src, 'js')).filter(f => f.endsWith('.js')).sort().map(f => read('js/' + f)).join('\n');
let html = read('index.html');
html = html.replace('/*__CSS__*/', () => read('styles.css'));
html = html.replace('/*__DEMO__*/', () => safe(read('demo.js')));
html = html.replace('/*__JS__*/', () => safe('(function(){\n' + js + '\n})();'));
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist', 'index.html'), html);
console.log('dist/index.html', (html.length / 1024).toFixed(1) + ' KiB');
