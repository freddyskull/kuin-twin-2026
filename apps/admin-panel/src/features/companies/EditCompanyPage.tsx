import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, FileText, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompany, useUpdateCompany } from './companies.hooks';
import { BranchList } from './components/BranchList';

const companyFormSchema = z.object({
  businessName: z.string().min(1, 'El nombre comercial es obligatorio'),
  logoUrl: z.string().url('URL del logo inválida').optional().or(z.literal('')),
  description: z.string().optional(),
  rfc: z.string().min(12, 'El RFC debe tener al menos 12 caracteres').max(13, 'El RFC no puede exceder 13 caracteres'),
  legalName: z.string().min(1, 'La razón social es obligatoria'),
  fiscalRegime: z.string().min(1, 'El régimen fiscal es obligatorio'),
  taxAddress: z.string().min(1, 'El domicilio fiscal es obligatorio'),
  taxAddressZip: z.string().min(5, 'El código postal debe tener 5 dígitos').max(5),
  taxAddressCity: z.string().min(1, 'La ciudad es obligatoria'),
  taxAddressState: z.string().min(1, 'El estado es obligatorio'),
  taxAddressCounty: z.string().optional(),
  isSatVerified: z.boolean().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export const EditCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading: isLoadingCompany } = useCompany(id!);
  const updateMutation = useUpdateCompany();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
  });

  useEffect(() => {
    if (company) {
      reset({
        businessName: company.businessName,
        logoUrl: company.logoUrl || '',
        description: company.description || '',
        rfc: company.rfc,
        legalName: company.legalName,
        fiscalRegime: company.fiscalRegime,
        taxAddress: company.taxAddress,
        taxAddressZip: company.taxAddressZip,
        taxAddressCity: company.taxAddressCity,
        taxAddressState: company.taxAddressState,
        taxAddressCounty: company.taxAddressCounty || '',
        isSatVerified: company.isSatVerified,
      });
    }
  }, [company, reset]);

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      const payload = { ...data };
      if (payload.logoUrl === '') payload.logoUrl = '';

      await updateMutation.mutateAsync({ id: id!, data: payload });
      navigate('/companies');
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
    }
  };

  if (isLoadingCompany) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl font-bold">Cargando empresa...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl font-bold">Empresa no encontrada</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Editar Empresa</h1>
        <p className="text-slate-400 font-medium">Actualiza la información fiscal y comercial de {company.businessName}.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Información Comercial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-6 w-6 text-dashboard-primary" />
            <h2 className="text-2xl font-bold text-white">Información Comercial</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Nombre Comercial *
              </label>
              <input
                {...register('businessName')}
                className={`w-full bg-[#0a0b1e]/60 border ${errors.businessName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
                placeholder="Ej: Servicios Profesionales SA"
              />
              {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-300 mb-2">
                URL del Logo
              </label>
              <input
                {...register('logoUrl')}
                type="url"
                className={`w-full bg-[#0a0b1e]/60 border ${errors.logoUrl ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
                placeholder="https://ejemplo.com/logo.png"
              />
              {errors.logoUrl && <p className="text-red-500 text-xs mt-1">{errors.logoUrl.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Descripción
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="Breve descripción de la empresa..."
              />
            </div>
          </div>
        </motion.div>

        {/* Información Fiscal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-dashboard-primary" />
            <h2 className="text-2xl font-bold text-white">Datos Fiscales (SAT)</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                RFC *
              </label>
              <input
                {...register('rfc')}
                className={`w-full bg-[#0a0b1e]/60 border ${errors.rfc ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50 uppercase`}
                placeholder="ABC123456XYZ"
              />
              {errors.rfc && <p className="text-red-500 text-xs mt-1">{errors.rfc.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Régimen Fiscal *
              </label>
              <select
                {...register('fiscalRegime')}
                className={`w-full bg-[#0a0b1e]/60 border ${errors.fiscalRegime ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
              >
                <option value="">Seleccionar...</option>
                <option value="601">601 - General de Ley Personas Morales</option>
                <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                <option value="605">605 - Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                <option value="606">606 - Arrendamiento</option>
                <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                <option value="621">621 - Régimen de Incorporación Fiscal</option>
                <option value="625">625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas</option>
                <option value="626">626 - Régimen Simplificado de Confianza</option>
              </select>
              {errors.fiscalRegime && <p className="text-red-500 text-xs mt-1">{errors.fiscalRegime.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Razón Social *
              </label>
              <input
                {...register('legalName')}
                className={`w-full bg-[#0a0b1e]/60 border ${errors.legalName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
                placeholder="Nombre legal completo de la empresa"
              />
              {errors.legalName && <p className="text-red-500 text-xs mt-1">{errors.legalName.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('isSatVerified')}
                  type="checkbox"
                  className="w-5 h-5 rounded bg-[#0a0b1e]/60 border border-white/10 text-dashboard-primary focus:ring-2 focus:ring-dashboard-primary/50"
                />
                <span className="text-sm font-bold text-slate-300">Empresa Verificada por SAT</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Domicilio Fiscal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-6 w-6 text-dashboard-primary" />
            <h2 className="text-2xl font-bold text-white">Domicilio Fiscal</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Dirección *
              </label>
              <input
                {...register('taxAddress')}
                className={`w-full bg-[#0a0b1e]/60 border ${errors.taxAddress ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
                placeholder="Calle, número exterior e interior"
              />
              {errors.taxAddress && <p className="text-red-500 text-xs mt-1">{errors.taxAddress.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Ciudad *
              </label>
              <input
                {...register('taxAddressCity')}
                className={`w-full bg-[#0a0b1e]/60 border ${errors.taxAddressCity ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
                placeholder="Ciudad"
              />
              {errors.taxAddressCity && <p className="text-red-500 text-xs mt-1">{errors.taxAddressCity.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Estado *
              </label>
              <input
                {...register('taxAddressState')}
                className={`w-full bg-[#0a0b1e]/60 border ${errors.taxAddressState ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
                placeholder="Estado"
              />
              {errors.taxAddressState && <p className="text-red-500 text-xs mt-1">{errors.taxAddressState.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Municipio/Delegación
              </label>
              <input
                {...register('taxAddressCounty')}
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="Municipio o Delegación"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Código Postal *
              </label>
              <input
                {...register('taxAddressZip')}
                className={`w-full bg-[#0a0b1e]/60 border ${errors.taxAddressZip ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
                placeholder="00000"
              />
              {errors.taxAddressZip && <p className="text-red-500 text-xs mt-1">{errors.taxAddressZip.message}</p>}
            </div>
          </div>
        </motion.div>

        {/* Listado de Sucursales */}
        <div className="pt-8">
          <BranchList companyId={id!} />
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end pt-8">
          <button
            type="button"
            onClick={() => navigate('/companies')}
            className="px-8 py-3.5 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-8 py-3.5 rounded-2xl bg-dashboard-primary text-dashboard-bg font-black shadow-xl shadow-dashboard-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? 'Guardando...' : 'Actualizar Empresa'}
          </button>
        </div>
      </form>
    </div>
  );
};
