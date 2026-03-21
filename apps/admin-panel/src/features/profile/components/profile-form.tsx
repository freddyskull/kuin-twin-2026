
import React, { useRef, useState, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormInput, FormTextarea, useToast, Avatar, AvatarFallback, AvatarImage, getAbsoluteUrl } from "ui-components";
import * as z from "zod";
import { useMyProfile, useUpdateProfile, useUpdateUser, useUploadMedia } from "../api/profile.service";
import { CreateProfileSchema } from "shared-types";
import { useAuthStore } from "../../../stores/auth.store";
import { Camera, Loader2 } from 'lucide-react';

// Schema para el formulario
const profileFormSchema = CreateProfileSchema.extend({
  email: z.string().email("Correo electrónico inválido"),
  displayName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  avatarUrl: z.string().nullable().optional(),
  website: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  facebook: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  instagram: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  tiktok: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  twitter: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  linkedin: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  youtube: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  phone: z.string().min(8, "Teléfono inválido").or(z.literal("")).nullable().optional(),
  whatsapp: z.string().min(8, "WhatsApp inválido").or(z.literal("")).nullable().optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  serviceRadiusKm: z.coerce.number().int().min(1).default(10),
  companyId: z.string().uuid().nullable().optional(),
  businessHours: z.any().nullable().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ className }: React.ComponentProps<"form">) {
  const { toast } = useToast();
  const { user, checkAuth } = useAuthStore();
  const { data: profile, isLoading } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  const updateUserMutation = useUpdateUser();
  const uploadMediaMutation = useUploadMedia();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Valores iniciales
  const defaultValues = React.useMemo<Partial<ProfileFormValues>>(() => ({
    email: user?.email || "",
    displayName: profile?.displayName || "",
    bio: profile?.bio || "",
    avatarUrl: profile?.avatarUrl || "",
    serviceRadiusKm: profile?.serviceRadiusKm || 10,
    phone: profile?.phone || "",
    whatsapp: profile?.whatsapp || "",
    facebook: profile?.facebook || "",
    instagram: profile?.instagram || "",
    tiktok: profile?.tiktok || "",
    twitter: profile?.twitter || "",
    linkedin: profile?.linkedin || "",
    youtube: profile?.youtube || "",
    website: profile?.website || "",
  }), [profile, user]);

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema as any),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, reset, watch, formState: { isSubmitting, isDirty } } = methods;
  const currentAvatarUrl = watch('avatarUrl');

  // Sincronizar el formulario cuando los datos del perfil cargan
  useEffect(() => {
    if (profile || user) {
      reset(defaultValues);
    }
  }, [profile, user, reset, defaultValues]);

  // Manejar cambio de archivo (Solo local)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Archivo demasiado grande",
        description: "El límite es de 2MB.",
      });
      return;
    }

    setPendingFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Limpiar el objectUrl anterior si existe
    return () => URL.revokeObjectURL(objectUrl);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      let finalAvatarUrl = data.avatarUrl || null;

      // 1. Si hay una imagen pendiente, subirla primero
      if (pendingFile && user?.id) {
        const uploadResult = await uploadMediaMutation.mutateAsync({ 
          userId: user.id, 
          file: pendingFile 
        });
        finalAvatarUrl = uploadResult.url;
      }

      // 2. Si el email cambió, actualizar el usuario
      if (data.email !== user?.email && user?.id) {
        await updateUserMutation.mutateAsync({
          id: user.id,
          data: { email: data.email }
        });
      }

      // 3. Transformar y preparar payload del perfil
      const { email, ...profileData } = data;
      
      const payload: any = {};
      Object.entries(profileData).forEach(([key, value]) => {
        if (value === "") {
          payload[key] = null;
        } else if (key === 'serviceRadiusKm') {
          payload[key] = Math.round(Number(value));
        } else if (key === 'latitude') {
          const lat = Number(value);
          if (!isNaN(lat) && lat >= -90 && lat <= 90) {
            payload[key] = lat;
          }
        } else if (key === 'longitude') {
          const lng = Number(value);
          if (!isNaN(lng) && lng >= -180 && lng <= 180) {
            payload[key] = lng;
          }
        } else {
          payload[key] = value;
        }
      });

      // Asegurar URL final
      payload.avatarUrl = finalAvatarUrl;

      // Preservar campos técnicos
      payload.businessHours = profile?.businessHours || null;
      payload.companyId = profile?.companyId || null;

      console.log("PAYLOAD PROFILE:", JSON.stringify(payload, null, 2));
      await updateProfileMutation.mutateAsync(payload);

      // 4. Actualizar estado global y limpiar estados locales
      await checkAuth();
      setPendingFile(null);
      setPreviewUrl(null);

      // Resetear con nuevos valores para limpiar isDirty
      reset({ ...data, avatarUrl: finalAvatarUrl || "" });

      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: error.response?.data?.message || "Ocurrió un error inesperado al guardar.",
      });
    }
  };

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast({
      variant: "destructive",
      title: "Atención: Revisa el formulario",
      description: "Hay errores de validación en los campos. Por favor corrígelos.",
    });
  };

  if (isLoading) {
    return <div className="text-center py-10 text-sm font-medium text-muted-foreground">Cargando perfil...</div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className={`space-y-8 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Avatar Upload Section */}
          <div className="md:col-span-4 flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl ring-1 ring-border transition-all group-hover:opacity-90">
                {/* Mostrar previewUrl si existe, sino el avatar actual de la DB */}
                <AvatarImage src={previewUrl || getAbsoluteUrl(currentAvatarUrl || '') || undefined} />
                <AvatarFallback className="text-2xl font-black bg-secondary text-muted-foreground uppercase">
                  {(profile?.displayName || user?.email || 'U').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="absolute bottom-2 right-2 p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {uploadMediaMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground uppercase tracking-widest">Foto de Perfil</p>
              <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG o WEBP. Máx 2MB.</p>
              {pendingFile && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase rounded-full border border-amber-500/20">
                  Cambio pendiente de guardar
                </span>
              )}
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="md:col-span-8 space-y-8">
            {/* Información Básica */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold tracking-tight border-b border-border/50 pb-2">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  name="displayName"
                  label="Nombre a mostrar"
                  placeholder="Tu nombre público o de negocio"
                  required
                />

                <FormInput
                  name="email"
                  label="Correo Electrónico"
                  placeholder="correo@ejemplo.com"
                  required
                  type="email"
                />
              </div>

              <FormTextarea
                name="bio"
                label="Biografía"
                placeholder="Cuéntanos sobre ti o tu negocio..."
                className="min-h-[100px]"
              />
            </div>

            {/* Contacto y Redes Sociales */}
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-bold tracking-tight border-b border-border/50 pb-2">Redes Sociales y Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormInput name="website" label="Sitio Web" placeholder="https://" />
                <FormInput name="phone" label="Teléfono" placeholder="+52..." />
                <FormInput name="whatsapp" label="WhatsApp" placeholder="+52..." />

                <div className="md:col-span-2 lg:col-span-3 h-px bg-border/50 my-2" />

                <FormInput name="facebook" label="Facebook" placeholder="https://facebook.com/usuario" />
                <FormInput name="instagram" label="Instagram" placeholder="https://instagram.com/usuario" />
                <FormInput name="tiktok" label="TikTok" placeholder="https://tiktok.com/@usuario" />
                <FormInput name="twitter" label="Twitter / X" placeholder="https://x.com/usuario" />
                <FormInput name="linkedin" label="LinkedIn" placeholder="https://linkedin.com/in/usuario" />
                <FormInput name="youtube" label="YouTube" placeholder="https://youtube.com/@canal" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-border/50">
          <Button
            type="submit"
            disabled={isSubmitting || (!isDirty && !pendingFile)}
            className="w-full md:w-auto min-w-[200px] font-bold"
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
