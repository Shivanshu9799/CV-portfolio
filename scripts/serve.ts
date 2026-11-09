/** Serves out/ at NEXT_PUBLIC_BASE_PATH for Playwright and Lighthouse. Usage: tsx scripts/serve.ts [port] */
import { serveOut } from './lib';

const port = Number(process.argv[2] ?? 4173);
serveOut(process.env.NEXT_PUBLIC_BASE_PATH ?? '', port).then((s) => console.log(`Serving ${s.url}/`));
