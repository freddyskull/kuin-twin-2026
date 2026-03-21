/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// https://vite.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'redirect-admin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin') {
            res.writeHead(301, { Location: '/admin/' });
            res.end();
          } else {
            next();
          }
        });
      },
    },
  ],

  resolve: {
    alias: {
      '@/lib/utils': path.resolve(__dirname, '../../libs/ui-components/src/lib/utils'),
      '@components': path.resolve(__dirname, '../../libs/ui-components/src/components/'),
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, '../../libs/public'),
      'shared-types': path.resolve(__dirname, '../../libs/shared-types/src'),
      'ui-components/styles': path.resolve(__dirname, '../../libs/ui-components/src/styles/globals.css'),
    },
  },
  optimizeDeps: {
    include: ['@tanstack/react-table', 'leaflet', 'react-leaflet'],
  },
  build: {
    commonjsOptions: {
      include: [/shared-types/, /node_modules/],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    fs: {
      allow: ['/', '/app', '..', '../../libs'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001/',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3001/',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})

