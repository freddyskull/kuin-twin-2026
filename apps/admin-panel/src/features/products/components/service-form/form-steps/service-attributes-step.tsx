import React, { useEffect } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { Star, Trash2, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Label, FormTextarea, FormInput, MapSelector, geocode, Button } from 'ui-components';
import type { ServiceFormValues } from '../schema';

export const ServiceAttributesStep: React.FC = () => {
  const { register, control, formState: { errors }, setValue, getValues } = useFormContext<ServiceFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadata"
  });

  const watchedMetadata = useWatch({ control, name: 'metadata' });
  const watchedDynamicAttributes = useWatch({ control, name: 'dynamicAttributes' });
  const watchedLatitude = useWatch({ control, name: 'latitude' });
  const watchedLongitude = useWatch({ control, name: 'longitude' });

  // Auto-generate JSON when metadata changes
  useEffect(() => {
    if (watchedMetadata && watchedMetadata.length > 0) {
      const currentJson = watchedDynamicAttributes || '';
      try {
        const parsedCurrent = currentJson ? JSON.parse(currentJson) : {};

        const newAttributes = watchedMetadata.reduce((acc: Record<string, any>, item) => {
          if (item.key && item.value) {
            // Handle duplicate keys by creating arrays to prevent overwriting
            if (Object.prototype.hasOwnProperty.call(acc, item.key)) {
              const existing = acc[item.key];
              if (Array.isArray(existing)) {
                existing.push(item.value);
              } else {
                acc[item.key] = [existing, item.value];
              }
            } else {
              acc[item.key] = item.value;
            }
          }
          return acc;
        }, {});

        // Merge with existing but let metadata overwrite keys
        const merged = { ...parsedCurrent, ...newAttributes };
        const newJsonString = JSON.stringify(merged, null, 2);

        if (newJsonString !== currentJson) {
          setValue('dynamicAttributes', newJsonString, { shouldValidate: true });
        }
      } catch (e) {
        // If current JSON is invalid, don't try to merge, just leave it be
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedMetadata, setValue]);

  const handleRemove = (index: number) => {
    const itemToRemove = watchedMetadata?.[index];
    if (itemToRemove && itemToRemove.key) {
      const keyToRemove = itemToRemove.key;
      // Check if key exists elsewhere in the remaining items (excluding the one being removed)
      const isKeyUsedElsewhere = watchedMetadata.some((item, i) => i !== index && item.key === keyToRemove);

      if (!isKeyUsedElsewhere) {
        try {
          const currentJson = watchedDynamicAttributes || '{}';
          const parsed = JSON.parse(currentJson);
          if (parsed && typeof parsed === 'object') {
            // Delete the key if it exists
            if (Object.prototype.hasOwnProperty.call(parsed, keyToRemove)) {
              delete parsed[keyToRemove];
              setValue('dynamicAttributes', JSON.stringify(parsed, null, 2), { shouldValidate: true });
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }
    remove(index);
  };

  const handleSearchAddress = async () => {
    const address = getValues('address');
    if (address && address.length > 3) {
      const coords = await geocode(address);
      if (coords) {
        setValue('latitude', coords.lat, { shouldDirty: true });
        setValue('longitude', coords.lng, { shouldDirty: true });
      }
    }
  };

  return (
    <motion.section
      key="step4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-accent/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 space-y-8"
    >
      <div className="flex items-center gap-3">
        <Star className="h-5 w-5 text-dashboard-primary" />
        <h2 className="text-xl font-bold text-white tracking-tight">Atributos</h2>
      </div>

      <div className="space-y-6">

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Especificaciones Técnicas</Label>
            <button type="button" onClick={() => append({ key: '', value: '' })} className="text-dashboard-primary text-[10px] font-bold uppercase tracking-wider hover:underline">
              + Añadir Spec
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-1">
                <div className="flex gap-2 items-center">
                  <input {...register(`metadata.${index}.key` as const)} placeholder="Etiqueta" className="flex-1 bg-[#0a0b1e]/40 border border-white/5 rounded-lg py-2.5 px-4 text-white text-xs font-bold focus:ring-1 focus:ring-dashboard-primary/30 outline-none" />
                  <input {...register(`metadata.${index}.value` as const)} placeholder="Valor" className="flex-1 bg-[#0a0b1e]/40 border border-white/5 rounded-lg py-2.5 px-4 text-white text-xs font-bold focus:ring-1 focus:ring-dashboard-primary/30 outline-none" />
                  <button type="button" onClick={() => handleRemove(index)} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {(errors.metadata?.[index]?.key || errors.metadata?.[index]?.value) && (
                  <p className="text-[10px] text-red-500 font-bold pl-1">
                    {errors.metadata?.[index]?.key?.message || errors.metadata?.[index]?.value?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <FormTextarea
          name="dynamicAttributes"
          label="Atributos JSON"
          rows={3}
          placeholder='{"clave": "valor"}'
          className="font-mono text-xs"
        />

        <div className="bg-[#0a0b1e]/40 p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-3 text-dashboard-primary mb-2">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Localización</span>
          </div>

          <div className="flex gap-2 items-end">
            <FormInput
              name="address"
              label="Ubicación física"
              placeholder="ej. Av. Principal #123, Ciudad"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleSearchAddress}
              className="mb-0.5 bg-dashboard-primary/20 hover:bg-dashboard-primary/30 text-dashboard-primary border-dashboard-primary/30 rounded-xl h-[46px] px-4"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <MapSelector
            initialLatitude={watchedLatitude}
            initialLongitude={watchedLongitude}
            onLocationChange={(lat, lng) => {
              setValue('latitude', lat, { shouldDirty: true });
              setValue('longitude', lng, { shouldDirty: true });
            }}
            onAddressChange={(address) => {
              setValue('address', address, { shouldDirty: true });
            }}
          />
        </div>
      </div>
    </motion.section>
  );
};
