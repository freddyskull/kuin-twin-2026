import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { cn } from '../lib/utils'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface FormInputProps extends React.ComponentProps<'input'> {
  label: string
  error?: string
  registration?: UseFormRegisterReturn
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, id, error, registration, className, ...props }, ref) => {
    return (
      <div className={cn("grid gap-2", className)}>
        <div className="flex items-center">
          <Label className='text-xs text-muted-foreground' htmlFor={id}>
            {label}
          </Label>
        </div>
        <Input
          id={id}
          ref={ref}
          {...registration}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"
