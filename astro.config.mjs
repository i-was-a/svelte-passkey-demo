// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [svelte()],
  vite: {
    ssr: {
      noExternal: ['@simplewebauthn/server']
    }
  }
});