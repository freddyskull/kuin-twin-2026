import React, { useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, LogOut, Settings as SettingsIcon, Menu } from 'lucide-react';
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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="sticky top-6 z-40 flex h-20 w-[96%] mx-auto items-center justify-between px-6 md:px-10 glass-card bg-card/40 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl mb-4"
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
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/search:text-primary transition-all duration-300" />
            <input
              type="text"
              placeholder="Explorar inteligencia..."
              className="bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-11 pr-6 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 transition-all duration-500 focus:w-80 focus:bg-white/10 placeholder:opacity-50 font-medium"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center pointer-events-none group-focus-within/search:opacity-0 transition-opacity">
               <span className="text-[10px] font-black text-white/30">⌘K</span>
            </div>
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
        <div className="flex items-center gap-3 pl-2 group cursor-pointer relative">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-foreground line-clamp-1">
              {profile?.displayName || user?.email?.split('@')[0] || 'Usuario'}
            </p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-black opacity-60">
              {user?.role || 'Vendedor'}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border-2 border-primary/20 ring-4 ring-primary/5 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:ring-primary/20 shadow-lg relative">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
            ) : (
              <span className="text-primary font-black text-sm">
                {(profile?.displayName || user?.email || 'U').substring(0, 2).toUpperCase()}
              </span>
            )}
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-primary border-2 border-black rounded-full shadow-[0_0_10px_rgba(245,192,106,0.5)]" />
          </div>

          {/* User Menu Dropdown */}
          <div className="absolute right-0 top-full pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
            <div className="w-56 glass-card bg-popover border border-border/50 rounded-2xl shadow-2xl p-2">
              <div className="px-4 py-3 border-b border-border/10 mb-2">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Cuenta Kuin</p>
                <p className="text-xs font-bold truncate text-foreground">{user?.email}</p>
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
