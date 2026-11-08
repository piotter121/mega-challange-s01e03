import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { deskRef } from '../support-kb/src/lib/kb/desk-ref.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const routes = path.join(root, 'support-kb/src/routes');
const out = path.join(root, 'rendered');
const server = await createServer({
  mode: 'production',
  configFile: path.join(root, 'vite.config.mjs'),
  server: { middlewareMode: true, hmr: false, watch: null },
});

async function pages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.filter((e) => e.isDirectory()).map((e) => pages(path.join(directory, e.name))));
  return [...entries.filter((e) => e.name === '+page.svx').map((e) => path.join(directory, e.name)), ...nested.flat()];
}

try {
  const { render } = await server.ssrLoadModule('svelte/server');
  for (const file of await pages(routes)) {
    const relative = path.relative(path.join(root, 'support-kb'), file).split(path.sep).join('/');
    const module = await server.ssrLoadModule('/' + relative);
    const result = render(module.default);
    if (module.metadata.signature) {
      const expected = deskRef(module.metadata.signature);
      assert.ok(result.body.includes(expected), `Missing computed RenderStamp in ${relative}`);
      assert.ok(!result.body.includes('no desk ref:'), `Unsigned page: ${relative}`);
    }
    if (relative.includes('/4471-review/')) {
      for (const count of ['412', '379', '33', '15', '38', '179', '184']) {
        assert.ok(result.body.includes(`>${count}<`), `Missing rendered count ${count}`);
      }
      assert.ok(result.body.includes('<svg'), 'Missing rendered timeline');
      assert.ok(result.body.includes('R-41620'), 'Missing anomalous report evidence');
      assert.ok(result.body.includes('different causes — keep apart'), 'Missing computed dedupe verdict');
    }
    const destination = path.join(out, path.relative(routes, path.dirname(file)), 'index.html');
    await fs.mkdir(path.dirname(destination), { recursive: true });
    const head = result.head.replace(/\/\*# sourceMappingURL=data:[\s\S]*?\*\//g, '');
    await fs.writeFile(destination, `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head}</head><body>${result.body}</body></html>\n`);
    console.log(path.relative(root, destination));
  }
} finally {
  await server.close();
}
