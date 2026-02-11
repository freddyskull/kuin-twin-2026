import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { cn } from '../lib/utils';

interface FormCheckboxProps extends React.ComponentProps<'input'> {
  name: string;
  label: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  className,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Checkbox
        id={name}
        {...register(name)}
        {...props}
        className={cn(
          "w-5 h-5 rounded bg-[#0a0b1e]/60 border border-white/10 text-dashboard-primary focus:ring-2 focus:ring-dashboard-primary/50",
          error && "border-red-500"
        )}
      />
      <Label
        className={cn("text-sm font-bold text-slate-300 cursor-pointer", error && "text-red-500")}
        htmlFor={name}
      >
        {label}
      </Label>
      {error && (
        <p className="text-xs text-red-500 font-medium ml-2">
          {error.message as string}
        </p>
      )}
    </div>
  );
};
