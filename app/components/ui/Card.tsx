import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'compact';
}

export function Card({ children, className = '', hover = true, variant = 'default' }: CardProps) {
  const baseStyles = 'bg-white border border-gray-100 rounded-2xl shadow-sm';
  const hoverStyles = hover ? 'hover:shadow-md transition-all duration-200' : '';
  const paddingStyles = variant === 'compact' ? 'p-4' : 'p-6';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddingStyles} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', compact = false }: { children: React.ReactNode; className?: string; compact?: boolean }) {
  const padding = compact ? 'p-4' : 'p-6';
  return (
    <div className={`${padding} ${className}`}>
      {children}
    </div>
  );
}
