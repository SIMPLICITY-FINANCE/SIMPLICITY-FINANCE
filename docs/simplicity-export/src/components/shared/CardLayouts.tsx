/**
 * CardGrid - Reusable 3-column card grid layout
 * 
 * Used for displaying cards in a 3-column grid with consistent spacing
 * Includes automatic row separators
 */

export interface CardGridProps {
  /** Array of items to display */
  items: any[];
  /** Render function for each item */
  renderItem: (item: any, index: number) => React.ReactNode;
  /** Columns per row */
  columns?: number;
  /** Show separators between rows */
  showSeparators?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function CardGrid({
  items,
  renderItem,
  columns = 3,
  showSeparators = true,
  className = ''
}: CardGridProps) {
  const rowCount = Math.ceil(items.length / columns);

  return (
    <div className={`space-y-5 ${className}`}>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div key={rowIndex}>
          {/* Row of cards */}
          <div className="flex justify-between">
            {items.slice(rowIndex * columns, (rowIndex + 1) * columns).map((item, itemIndex) => (
              <div key={rowIndex * columns + itemIndex}>
                {renderItem(item, rowIndex * columns + itemIndex)}
              </div>
            ))}
          </div>

          {/* Separator between rows (except after last row) */}
          {showSeparators && rowIndex < rowCount - 1 && (
            <div className="border-t border-border/30 mt-5" />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * CardCarousel - Reusable horizontal scrolling carousel
 * 
 * Used for displaying cards in a horizontal scrollable container
 */

export interface CardCarouselProps {
  /** Array of items to display */
  items: any[];
  /** Render function for each item */
  renderItem: (item: any, index: number) => React.ReactNode;
  /** Gap between cards */
  gap?: number;
  /** Additional CSS classes */
  className?: string;
}

export function CardCarousel({
  items,
  renderItem,
  gap = 3,
  className = ''
}: CardCarouselProps) {
  const gapClass = `gap-${gap}`;

  return (
    <div className={`overflow-x-auto hide-scrollbar -mx-1 px-1 ${className}`}>
      <div className={`flex ${gapClass} pb-2`}>
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
