import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 4200,
    strictPort: true,
    // La API va por el mismo origen: la cookie de sesión funciona sin CORS ni SameSite=None
    proxy: { '/api': 'http://localhost:3000' },
  },
});
