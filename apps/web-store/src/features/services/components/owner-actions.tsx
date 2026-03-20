"use client";

import { useAuthStore } from "@/features/auth/auth.store";
import { useDeleteService } from "../services.hooks";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface OwnerActionsProps {
  serviceId: string;
  vendorId: string;
  title: string;
}

export function OwnerActions({ serviceId, vendorId, title }: OwnerActionsProps) {
  const user = useAuthStore((state) => state.user);
  const deleteMutation = useDeleteService();
  const router = useRouter();

  // Si no hay usuario o no es el dueño, no mostrar nada
  if (!user || user.id !== vendorId) return null;

  const handleEdit = () => {
    window.location.href = `/admin/servicios/${serviceId}/editar`;
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${title}"? Esta acción no se puede deshacer.`)) {
      deleteMutation.mutate(serviceId, {
        onSuccess: () => {
          toast.success("Servicio eliminado correctamente");
          router.push("/");
        },
        onError: () => {
          toast.error("Hubo un error al eliminar el servicio");
        }
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-4 mb-8 p-6 rounded-[2rem] bg-card border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
        <Pencil className="w-24 h-24 rotate-12" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Panel de Control</span>
          <span className="text-sm font-bold text-foreground">Eres el propietario de este servicio</span>
        </div>
      </div>

      <div className="flex gap-3 relative z-10">
        <Button 
          onClick={handleEdit} 
          className="flex-1 rounded-full gap-2 font-bold h-12 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Pencil className="w-4 h-4" />
          Editar Publicación
        </Button>
        <Button 
          onClick={handleDelete} 
          disabled={deleteMutation.isPending}
          variant="secondary" 
          className="rounded-full w-12 h-12 p-0 shadow-lg border border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all active:scale-95"
          title="Eliminar Publicación"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
