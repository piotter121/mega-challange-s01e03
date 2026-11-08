import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('./support-kb', import.meta.url)),
  resolve: {
    alias: { '#lib': fileURLToPath(new URL('./support-kb/src/lib', import.meta.url)) },
  },
  plugins: [svelte({
    extensions: ['.svelte', '.svx'],
    preprocess: mdsvex({
      extensions: ['.svx'],
      layout: { runbook: fileURLToPath(new URL('./support-kb/src/lib/layouts/runbook.svelte', import.meta.url)) },
    }),
    compilerOptions: { css: 'injected', dev: false },
  })],
});
