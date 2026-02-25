'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBookingSchema, CreateBookingInput } from 'shared-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/components/ui';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/auth.store';
import { useCreateBooking } from '../bookings.hooks';
import { useRouter } from 'next/navigation';

interface BookingDialogProps {
  serviceId: string;
  serviceTitle: string;
  basePrice?: number | null;
  unitName?: string | null;
  children: React.ReactNode;
}

export const BookingDialog: React.FC<BookingDialogProps> = ({
  serviceId,
  serviceTitle,
  basePrice,
  unitName,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user, token } = useAuthStore();
  const router = useRouter();
  const createBookingMutation = useCreateBooking();

  const form = useForm<CreateBookingInput>({
    resolver: zodResolver(CreateBookingSchema) as any,
    defaultValues: {
      serviceId,
      customerId: user?.id || '',
      scheduledDate: new Date(),
      quantity: 1,
      notes: '',
    },
  });

  const onSubmit = async (data: CreateBookingInput) => {
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        ...data,
        customerId: user?.id || '', // Asegurar que usamos el ID del usuario actual
      });
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Resetear estados al cerrar manualmente
      setTimeout(() => {
        setIsSuccess(false);
      }, 300); // Pequeño delay para la animación de cierre
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] flex flex-col items-center justify-center py-10 rounded-3xl border-none shadow-2xl overflow-hidden">
          {/* Fondo decorativo con gradiente para éxito */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-500" />

          <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 ring-8 ring-green-500/5">
            <CheckCircle2 className="h-10 w-10 text-green-500 animate-in zoom-in spin-in-12 duration-500" />
          </div>
          <DialogTitle className="text-2xl font-black text-center tracking-tight">¡Genial, solicitud enviada!</DialogTitle>
          <DialogDescription className="text-center mt-3 text-base px-2">
            Tu reserva para <strong>{serviceTitle}</strong> ha sido registrada.
            El experto revisará tu solicitud y te avisará pronto.
          </DialogDescription>
          <Button
            className="mt-8 w-full rounded-full h-12 font-bold text-lg shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 transition-all active:scale-95"
            onClick={() => handleOpenChange(false)}
          >
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] overflow-hidden p-0 rounded-3xl border-none shadow-2xl">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Reservar Servicio</DialogTitle>
            <DialogDescription className="font-medium">
              Estás reservando: <span className="text-foreground font-bold">{serviceTitle}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha de la Reserva */}
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fecha del Servicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-12 rounded-xl border-border/40 bg-background hover:border-primary/50 transition-colors",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cantidad/Unidades */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cantidad ({unitName || 'unidades'})</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        className="h-12 rounded-xl border-border/40 bg-background focus-visible:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notas / Detalles extra */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Notas Adicionales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Necesito que traigan herramientas específicas, indicaciones para llegar..."
                      className="resize-none min-h-[100px] rounded-2xl border-border/40 bg-background focus-visible:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[10px]">
                    Indica cualquier detalle que el profesional deba saber de antemano.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resumen de Precio */}
            {basePrice && (
              <div className="bg-secondary/5 p-4 rounded-2xl border border-border/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Total Estimado</p>
                  <p className="text-2xl font-black text-primary">
                    ${(basePrice * (form.watch('quantity') || 1)).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-medium text-muted-foreground">Incluye impuestos</p>
                  <p className="text-[10px] font-medium text-muted-foreground">Pago contra servicio</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 rounded-full h-12 font-bold"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-[2] rounded-full h-12 font-bold text-lg shadow-lg shadow-primary/20"
                disabled={createBookingMutation.isPending}
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Confirmar Reserva'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
