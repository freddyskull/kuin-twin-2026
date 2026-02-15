import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, User, ChevronRight, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, profile, logout } = useAuthStore();
  const location = useLocation();

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
      className="sticky top-0 z-40 flex h-20 w-full items-center justify-between px-8 bg-dashboard-bg/80 backdrop-blur-xl border-b border-white/5"
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
        <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all group">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-dashboard-primary rounded-full border-2 border-[#0a0b1e] animate-pulse" />
        </button>

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
