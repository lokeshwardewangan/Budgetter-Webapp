import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormField } from './FormField';

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children'
> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
};

// Wraps FormField with a built-in show/hide eye toggle. Replaces the
// `useState(showPassword)` boilerplate previously duplicated across
// Login / Signup / Reset / ProfilePage password fields.
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ icon, ...props }, ref) => {
  const [show, setShow] = useState(false);
  return (
    <FormField
      {...props}
      ref={ref}
      type={show ? 'text' : 'password'}
      icon={icon}
      endAdornment={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="text-gray-500"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      }
    />
  );
});
PasswordInput.displayName = 'PasswordInput';
