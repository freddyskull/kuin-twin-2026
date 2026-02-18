"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  className,
  loading: externalLoading
}) => {
  const {
    formState: { isSubmitting, isValid, isDirty },
  } = useFormContext();

  const loading = externalLoading || isSubmitting;
  const isDisabled = !isValid || !isDirty || loading;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className={cn("w-full rounded-xl h-12 text-md font-bold transition-all shadow-lg", className)}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Cargando...
        </>
      ) : (
        children
      )}
    </Button>
  );
};
