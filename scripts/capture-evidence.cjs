const fs = require('node:fs/promises');
const path = require('node:path');
const { createRequire } = require('node:module');
const bundled = createRequire('C:/Users/New User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = bundled('playwright');
const mongoose = require('mongoose');
const { spawn } = require('node:child_process');
const { randomBytes } = require('node:crypto');
(async () => {
  const dir = path.resolve('evidence');
  await fs.mkdir(dir, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1000, height: 180 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/');
  await page.addStyleTag({ content: 'body,pre { font-size: 24px !important; }' });
  await page.screenshot({ path: path.join(dir, 'welcome.png') });
  await mongoose.connect('mongodb://127.0.0.1:27017/Portfolio');
  const collections = await mongoose.connection.db.listCollections().toArray();
  const dbInfo = { connected: mongoose.connection.readyState === 1, host: mongoose.connection.host, database: mongoose.connection.name, collections: collections.map(c => c.name) };
  await mongoose.disconnect();
  const escape = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  async function shot(name, title, value) {
    await page.setContent('<html><head><style>body{font:18px Arial;padding:30px;color:#18222e}h1{font-size:28px}pre{font:20px Consolas;white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f5f7;padding:22px;border:1px solid #cbd2d9}</style></head><body><h1>'+escape(title)+'</h1><p>COMP229 Assignment 2 — actual locally executed evidence</p><pre>'+escape(JSON.stringify(value,null,2))+'</pre></body></html>');
    await page.screenshot({ path: path.join(dir,name+'.png'), fullPage: true });
  }
  await shot('database','MongoDB connection and required collections',dbInfo);
  const child = spawn(process.execPath, ['server.js'], {env: {...process.env, PORT: '3001', JWT_SECRET: randomBytes(48).toString('hex')}, windowsHide: true});
  let startup = '';
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { child.kill(); reject(new Error('Startup capture timed out')); }, 15000);
    child.stdout.on('data', chunk => { startup += chunk; if (startup.includes('Server running')) { clearTimeout(timer); resolve(); } });
    child.on('error', reject);
  });
  await fs.writeFile(path.join(dir, 'server-startup.txt'), startup);
  await shot('console', 'Captured server startup stdout', startup);
  child.kill();
  const results = JSON.parse(await fs.readFile(path.join(dir,'api-results.json'),'utf8'));
  for (const r of ['contacts','projects','qualifications','users']) {
    const rows = results.evidence.filter(e => e.url.startsWith('/api/'+r));
    await shot(r+'-summary',r+' CRUD and validation results',rows.map(e => e.method.padEnd(7) + ' ' + e.url.replace(/\/[a-f0-9]{24}$/, '/:id') + ' | expected ' + e.expected + ' | actual ' + e.actual + ' | ' + (e.expected===e.actual ? 'PASS' : 'FAIL')));
    const example = rows.find(e => e.method==='POST' && e.actual===201);
    await shot(r+'-create',r+' create request and response',example);
  }
  await shot('authentication','JWT authentication and revocation results',results.evidence.filter(e => e.url.includes('/auth/') || (e.url==='/api/users' && e.actual===401)).map(e => e.method + ' ' + e.url + ' | expected ' + e.expected + ' | actual ' + e.actual));
  await browser.close();
  console.log('Captured actual browser and API evidence.');
})().catch(e => { console.error(e); process.exitCode=1; });
