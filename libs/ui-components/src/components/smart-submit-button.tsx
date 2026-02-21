import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, type ButtonProps } from './ui/button';
import { Loader2 } from 'lucide-react';

interface SmartSubmitButtonProps extends ButtonProps {
  loadingLabel?: string;
}

export const SmartSubmitButton: React.FC<SmartSubmitButtonProps> = ({
  children,
  loadingLabel = 'Procesando...',
  disabled,
  className,
  ...props
}) => {
  const {
    formState: { isSubmitting, isValid, isDirty }
  } = useFormContext();

  const isButtonDisabled = disabled || isSubmitting || !isValid || !isDirty;

  return (
    <Button
      type="submit"
      disabled={isButtonDisabled}
      className={className}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
