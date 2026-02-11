import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { cn } from '../lib/utils';

interface FormTextareaProps extends React.ComponentProps<'textarea'> {
  name: string;
  label: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
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
    <div className={cn("grid gap-2", className)}>
      <Label
        className={cn("text-xs font-bold text-slate-500 uppercase tracking-wider", error && "text-red-500")}
        htmlFor={name}
      >
        {label}
      </Label>
      <Textarea
        id={name}
        {...register(name)}
        {...props}
        className={cn(
          "bg-[#0a0b1e]/60 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50",
          error && "border-red-500 focus:ring-red-500/50"
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
