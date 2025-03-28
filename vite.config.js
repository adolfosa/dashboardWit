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
          'Origin': 'http://localhost:5174',
          'Access-Control-Allow-Origin': 'http://localhost:5174',
          'Access-Control-Allow-Credentials': 'true'
        },
        cookieDomainRewrite: {
          '*': 'localhost'
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-Forwarded-Host', 'localhost:5174');
            proxyReq.setHeader('X-Forwarded-Proto', 'http');
            proxyReq.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
            proxyReq.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5174';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        }
      }
    },
    // Configuración adicional del servidor de desarrollo
    cors: {
      origin: 'http://localhost:5174',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true
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