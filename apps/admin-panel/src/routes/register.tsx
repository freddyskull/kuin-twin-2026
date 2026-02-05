import { createFileRoute, redirect } from '@tanstack/react-router'
import logo from '@assets/logo-kuin-twin.svg'
import { RegisterForm } from '@/features/auth/registerForm'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    const authStore = (await import('../stores/auth.store')).useAuthStore
    await authStore.getState().checkAuth()
    const { isAuthenticated } = authStore.getState()
    if (isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="grid min-h-svh lg:grid-cols-2 relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <img
          src="/admin/login-image3.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] "
        />
      </div>

      <div className="flex flex-col  p-6 md:p-10 relative">
        <img src={logo} alt="Logo" className="h-40 w-auto" />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm bg-card/30 backdrop-blur-md p-6 rounded-md border border-border/50 mt-4">
            <RegisterForm />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
