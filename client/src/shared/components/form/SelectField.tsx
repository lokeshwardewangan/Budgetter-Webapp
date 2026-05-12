import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Option = { value: string; label: string };

type SelectFieldProps = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | readonly Option[];
  error?: string;
  className?: string;
};

// Thin wrapper around the Radix `<Select>` for react-hook-form usage via
// Controller. Accepts either an array of strings (auto-mapped to
// { value, label }) or a list of { value, label } objects.
export function SelectField({
  label,
  required,
  placeholder = 'Choose...',
  value,
  onChange,
  options,
  error,
  className,
}: SelectFieldProps) {
  const normalised: Option[] = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  return (
    <div className={className}>
      {label && (
        <p className="text-sm">
          {label}{' '}
          {required && (
            <span className="text-red-500 dark:text-red-200">*</span>
          )}
        </p>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {normalised.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <span
          role="alert"
          className="mt-1 block text-xs font-medium text-red-500"
        >
          {error}
        </span>
      )}
    </div>
  );
}
