import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://cs.fs.rupp.edu.kh/laravelapi',
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'https://cs.fs.rupp.edu.kh/laravelapi',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

