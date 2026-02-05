import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ThemeProvider } from "@/components/theme-provider"
import './index.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a new router instance
const router = createRouter({
  routeTree,
  basepath: '/admin'
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
