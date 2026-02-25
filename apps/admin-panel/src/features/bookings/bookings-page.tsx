import React from 'react';
import { useBookings } from './bookings.hooks';
import { DataTable } from 'ui-components';
import { useAuthStore } from '../../stores/auth.store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShoppingBag, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { BookingDto } from 'shared-types';

export const BookingsPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { data: bookings = [], isLoading, error } = useBookings({ vendorId: user?.id });

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
        <div className="flex flex-col">
          <span className="font-bold text-slate-300 text-xs">ID: {row.original.customerId.slice(0, 8)}</span>
          <span className="text-[10px] text-slate-500 font-medium">Reserva directa</span>
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
              <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all shadow-lg shadow-green-500/5 group" title="Confirmar">
                <CheckCircle2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
              <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all shadow-lg shadow-red-500/5 group" title="Rechazar">
                <XCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}
          <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 group" title="Ver Detalles">
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header Info */}
      <div className="bg-[#1a1c3d]/20 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ShoppingBag className="w-48 h-48 rotate-12 text-white" />
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="h-16 w-16 rounded-[2rem] bg-dashboard-primary flex items-center justify-center shadow-2xl shadow-dashboard-primary/20">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Gestión de Pedidos</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock className="w-3 h-3" /> Monitor de solicitudes en tiempo real
            </p>
          </div>
        </div>

        <div className="flex gap-4 relative z-10">
          <div className="px-6 py-4 rounded-3xl bg-dashboard-primary/10 border border-dashboard-primary/20 flex flex-col items-center min-w-[120px]">
            <span className="text-2xl font-black text-dashboard-primary leading-none">{bookings.length}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Total</span>
          </div>
          <div className="px-6 py-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center min-w-[120px]">
            <span className="text-2xl font-black text-amber-500 leading-none">
              {bookings.filter(b => b.status === 'PENDING').length}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Pendientes</span>
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
          emptyMessage="No tienes pedidos pendientes en este momento."
          className="border-none"
        />
      </div>
    </div>
  );
};
