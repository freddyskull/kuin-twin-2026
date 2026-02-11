import React from 'react';
import { useForm, FormProvider, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface CustomFormProps<T extends FieldValues> {
  schema: any;
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: DefaultValues<T>;
  children: React.ReactNode | ((methods: UseFormReturn<T>) => React.ReactNode);
  className?: string;
  id?: string;
}

export function CustomForm<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
  id
}: CustomFormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
      >
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  );
}
