
import { Button, FormInput, CustomForm, useToast } from "ui-components";
import * as z from "zod";
import { useMyProfile, useUpdateProfile } from "../api/profile.service";
import { CreateProfileSchema } from "shared-types";

// Schema para el formulario
const profileFormSchema = CreateProfileSchema.extend({
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  serviceRadiusKm: z.coerce.number().min(1).default(10),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ className }: React.ComponentProps<"form">) {
  const { toast } = useToast();
  const { data: profile, isLoading } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();

  if (isLoading) {
    return <div className="text-center py-10">Cargando perfil...</div>;
  }

  // Valores iniciales
  const defaultValues: Partial<ProfileFormValues> = {
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
    // TODO: Extraer lat/lng de location (PostGIS) si profile?.location es un objeto
    // latitude: profile?.location?.coordinates?.[1] || undefined,
    // longitude: profile?.location?.coordinates?.[0] || undefined,
  };

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync(data as any);
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: error.response?.data?.message || "Ocurrió un error inesperado.",
      });
    }
  };

  return (
    <CustomForm<ProfileFormValues>
      schema={profileFormSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      className={`space-y-8 ${className}`}
    >
      {({ formState: { isSubmitting, isDirty } }) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="displayName"
                  label="Nombre a mostrar"
                  placeholder="Tu nombre público o de negocio"
                  required
                />

                <FormInput
                  name="avatarUrl"
                  label="URL de Avatar"
                  placeholder="https://example.com/imagen.jpg"
                />
              </div>

              <FormInput
                name="bio"
                label="Biografía"
                placeholder="Cuéntanos sobre ti o tu negocio..."
                className="h-24" // Ajuste para textarea si soportado, sino usar input
              // type="textarea" // Si FormInput soporta textarea
              />
            </div>

            {/* Ubicación y Cobertura */}
            <div className="space-y-4 md:col-span-2 border-t pt-4">
              <h3 className="text-lg font-medium">Ubicación y Cobertura</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  name="serviceRadiusKm"
                  label="Radio de servicio (km)"
                  type="number"
                  min={1}
                />
                <FormInput
                  name="latitude"
                  label="Latitud"
                  type="number"
                  step="any"
                  placeholder="Ej: 19.4326"
                />
                <FormInput
                  name="longitude"
                  label="Longitud"
                  type="number"
                  step="any"
                  placeholder="Ej: -99.1332"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Ingresa coordenadas manuales por ahora. Próximamente selector de mapa.
              </p>
            </div>

            {/* Contacto y Redes Sociales */}
            <div className="space-y-4 md:col-span-2 border-t pt-4">
              <h3 className="text-lg font-medium">Redes Sociales y Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormInput name="website" label="Sitio Web" placeholder="https://" />
                <FormInput name="phone" label="Teléfono" placeholder="+52..." />
                <FormInput name="whatsapp" label="WhatsApp" placeholder="+52..." />

                <div className="md:col-span-2 lg:col-span-3 h-px bg-border my-2" />

                <FormInput name="facebook" label="Facebook" placeholder="Usuario o URL" />
                <FormInput name="instagram" label="Instagram" placeholder="@usuario" />
                <FormInput name="tiktok" label="TikTok" placeholder="@usuario" />
                <FormInput name="twitter" label="Twitter / X" placeholder="@usuario" />
                <FormInput name="linkedin" label="LinkedIn" placeholder="Usuario o URL" />
                <FormInput name="youtube" label="YouTube" placeholder="Canal" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="w-full md:w-auto min-w-[200px]"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </>
      )}
    </CustomForm>
  );
}
