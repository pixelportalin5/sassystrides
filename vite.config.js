import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const sassyApiProxy = {
  target: 'https://sassystrides.com',
  changeOrigin: true,
  secure: true,
};

export default defineConfig({
  plugins: [react()],
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
