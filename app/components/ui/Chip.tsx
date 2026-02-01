import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export function Chip({ children, className = '' }: ChipProps) {
  return (
    <span className={`inline-flex items-center px-2 py-1 text-[10px] font-medium text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors ${className}`}>
      {children}
    </span>
  );
}
