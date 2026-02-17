// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap'; // 1. TÄMÄ PUUTTUI

export default defineConfig({
  site: 'https://kultalaskuri.fi',
  output: 'static',
  
  integrations: [
    react(), 
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(), // 2. JA TÄMÄ PUUTTUI
  ],
});