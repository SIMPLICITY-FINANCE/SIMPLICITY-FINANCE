"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

interface Person {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  avatar_url: string | null;
  title: string | null;
  episode_count: number;
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
      <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center">
        <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">No people added yet</p>
        <p className="text-xs text-muted-foreground">
          People are extracted from episodes during ingestion.
          <br />
          Process some episodes to see people appear here.
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
        {uniquePeople.map((person) => (
          <a
            key={`person-${person.id}`}
            href={`/discover/people/${person.slug}`}
            className="flex-none w-32 group/card"
          >
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              {/* Avatar */}
              <div className="pt-3 pb-2 flex justify-center">
                {person.avatar_url ? (
                  <img
                    src={person.avatar_url}
                    alt={person.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl ring-2 ring-gray-100">
                    {person.emoji || "\u{1F464}"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-2 pb-3 text-center">
                <h4 className="text-xs font-semibold text-foreground line-clamp-1 group-hover/card:text-blue-600 transition-colors">
                  {person.name}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {person.episode_count} {person.episode_count === 1 ? "ep" : "eps"}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
