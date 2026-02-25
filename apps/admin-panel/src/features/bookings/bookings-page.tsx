import React from 'react';
import { useBookings, useUpdateBookingStatus } from './bookings.hooks';
import { DataTable } from 'ui-components';
import { useAuthStore } from '../../stores/auth.store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShoppingBag, ChevronRight, CheckCircle2, XCircle, User } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { BookingDto } from 'shared-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/modal';

export const BookingsPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [filter, setFilter] = React.useState<'all' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('all');

  const { data: bookings = [], isLoading, error } = useBookings({
    vendorId: user?.id,
    status: filter === 'all' ? undefined : filter
  });

  // Consulta paralela para obtener los contadores globales (sin filtro de estado)
  const { data: allBookings = [] } = useBookings({
    vendorId: user?.id
  });

  const updateStatusMutation = useUpdateBookingStatus();
  const [confirmConfig, setConfirmConfig] = React.useState<{ id: string; status: string; title: string } | null>(null);
  const [selectedBooking, setSelectedBooking] = React.useState<BookingDto | null>(null);

  const handleStatusUpdate = (id: string, status: string, title: string) => {
    setConfirmConfig({ id, status, title });
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
        return <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">Pendiente</span>;
      case 'ACTIVE':
        return <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Confirmado</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">Completado</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20">Cancelado</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-500/10 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-500/20">{status}</span>;
    }
  };

  const columns: ColumnDef<BookingDto>[] = [
    {
      accessorKey: 'id',
      header: 'ID / Fecha',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">#{row.original.id.slice(0, 8)}</div>
          <div className="text-xs font-bold text-white whitespace-nowrap">
            {format(new Date(row.original.scheduledDate), 'PPP', { locale: es })}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'service',
      header: 'Servicio',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
            <ShoppingBag className="h-5 w-5 text-dashboard-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm tracking-tight capitalize">{row.original.service?.title || 'Servicio Premium'}</span>
            <span className="text-[10px] text-slate-500 font-medium italic">Cant: {row.original.details?.quantity || 1}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'Cliente',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden">
            {row.original.customer?.profile?.avatarUrl ? (
              <img src={row.original.customer.profile.avatarUrl} className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4 text-slate-500" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-xs">{row.original.customer?.profile?.displayName || 'Usuario'}</span>
            <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">{row.original.customer?.email}</span>
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
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleStatusUpdate(row.original.id, 'ACTIVE', row.original.service?.title || 'Pedido')}
                className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all shadow-lg shadow-green-500/5 group"
                title="Confirmar"
              >
                <CheckCircle2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => handleStatusUpdate(row.original.id, 'CANCELLED', row.original.service?.title || 'Pedido')}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all shadow-lg shadow-red-500/5 group"
                title="Rechazar"
              >
                <XCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}
          {row.original.status === 'ACTIVE' && (
            <button
              onClick={() => handleStatusUpdate(row.original.id, 'COMPLETED', row.original.service?.title || 'Pedido')}
              className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all group"
              title="Marcar como Completado"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setSelectedBooking(row.original)}
            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 group"
            title="Ver Detalles"
          >
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      ),
    },
  ];

  const totalPending = (allBookings || []).filter((b: BookingDto) => b.status === 'PENDING').length;
  const totalActive = (allBookings || []).filter((b: BookingDto) => b.status === 'ACTIVE').length;
  const totalCompleted = (allBookings || []).filter((b: BookingDto) => b.status === 'COMPLETED').length;
  const totalCancelled = (allBookings || []).filter((b: BookingDto) => b.status === 'CANCELLED').length;

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex bg-[#1a1c3d]/60 p-1.5 rounded-2xl border border-white/5 shadow-2xl">
            {(['all', 'PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${filter === f
                  ? 'bg-dashboard-primary text-white shadow-lg shadow-dashboard-primary/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
              >
                {f === 'all' ? 'Todos' : f === 'PENDING' ? 'Pendientes' : f === 'ACTIVE' ? 'Confirmados' : f === 'COMPLETED' ? 'Completados' : 'Cancelados'}
              </button>
            ))}
          </div>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-6 pr-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Pendientes</span>
            <span className="text-xl font-black text-white leading-none">{totalPending}</span>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Confirmados</span>
            <span className="text-xl font-black text-white leading-none">{totalActive}</span>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Completados</span>
            <span className="text-xl font-black text-white leading-none">{totalCompleted}</span>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Cancelados</span>
            <span className="text-xl font-black text-white leading-none">{totalCancelled}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl font-bold text-sm">
          Error: {(error as Error).message}
        </div>
      )}

      <div className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-inner">
        <DataTable
          columns={columns}
          data={bookings}
          isLoading={isLoading}
          emptyMessage="No se encontraron pedidos con estos criterios."
          className="border-none"
        />
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmConfig && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmConfig(null)}
              className="absolute inset-0 bg-[#0a0b1e]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#1a1c3d] border border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 ${confirmConfig.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' :
                  confirmConfig.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                  {confirmConfig.status === 'ACTIVE' ? <CheckCircle2 className="h-8 w-8" /> :
                    confirmConfig.status === 'CANCELLED' ? <XCircle className="h-8 w-8" /> :
                      <CheckCircle2 className="h-8 w-8" />}
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight italic uppercase">¿Confirmar Acción?</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Estás a punto de cambiar el estado de <span className="text-white font-bold">"{confirmConfig.title}"</span> a{' '}
                  <span className={`font-black uppercase tracking-widest ${confirmConfig.status === 'ACTIVE' ? 'text-green-500' :
                    confirmConfig.status === 'CANCELLED' ? 'text-red-500' :
                      'text-blue-500'
                    }`}>
                    {confirmConfig.status === 'ACTIVE' ? 'Confirmado' :
                      confirmConfig.status === 'CANCELLED' ? 'Rechazado' :
                        'Completado'}
                  </span>.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmConfig(null)}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
                >
                  Regresar
                </button>
                <button
                  onClick={confirmUpdate}
                  disabled={updateStatusMutation.isPending}
                  className={`flex-1 px-6 py-3.5 rounded-xl font-black text-white shadow-lg transition-all text-xs uppercase tracking-widest disabled:opacity-50 ${confirmConfig.status === 'ACTIVE' ? 'bg-green-500 shadow-green-500/20' :
                    confirmConfig.status === 'CANCELLED' ? 'bg-red-500 shadow-red-500/20' :
                      'bg-blue-500 shadow-blue-500/20'
                    }`}
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
          <div className="space-y-8 p-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-dashboard-primary flex items-center justify-center shadow-lg shadow-dashboard-primary/10">
                  <ShoppingBag className="h-7 w-7 text-white m-3.5" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight italic">{selectedBooking.service?.title}</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Reserva #{selectedBooking.id.slice(0, 8)}</p>
                </div>
              </div>
              {getStatusBadge(selectedBooking.status)}
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Datos del Comprador</h5>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-dashboard-primary/20 flex items-center justify-center border border-dashboard-primary/20 overflow-hidden">
                    {selectedBooking.customer?.profile?.avatarUrl ? (
                      <img src={selectedBooking.customer.profile.avatarUrl} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-dashboard-primary" />
                    )}
                  </div>
                  <div>
                    <h6 className="text-white font-bold">{selectedBooking.customer?.profile?.displayName || 'Cliente Sin Nombre'}</h6>
                    <p className="text-xs text-slate-500 font-medium italic">{selectedBooking.customer?.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Teléfono Directo</span>
                  <span className="text-sm text-white font-black tracking-tight">{selectedBooking.customer?.profile?.phone || 'No proporcionado'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Información de la Cita</h5>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                  <p className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold">Fecha:</span>
                    <span className="font-medium">{format(new Date(selectedBooking.scheduledDate), 'PPPP', { locale: es })}</span>
                  </p>
                  <p className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold">Cliente ID:</span>
                    <span className="font-mono text-xs">{selectedBooking.customerId}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resumen de Pago</h5>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2 text-white">
                  <p className="flex justify-between text-sm font-bold capitalize">
                    <span className="text-slate-400 ">Cantidad:</span>
                    <span>{selectedBooking.details?.quantity} Unidades</span>
                  </p>
                  <p className="flex justify-between text-lg font-black pt-2 border-t border-white/5">
                    <span className="text-dashboard-primary">Total:</span>
                    <span>${selectedBooking.details?.grandTotal}</span>
                  </p>
                </div>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notas del Cliente</h5>
                <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10 italic text-slate-300 text-sm leading-relaxed">
                  "{selectedBooking.notes}"
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
