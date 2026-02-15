import React, { useState, useEffect } from 'react';
import { useService, useUpdateService } from '../services.hooks';
import { CompanySelector } from './service-form/company-selector';
import { Button, useToast } from 'ui-components';
import { Loader2, Save } from 'lucide-react';

interface ServiceCompanyManagerProps {
  service: any; // Basic info
  onClose: () => void;
}

export const ServiceCompanyManager: React.FC<ServiceCompanyManagerProps> = ({ service: initialService, onClose }) => {
  // Fetch full details to ensure we have branches
  const { data: fullService, isLoading } = useService(initialService.id);
  const updateMutation = useUpdateService();
  const { toast } = useToast();

  const [companyId, setCompanyId] = useState<string>('');
  const [branchIds, setBranchIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize state from full service data
  useEffect(() => {
    if (fullService) {
      const initialCompanyId = fullService.companyId || (fullService.company?.id) || '';
      const initialBranchIds = fullService.branches?.map((b: any) => String(typeof b === 'object' ? b.id : b)) || [];

      setCompanyId(String(initialCompanyId));
      setBranchIds(initialBranchIds);
    }
  }, [fullService]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        companyId,
        branchIds
      };

      await updateMutation.mutateAsync({ id: initialService.id, data: payload });

      toast({
        title: "Cambios guardados",
        description: "Las sucursales se han actualizado correctamente."
      });
      onClose();
    } catch (error) {
      console.error('Error saving companies/branches:', error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-dashboard-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">Gestionar Sucursales</h3>
        <p className="text-slate-400 text-sm">
          Selecciona las empresas y sucursales donde estará disponible el servicio <span className="text-white font-bold">"{initialService.title}"</span>.
        </p>
      </div>

      <div className="bg-[#0a0b1e]/40 p-6 rounded-2xl border border-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar">
        <CompanySelector
          selectedCompanyId={companyId}
          onCompanyChange={setCompanyId}
          selectedBranchIds={branchIds}
          onBranchChange={setBranchIds}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <Button variant="ghost" onClick={onClose} disabled={isSaving}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
