import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Sidebar } from '../features/dashboard/components/CustomSidebar'

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
    <div className="flex bg-dashboard-bg min-h-screen relative">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-12">
        <Outlet />
      </main>
    </div>
  )
}
