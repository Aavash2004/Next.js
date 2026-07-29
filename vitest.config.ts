import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      {
        find: /^@\/app\/ui\/fonts$/,
        replacement: fileURLToPath(new URL('./test/stubs/fonts.ts', import.meta.url)),
      },
      { find: '@', replacement: fileURLToPath(new URL('./', import.meta.url)) },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['app/lib/**/*.ts', 'app/ui/**/*.tsx'],
      exclude: ['app/lib/placeholder-data.ts', 'app/lib/definitions.ts'],
    },
  },
});
