import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
};

// Standard primary action button for forms: shows a spinner + "Please wait"
// while a mutation is pending, disables itself, and keeps the visual style
// consistent across every form.
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  loadingText = 'Please wait',
  disabled,
  className,
  children,
  ...rest
}) => (
  <Button
    type="submit"
    disabled={isLoading || disabled}
    className={cn(
      'h-10 w-full rounded-md bg-blue-600 px-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none',
      (isLoading || disabled) && 'cursor-not-allowed',
      className
    )}
    {...rest}
  >
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText}
      </>
    ) : (
      children
    )}
  </Button>
);
