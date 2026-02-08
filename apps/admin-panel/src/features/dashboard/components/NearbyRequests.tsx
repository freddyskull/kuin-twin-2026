import React from 'react';
import { Flower2, Utensils, Car } from 'lucide-react';
import { motion } from 'framer-motion';

const requests = [
  {
    id: 1,
    title: 'Luxury Spa Concierge',
    distance: '2.4 miles away',
    time: '45 mins',
    price: '$180.00',
    status: 'URGENT',
    icon: Flower2,
  },
  {
    id: 2,
    title: 'Private Chef Experience',
    distance: '5.1 miles away',
    time: 'Tomorrow',
    price: '$450.00',
    status: 'STANDARD',
    icon: Utensils,
  },
  {
    id: 3,
    title: 'Chauffeur Service',
    distance: '0.8 miles away',
    time: 'Scheduled',
    price: '$120.00',
    status: 'LUXURY',
    icon: Car,
  }
];

export const NearbyRequests: React.FC = () => {
  return (
    <div className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 h-full overflow-hidden">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold text-white tracking-tight">Nearby Professional Requests</h2>
        <button className="text-sm font-bold text-dashboard-primary hover:text-dashboard-primary/80 transition-all uppercase tracking-widest">View All</button>
      </div>

      <div className="space-y-6">
        {requests.map((req) => (
          <motion.div
            key={req.id}
            whileHover={{ scale: 1.01 }}
            className="group flex items-center justify-between p-6 rounded-3xl bg-[#0a0b1e]/40 border border-white/5 hover:border-dashboard-primary/30 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-[#1a1c3d] flex items-center justify-center text-dashboard-primary shadow-lg border border-white/5 group-hover:bg-dashboard-primary/10 transition-colors">
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
                <p className={`text-[11px] font-black tracking-[0.2em] ${req.status === 'URGENT' ? 'text-red-500' : 'text-slate-500'} uppercase`}>{req.status}</p>
              </div>
              <button className="bg-dashboard-primary hover:bg-dashboard-primary/90 text-dashboard-bg px-8 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-dashboard-primary/20 transition-all active:scale-95">
                Accept
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
