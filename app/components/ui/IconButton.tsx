import React from 'react';

interface IconButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'ghost' | 'subtle';
}

export function IconButton({ children, className = '', onClick, variant = 'ghost' }: IconButtonProps) {
  const baseStyles = 'w-8 h-8 flex items-center justify-center rounded-md transition-colors';
  const variantStyles = variant === 'ghost' 
    ? 'hover:bg-gray-100/50' 
    : 'bg-gray-50 hover:bg-gray-100';
  
  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
}
