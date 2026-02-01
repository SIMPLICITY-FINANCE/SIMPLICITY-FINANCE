/**
 * SearchFilterBar - Reusable search and filter control bar
 * 
 * Used across: Notebook, Reports, Discover, Following, Saved, Top Shows, New Shows
 * Standard pattern: Search input (flex-1) + Filter dropdown (fixed width)
 */

import { Search, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchFilterBarProps {
  /** Current search query */
  searchValue: string;
  /** Search change handler */
  onSearchChange: (value: string) => void;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Current filter value */
  filterValue?: string;
  /** Filter options array */
  filterOptions?: FilterOption[];
  /** Filter change handler */
  onFilterChange?: (value: string) => void;
  /** Show filter dropdown? */
  showFilter?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterValue,
  filterOptions = [],
  onFilterChange,
  showFilter = true,
  className = ''
}: SearchFilterBarProps) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Get current filter label
  const currentFilterLabel = filterOptions.find(opt => opt.value === filterValue)?.label || 'All';

  return (
    <div className={`flex items-center gap-3 mb-7 ${className}`}>
      {/* Search Bar - Always visible, extends to the right */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Filter - Right Side */}
      {showFilter && filterOptions.length > 0 && (
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-xs font-medium hover:bg-muted transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{currentFilterLabel}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Filter Dropdown Menu */}
          {showFilterDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowFilterDropdown(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/50 rounded-xl shadow-lg z-20 overflow-hidden">
                <div className="p-2 space-y-0.5">
                  {filterOptions.map((option, index) => (
                    <div key={option.value}>
                      <button
                        onClick={() => {
                          onFilterChange?.(option.value);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          filterValue === option.value
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {option.label}
                      </button>

                      {/* Separator after first item (typically "All") */}
                      {index === 0 && filterOptions.length > 1 && (
                        <div className="border-t border-border/30 my-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
