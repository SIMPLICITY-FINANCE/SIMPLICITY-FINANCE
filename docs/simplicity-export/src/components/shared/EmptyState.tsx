/**
 * EmptyState - Reusable empty state display
 * 
 * Used across: Notebook, Saved, Following, Reports, Notifications
 * Standard pattern for "no content" states
 */

import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Primary message */
  title: string;
  /** Secondary message (optional) */
  description?: string;
  /** Custom action button (optional) */
  action?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <Icon className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      {description && (
        <p className="text-[10px] text-muted-foreground">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}
