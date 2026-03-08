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
  X
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
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-72 bg-sidebar border-r border-sidebar-border flex flex-col p-6 z-50 transition-transform duration-300 ease-in-out",
      isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
    )}>
      {/* Logo & Close Button */}
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-black text-lg">K</span>
          </div>
          <span className="font-bold text-white tracking-tight text-lg">Kuin Twin</span>
        </div>
        
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
                  "flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-200 relative group/item",
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent'
                )}
              >
                <item.icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover/item:text-foreground'}`} />
                <span className="font-medium text-sm flex-1">{item.label}</span>

                {item.badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary text-[10px] font-black text-primary-foreground shadow-lg shadow-primary/20">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-muted-foreground hover:text-destructive transition-colors px-4 py-2.5 rounded-xl hover:bg-destructive/5 group"
        >
          <LogOut className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
          <span className="font-semibold text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
