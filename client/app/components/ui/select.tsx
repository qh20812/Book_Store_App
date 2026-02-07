import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  placeholder?: string;
}

const sizeClassMap: Record<'xs' | 'sm' | 'md' | 'lg', string> = {
  xs: 'select-xs',
  sm: 'select-sm',
  md: 'select-md',
  lg: 'select-lg',
};

const variantClassMap: Record<string, string> = {
  bordered: 'select-bordered',
  ghost: 'select-ghost',
  primary: 'select-primary',
  secondary: 'select-secondary',
  accent: 'select-accent',
  info: 'select-info',
  success: 'select-success',
  warning: 'select-warning',
  error: 'select-error',
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, label, error, size = 'md', variant = 'bordered', placeholder, className = '', ...rest }, ref) => {
    const sizeClass = sizeClassMap[size];
    const variantClass = variantClassMap[variant];

    return (
      <div className="w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        
        <select
          ref={ref}
          className={`select ${sizeClass} ${variantClass} w-full appearance-none ${className}`}
          {...rest}
        >
          {placeholder && (
            <option disabled value="">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <div className="text-error text-sm mt-1">{error}</div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;