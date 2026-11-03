import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: 'esm',
  target: 'node22',
  platform: 'node',
  sourcemap: true,
  clean: true,
  // el paquete shared se publica como TypeScript, así que se incluye en el bundle
  noExternal: ['@wos/shared'],
});
