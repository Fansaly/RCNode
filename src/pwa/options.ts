import { VitePWAOptions } from 'vite-plugin-pwa';

const pwaOptions: Partial<VitePWAOptions> = {
  includeAssets: ['favicon.svg'],
  manifest: {
    lang: 'zh-CN',
    name: 'RCNode',
    short_name: 'RCNode',
    description: 'CNode 社区 第三方 WEB APP',
    start_url: './',
    theme_color: '#21a8f3',
    background_color: '#f4f4f4',
    display: 'standalone',
    icons: [
      {
        src: 'icons/128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: 'icons/144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: 'icons/152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: 'icons/192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
};

const replaceOptions = {
  preventAssignment: true,
  __DATE__: new Date().toISOString(),
};
const claims = process.env.CLAIMS === 'true';
const reload = process.env.RELOAD_SW === 'true';
const selfDestroying = process.env.SW_DESTROY === 'true';

if (process.env.SW === 'true') {
  pwaOptions.srcDir = 'src/pwa';
  pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts';
  pwaOptions.strategies = 'injectManifest';
}

if (claims) {
  pwaOptions.registerType = 'autoUpdate';
}

if (reload) {
  // @ts-expect-error just ignore
  replaceOptions.__RELOAD_SW__ = 'true';
}

if (selfDestroying) {
  pwaOptions.selfDestroying = selfDestroying;
}

export { pwaOptions, replaceOptions };
