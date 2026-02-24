import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, ChevronRight, LogOut, Settings as SettingsIcon, MessageSquare, Clock, X } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { useMessagesStore } from '../stores/messages.store';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, profile, logout } = useAuthStore();
  const { unreadCount, notificationMessages, removeNotification, clearUnread } = useMessagesStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Cerrar popup al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
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

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 flex h-20 w-full items-center justify-between px-8 bg-background/80 backdrop-blur-xl border-b border-white/5"
    >
      {/* Breadcrumbs / Page Title */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
          <Link to="/" className="hover:text-dashboard-primary transition-colors">Admin</Link>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb}>
              <ChevronRight className="h-3 w-3" />
              <span className={index === breadcrumbs.length - 1 ? 'text-slate-300' : 'hover:text-dashboard-primary transition-colors cursor-pointer'}>
                {crumb.replace(/-/g, ' ')}
              </span>
            </React.Fragment>
          ))}
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Search Bar - Aesthetic only for now */}
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-dashboard-primary transition-colors" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30 w-64 transition-all focus:bg-white/10"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl border transition-all group ${showNotifications
              ? 'bg-dashboard-primary/10 border-dashboard-primary/50 text-dashboard-primary'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 bg-dashboard-primary rounded-full border-2 border-[#0a0b1e] animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 bg-[#1a1c3d]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden shadow-black/80"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Notificaciones</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={() => clearUnread()}
                        className="text-[10px] font-bold text-dashboard-primary hover:underline"
                      >
                        Limpiar todo
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)}>
                      <X className="h-4 w-4 text-slate-500 hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notificationMessages.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {notificationMessages.map((msg) => {
                        const { date, time } = formatMessageDate(msg.createdAt);
                        return (
                          <div
                            key={msg.id}
                            onClick={() => {
                              removeNotification(msg.id);
                              navigate(`/mensajes/${msg.senderId}`);
                              setShowNotifications(false);
                            }}
                            className="p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                          >
                            <div className="flex gap-3">
                              <div className="h-10 w-10 rounded-xl bg-dashboard-primary/10 border border-dashboard-primary/20 flex items-center justify-center shrink-0 group-hover:bg-dashboard-primary/20 transition-all">
                                {msg.sender.profile?.avatarUrl ? (
                                  <img src={msg.sender.profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover rounded-xl" />
                                ) : (
                                  <MessageSquare className="h-5 w-5 text-dashboard-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white truncate">
                                    {msg.sender.profile?.displayName || msg.sender.email}
                                  </span>
                                  <span className="text-[9px] font-medium text-slate-500 whitespace-nowrap">
                                    {date}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                  {msg.content}
                                </p>
                                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600">
                                  <Clock className="h-3 w-3" />
                                  {time}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Bell className="h-6 w-6 text-slate-600" />
                      </div>
                      <p className="text-xs font-medium text-slate-500">No tienes mensajes nuevos</p>
                    </div>
                  )}
                </div>

                <Link
                  to="/mensajes"
                  onClick={() => setShowNotifications(false)}
                  className="block p-3 text-center bg-white/5 border-t border-white/10 text-[10px] font-bold text-slate-400 hover:text-dashboard-primary hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                  Ver todos los mensajes
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Dropdown Placeholder */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10 group cursor-pointer relative">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-white group-hover:text-dashboard-primary transition-colors">
              {profile?.displayName || user?.email?.split('@')[0] || 'Usuario'}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {user?.role || 'Admin'}
            </span>
          </div>

          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-dashboard-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-dashboard-primary/50 transition-all shadow-lg">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-dashboard-primary" />
            )}
          </div>

          {/* User Menu Tooltip/Dropdown simulation */}
          <div className="absolute right-0 top-full pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 translate-x-0 z-50">
            <div className="w-56 bg-[#1a1c3d] border border-white/10 rounded-2xl shadow-2xl p-3 space-y-1 shadow-black/80">
              <Link to="/perfil" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all">
                <SettingsIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Mi Cuenta</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
