import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { cn } from '../lib/utils';

interface FormSelectProps {
  name: string;
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  placeholder = "Seleccionar...",
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
    <div className={cn("grid gap-2", className)}>
      <Label
        className={cn("text-xs font-bold text-slate-500 uppercase tracking-wider", error && "text-red-500")}
        htmlFor={name}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
            <SelectTrigger
              id={name}
              className={cn(
                "bg-[#0a0b1e]/60 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50",
                error && "border-red-500 focus:ring-red-500/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1c3d] border-white/10 text-white">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && (
        <p className="text-xs text-red-500 font-medium">
          {error.message as string}
        </p>
      )}
    </div>
  );
};
