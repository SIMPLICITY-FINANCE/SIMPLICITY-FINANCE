"use client";

import { useState, useTransition } from "react";
import { Button } from "./Button.js";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface FollowButtonProps {
  isFollowing: boolean;
  onFollow: () => Promise<{ success: boolean }>;
  onUnfollow: () => Promise<{ success: boolean }>;
  size?: "sm" | "md" | "lg";
}

export function FollowButton({ isFollowing, onFollow, onUnfollow, size = "sm" }: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      if (following) {
        const result = await onUnfollow();
        if (result.success) {
          setFollowing(false);
        }
      } else {
        const result = await onFollow();
        if (result.success) {
          setFollowing(true);
        }
      }
    });
  };

  return (
    <Button
      variant={following ? "secondary" : "primary"}
      size={size}
      onClick={handleClick}
      disabled={isPending}
    >
      {following ? (
        <>
          <BookmarkCheck size={16} className="mr-2" />
          Following
        </>
      ) : (
        <>
          <Bookmark size={16} className="mr-2" />
          Follow
        </>
      )}
    </Button>
  );
}
