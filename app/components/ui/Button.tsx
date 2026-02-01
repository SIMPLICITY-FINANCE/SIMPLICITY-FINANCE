import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';
  
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring/20',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/20',
    ghost: 'bg-transparent text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/20 shadow-none',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
