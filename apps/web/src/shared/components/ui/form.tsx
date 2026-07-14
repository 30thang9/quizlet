'use client';

import * as React from 'react';
import { useForm, FormProvider, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema, ZodError } from 'zod';
import { cn } from '@/shared/utils';

interface FormProps<T extends Record<string, any>>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void | Promise<void>;
  children: React.ReactNode;
}

function Form<T extends Record<string, any>>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<T>) {
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
      {...props}
    >
      {children}
    </form>
  );
}

interface FormFieldContextValue<T extends Record<string, any> = any> {
  name: keyof T;
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

interface UseFormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  placeholder?: string;
  error?: string;
}

interface FormFieldProps<T extends Record<string, any>> {
  name: keyof T;
  children: (field: {
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    ref: React.Ref<HTMLInputElement>;
  }) => React.ReactNode;
}

function FormField<T extends Record<string, any>>({ name, children }: FormFieldProps<T>) {
  const { watch, setValue, register, formState: { errors } } = React.useFormContext<T>();
  
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children({
        name: name as string,
        value: watch(name),
        onChange: (e) => setValue(name, e.target.value as any, { shouldValidate: true }),
        onBlur: () => {},
        ref: () => {},
      })}
    </FormFieldContext.Provider>
  );
}

// Re-export everything from react-hook-form
export { useForm, FormProvider, FormProvider as Root };

// Custom Form component with Zod integration
export function useZodForm<T extends Record<string, any>>(
  props: {
    schema: ZodSchema<T>;
    defaultValues?: UseFormProps<T>['defaultValues'];
  }
) {
  return useForm<T>({
    ...props,
    resolver: zodResolver(props.schema),
  });
}

// Helper to format Zod errors
export function getZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  return errors;
}

export { Form, FormField };
