import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Plus, Search, Pencil, Trash2, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServicesStore } from '../../stores/services.store';

export const ServicesPage: React.FC = () => {
  const { services, fetchServices, filter, setFilter, deleteService, toggleServiceStatus, error, isLoading } = useServicesStore();
  const [statusConfirm, setStatusConfirm] = React.useState<{ id: string, title: string, nextStatus: boolean } | null>(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const handleToggleStatus = (id: string, title: string, currentStatus: boolean) => {
    setStatusConfirm({ id, title, nextStatus: !currentStatus });
  };

  const confirmToggleStatus = async () => {
    if (statusConfirm) {
      await toggleServiceStatus(statusConfirm.id, statusConfirm.nextStatus);
      setStatusConfirm(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el servicio "${title}"?`)) {
      await deleteService(id);
    }
  };

  const filteredServices = services.filter(s => {
    const matchesFilter = filter === 'all' || (filter === 'active' ? s.isActive : !s.isActive);
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Custom Header for Services */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Mis Servicios</h1>
          <p className="text-slate-400 font-medium">Gestiona tus ofertas de servicios profesionales y disponibilidad.</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              Añadir Nuevo Servicio
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
                {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
              </button>
            ))}
          </div>
        </div>

        <div className="text-slate-400 font-bold text-sm">
          Total: <span className="text-white ml-1">{filteredServices.length}</span> Servicios
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl font-bold text-sm animate-in slide-in-from-top-4 duration-300">
          Error: {error}
        </div>
      )}

      {/* Services List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {paginatedServices.map((service) => (
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
                    <img src={service.imageUrl.startsWith('http') ? service.imageUrl : `http://localhost:3001${service.imageUrl}`} alt={service.title} className="h-full w-full object-cover" />
                  ) : (
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre" className="h-20 w-20" />
                  )}
                </div>

                <div className="flex-1 max-w-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{service.title}</h3>
                    <button
                      onClick={() => handleToggleStatus(service.id, service.title, service.isActive)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all hover:scale-105 active:scale-95 ${service.isActive ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                        }`}
                      title={service.isActive ? "Click para desactivar" : "Click para activar"}
                    >
                      {service.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed mb-4">
                    {service.description || 'No se ha proporcionado una descripción para este servicio.'}
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
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Precio</p>
                  <p className="text-3xl font-black text-white tracking-tighter">${Number(service.basePrice).toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Link to={`/services/${service.id}/edit`}>
                    <button className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-dashboard-primary hover:bg-dashboard-primary/10 transition-all active:scale-90">
                      <Pencil className="h-5 w-5" />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(service.id, service.title)}
                    disabled={isLoading || service.isActive}
                    title={service.isActive ? "Desactiva el servicio antes de eliminarlo" : "Eliminar servicio"}
                    className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
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
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 pb-12">
          <div className="flex items-center gap-2 bg-[#1a1c3d]/60 p-2 rounded-2xl border border-white/5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 text-slate-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-10 w-10 font-bold rounded-xl transition-all ${currentPage === i + 1
                  ? 'bg-dashboard-primary text-dashboard-bg font-black'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 text-slate-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
      {/* Confirmation Dialog */}
      <AnimatePresence>
        {statusConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setStatusConfirm(null)}
              className="absolute inset-0 bg-[#0a0b1e]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#1a1c3d] border border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">¿Cambiar Estado?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Estás a punto de cambiar <span className="text-white font-bold">"{statusConfirm.title}"</span> a{' '}
                  <span className={`font-bold ${statusConfirm.nextStatus ? 'text-green-500' : 'text-red-500'}`}>
                    {statusConfirm.nextStatus ? 'ACTIVO' : 'INACTIVO'}
                  </span>.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStatusConfirm(null)}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmToggleStatus}
                  className={`flex-1 px-6 py-3.5 rounded-xl font-bold text-dashboard-bg shadow-lg transition-all text-sm ${statusConfirm.nextStatus ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'
                    }`}
                >
                  Confirmar Cambio
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
