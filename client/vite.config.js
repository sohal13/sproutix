import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `https://sproutix-backend.onrender.com`, // Backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
