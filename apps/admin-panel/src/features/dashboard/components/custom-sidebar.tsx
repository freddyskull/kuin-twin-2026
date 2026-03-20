import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Building2,
  MessageSquare,
  X,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../stores/auth.store';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { usePendingServicesCount } from '../../bookings/bookings.hooks';
import { useIsMobile } from '../../../hooks/use-mobile';
import { cn } from 'ui-components';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const user = useAuthStore((state) => state.user);
  const pendingCount = usePendingServicesCount(user?.id);

  const handleLogout = () => {
    logout();
    navigate('/iniciar-sesion');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: Plus, label: 'Nuevo Servicio', to: '/servicios/crear' },
    { icon: Briefcase, label: 'Mis Servicios', to: '/servicios' },
    { icon: Building2, label: 'Empresas', to: '/empresas' },
    { icon: MessageSquare, label: 'Mensajes', to: '/mensajes' },
    { icon: ShoppingBag, label: 'Pedidos', to: '/pedidos', badge: pendingCount > 0 ? pendingCount : null },
    { icon: BarChart3, label: 'Estadísticas', to: '/estadisticas' },
    { icon: Settings, label: 'Ajustes', to: '/ajustes' },
  ];

  return (
    <aside 
      data-sidebar="sidebar"
      className={cn(
        "fixed left-6 top-6 bottom-6 w-64 glass-card bg-card/60 border border-white/10 flex flex-col p-6 z-[60] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-[2.5rem] shadow-2xl",
        isMobile && !isOpen ? "-translate-x-[120%]" : "translate-x-0"
      )}>
      {/* Background Glow */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
      {/* Logo & Close Button */}
      <div className="flex items-center justify-between mb-12 px-2">
        <Link to="/" className="flex items-center gap-2 group/logo">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 transition-all duration-300">
            <span className="text-primary-foreground font-black text-xl">K</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading tracking-tighter text-primary leading-none">
              KUIN<span className="text-white">TWIN</span>
            </span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-0.5 opacity-60">Admin Panel</span>
          </div>
        </Link>
        
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2 -mr-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.to}
                className="block"
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-500 relative group/item text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
                >
                  <item.icon className="h-5 w-5 transition-colors duration-300 group-hover/item:text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest flex-1 opacity-70 group-hover/item:opacity-100">
                     {item.label}
                  </span>
                </motion.div>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.to as any}
              className="block"
              onClick={() => isMobile && onClose?.()}
            >
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-500 relative group/item",
                  isActive
                    ? 'bg-primary text-black shadow-xl shadow-primary/25 border border-primary/50'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent'
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  isActive ? 'text-black' : 'text-muted-foreground group-hover/item:text-primary'
                )} />
                <span className={cn(
                  "text-xs font-black uppercase tracking-widest flex-1",
                  isActive ? "text-shadow-none" : "opacity-70 group-hover/item:opacity-100"
                )}>
                   {item.label}
                </span>

                {item.badge && (
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-lg text-[10px] font-black shadow-lg",
                    isActive ? "bg-black text-primary" : "bg-primary text-primary-foreground shadow-primary/20"
                  )}>
                    {item.badge}
                  </span>
                )}
              </motion.div>

            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-all py-3 rounded-2xl hover:bg-destructive/5 group"
        >
          <LogOut className="h-4 w-4 transition-colors" />
          <span>Finalizar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
