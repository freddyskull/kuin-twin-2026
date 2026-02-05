import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Header } from '../components/header'

export const Route = createFileRoute('/_layout')({
  beforeLoad: async ({ location }) => {
    // Check if we can access the store directly
    const authStore = (await import('../stores/auth.store')).useAuthStore
    await authStore.getState().checkAuth()
    const { isAuthenticated } = authStore.getState()

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
    </div>
  )
}
