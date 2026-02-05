import { createFileRoute } from '@tanstack/react-router'
import { Users, DollarSign, ShoppingCart, LogOut, Activity, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/_layout/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  return (

    <>
      <div className="fixed inset-0 -z-10 bg-gradient-dashboard">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="flex h-screen text-white">
        {/* Sidebar */}
        <aside className="w-72 bg-sidebar-bg backdrop-blur-xl border-r border-card-border flex flex-col">
          <div className="p-8 border-b border-card-border">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-logo flex items-center justify-center shadow-2xl shadow-primary/20">
                <span className="text-5xl font-black text-primary tracking-wider">KU</span>
              </div>
              <h1 className="mt-4 text-2xl font-bold bg-gradient-to-r from-primary to-yellow-200 bg-clip-text text-transparent">
                KUIN TWIN
              </h1>
            </div>
          </div>

          <nav className="flex-1 p-6">
            {/* <ul className="space-y-2">
              {[
                { icon: Home, label: 'Dashboard', active: true },
                { icon: FileText, label: 'Reports' },
                { icon: BarChart3, label: 'Analytics' },
                { icon: Settings, label: 'Settings' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${item.active
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'hover:bg-white/5 text-muted-foreground'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul> */}
          </nav>

          <div className="p-6 border-t border-card-border">
            <a href="#" className="flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-red-900/30 transition">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="">
          <header className="bg-header-bg backdrop-blur-xl border-b border-card-border px-10 py-6 flex justify-between items-center">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <div className="flex items-center gap-6">
              <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <Activity className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-cyan-500 flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </header>

          <div className="p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Revenue Card - Espacio reservado para gráfico */}
              <div className="xl:col-span-1 bg-card backdrop-blur-xl rounded-3xl border border-card-border p-8 shadow-glass">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-muted-foreground">Revenue</h3>
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="h-[250px] flex items-center justify-center bg-black/20 rounded-2xl border border-dashed border-white/20">
                  <p className="text-muted-foreground text-center">
                    Espacio reservado para gráfico de Revenue<br />
                    <span className="text-sm">(Se agregará más adelante)</span>
                  </p>
                </div>
              </div>

              {/* Users Card - Espacio reservado para gráfico */}
              <div className="xl:col-span-1 bg-card backdrop-blur-xl rounded-3xl border border-card-border p-8 shadow-glass">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-muted-foreground">Users</h3>
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div className="h-[250px] flex items-center justify-center bg-black/20 rounded-2xl border border-dashed border-white/20">
                  <p className="text-muted-foreground text-center">
                    Espacio reservado para gráfico de Users<br />
                    <span className="text-sm">(Se agregará más adelante)</span>
                  </p>
                </div>
              </div>

              {/* Traffic Card - Espacio reservado para gráfico */}
              <div className="bg-card backdrop-blur-xl rounded-3xl border border-card-border p-8 shadow-glass">
                <h3 className="text-xl font-semibold text-muted-foreground mb-6">Traffic</h3>
                <div className="h-[280px] flex items-center justify-center bg-black/20 rounded-2xl border border-dashed border-white/20">
                  <p className="text-muted-foreground text-center">
                    Espacio reservado para gráfico de Traffic<br />
                    <span className="text-sm">(Se agregará más adelante)</span>
                  </p>
                </div>
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm text-center">
                    Leyenda y datos se mostrarán aquí cuando se integre el gráfico
                  </p>
                </div>
              </div>

              {/* Stats Card (usuarios activos) - Esta se mantiene como estaba */}
              <div className="bg-card backdrop-blur-xl rounded-3xl border border-card-border p-8 shadow-glass">
                <h3 className="text-xl font-semibold text-muted-foreground mb-6">Usuarios activos</h3>
                <div className="space-y-4">
                  {['24,475', '7,732', '5,418', '3,205', '1,718'].map((num, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary' : 'bg-gray-500'}`} />
                      <span className="text-2xl font-bold text-foreground">{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>

  )
}
