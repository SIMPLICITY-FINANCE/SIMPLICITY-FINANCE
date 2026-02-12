"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface Episode {
  id: string;
  youtube_title: string;
  video_id: string;
  youtube_thumbnail_url: string | null;
  published_at: string | null;
  show_name: string | null;
  youtube_duration: string | null;
}

interface RecentEpisodesStripProps {
  episodes: Episode[];
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export function RecentEpisodesStrip({ episodes }: RecentEpisodesStripProps) {
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
        {episodes.map((ep) => (
          <a
            key={ep.id}
            href={`/episodes/${ep.video_id}`}
            className="flex-none w-56 group/card"
          >
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-50 overflow-hidden">
                {ep.youtube_thumbnail_url ? (
                  <img
                    src={ep.youtube_thumbnail_url}
                    alt={ep.youtube_title}
                    className="w-full h-full object-cover group-hover/card:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play size={28} className="text-gray-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 flex flex-col gap-1">
                <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-tight group-hover/card:text-blue-600 transition-colors">
                  {ep.youtube_title}
                </h4>
                <div className="flex items-center justify-between">
                  {ep.show_name && (
                    <p className="text-[11px] text-muted-foreground truncate">
                      {ep.show_name}
                    </p>
                  )}
                  {ep.published_at && (
                    <p className="text-[11px] text-muted-foreground flex-shrink-0">
                      {formatRelativeDate(ep.published_at)}
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
