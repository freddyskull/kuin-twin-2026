import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, MapPin, Search, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCreateCompany, useVerifySat } from './companies.hooks';
import {
  CustomForm,
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox,
  useToast
} from 'ui-components';
import { z } from 'zod';

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

export const CreateCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateCompany();
  const verifySatMutation = useVerifySat();
  const { toast } = useToast();

  const handleVerifySat = async (rfc: string, setValue: any) => {
    if (!rfc || rfc.length < 12) {
      toast({
        title: "RFC Inválido",
        description: "Por favor ingresa un RFC válido antes de verificar.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await verifySatMutation.mutateAsync(rfc);
      if (result.isValid) {
        toast({
          title: "RFC Verificado",
          description: result.message,
          className: "bg-green-500 text-white"
        });
        if (result.details) {
          setValue('legalName', result.details.legalName);
          setValue('fiscalRegime', result.details.taxRegime.split(' - ')[0]);
          setValue('taxAddressZip', result.details.zipCode);
          setValue('isSatVerified', true);
        }
      } else {
        toast({
          title: "Error de Verificación",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error del Servidor",
        description: "No se pudo conectar con el servicio de verificación.",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      const payload = { ...data };
      if (!payload.logoUrl) delete (payload as any).logoUrl;
      if (!payload.description) delete (payload as any).description;
      if (!payload.taxAddressCounty) delete (payload as any).taxAddressCounty;

      await createMutation.mutateAsync(payload);
      navigate('/companies');
    } catch (error) {
      console.error('Error al crear empresa:', error);
    }
  };

  const fiscalRegimeOptions = [
    { value: "601", label: "601 - General de Ley Personas Morales" },
    { value: "603", label: "603 - Personas Morales con Fines no Lucrativos" },
    { value: "605", label: "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios" },
    { value: "606", label: "606 - Arrendamiento" },
    { value: "612", label: "612 - Personas Físicas con Actividades Empresariales" },
    { value: "621", label: "621 - Régimen de Incorporación Fiscal" },
    { value: "625", label: "625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas" },
    { value: "626", label: "626 - Régimen Simplificado de Confianza" },
  ];

  const defaultValues: CompanyFormValues = {
    businessName: '',
    logoUrl: '',
    description: '',
    rfc: '',
    legalName: '',
    fiscalRegime: '',
    taxAddress: '',
    taxAddressZip: '',
    taxAddressCity: '',
    taxAddressState: '',
    taxAddressCounty: '',
    isSatVerified: false,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Registrar Nueva Empresa</h1>
        <p className="text-slate-400 font-medium">Completa la información fiscal y comercial de la empresa.</p>
      </div>

      <CustomForm
        schema={companyFormSchema}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        className="space-y-8"
      >
        {({ watch, setValue, formState: { isSubmitting } }) => {
          const currentRfc = watch('rfc');
          const isVerified = watch('isSatVerified');

          return (
            <>
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
                    <FormInput name="businessName" label="Nombre Comercial" required placeholder="Ej: Servicios Profesionales SA" />
                  </div>

                  <div className="col-span-2">
                    <FormInput name="logoUrl" label="URL del Logo" type="url" placeholder="https://ejemplo.com/logo.png" />
                  </div>

                  <div className="col-span-2">
                    <FormTextarea name="description" label="Descripción" rows={3} placeholder="Breve descripción de la empresa..." />
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-dashboard-primary" />
                    <h2 className="text-2xl font-bold text-white">Datos Fiscales (SAT)</h2>
                  </div>
                  {isVerified && (
                    <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-xs font-bold border border-green-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verificado por SAT
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="relative group">
                    <FormInput
                      name="rfc"
                      label="RFC"
                      required
                      placeholder="ABC123456XYZ"
                      className="uppercase"
                      disabled={isVerified}
                    />
                    {!isVerified && (
                      <button
                        type="button"
                        onClick={() => handleVerifySat(currentRfc, setValue)}
                        disabled={verifySatMutation.isPending}
                        className="absolute right-2 bottom-1.5 p-2 rounded-lg bg-dashboard-primary/10 text-dashboard-primary hover:bg-dashboard-primary hover:text-dashboard-bg transition-all active:scale-95 disabled:opacity-50"
                        title="Verificar ante el SAT"
                      >
                        {verifySatMutation.isPending ? (
                          <Search className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>

                  <FormSelect name="fiscalRegime" label="Régimen Fiscal" required options={fiscalRegimeOptions} />

                  <div className="col-span-2">
                    <FormInput name="legalName" label="Razón Social" required placeholder="Nombre legal completo de la empresa" />
                  </div>

                  <div className="col-span-2">
                    <FormCheckbox name="isSatVerified" label="Confirmar Verificación SAT" />
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
                    <FormInput name="taxAddress" label="Dirección" required placeholder="Calle, número exterior e interior" />
                  </div>

                  <FormInput name="taxAddressCity" label="Ciudad" required placeholder="Ciudad" />
                  <FormInput name="taxAddressState" label="Estado" required placeholder="Estado" />
                  <FormInput name="taxAddressCounty" label="Municipio/Delegación" placeholder="Municipio o Delegación" />
                  <FormInput name="taxAddressZip" label="Código Postal" required placeholder="00000" />
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/companies')}
                  className="px-8 py-3.5 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || isSubmitting}
                  className="px-8 py-3.5 rounded-2xl bg-dashboard-primary text-dashboard-bg font-black shadow-xl shadow-dashboard-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(createMutation.isPending || isSubmitting) ? 'Guardando...' : 'Registrar Empresa'}
                </button>
              </div>
            </>
          );
        }}
      </CustomForm>
    </div>
  );
};
