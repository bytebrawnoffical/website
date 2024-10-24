// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/website/',  // Make sure this points to your repository name
  resolve: {
    alias: {
      'three': 'node_modules/three/build/three.module.js'
    }
  },
  build: {
    rollupOptions: {
      // Ensure nothing is treated as external
      external: [],
    },
  },
});
