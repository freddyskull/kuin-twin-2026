import React, { useMemo, useState } from 'react';
import { useBookings, useUpdateBookingStatus } from './bookings.hooks';
import { Avatar, AvatarFallback, AvatarImage, ResourceTable, useQueryState, useQueryPagination } from 'ui-components';
import { useAuthStore } from '../../stores/auth.store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShoppingBag, ChevronRight, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { BookingDto } from 'shared-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/Modal';

export const BookingsPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  
  // URL-Synced state
  const [filter, setFilter] = useQueryState<'all' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('filter', 'all');
  const [page, setPage] = useQueryPagination();
  const [searchTerm, setSearchTerm] = useQueryState('search', '');
  
  const pageSize = 10;

  const { data: bookings = [], isLoading, error } = useBookings({
    vendorId: user?.id,
    status: filter === 'all' ? undefined : filter
  });

  // Consulta paralela para obtener los contadores globales (sin filtro de estado)
  const { data: allBookings = [] } = useBookings({
    vendorId: user?.id
  });

  const { filteredBookings, paginatedBookings, totalPages, total } = useMemo(() => {
    const filtered = bookings.filter(b => {
      const matchesSearch = searchTerm === '' || 
        b.service?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customer?.profile?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
    
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    
    return { filteredBookings: filtered, paginatedBookings: paginated, totalPages, total };
  }, [bookings, page, searchTerm]);

  const updateStatusMutation = useUpdateBookingStatus();
  const [confirmConfig, setConfirmConfig] = React.useState<{ id: string; status: string; title: string } | null>(null);
  const [selectedBooking, setSelectedBooking] = React.useState<BookingDto | null>(null);

  const handleStatusUpdate = (id: string, status: string, title: string) => {
    setConfirmConfig({ id, status, title });
  };

  const handleFilterChange = (f: typeof filter) => {
    setFilter(f);
  };

  const confirmUpdate = async () => {
    if (confirmConfig) {
      try {
        await updateStatusMutation.mutateAsync({
          id: confirmConfig.id,
          status: confirmConfig.status
        });
        setConfirmConfig(null);
      } catch (err) {
        console.error('Error al actualizar estado:', err);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">Pendiente</span>;
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">Activo</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">Completado</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider border border-destructive/20">Cancelado</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const columns: ColumnDef<BookingDto>[] = [
    {
      accessorKey: 'id',
      header: 'Pedido',
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-tight">#{row.original.id.slice(0, 8)}</div>
          <div className="text-xs font-bold text-foreground">
            {format(new Date(row.original.scheduledDate), 'dd MMM, yyyy', { locale: es })}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'service',
      header: 'Servicio',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center border border-border shrink-0">
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground text-xs truncate max-w-[180px]">{row.original.service?.title || 'Servicio Premium'}</span>
            <span className="text-[10px] text-muted-foreground">Cantidad: {row.original.details?.quantity || 1}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'Cliente',
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7 border border-border">
            <AvatarImage src={row.original.customer?.profile?.avatarUrl} />
            <AvatarFallback className="text-[9px] bg-secondary text-muted-foreground">
              {(row.original.customer?.profile?.displayName || 'U').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground text-[11px] truncate max-w-[120px]">{row.original.customer?.profile?.displayName || 'Usuario'}</span>
            <span className="text-[9px] text-muted-foreground truncate max-w-[120px]">{row.original.customer?.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          {row.original.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleStatusUpdate(row.original.id, 'ACTIVE', row.original.service?.title || 'Pedido')}
                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                title="Confirmar"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleStatusUpdate(row.original.id, 'CANCELLED', row.original.service?.title || 'Pedido')}
                className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                title="Rechazar"
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          {row.original.status === 'ACTIVE' && (
            <button
              onClick={() => handleStatusUpdate(row.original.id, 'COMPLETED', row.original.service?.title || 'Pedido')}
              className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              title="Completar"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => setSelectedBooking(row.original)}
            className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-all"
            title="Detalles"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const totalPending = (allBookings || []).filter((b: BookingDto) => b.status === 'PENDING').length;
  const totalActive = (allBookings || []).filter((b: BookingDto) => b.status === 'ACTIVE').length;

  return (
    <>
      <ResourceTable<BookingDto>
        title="Pedidos"
        subtitle="Gestiona y realiza seguimiento de todas las reservas."
        total={total}
        isLoading={isLoading}
        columns={columns}
        data={paginatedBookings}
        emptyMessage="No se encontraron pedidos."
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Buscar por servicio, cliente o ID..."
        }}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage
        }}
        filters={
          (['all', 'PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider whitespace-nowrap ${filter === f
                ? 'bg-background text-primary shadow-sm border border-border/50'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {f === 'all' ? 'Todos' : f === 'PENDING' ? `Pendientes (${totalPending})` : f === 'ACTIVE' ? `Activos (${totalActive})` : f === 'COMPLETED' ? 'Completados' : f === 'CANCELLED' ? 'Cancelados' : ''}
            </button>
          ))
        }
      />

      <AnimatePresence>
        {confirmConfig && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmConfig(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-sm bg-popover border border-border p-8 rounded-2xl shadow-2xl space-y-6 text-center"
            >
              <div className={`mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-2 ${confirmConfig.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-500' :
                confirmConfig.status === 'CANCELLED' ? 'bg-destructive/10 text-destructive' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                <CheckCircle2 className="h-7 w-7" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground tracking-tight">¿Confirmar Acción?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Vas a cambiar el estado de <span className="text-foreground font-bold">"{confirmConfig.title}"</span> a{' '}
                  <span className="font-bold text-primary uppercase">{confirmConfig.status}</span>.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setConfirmConfig(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-foreground font-bold hover:bg-secondary/80 transition-all text-xs uppercase tracking-widest"
                >
                  Regresar
                </button>
                <button
                  onClick={confirmUpdate}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {updateStatusMutation.isPending ? 'Procesando...' : 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Detalles del Pedido"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-8 font-sans">
            <div className="flex items-center justify-between pb-6 border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-primary-foreground">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground tracking-tight">{selectedBooking.service?.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">ID #{selectedBooking.id.slice(0, 8)}</p>
                </div>
              </div>
              {getStatusBadge(selectedBooking.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Cliente</h5>
                <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={selectedBooking.customer?.profile?.avatarUrl} />
                    <AvatarFallback className="bg-secondary text-muted-foreground font-bold">
                      {(selectedBooking.customer?.profile?.displayName || 'U').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{selectedBooking.customer?.profile?.displayName || 'Usuario'}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{selectedBooking.customer?.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Programación</h5>
                <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-3 text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">{format(new Date(selectedBooking.scheduledDate), 'PPPP', { locale: es })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Resumen Económico</h5>
              <div className="bg-secondary/30 p-6 rounded-2xl border border-border/50 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Cantidad</span>
                  <span className="font-bold text-foreground">{selectedBooking.details?.quantity} Unidades</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Precio Unitario</span>
                  <span className="font-bold text-foreground">${selectedBooking.details?.unitPrice}</span>
                </div>
                <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                  <span className="text-base font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary tracking-tight">${selectedBooking.details?.grandTotal}</span>
                </div>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Notas del Cliente</h5>
                <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 italic text-muted-foreground text-xs leading-relaxed">
                  "{selectedBooking.notes}"
                </div>
              </div>
            )}

            <div className="flex pt-4">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full px-6 py-3 rounded-xl bg-secondary text-foreground font-bold hover:bg-secondary/80 transition-all text-xs uppercase tracking-widest"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
