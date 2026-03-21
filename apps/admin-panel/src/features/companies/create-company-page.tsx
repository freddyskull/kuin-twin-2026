import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, MapPin, Search, CheckCircle2, ShieldAlert, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCreateCompany, useVerifySat } from './companies.hooks';
import {
  CustomForm,
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox,
  useToast,
  Button,
  getAbsoluteUrl
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
      toast({ title: "Empresa creada", description: "La empresa se ha registrado correctamente." });
      navigate('/empresas');
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
    <div className="mx-auto space-y-8 pb-20">
      <CustomForm
        schema={companyFormSchema}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        className="space-y-8"
      >
        {({ watch, setValue, formState: { isSubmitting, isValid, isDirty } }) => {
          const currentRfc = watch('rfc');
          const isVerified = watch('isSatVerified');
          const currentLogo = watch('logoUrl');

          return (
            <>
              {/* Header con Acciones Pegajosas */}
              <div className="sticky top-0 z-50 -mx-4 px-4 py-4 bg-background/80 backdrop-blur-md border-b border-border/50 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/empresas')}
                    className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-all"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Nueva Empresa</h1>
                    <p className="text-xs text-muted-foreground font-medium">Registra los datos oficiales de tu negocio.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/empresas')}
                    className="rounded-xl font-bold text-xs uppercase tracking-wider"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || isSubmitting || !isValid || !isDirty}
                    className="rounded-xl px-8 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    {(createMutation.isPending || isSubmitting) ? 'Registrando...' : 'Registrar Empresa'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Columna Principal - Formulario */}
                <div className="lg:col-span-8 space-y-8">

                  {/* Sección 1: Identidad */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-[2rem] p-8 space-y-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-foreground uppercase tracking-wider text-sm">Información Comercial</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <FormInput name="businessName" label="Nombre Comercial" required placeholder="Ej: Servicios Profesionales SA" />
                      <FormTextarea name="description" label="Descripción de la Empresa" rows={3} placeholder="Cuéntanos a qué se dedica tu empresa..." />
                    </div>
                  </motion.div>

                  {/* Sección 2: Datos Fiscales */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-card border border-border rounded-[2rem] p-8 space-y-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground uppercase tracking-wider text-sm">Datos Fiscales (SAT)</h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <FormInput
                          name="rfc"
                          label="RFC"
                          required
                          placeholder="ABC123456XYZ"
                          className="uppercase font-mono"
                          disabled={isVerified}
                        />
                        {!isVerified && (
                          <button
                            type="button"
                            onClick={() => handleVerifySat(currentRfc, setValue)}
                            disabled={verifySatMutation.isPending}
                            className="absolute right-2 bottom-1.5 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                            title="Verificar ante el SAT"
                          >
                            <Search className={`h-4 w-4 ${verifySatMutation.isPending ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                      </div>

                      <FormSelect name="fiscalRegime" label="Régimen Fiscal" required options={fiscalRegimeOptions} />

                      <div className="md:col-span-2">
                        <FormInput name="legalName" label="Razón Social / Nombre Legal" required placeholder="Nombre legal completo" />
                      </div>

                      <div className="md:col-span-2">
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                          <ShieldAlert className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <div className="space-y-3">
                            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                              La verificación ante el SAT garantiza la validez fiscal de tu empresa. Al verificar, algunos datos se completarán automáticamente.
                            </p>
                            <FormCheckbox name="isSatVerified" label="Empresa Verificada ante el SAT" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Sección 3: Domicilio */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-card border border-border rounded-[2rem] p-8 space-y-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-foreground uppercase tracking-wider text-sm">Domicilio Fiscal</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <FormInput name="taxAddress" label="Dirección Completa" required placeholder="Calle, número, colonia..." />
                      </div>
                      <FormInput name="taxAddressCity" label="Ciudad" required />
                      <FormInput name="taxAddressState" label="Estado" required />
                      <FormInput name="taxAddressCounty" label="Municipio / Alcaldía" />
                      <FormInput name="taxAddressZip" label="Código Postal" required placeholder="00000" />
                    </div>
                  </motion.div>
                </div>

                {/* Columna Lateral - Logo Preview */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm overflow-hidden sticky top-32">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">Logo de la Empresa</h3>
                    <div className="aspect-square w-full rounded-2xl bg-secondary/50 border border-dashed border-border flex flex-col items-center justify-center overflow-hidden mb-4 group transition-all">
                      {currentLogo ? (
                        <img
                          src={getAbsoluteUrl(currentLogo) || ''}
                          alt="Preview"
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="text-center p-6">
                          <ImageIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                          <p className="text-[10px] text-muted-foreground font-medium italic">El logo aparecerá aquí</p>
                        </div>
                      )}
                    </div>
                    <FormInput name="logoUrl" label="URL del Logo" type="url" placeholder="https://..." className="text-xs" />

                    <div className="mt-8 pt-6 border-t border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verificación</span>
                        {isVerified ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" /> LISTO
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            PENDIENTE
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                        Completa el RFC y presiona la lupa para validar automáticamente los datos ante el SAT.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </CustomForm>
    </div>
  );
};
