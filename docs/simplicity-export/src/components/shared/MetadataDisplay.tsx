/**
 * MetadataRow - Reusable icon + text metadata display
 * 
 * Used for displaying metadata like show name, host, date, duration, etc.
 * Standard pattern across cards, lists, and detail views
 */

import { LucideIcon } from 'lucide-react';

export interface MetadataRowProps {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Text to display */
  text: string;
  /** Text size variant */
  size?: 'xs' | 'sm';
  /** Icon size in pixels */
  iconSize?: number;
  /** Additional CSS classes */
  className?: string;
}

export function MetadataRow({
  icon: Icon,
  text,
  size = 'sm',
  iconSize = 12,
  className = ''
}: MetadataRowProps) {
  const textClass = size === 'xs' ? 'text-[9px]' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon
        className="text-muted-foreground flex-shrink-0"
        style={{ width: iconSize, height: iconSize }}
      />
      <span className={`${textClass} text-muted-foreground truncate`}>
        {text}
      </span>
    </div>
  );
}

/**
 * MetadataStack - Vertical stack of metadata rows
 * 
 * Used in cards and detail views for displaying multiple metadata items
 */

export interface MetadataItem {
  icon: LucideIcon;
  text: string;
}

export interface MetadataStackProps {
  /** Array of metadata items to display */
  items: MetadataItem[];
  /** Size variant */
  size?: 'xs' | 'sm';
  /** Gap between items */
  gap?: 'tight' | 'normal';
  /** Icon size in pixels */
  iconSize?: number;
  /** Additional CSS classes */
  className?: string;
}

export function MetadataStack({
  items,
  size = 'sm',
  gap = 'normal',
  iconSize = 12,
  className = ''
}: MetadataStackProps) {
  const gapClass = gap === 'tight' ? 'gap-0.5' : 'gap-1';

  return (
    <div className={`flex flex-col ${gapClass} ${className}`}>
      {items.map((item, index) => (
        <MetadataRow
          key={index}
          icon={item.icon}
          text={item.text}
          size={size}
          iconSize={iconSize}
        />
      ))}
    </div>
  );
}
