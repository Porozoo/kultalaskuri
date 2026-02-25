// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://kultalaskuri.fi',
  output: 'static',
  
  integrations: [
    react(), 
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: false,
      workbox: {
        // Staattiset tiedostot välimuistiin (myös fontit)
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}']
        // API runtimeCaching poistettu – ei tarvita, koska
        // API-kutsut tehdään build-aikana (GitHub Actions),
        // ei selaimessa.
      }
    }),
  ],
});