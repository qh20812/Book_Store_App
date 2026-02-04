import React from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  soft?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantClassMap: Record<AlertVariant, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

const Alert: React.FC<AlertProps> = ({ 
  variant = 'info', 
  soft = false,
  className = '', 
  children,
  ...rest 
}) => {
  const classes = [
    'alert',
    variantClassMap[variant],
    soft ? 'alert-soft' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div role="alert" className={classes} {...rest}>
      {children}
    </div>
  );
};

export default Alert;