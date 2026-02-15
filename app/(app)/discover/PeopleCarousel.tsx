"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

interface Person {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  show_name: string;
  show_slug: string | null;
}

interface PeopleCarouselProps {
  people: Person[];
}

export function PeopleCarousel({ people }: PeopleCarouselProps) {
  // Deduplicate by id - safety net regardless of query
  const uniquePeople = Array.from(
    new Map(people.map(person => [person.id, person])).values()
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

  if (uniquePeople.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">No hosts set yet</p>
        <p className="text-xs text-muted-foreground">
          Hosts are configured in the admin panel for each show.
          <br />
          Set hosts for shows to see them appear here.
        </p>
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
        {uniquePeople.map((person) => {
          const displayImage = person.image_url;
          const hue = ((person.name?.charCodeAt(0) ?? 65) * 5) % 360;
          return (
            <a
              key={`person-${person.slug}`}
              href={`/discover/people/${person.slug}`}
              className="flex-shrink-0 w-36 p-2 rounded-lg hover:bg-accent transition-colors group/card"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-muted mx-auto mb-2 ring-2 ring-border">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={person.name ?? ''}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-xl font-bold text-white rounded-full"
                    style={{ background: `hsl(${hue}, 65%, 45%)` }}
                  >
                    {person.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
              </div>

              {/* Name */}
              <p className="text-xs font-semibold text-foreground text-center line-clamp-2 leading-tight mb-0.5">
                {person.name}
              </p>

              {/* Show name - only show if different from person name */}
              {person.show_name && person.show_name !== person.name && (
                <p className="text-[11px] text-muted-foreground text-center truncate">
                  {person.show_name}
                </p>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
