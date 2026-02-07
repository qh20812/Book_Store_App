import React, { forwardRef } from 'react';

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, className = '', ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        
        <input
          ref={ref}
          type="date"
          className={`input input-bordered w-full ${className}`}
          {...rest}
        />

        {error && (
          <div className="text-error text-sm mt-1">{error}</div>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export default DateInput;
