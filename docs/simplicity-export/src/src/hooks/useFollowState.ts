/**
 * useFollowState Hook
 * 
 * Manages follow/unfollow state for podcasts and people.
 * Provides consistent follow toggle logic across the application.
 */

import { useState, useCallback } from 'react';

export interface UseFollowStateReturn {
  followedShows: Set<string>;
  followedPeople: Set<string>;
  toggleFollowShow: (showId: string) => void;
  toggleFollowPerson: (personId: string) => void;
  isFollowingShow: (showId: string) => boolean;
  isFollowingPerson: (personId: string) => boolean;
  followShow: (showId: string) => void;
  unfollowShow: (showId: string) => void;
  followPerson: (personId: string) => void;
  unfollowPerson: (personId: string) => void;
}

export function useFollowState(
  initialShows: Set<string> = new Set(),
  initialPeople: Set<string> = new Set()
): UseFollowStateReturn {
  const [followedShows, setFollowedShows] = useState<Set<string>>(initialShows);
  const [followedPeople, setFollowedPeople] = useState<Set<string>>(initialPeople);

  const toggleFollowShow = useCallback((showId: string) => {
    setFollowedShows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(showId)) {
        newSet.delete(showId);
      } else {
        newSet.add(showId);
      }
      return newSet;
    });
  }, []);

  const toggleFollowPerson = useCallback((personId: string) => {
    setFollowedPeople((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(personId)) {
        newSet.delete(personId);
      } else {
        newSet.add(personId);
      }
      return newSet;
    });
  }, []);

  const isFollowingShow = useCallback(
    (showId: string) => followedShows.has(showId),
    [followedShows]
  );

  const isFollowingPerson = useCallback(
    (personId: string) => followedPeople.has(personId),
    [followedPeople]
  );

  const followShow = useCallback((showId: string) => {
    setFollowedShows((prev) => new Set(prev).add(showId));
  }, []);

  const unfollowShow = useCallback((showId: string) => {
    setFollowedShows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(showId);
      return newSet;
    });
  }, []);

  const followPerson = useCallback((personId: string) => {
    setFollowedPeople((prev) => new Set(prev).add(personId));
  }, []);

  const unfollowPerson = useCallback((personId: string) => {
    setFollowedPeople((prev) => {
      const newSet = new Set(prev);
      newSet.delete(personId);
      return newSet;
    });
  }, []);

  return {
    followedShows,
    followedPeople,
    toggleFollowShow,
    toggleFollowPerson,
    isFollowingShow,
    isFollowingPerson,
    followShow,
    unfollowShow,
    followPerson,
    unfollowPerson,
  };
}
