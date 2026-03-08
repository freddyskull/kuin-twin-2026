import React, { useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, User, ChevronRight, LogOut, Settings as SettingsIcon, Menu } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { useMessagesStore } from '../stores/messages.store';
import { NotificationBell } from 'ui-components';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, profile, logout } = useAuthStore();
  const { unreadCount, notificationMessages, removeNotification, clearUnread } = useMessagesStore();
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Cerrar popup al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        // setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obtener el nombre de la página basado en la ruta
  const getPageTitle = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length === 0) return 'Dashboard';

    const lastPart = path[path.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
  };

  const breadcrumbs = location.pathname.split('/').filter(Boolean);

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 flex h-16 w-full items-center justify-between px-4 md:px-8 bg-background/60 backdrop-blur-md border-b border-border/50"
    >
      {/* Left Side: Menu Toggle (Mobile) or Breadcrumbs (Desktop) */}
      <div className="flex items-center gap-4">
        {isMobile && (
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {!isMobile && (
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Admin</Link>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb}>
                <ChevronRight className="h-3 w-3 opacity-50" />
                <span className={index === breadcrumbs.length - 1 ? 'text-foreground font-semibold' : 'hover:text-foreground transition-colors cursor-pointer'}>
                  {crumb.replace(/-/g, ' ')}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {isMobile && (
          <h2 className="text-sm font-bold text-foreground truncate max-w-[120px]">
            {getPageTitle()}
          </h2>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar - Desktop Only */}
        {!isMobile && (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-secondary/50 border border-border rounded-lg py-1.5 pl-9 pr-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 transition-all focus:w-64 focus:bg-secondary"
            />
          </div>
        )}

        {!isMobile && <div className="h-4 w-px bg-border/50 mx-2" />}

        {/* Notifications */}
        <NotificationBell
          unreadCount={unreadCount}
          notifications={notificationMessages as any}
          onClearAll={() => clearUnread()}
          onRemoveNotification={(id) => removeNotification(id)}
          onViewAll={() => navigate('/mensajes')}
          onNotificationClick={(msg) => {
            removeNotification(msg.id);
            navigate(`/mensajes/${msg.senderId}`);
          }}
        />

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 group cursor-pointer relative">
          <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 shadow-sm">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>

          {!isMobile && (
            <span className="text-xs font-semibold text-foreground leading-none">
              {profile?.displayName || user?.email?.split('@')[0] || 'Usuario'}
            </span>
          )}

          {/* User Menu Dropdown */}
          <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50">
            <div className="w-48 bg-popover border border-border rounded-xl shadow-xl p-1.5">
              <div className="px-3 py-2 border-b border-border/50 mb-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cuenta</p>
                <p className="text-[11px] font-medium truncate opacity-70">{user?.email}</p>
              </div>
              <Link to="/perfil" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary text-sm font-medium text-foreground/80 hover:text-foreground transition-all">
                <SettingsIcon className="h-3.5 w-3.5" />
                <span>Mi Perfil</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-destructive/10 text-sm font-medium text-muted-foreground hover:text-destructive transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
