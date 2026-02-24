import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, LayoutDashboard } from 'lucide-react';
import { useServices, useDeleteService, useToggleServiceStatus } from './services.hooks';
import { Button, DataTable } from 'ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/modal';
import { ServiceCompanyManager } from './components/service-company-manager';
import { motion, AnimatePresence } from 'framer-motion';

export const ServicesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const limit = 10;

  const { data, isLoading, error } = useServices({
    page,
    limit,
    isActive: filter === 'all' ? undefined : (filter === 'active')
  });

  const services = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const deleteMutation = useDeleteService();
  const toggleStatusMutation = useToggleServiceStatus();

  const [statusConfirm, setStatusConfirm] = React.useState<{ id: string, title: string, nextStatus: boolean } | null>(null);
  const [selectedServiceForCompanies, setSelectedServiceForCompanies] = React.useState<any | null>(null);

  const handleToggleStatus = (id: string, title: string, currentStatus: boolean) => {
    setStatusConfirm({ id, title, nextStatus: !currentStatus });
  };

  const confirmToggleStatus = async () => {
    if (statusConfirm) {
      try {
        await toggleStatusMutation.mutateAsync({ id: statusConfirm.id, isActive: statusConfirm.nextStatus });
        setStatusConfirm(null);
      } catch (err) {
        console.error('Error al cambiar estado del servicio:', err);
      }
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el servicio "${title}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Error al eliminar servicio:', err);
      }
    }
  };

  const handleFilterChange = (f: 'all' | 'active' | 'inactive') => {
    setFilter(f);
    setPage(1); // Reset to first page on filter change
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Servicio',
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center gap-4" title={service.title}>
            <div className="h-12 w-12 rounded-xl bg-[#0a0b1e] overflow-hidden flex items-center justify-center border border-white/5 flex-shrink-0">
              {service.imageUrl ? (
                <img src={service.imageUrl.startsWith('http') ? service.imageUrl : `http://localhost:3001${service.imageUrl}`} alt={service.title} className="h-full w-full object-cover" />
              ) : (
                <LayoutDashboard className="h-6 w-6 text-slate-600" />
              )}
            </div>
            <div className="max-w-[200px]">
              <div className="font-bold text-white tracking-tight truncate">{service.title}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider h-[1.5em] overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                {service.category?.name || 'Sin Categoría'}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'company',
      header: 'Empresa',
      cell: ({ row }) => {
        const company = row.original.company;
        if (!company) return <span className="text-slate-500 italic">Sin empresa</span>;

        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-400 border border-white/5">
              {company.businessName}
            </span>
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
        <>
          {row.original.showPrice ? (
            <div className="font-bold text-white">
              ${Number(row.getValue('basePrice')).toFixed(2)}
            </div>
          ) : (
            <span className="text-dashboard-primary font-bold italic">Cotización</span>
          )}
        </>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedServiceForCompanies(service)}
              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all"
              title="Gestionar Sucursales"
            >
              <LayoutDashboard className="h-4 w-4" />
            </button>
            <Link to={`/servicios/${service.id}/editar`}>
              <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-dashboard-primary hover:bg-dashboard-primary/10 transition-all" title="Editar Servicio">
                <Pencil className="h-4 w-4" />
              </button>
            </Link>
            <button
              onClick={() => handleDelete(service.id, service.title)}
              disabled={deleteMutation.isPending || service.isActive}
              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Eliminar Servicio"
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
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/servicios/crear">
            <Button>
              <Plus className="h-5 w-5 stroke-[3]" />
              Añadir Nuevo Servicio
            </Button>
          </Link>

          <div className="flex bg-[#1a1c3d]/60 p-1.5 rounded-2xl border border-white/5">
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
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
          Error: {(error as Error).message}
        </div>
      )}
      <p className="text-slate-500  text-sm font-bold italic">para poder borrar servicios primero debes cambiar su estado a inactivo</p>
      <div className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden">
        <DataTable
          columns={columns}
          data={services}
          isLoading={isLoading}
          emptyMessage="No se encontraron servicios con los criterios seleccionados."
          className="border-none"
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/5 flex items-center justify-between bg-white/5">
            <div className="text-sm text-slate-500 font-bold">
              Mostrando <span className="text-white">{(page - 1) * limit + 1}</span> a <span className="text-white">{Math.min(page * limit, total)}</span> de <span className="text-white">{total}</span> servicios
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl px-4"
              >
                Anterior
              </Button>
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${p === page ? 'bg-dashboard-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-xl px-4"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
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
                  className={`flex-1 px-6 py-3.5 rounded-xl font-bold text-primary shadow-lg transition-all text-sm ${statusConfirm.nextStatus ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`}
                >
                  Confirmar Cambio
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={!!selectedServiceForCompanies}
        onClose={() => setSelectedServiceForCompanies(null)}
        title="Asignar Sucursales"
        size="lg"
      >
        {selectedServiceForCompanies && (
          <ServiceCompanyManager
            service={selectedServiceForCompanies}
            onClose={() => setSelectedServiceForCompanies(null)}
          />
        )}
      </Modal>
    </div>
  );
};
