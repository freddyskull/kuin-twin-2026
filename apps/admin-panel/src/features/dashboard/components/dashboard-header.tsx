import React from 'react';
import { Search, Bell } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Panel Premium</h1>
        <p className="text-slate-400 font-medium">Bienvenido de nuevo, tus servicios están rindiendo bien hoy.</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar información..."
            className="bg-[#1a1c3d]/60 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50 w-80 transition-all placeholder:text-slate-500"
          />
        </div>

        <button className="bg-[#1a1c3d]/60 p-3 rounded-2xl border border-white/5 text-slate-400 hover:text-white transition-all relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-3 right-3.5 h-2 w-2 bg-dashboard-primary rounded-full"></span>
        </button>

        <div className="flex items-center gap-4 ml-2">
          <div className="text-right">
            <p className="text-sm font-bold text-white leading-none mb-1">Alexandre V.</p>
            <p className="text-xs text-slate-500 font-medium">Socio Premium</p>
          </div>
          <div className="h-12 w-12 rounded-full p-[2px] bg-gradient-to-br from-[#1a1c3d] to-dashboard-primary/20">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre"
              alt="Avatar"
              className="h-full w-full rounded-full object-cover bg-dashboard-sidebar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
