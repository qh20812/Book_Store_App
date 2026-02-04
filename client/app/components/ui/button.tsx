import React, { forwardRef } from 'react';

type Variant = 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
}

const sizeClassMap: Record<Size, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

const variantClassMap: Record<Variant, string> = {
  neutral: 'btn-neutral',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'neutral', size = 'md', fullWidth = false, className = '', children, ...rest }, ref) => {
    const classes = [
      'btn',
      variantClassMap[variant],
      sizeClassMap[size],
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;