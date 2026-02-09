import React, { useEffect } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { Star, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ServiceFormValues } from '../schema';

export const ServiceAttributesStep: React.FC = () => {
  const { register, control, formState: { errors }, setValue } = useFormContext<ServiceFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadata"
  });

  const watchedMetadata = useWatch({ control, name: 'metadata' });
  const watchedDynamicAttributes = useWatch({ control, name: 'dynamicAttributes' });

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

  return (
    <motion.section
      key="step4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 space-y-8"
    >
      <div className="flex items-center gap-3">
        <Star className="h-5 w-5 text-dashboard-primary" />
        <h2 className="text-xl font-bold text-white tracking-tight">Atributos</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Especificaciones Técnicas</label>
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

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Atributos JSON</label>
          <textarea {...register('dynamicAttributes')} rows={3} placeholder='{"clave": "valor"}' className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-xl py-3 px-4 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-dashboard-primary/30 outline-none placeholder:text-slate-700" />
          {errors.dynamicAttributes && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.dynamicAttributes.message}</p>}
        </div>
      </div>
    </motion.section>
  );
};
