"use client";

import { useState } from "react";
import { Plus, Check, Loader2 } from "lucide-react";

interface FollowShowButtonProps {
  channelId: string;
  initialFollowing?: boolean;
  variant?: "default" | "compact";
}

export function FollowShowButton({
  channelId,
  initialFollowing = false,
  variant = "default",
}: FollowShowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      const method = following ? "DELETE" : "POST";
      const res = await fetch(`/api/shows/${channelId}/follow`, { method });
      if (res.ok) {
        setFollowing(!following);
        // Broadcast so other components (e.g. feed) can react
        window.dispatchEvent(new CustomEvent("follow-change", { detail: { channelId, following: !following } }));
      }
    } catch {
      console.error("[FollowShowButton] Failed to toggle follow");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
          following
            ? "bg-blue-100 text-blue-600 hover:bg-red-100 hover:text-red-500"
            : "bg-muted text-muted-foreground hover:bg-blue-100 hover:text-blue-600"
        }`}
        title={following ? "Unfollow" : "Follow"}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : following ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Plus className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        following
          ? "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
          : "bg-muted text-foreground border border-border hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : following ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Plus className="w-3.5 h-3.5" />
      )}
      {following ? "Following" : "Follow"}
    </button>
  );
}
