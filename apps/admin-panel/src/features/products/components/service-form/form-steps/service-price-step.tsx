import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormInput, FormSelect } from 'ui-components';
import type { ServiceFormValues } from '../schema';
import { useServicesStore } from '../../../../../stores/services.store';

export const ServicePriceStep: React.FC = () => {
  const { control } = useFormContext<ServiceFormValues>();
  const { units } = useServicesStore();

  return (
    <motion.section
      key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 space-y-8"
    >
      <div className="flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-dashboard-primary" />
        <h2 className="text-xl font-bold text-white tracking-tight">Precio</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormInput
          name="basePrice"
          label="Precio ($)"
          required
          type="number"
          step="0.01"
          className="text-xl font-black"
        />

        <FormSelect
          name="unitId"
          label="Unidad"
          required
          options={units.map(u => ({
            value: u.id,
            label: `${u.name} (${u.abbreviation})`
          }))}
        />
      </div>
    </motion.section>
  );
};
