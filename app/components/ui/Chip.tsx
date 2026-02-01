import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export function Chip({ children, className = '' }: ChipProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium text-gray-500 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors ${className}`}>
      {children}
    </span>
  );
}
