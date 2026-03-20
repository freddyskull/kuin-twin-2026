import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Servicio a Domicilio', value: 4291, color: '#f5c06a' },
  { name: 'Sesión Virtual', value: 1502, color: '#475569' },
];

export const ServiceDistribution: React.FC = () => {
  return (
    <div className="glass-card bg-card/40 border border-border/40 rounded-[2.5rem] p-10 h-full flex flex-col shadow-2xl">
      <h2 className="text-2xl font-bold font-heading text-white tracking-tight mb-8">Uso del Servicio</h2>

      <div className="flex-1 relative min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={115}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-5xl font-black text-white leading-none mb-1">72%</span>
          <span className="text-[10px] text-primary font-black tracking-[0.2em] uppercase">Local</span>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-base text-slate-400 font-medium">{item.name}</span>
            </div>
            <span className="text-base font-bold text-white">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
