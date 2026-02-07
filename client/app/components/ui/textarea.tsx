import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fieldsetClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, fieldsetClassName = '', className = '', ...rest }, ref) => {
    return (
      <fieldset className={`fieldset ${fieldsetClassName}`}>
        {label && <legend className="fieldset-legend">{label}</legend>}
        <textarea
          ref={ref}
          className={`textarea h-24 ${className}`}
          {...rest}
        />
        {helperText && !error && (
          <div className="label text-sm text-base-content/60">{helperText}</div>
        )}
        {error && (
          <div className="label text-sm text-error">{error}</div>
        )}
      </fieldset>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;