import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ icon, className = '', ...props }: InputProps) {
  const baseStyles = 'w-full h-10 px-4 text-sm bg-white border border-gray-100 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all';
  const iconStyles = icon ? 'pl-10' : '';
  
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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
