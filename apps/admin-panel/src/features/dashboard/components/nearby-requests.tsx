import React from 'react';
import { Flower2, Utensils, Car } from 'lucide-react';
import { motion } from 'framer-motion';

const requests = [
  {
    id: 1,
    title: 'Conserje de Spa de Lujo',
    distance: 'a 2.4 millas',
    time: '45 mins',
    price: '$180.00',
    status: 'URGENTE',
    icon: Flower2,
  },
  {
    id: 2,
    title: 'Chef Privado',
    distance: 'a 5.1 millas',
    time: 'Mañana',
    price: '$450.00',
    status: 'ESTÁNDAR',
    icon: Utensils,
  },
  {
    id: 3,
    title: 'Servicio de Chofer',
    distance: 'a 0.8 millas',
    time: 'Programado',
    price: '$120.00',
    status: 'LUJO',
    icon: Car,
  }
];

export const NearbyRequests: React.FC = () => {
  return (
    <div className="bg-card backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 h-full overflow-hidden">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold text-white tracking-tight">Solicitudes Profesionales Cercanas</h2>
        <button className="text-sm font-bold text-primary hover:text-primary/80 transition-all uppercase tracking-widest">Ver Todo</button>
      </div>

      <div className="space-y-6">
        {requests.map((req) => (
          <motion.div
            key={req.id}
            whileHover={{ scale: 1.01 }}
            className="group flex items-center justify-between p-6 rounded-3xl bg-background/40 border border-white/5 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-card flex items-center justify-center text-primary shadow-lg border border-white/5 group-hover:bg-primary/10 transition-colors">
                <req.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5">{req.title}</h3>
                <p className="text-sm text-slate-500 font-medium">
                  {req.distance} <span className="mx-2">•</span> {req.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="text-right">
                <p className="text-xl font-black text-white mb-1 tracking-tight">{req.price}</p>
                <p className={`text-[11px] font-black tracking-[0.2em] ${req.status === 'URGENTE' ? 'text-red-500' : 'text-slate-500'} uppercase`}>{req.status}</p>
              </div>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-primary/20 transition-all active:scale-95">
                Aceptar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
