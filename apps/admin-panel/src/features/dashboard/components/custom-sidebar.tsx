import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../stores/auth.store';
import { useNavigate, Link, useLocation } from 'react-router-dom';


export const Sidebar: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/iniciar-sesion');
  };


  const menuItems = [
    { icon: LayoutDashboard, label: 'Panel Control', to: '/' },
    { icon: Plus, label: 'Nuevo Servicio', to: '/servicios/crear' },
    { icon: Briefcase, label: 'Mis Servicios', to: '/servicios' },
    { icon: Building2, label: 'Empresas', to: '/empresas' },
    { icon: ShoppingBag, label: 'Pedidos', to: '/pedidos' },
    { icon: BarChart3, label: 'Estadísticas', to: '/estadisticas' },
    { icon: Settings, label: 'Ajustes', to: '/ajustes' },
  ];


  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-dashboard-sidebar flex flex-col p-8 z-50">
      {/* Logo */}
      <div className="flex items-center gap-4 mb-16">
        <div className="h-10 w-10 rounded-xl bg-dashboard-primary flex items-center justify-center shadow-[0_0_20px_rgba(245,192,106,0.3)]">
          <span className="text-dashboard-bg font-black text-xl">K</span>
        </div>
        <span className="font-bold text-white tracking-[0.2em] text-sm">KUIN TWIN</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to as any}
              className="block"
            >
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 ${isActive
                  ? 'bg-dashboard-primary/10 text-dashboard-primary shadow-[inset_0_0_20px_rgba(245,192,106,0.05)] border-l-4 border-dashboard-primary'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-dashboard-primary' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-4 text-red-500 hover:text-red-400 transition-colors p-4 mt-auto group"
      >
        <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
        <span className="font-semibold">Cerrar Sesión</span>
      </button>
    </aside>
  );
};
