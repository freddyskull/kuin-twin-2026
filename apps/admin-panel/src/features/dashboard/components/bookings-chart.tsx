import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '100', bookings: 120 },
  { name: '200', bookings: 110 },
  { name: '300', bookings: 130 },
  { name: '400', bookings: 140 },
  { name: '500', bookings: 220 },
  { name: '600', bookings: 190 },
  { name: '700', bookings: 160 },
  { name: '800', bookings: 250 },
];

export const BookingsChart: React.FC = () => {
  return (
    <div className="glass-card bg-card/60 border border-border/40 rounded-[2.5rem] p-10 h-[500px] flex flex-col relative overflow-hidden group shadow-2xl">
      <div className="flex justify-between items-center mb-10 z-10">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white tracking-tight">Reservas en el Tiempo</h2>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mt-1">Actividad mensual de servicios</p>
        </div>
        <div className="flex bg-background/40 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
          <button className="px-5 py-2 text-sm text-slate-500 font-bold rounded-lg transition-all hover:text-slate-300">Semana</button>
          <button className="px-5 py-2 text-sm text-primary bg-primary/10 rounded-lg transition-all font-black uppercase tracking-wider">Mes</button>
        </div>
      </div>

      <div className="flex-1 w-full z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5c06a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f5c06a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }}
              dy={15}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ stroke: 'rgba(245, 192, 106, 0.2)', strokeWidth: 2 }}
              contentStyle={{
                backgroundColor: 'rgba(17, 18, 45, 0.8)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '16px 20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="hsl(43 96% 56%)"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorBookings)"
              dot={{ r: 0 }}
              activeDot={{ r: 8, fill: 'hsl(43 96% 56%)', stroke: '#11122d', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </div>
  );
};
