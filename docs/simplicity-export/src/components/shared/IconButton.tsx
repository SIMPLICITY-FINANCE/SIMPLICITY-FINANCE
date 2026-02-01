/**
 * IconButton - Reusable icon button component
 * 
 * Used throughout the app for action buttons with icons
 * Three size variants: sm (w-7), md (w-10), action (minimal padding)
 */

import { LucideIcon } from 'lucide-react';

export interface IconButtonProps {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Size variant */
  size?: 'sm' | 'md' | 'action';
  /** Button variant */
  variant?: 'default' | 'premium' | 'active' | 'minimal';
  /** Click handler */
  onClick?: () => void;
  /** Aria label for accessibility */
  'aria-label'?: string;
  /** Title tooltip */
  title?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function IconButton({
  icon: Icon,
  size = 'md',
  variant = 'default',
  onClick,
  'aria-label': ariaLabel,
  title,
  disabled = false,
  className = ''
}: IconButtonProps) {
  // Size-specific classes
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    action: 'p-1.5'
  };

  // Icon size map
  const iconSizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    action: 'w-3.5 h-3.5'
  };

  // Variant-specific classes
  const variantClasses = {
    default: 'bg-card border border-border/50 shadow-sm',
    premium: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border border-amber-200 dark:border-amber-900/50 shadow-sm',
    active: 'bg-muted/80 border border-border/50 shadow-sm',
    minimal: ''
  };

  const baseClasses = 'rounded-lg hover:bg-muted transition-all flex items-center justify-center';
  const sizeClass = sizeClasses[size];
  const variantClass = variantClasses[variant];
  const iconSize = iconSizeMap[size];

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      className={`${baseClasses} ${sizeClass} ${variantClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <Icon className={`${iconSize} ${variant === 'premium' ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`} />
    </button>
  );
}
