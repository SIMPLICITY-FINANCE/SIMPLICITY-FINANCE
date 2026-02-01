/**
 * useHoverState Hook
 * 
 * Simple reusable hook for managing hover state on items.
 * Useful for showing/hiding UI elements on hover (e.g., "Unfollow" button).
 */

import { useState, useCallback } from 'react';

export interface UseHoverStateReturn {
  hoveredId: string | null;
  setHovered: (id: string | null) => void;
  isHovered: (id: string) => boolean;
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: () => void;
}

export function useHoverState(): UseHoverStateReturn {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const setHovered = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  const isHovered = useCallback(
    (id: string) => hoveredId === id,
    [hoveredId]
  );

  const handleMouseEnter = useCallback((id: string) => {
    setHoveredId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  return {
    hoveredId,
    setHovered,
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
  };
}
