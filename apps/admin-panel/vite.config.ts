import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, '../../libs/public'),
      '@ui-components': path.resolve(__dirname, '../../libs/ui-components'),
    },
  },
  optimizeDeps: {
    include: ['shared-types', 'shared-types/zod'],
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
})

