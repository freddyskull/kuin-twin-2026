import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'In-Home Service', value: 4291, color: '#f5c06a' },
  { name: 'Virtual Session', value: 1502, color: '#475569' },
];

export const ServiceDistribution: React.FC = () => {
  return (
    <div className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-10 tracking-tight">Service Distribution</h2>

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
          <span className="text-5xl font-black text-white leading-none mb-2">72%</span>
          <span className="text-xs text-slate-500 font-bold tracking-[0.3em] uppercase">In-Home</span>
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
