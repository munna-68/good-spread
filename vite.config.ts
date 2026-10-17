import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/good-spread/',
  plugins: [react()],
  server: { port: 5173 },
});
