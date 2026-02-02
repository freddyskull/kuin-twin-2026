import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/header'

export const Route = createFileRoute('/_layout')({
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
