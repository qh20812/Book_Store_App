import React from 'react';

type LoadingType = 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: LoadingType;
  size?: LoadingSize;
  className?: string;
}

const typeClassMap: Record<LoadingType, string> = {
  spinner: 'loading-spinner',
  dots: 'loading-dots',
  ring: 'loading-ring',
  ball: 'loading-ball',
  bars: 'loading-bars',
  infinity: 'loading-infinity',
};

const sizeClassMap: Record<LoadingSize, string> = {
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
  xl: 'loading-xl',
};

const Loading: React.FC<LoadingProps> = ({ 
  type = 'spinner', 
  size = 'md', 
  className = '', 
  ...rest 
}) => {
  const classes = [
    'loading',
    typeClassMap[type],
    sizeClassMap[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} {...rest} />;
};

export default Loading;