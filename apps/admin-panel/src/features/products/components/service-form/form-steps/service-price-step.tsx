import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormInput, FormSelect, FormSwitch } from 'ui-components';
import type { ServiceFormValues } from '../schema';
import { useServicesStore } from '../../../../../stores/services.store';

export const ServicePriceStep: React.FC = () => {
  const { watch } = useFormContext<ServiceFormValues>();
  const { units } = useServicesStore();
  const showPrice = watch('showPrice');

  return (
    <motion.section
      key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-card/40 backdrop-blur-2xl border border-border rounded-[2rem] p-8 space-y-8"
    >
      <div className="flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-white tracking-tight">Precio</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormInput
          name="basePrice"
          label="Precio ($)"
          required={showPrice}
          type="number"
          step="0.01"
          className="text-xl font-black"
          disabled={!showPrice}
        />

        <FormSelect
          name="unitId"
          label="Unidad"
          required={showPrice}
          disabled={!showPrice}
          options={units.map(u => ({
            value: u.id,
            label: `${u.name} (${u.abbreviation})`
          }))}
        />

        <div className="col-span-2 pt-2">
          <FormSwitch
            name="showPrice"
            label="Mostrar precio en el marketplace"
            description="Si se desactiva, el precio no será visible para los clientes."
          />
        </div>
      </div>
    </motion.section>
  );
};
