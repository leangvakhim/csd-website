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
        target: 'https://aimostore.shop',
        changeOrigin: true,
        secure: false, // in case you use self-signed SSL on dev
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
      '/storage/uploads': {
        target: 'https://aimostore.shop',
        changeOrigin: true,
      },
    },
  },
})

