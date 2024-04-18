import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace';
import svgr from 'vite-plugin-svgr';

import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

import { pwaOptions, replaceOptions } from './src/pwa/options';

const resolvePath = (dir) => path.join(__dirname, dir);

// https://vitejs.dev/config
export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : '/RCNode/',
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  plugins: [
    react(),
    VitePWA(pwaOptions),
    replace(replaceOptions),
    svgr(),
    eslint(),
    checker({ typescript: true }),
  ],
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
