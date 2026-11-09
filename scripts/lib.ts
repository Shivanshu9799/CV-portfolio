import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

export const ROOT = process.cwd();
export const OUT = path.join(ROOT, 'out');

export function walk(dir: string, exts?: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  const res: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) res.push(...walk(p, exts));
    else if (!exts || exts.includes(path.extname(e.name).toLowerCase())) res.push(p);
  }
  return res;
}

export function readAllowlist(file: string): Set<string> {
  if (!fs.existsSync(file)) return new Set();
  return new Set(
    fs
      .readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#')),
  );
}

/** Text of the generated PDF, or null if it does not exist. */
export async function pdfText(file: string): Promise<{ text: string; pages: number } | null> {
  if (!fs.existsSync(file)) return null;
  const mod = (await import('pdf-parse/lib/pdf-parse.js')) as unknown as {
    default: (b: Buffer) => Promise<{ text: string; numpages: number }>;
  };
  const r = await mod.default(fs.readFileSync(file));
  return { text: r.text, pages: r.numpages };
}

/** Minimal static server for `out/`, mounted at an optional base path. */
export function serveOut(basePath: string, port = 0): Promise<{ url: string; close: () => void }> {
  const base = basePath.replace(/\/$/, '');
  const types: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.xml': 'application/xml',
  };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/');
    if (base && p.startsWith(base)) p = p.slice(base.length) || '/';
    else if (base) {
      res.writeHead(404).end('not found');
      return;
    }
    let file = path.join(OUT, p);
    if (!file.startsWith(OUT)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      const nf = path.join(OUT, '404.html');
      res.writeHead(404, { 'content-type': types['.html'] });
      res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'not found');
      return;
    }
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      const addr = server.address();
      const actual = typeof addr === 'object' && addr ? addr.port : port;
      resolve({ url: `http://127.0.0.1:${actual}${base}`, close: () => server.close() });
    });
  });
}
