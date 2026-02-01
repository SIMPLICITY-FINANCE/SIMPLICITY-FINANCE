/**
 * EpisodeCard - Reusable card component for episode/podcast display
 * 
 * Used across: Discover, Notebook, Top Shows, New Shows, Following, Saved
 * Variants: grid (default), carousel (compact)
 */

import { FileText, Mic, User, Calendar } from 'lucide-react';

export interface EpisodeCardProps {
  /** Episode or podcast title */
  title: string;
  /** URL for thumbnail image */
  thumbnailUrl: string;
  /** Show/podcast name */
  showName: string;
  /** Host or guest name */
  host: string;
  /** Date string (formatted as MM-DD-YYYY) */
  date: string;
  /** Click handler */
  onClick?: () => void;
  /** Card variant - grid has larger padding, carousel is compact */
  variant?: 'grid' | 'carousel';
  /** Additional CSS classes */
  className?: string;
}

export function EpisodeCard({
  title,
  thumbnailUrl,
  showName,
  host,
  date,
  onClick,
  variant = 'grid',
  className = ''
}: EpisodeCardProps) {
  // Variant-specific padding
  const contentPadding = variant === 'carousel' ? 'p-2' : 'p-2.5';
  const titleSize = variant === 'carousel' ? 'text-[10px]' : 'text-[11px]';
  const iconSize = variant === 'carousel' ? 'w-[10px] h-[10px]' : 'w-[11px] h-[11px]';
  const metadataTextSize = variant === 'carousel' ? 'text-[9px]' : 'text-[10px]';
  const metadataGap = variant === 'carousel' ? 'gap-0.5' : 'gap-1';
  const titleMargin = variant === 'carousel' ? 'mb-1.5 pb-1.5' : 'mb-2';
  const hasTitleBorder = variant === 'carousel';

  return (
    <div
      className={`group cursor-pointer flex-shrink-0 w-40 ${className}`}
      onClick={onClick}
    >
      {/* Card Container */}
      <div className="bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all overflow-hidden">
        {/* Thumbnail */}
        <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className={contentPadding}>
          {/* Title with Icon */}
          <div className={`${titleMargin} ${hasTitleBorder ? 'border-b border-border/30' : ''}`}>
            <div className="flex items-start gap-1">
              <FileText className={`${iconSize} text-foreground flex-shrink-0 mt-0.5`} />
              <h3 className={`${titleSize} font-semibold text-foreground line-clamp-2 leading-tight flex-1`}>
                {title}
              </h3>
            </div>
          </div>

          {/* Metadata Stack */}
          <div className={`flex flex-col ${metadataGap}`}>
            {/* Show */}
            <div className="flex items-center gap-1.5">
              <Mic className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className={`${metadataTextSize} text-muted-foreground truncate`}>
                {showName}
              </span>
            </div>

            {/* Host/Guest */}
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className={`${metadataTextSize} text-muted-foreground truncate`}>
                {host}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className={`${metadataTextSize} text-muted-foreground`}>
                {date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
