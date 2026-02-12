"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Podcast } from "lucide-react";
import { FollowShowButton } from "../../components/FollowShowButton.js";

interface Show {
  id: string;
  name: string;
  channel_id: string;
  channel_thumbnail: string | null;
  episode_count: number;
  latest_thumbnail: string | null;
  latest_episode: string | null;
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

function isWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return (now.getTime() - date.getTime()) < days * 24 * 60 * 60 * 1000;
}

interface ShowsCarouselProps {
  shows: Show[];
}

export function ShowsCarousel({ shows }: ShowsCarouselProps) {
  // Deduplicate by id - safety net regardless of query
  const uniqueShows = Array.from(
    new Map(shows.map(show => [show.id, show])).values()
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  if (uniqueShows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <Podcast size={40} className="mx-auto mb-3 text-gray-300" />
        <p className="text-muted-foreground text-sm">No shows yet</p>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {uniqueShows.map((show) => (
          <a
            key={`show-${show.id}`}
            href={`/discover/shows/${show.channel_id}`}
            className="flex-none w-48 group/card"
          >
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-50 overflow-hidden">
                {show.latest_thumbnail || show.channel_thumbnail ? (
                  <img
                    src={show.latest_thumbnail || show.channel_thumbnail || ""}
                    alt={show.name}
                    className="w-full h-full object-cover group-hover/card:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Podcast size={28} className="text-gray-300" />
                  </div>
                )}
                {/* NEW badge - only if episode within last 7 days */}
                {show.latest_episode && isWithinDays(show.latest_episode, 7) && (
                  <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    NEW
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 flex flex-col gap-1">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-tight group-hover/card:text-blue-600 transition-colors">
                    {show.name}
                  </h4>
                  <FollowShowButton channelId={show.channel_id} variant="compact" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    {show.episode_count} {show.episode_count === 1 ? "episode" : "episodes"}
                  </p>
                  {show.latest_episode && (
                    <p className="text-[11px] text-muted-foreground">
                      {formatRelativeDate(show.latest_episode)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
