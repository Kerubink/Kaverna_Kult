import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["swiper"],
  },
  plugins: [react(), tailwindcss(),],
  server: {
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