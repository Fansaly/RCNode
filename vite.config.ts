import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

const resolvePath = (dir) => path.join(__dirname, dir);

// https://vitejs.dev/config
export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : '/RCNode/',
  plugins: [react(), eslint(), checker({ typescript: true }), svgr()],
  resolve: {
    alias: {
      '@/': resolvePath('./src/'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3210,
  },
}));
