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
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@/lib/utils': path.resolve(__dirname, '../../libs/ui-components/src/lib/utils'),
      '@components': path.resolve(__dirname, '../../libs/ui-components/src/components/'),
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, '../../libs/public'),
      'shared-types': path.resolve(__dirname, '../../libs/shared-types/src/index.ts'),
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
    proxy: {
      '/api': {
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

