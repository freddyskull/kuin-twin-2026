"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, Label } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.ComponentProps<'input'> {
  name: string;
  label: string;
  helperText?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  helperText,
  className,
  required,
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
        className={cn("text-sm font-medium", error && "text-destructive")}
        htmlFor={name}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={name}
        {...register(name)}
        {...props}
        className={cn(
          "rounded-xl",
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {error && (
        <p className="text-xs text-destructive font-medium">
          {error.message as string}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
};
