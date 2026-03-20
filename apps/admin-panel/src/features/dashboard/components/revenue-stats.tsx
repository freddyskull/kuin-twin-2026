import React from 'react';
import { CreditCard, TrendingUp } from 'lucide-react';

export const RevenueCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-primary to-primary/60 rounded-[2.5rem] p-8 h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group border border-white/10">
      {/* Glossy overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-1000" />

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-white/80 text-base font-bold mb-2">Ingresos Totales</p>
          <h2 className="text-[2.75rem] font-black text-white tracking-tighter leading-tight">$48,295.50</h2>
        </div>
        <div className="bg-white/20 p-3 rounded-[1.25rem] backdrop-blur-md border border-white/30">
          <CreditCard className="h-7 w-7 text-white" />
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30">
          <TrendingUp className="h-5 w-5 text-white" />
          <span className="text-sm font-black text-white">+12.4% desde el mes pasado</span>
        </div>
      </div>
    </div>
  );
};

export const ActiveUsers: React.FC = () => {
  const stats = [
    { label: 'Reservas Activas', value: '2,147', color: 'bg-primary' },
    { label: 'Solicitudes Pendientes', value: '0,792', color: 'bg-slate-700' },
    { label: 'Completado Hoy', value: '1,318', color: 'bg-slate-700' },
  ];

  return (
    <div className="glass-card bg-card border border-white/5 rounded-[2.5rem] p-10 h-full">
      <h2 className="text-2xl font-bold text-white mb-10 tracking-tight">Actividad de Usuarios</h2>

      <div className="space-y-10">
        {stats.map((stat, index) => (
          <div key={index} className="flex gap-6 items-center">
            <div className={`w-2 h-12 rounded-full ${stat.color} shadow-[0_0_15px_rgba(245,192,106,0.3)]`} />
            <div>
              <p className="text-[1.75rem] font-black text-white leading-none mb-1.5 tracking-tighter">{stat.value}</p>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] leading-none">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
