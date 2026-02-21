import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { cn } from '../lib/utils';

interface FormSwitchProps {
  name: string;
  label: string;
  description?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  label,
  description,
  className,
  required,
  disabled,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn("flex flex-row items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10", className)}>
      <div className="space-y-0.5">
        <Label
          className={cn("text-sm font-bold text-white cursor-pointer", error && "text-red-500")}
          htmlFor={name}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            {description}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500 font-medium">
            {error.message as string}
          </p>
        )}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            className={cn(disabled && "opacity-50 cursor-not-allowed")}
          />
        )}
      />
    </div>
  );
};
