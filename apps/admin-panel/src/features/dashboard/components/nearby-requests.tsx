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
    <div className="glass-card bg-card/40 border border-border/40 rounded-[2.5rem] p-8 h-full shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-xl font-bold font-heading text-white tracking-tight">Solicitudes Cercanas</h2>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Servicios disponibles en tu zona</p>
        </div>
        <button className="text-[10px] font-black text-primary hover:bg-primary/20 transition-all uppercase tracking-[0.2em] px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">Ver Todo</button>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <motion.div
            key={req.id}
            whileHover={{ y: -2 }}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-200 gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center text-primary group-hover:bg-primary/5 transition-colors shrink-0">
                <req.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{req.title}</h3>
                <p className="text-[11px] text-muted-foreground font-medium truncate">
                  {req.distance} <span className="mx-1.5 opacity-30">•</span> {req.time}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-border/50 pt-3 sm:pt-0">
              <div className="text-left sm:text-right">
                <p className="text-sm font-bold text-foreground">{req.price}</p>
                <p className={`text-[9px] font-black tracking-widest ${req.status === 'URGENTE' ? 'text-destructive' : 'text-muted-foreground'} uppercase`}>{req.status}</p>
              </div>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm whitespace-nowrap">
                Aceptar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
