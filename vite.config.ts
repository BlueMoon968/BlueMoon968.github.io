import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.md'],
  base: 'BlueMoon968.github.io',
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    minify: 'terser'
  },
  define: {
    'global': 'globalThis',
  }
});