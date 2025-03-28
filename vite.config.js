import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/dashboardWit/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5174'
        },
        cookieDomainRewrite: {
          '*': 'localhost'
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-Forwarded-Host', 'localhost:5174');
            proxyReq.setHeader('X-Forwarded-Proto', 'http');
          });
        }
      }
    }
  },
  resolve: {
    alias: {
      jquery: 'jquery/dist/jquery.slim.js'
    }
  },
  optimizeDeps: {
    include: [
      'jquery',
      'datatables.net',
      'datatables.net-responsive',
      'datatables.net-bs5'
    ]
  }
});