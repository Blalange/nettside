import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      manifestFilename: 'manifest.json',
      manifest: {
          "name": "Blålange festivalen",
          "short_name": "Blålange",
          "start_url": "/",
          "display": "standalone",
          "background_color": "#ffffff",
          "lang": "nb",
          "scope": "./",
          "icons": [
            {
              "src": "/img/pwa-64x64.png",
              "sizes": "64x64",
              "type": "image/png"
            },
            {
              "src": "/img/pwa-192x192.png",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "/img/pwa-512x512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "any"
            },
            {
              "src": "/img/maskable-icon-512x512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "maskable"
            }
          ],
          "theme_color": "#000000",
          "id": "kuk-2023-9921832113",
          "description": "Blålange Festivalen er en norsk festival som skjer et par ganger i áret.",
          "dir": "auto",
          "categories": [
            "news",
            "social",
            "events"
          ]
      }
    })
  ],
  define: {
    'process.env.NODE_ENV': process.env.NODE_ENV === 'production' 
      ? '"production"'
      : '"development"'
  }
};

export default config;
