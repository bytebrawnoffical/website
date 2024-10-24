import { defineConfig } from 'vite';

export default defineConfig({
  base: '/website/',  // Ensure this is correctly set
  build: {
    rollupOptions: {
      external: ['three'], // Make sure three.js is bundled correctly
      output: {
        globals: {
          three: 'THREE',  // Specify the global name for three.js
        }
      }
    }
  }
});
