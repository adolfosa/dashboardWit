import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/apis': {
        target: 'http://tu-backend.com', // ajusta esto a tu backend
        changeOrigin: true,
        secure: false
      }
    }
  }
})