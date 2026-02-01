import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ icon, className = '', ...props }: InputProps) {
  const baseStyles = 'w-full h-11 px-4 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm';
  const iconStyles = icon ? 'pl-11' : '';
  
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <input
        className={`${baseStyles} ${iconStyles} ${className}`}
        {...props}
      />
    </div>
  );
}
