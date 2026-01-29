// vite.config.ts (Optimized for Chunk Splitting & Compression)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  base: '/Portfolio/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.split('node_modules/')[1].split('/')[0];
          }
        },
      },
    },
    chunkSizeWarningLimit: 800, // Increased limit to avoid warnings
  },
  plugins: [react(), viteCompression()], // Enable React plugin and Gzip Compression
});
