/**
 * useFilterState Hook
 * 
 * Generic reusable hook for managing filter/tab state.
 * Reduces boilerplate code across components with filter UI.
 */

import { useState, useCallback } from 'react';

export interface UseFilterStateReturn<T extends string> {
  currentFilter: T;
  setFilter: (filter: T) => void;
  isActive: (filter: T) => boolean;
}

export function useFilterState<T extends string>(
  defaultFilter: T
): UseFilterStateReturn<T> {
  const [currentFilter, setCurrentFilter] = useState<T>(defaultFilter);

  const setFilter = useCallback((filter: T) => {
    setCurrentFilter(filter);
  }, []);

  const isActive = useCallback(
    (filter: T) => currentFilter === filter,
    [currentFilter]
  );

  return {
    currentFilter,
    setFilter,
    isActive,
  };
}
