import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const sassyApiProxy = {
  target: 'https://sassystrides.com',
  changeOrigin: true,
  secure: true,
};

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/wp-json/sassy/v1': sassyApiProxy,
      '/wp-json/wp/v2': sassyApiProxy,
    },
  },
  preview: {
    proxy: {
      '/wp-json/sassy/v1': sassyApiProxy,
      '/wp-json/wp/v2': sassyApiProxy,
    },
  },
});
