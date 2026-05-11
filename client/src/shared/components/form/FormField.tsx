import React from 'react';
import { cn } from '@/lib/utils';

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
  inputClassName?: string;
};

// Generic labelled input with leading icon, optional trailing adornment, and
// an inline error slot. Designed to wrap any registered react-hook-form input
// without enforcing a specific RHF API on the consumer.
export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon, endAdornment, className, inputClassName, ...inputProps }, ref) => {
    return (
      <div className={cn('relative mb-3', className)}>
        {label && (
          <label
            htmlFor={inputProps.id || inputProps.name}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <span className="absolute left-3 top-[7px] text-gray-500">{icon}</span>}
          <input
            ref={ref}
            {...inputProps}
            className={cn(
              'mt-1 block w-full rounded-md border border-gray-300 py-2 font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm',
              icon ? 'pl-9' : 'px-3',
              endAdornment ? 'pr-12' : '',
              inputClassName,
            )}
          />
          {endAdornment && (
            <div className="absolute right-0 top-1.5 flex items-center pr-3">{endAdornment}</div>
          )}
        </div>
        {error && <span className="ml-1 text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);
FormField.displayName = 'FormField';
