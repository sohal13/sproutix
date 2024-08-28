import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
console.log(import.meta.env.VITE_API_BASE_URL);
export default defineConfig({
   plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:4444/`, // Backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
