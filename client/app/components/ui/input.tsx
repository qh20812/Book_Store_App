import React, { forwardRef, useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  validationHint?: string | React.ReactNode;
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, validationHint, label, error, className = '', ...rest }, ref) => {
    const [showHint, setShowHint] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        
        <label className={`input validator w-full ${className}`}>
          {icon && (
            <span className="h-[1em] opacity-50">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            onInvalid={() => setShowHint(true)}
            onInput={() => setShowHint(false)}
            {...rest}
            className='w-full'
          />
        </label>

        {validationHint && (
          <div className={`validator-hint ${!showHint ? 'hidden' : ''}`}>
            {validationHint}
          </div>
        )}

        {error && (
          <div className="text-error text-sm mt-1">{error}</div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
