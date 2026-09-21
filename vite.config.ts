import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/material-room-card.ts',
      formats: ['es'],
      fileName: () => 'material-room-card.js',
    },
    rollupOptions: {
      output: {
        // Force a single bundled output file
        inlineDynamicImports: true,
      },
    },
    minify: 'esbuild',
    sourcemap: true,
  },
});
