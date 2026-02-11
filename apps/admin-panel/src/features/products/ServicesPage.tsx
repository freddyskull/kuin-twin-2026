import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServicesStore } from '../../stores/services.store';
import { DataTable } from 'ui-components';
import type { ColumnDef } from '@tanstack/react-table';

export const ServicesPage: React.FC = () => {
  const { services, fetchServices, filter, setFilter, deleteService, toggleServiceStatus, error, isLoading } = useServicesStore();
  const [statusConfirm, setStatusConfirm] = React.useState<{ id: string, title: string, nextStatus: boolean } | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesFilter = filter === 'all' || (filter === 'active' ? s.isActive : !s.isActive);
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [services, filter, searchQuery]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Servicio',
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#0a0b1e] overflow-hidden flex items-center justify-center border border-white/5 flex-shrink-0">
              {service.imageUrl ? (
                <img src={service.imageUrl.startsWith('http') ? service.imageUrl : `http://localhost:3001${service.imageUrl}`} alt={service.title} className="h-full w-full object-cover" />
              ) : (
                <LayoutDashboard className="h-6 w-6 text-slate-600" />
              )}
            </div>
            <div>
              <div className="font-bold text-white tracking-tight">{service.title}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider h-[1.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                {service.category?.name || 'Sin Categoría'}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) => {
        const service = row.original;
        return (
          <button
            onClick={() => handleToggleStatus(service.id, service.title, service.isActive)}
            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all hover:scale-105 active:scale-95 ${service.isActive ? 'bg-green-500/20 text-green-500 active:bg-green-500/40' : 'bg-red-500/20 text-red-500 active:bg-red-500/40'}`}
          >
            {service.isActive ? 'Activo' : 'Inactivo'}
          </button>
        );
      },
    },
    {
      accessorKey: 'basePrice',
      header: 'Precio',
      cell: ({ row }) => (
        <div className="font-bold text-white">
          ${Number(row.getValue('basePrice')).toFixed(2)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link to={`/services/${service.id}/edit`}>
              <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-dashboard-primary hover:bg-dashboard-primary/10 transition-all">
                <Pencil className="h-4 w-4" />
              </button>
            </Link>
            <button
              onClick={() => handleDelete(service.id, service.title)}
              disabled={isLoading || service.isActive}
              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
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
        </div>
      </div>

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
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl font-bold text-sm">
          Error: {error}
        </div>
      )}

      <div className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredServices}
          isLoading={isLoading}
          emptyMessage="No se encontraron servicios con los criterios seleccionados."
          className="border-none"
        />
      </div>

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
                  className={`flex-1 px-6 py-3.5 rounded-xl font-bold text-dashboard-bg shadow-lg transition-all text-sm ${statusConfirm.nextStatus ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`}
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
