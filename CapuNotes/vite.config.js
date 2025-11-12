import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 👈 alias para que "@/" funcione
    },
  },
  server: {
    // Proxy DESACTIVADO - Llamamos directamente al backend en http://localhost:8080
    // con BASE = 'http://localhost:8080' en apiClient.js
    /* 
    proxy: {
      // Proxy específico para rutas de autenticación (mantiene /api/auth)
      "/api/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('❌ Proxy error (auth):', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('📤 Proxying (auth):', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📥 Response (auth):', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy general para otros recursos (quita /api)
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 60000, // 60 segundos
        proxyTimeout: 60000,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('❌ Proxy error:', err.message);
            console.error('   Request:', req.method, req.url);
            if (!res.headersSent) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('📤 Proxying:', req.method, req.url, '→', req.url.replace(/^\/api/, ''));
            // Log body para debugging
            if (req.body) {
              console.log('   Body:', JSON.stringify(req.body).substring(0, 100));
            }
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📥 Response:', proxyRes.statusCode, req.url);
          });
          proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
            console.log('🔌 WebSocket proxying:', req.url);
          });
          proxy.on('close', (res, socket, head) => {
            console.log('🔒 Proxy connection closed');
          });
        },
      },
    },
    */
  },
});
