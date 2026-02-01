import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface FeedSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isExpanded?: boolean;
  onClose?: () => void;
  isMobileOverlay?: boolean;
}

export function FeedSearch({ 
  value, 
  onChange, 
  placeholder = "Search for notes, summaries & more",
  isExpanded = true,
  onClose,
  isMobileOverlay = false,
}: FeedSearchProps) {
  const [activeFilter, setActiveFilter] = useState<string>('');
  
  const filters = ['Notes', 'Summaries', 'Reports', 'Shows', 'People'];

  // Mobile overlay mode - full screen overlay with close button
  if (isMobileOverlay) {
    return (
      <div className="fixed inset-0 z-[100] bg-background md:hidden">
        <div className="flex flex-col h-full">
          {/* Search Header */}
          <div className="flex-shrink-0 border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Back/Close Button */}
              <button
                onClick={onClose}
                className="p-2 -ml-2 rounded-lg hover:bg-muted transition-all"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>

              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  autoFocus
                  className="w-full h-10 pl-10 pr-4 bg-muted rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-border transition-all text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Filter Pills */}
            {value && (
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(activeFilter === filter ? '' : filter)}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                      activeFilter === filter
                        ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Results Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {value ? (
              <div className="p-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  Search results for "{value}" will appear here
                </p>
              </div>
            ) : (
              <div className="p-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  Start typing to search...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop mode - inline search bar
  return (
    <div className="z-50 bg-background/95 backdrop-blur-md pb-3 px-4 md:px-6 pt-3 md:pt-4 mb-0">
      {/* Search Bar - Matches filter bar height and styling */}
      <div className="w-full max-w-xl mx-auto">
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[34px] pl-10 pr-4 bg-muted rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-border hover:bg-accent/80 transition-all text-xs text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        {/* Filter Pills - Only show when search is active */}
        {value && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(activeFilter === filter ? '' : filter)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}