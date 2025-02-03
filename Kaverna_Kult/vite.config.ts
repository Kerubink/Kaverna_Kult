import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["swiper"],
  },
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './certs/cert.pem')),
    },
    host: true, 
    proxy: {
      '/api/frete': {
        target: 'https://freteapi.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/frete/, '/frete'),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },

  },
})
