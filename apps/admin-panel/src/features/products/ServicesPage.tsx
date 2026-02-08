import React, { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus, Search, Pencil, Trash2, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServicesStore } from '../../stores/services.store';

export const ServicesPage: React.FC = () => {
  const { services, fetchServices, filter, setFilter, isLoading, deleteService } = useServicesStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = services.filter(s => {
    if (filter === 'active') return s.isActive;
    if (filter === 'inactive') return !s.isActive;
    return true;
  });

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Custom Header for Services */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">My Services</h1>
          <p className="text-slate-400 font-medium">Manage your professional service offerings and availability.</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search services..."
              className="bg-[#1a1c3d]/60 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50 w-80 transition-all placeholder:text-slate-500"
            />
          </div>
          <div className="flex p-[2px] bg-gradient-to-br from-[#1a1c3d] to-dashboard-primary/20 rounded-full h-12 w-12">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre" className="rounded-full bg-dashboard-sidebar" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/services/create">
            <button className="flex items-center gap-3 bg-dashboard-primary text-dashboard-bg px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-dashboard-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Plus className="h-5 w-5 stroke-[3]" />
              Add New Service
            </button>
          </Link>

          <div className="flex bg-[#1a1c3d]/60 p-1.5 rounded-2xl border border-white/5">
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all capitalize ${filter === f
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                {f} Services
              </button>
            ))}
          </div>
        </div>

        <div className="text-slate-400 font-bold text-sm">
          Total: <span className="text-white ml-1">{filteredServices.length}</span> Services
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group flex items-center justify-between p-8 rounded-[2.5rem] bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 hover:border-dashboard-primary/30 transition-all"
            >
              <div className="flex items-center gap-8 flex-1">
                <div className="h-24 w-24 rounded-3xl bg-[#0a0b1e] overflow-hidden flex items-center justify-center border border-white/5">
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover" />
                  ) : (
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre" className="h-20 w-20" />
                  )}
                </div>

                <div className="flex-1 max-w-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{service.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${service.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed mb-4">
                    {service.description || 'No description provided for this service yet.'}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <Clock className="h-4 w-4" />
                      60-90 Mins
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <Star className="h-4 w-4 text-dashboard-primary fill-dashboard-primary" />
                      4.9 (128 reviews)
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12 pl-12">
                <div className="text-right">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-3xl font-black text-white tracking-tighter">${Number(service.basePrice).toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-dashboard-primary hover:bg-dashboard-primary/10 transition-all active:scale-90">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12 pb-12">
        <div className="flex items-center gap-2 bg-[#1a1c3d]/60 p-2 rounded-2xl border border-white/5">
          <button className="p-3 text-slate-500 hover:text-white transition-all disabled:opacity-30" disabled>&lt;</button>
          <button className="h-10 w-10 bg-dashboard-primary text-dashboard-bg font-black rounded-xl">1</button>
          <button className="h-10 w-10 text-slate-400 hover:text-white font-bold transition-all">2</button>
          <button className="h-10 w-10 text-slate-400 hover:text-white font-bold transition-all">3</button>
          <button className="p-3 text-slate-500 hover:text-white transition-all">&gt;</button>
        </div>
      </div>
    </div>
  );
};
