/**
 * SectionSeparator - Standardized separator component
 * 
 * Used throughout the app for visual separation between sections
 * Consistent border opacity and spacing
 */

export interface SectionSeparatorProps {
  /** Spacing variant */
  spacing?: 'tight' | 'default' | 'loose';
  /** Horizontal padding (for menu separators) */
  horizontalPadding?: number;
  /** Additional CSS classes */
  className?: string;
}

export function SectionSeparator({
  spacing = 'default',
  horizontalPadding,
  className = ''
}: SectionSeparatorProps) {
  // Spacing map
  const spacingMap = {
    tight: 'my-1',
    default: 'my-7',
    loose: 'my-12'
  };

  const spacingClass = spacingMap[spacing];
  const paddingClass = horizontalPadding ? `mx-${horizontalPadding}` : '';

  return (
    <div className={`border-t border-border/30 ${spacingClass} ${paddingClass} ${className}`} />
  );
}
