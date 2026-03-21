import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, LayoutDashboard, Building2, XCircle } from 'lucide-react';
import { useServices, useDeleteService, useToggleServiceStatus } from './services.hooks';
import { useAuthStore } from '../../stores/auth.store';
import { getAbsoluteUrl, ResourceTable, useQueryState, useQueryPagination } from 'ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import type { ServiceDto } from 'shared-types';
import { Modal } from '@/components/Modal';
import { ServiceCompanyManager } from './components/service-company-manager';
import { motion, AnimatePresence } from 'framer-motion';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // URL-Synced state
  const [page, setPage] = useQueryPagination();
  const [filter, setFilter] = useQueryState<'all' | 'active' | 'inactive'>('filter', 'all');
  const [searchTerm, setSearchTerm] = useQueryState('search', '');
  
  const limit = 10;

  const { data, isLoading, error } = useServices({
    page,
    limit,
    isActive: filter === 'all' ? undefined : (filter === 'active'),
    vendorId: user?.role === 'ADMIN' ? undefined : user?.id,
    search: searchTerm || undefined
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
  };

  const columns: ColumnDef<ServiceDto>[] = [
    {
      accessorKey: 'title',
      header: 'Servicio',
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center gap-3" title={service.title}>
            <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden flex items-center justify-center border border-border flex-shrink-0">
              {service.imageUrl ? (
                <img src={getAbsoluteUrl(service.imageUrl) || ''} alt={service.title} className="h-full w-full object-cover" />
              ) : (
                <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="max-w-[220px] min-w-0">
              <div className="font-bold text-foreground text-xs truncate">{service.title}</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">
                {service.category?.name || 'Sin Categoría'}
              </div>
            </div>
          </div>
        );
      },
    },
    ...(user?.role === 'ADMIN' ? [{
      accessorKey: 'vendor',
      header: 'Vendedor',
      cell: ({ row }: { row: any }) => {
        const vendor = row.original.vendor;
        const profile = vendor?.profile;
        return (
          <div className="max-w-[150px]">
            <div className="text-[10px] font-bold text-foreground truncate">
              {profile?.displayName || 'Sin nombre'}
            </div>
            <div className="text-[9px] text-muted-foreground truncate italic">
              {vendor?.email}
            </div>
          </div>
        );
      },
    }] : []),
    {
      accessorKey: 'company',
      header: 'Empresa',
      cell: ({ row }) => {
        const company = row.original.company;
        if (!company) return <span className="text-muted-foreground text-[10px] italic font-medium">No asignada</span>;

        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/50 text-muted-foreground border border-border/50 truncate max-w-[150px]">
            {company.businessName}
          </span>
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
            onClick={() => handleToggleStatus(service.id as string, service.title, service.isActive)}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all border ${service.isActive 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
              : 'bg-muted text-muted-foreground border-border'}`}
          >
            {service.isActive ? 'Activo' : 'Inactivo'}
          </button>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Creado',
      cell: ({ row }) => {
        const date = row.original.createdAt;
        if (!date) return <span className="text-muted-foreground text-[10px]">-</span>;
        return (
          <div className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
            {new Intl.DateTimeFormat('es-MX', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            }).format(new Date(date))}
          </div>
        );
      },
    },
    {
      accessorKey: 'basePrice',
      header: 'Precio',
      cell: ({ row }) => {
        const price = Number(row.original.basePrice);
        return (
          <div className="text-xs font-bold text-foreground">
            {row.original.showPrice ? (
              new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(price)
            ) : (
              <span className="text-primary italic">Cotización</span>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setSelectedServiceForCompanies(service)}
              className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-primary/20"
              title="Sucursales"
            >
              <Building2 className="h-3.5 w-3.5" />
            </button>
            <Link to={`/servicios/${service.id}/editar`}>
              <button className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-all" title="Editar">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </Link>
            <button
              onClick={() => handleDelete(service.id as string, service.title)}
              disabled={deleteMutation.isPending || service.isActive}
              className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-destructive transition-all disabled:opacity-20"
              title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ResourceTable<ServiceDto>
        title="Servicios"
        subtitle="Gestiona el catálogo de servicios ofrecidos en la plataforma."
        total={total}
        isLoading={isLoading}
        columns={columns}
        data={services}
        emptyMessage="No se encontraron servicios."
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Buscar servicio..."
        }}
        createButton={{
          label: "Nuevo Servicio",
          onClick: () => navigate('/servicios/crear')
        }}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage
        }}
        filters={
          (['all', 'active', 'inactive'] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider whitespace-nowrap ${filter === f
                ? 'bg-background text-primary shadow-sm border border-border/50'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : f === 'inactive' ? 'Inactivos' : ''}
            </button>
          ))
        }
      />

      <p className="text-[10px] text-muted-foreground font-medium italic px-2 max-w-[1400px] mx-auto -mt-6 mb-10">
        * Para eliminar un servicio, primero cámbialo a estado inactivo.
      </p>

      <AnimatePresence>
        {statusConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setStatusConfirm(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-sm bg-popover border border-border p-8 rounded-2xl shadow-2xl space-y-6 text-center"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground tracking-tight">¿Cambiar Estado?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Vas a cambiar <span className="text-foreground font-bold">"{statusConfirm.title}"</span> a{' '}
                  <span className={`font-bold ${statusConfirm.nextStatus ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                    {statusConfirm.nextStatus ? 'ACTIVO' : 'INACTIVO'}
                  </span>.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStatusConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-foreground font-bold hover:bg-secondary/80 transition-all text-xs uppercase tracking-widest"
                >
                  Regresar
                </button>
                <button
                  onClick={confirmToggleStatus}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all text-xs uppercase tracking-widest"
                >
                  Confirmar
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
    </>
  );
};
