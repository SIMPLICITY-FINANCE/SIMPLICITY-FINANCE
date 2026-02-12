"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, X, Loader2, Mic2, Users, FileText } from "lucide-react";

interface SearchShow {
  id: string;
  name: string;
  channel_id: string;
  channel_thumbnail: string | null;
  episode_count: number;
}

interface SearchEpisode {
  id: string;
  youtube_title: string;
  youtube_thumbnail_url: string | null;
  published_at: string | null;
  show_name: string | null;
  channel_id: string | null;
}

interface SearchPerson {
  id: string;
  name: string;
  slug: string;
  avatar_url: string | null;
}

interface SearchResults {
  shows: SearchShow[];
  episodes: SearchEpisode[];
  people: SearchPerson[];
  query: string;
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export function DiscoverSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        if (!query) setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowDropdown(false);
        setIsExpanded(false);
        setQuery("");
        setResults(null);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  // Debounced search
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/discover/search?q=${encodeURIComponent(value.trim())}`
        );
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.error("[Search] Failed to fetch results", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  const hasResults =
    results &&
    (results.shows.length > 0 ||
      results.episodes.length > 0 ||
      results.people.length > 0);

  const handleResultClick = () => {
    setShowDropdown(false);
    setIsExpanded(false);
    setQuery("");
    setResults(null);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search trigger + input */}
      <div
        className={`flex items-center gap-2 transition-all duration-200 ${
          isExpanded
            ? "bg-white border border-gray-200 rounded-lg px-3 py-2 w-64 shadow-sm"
            : ""
        }`}
      >
        {/* Search icon button */}
        <button
          onClick={() => {
            if (!isExpanded) {
              setIsExpanded(true);
            } else if (query) {
              setQuery("");
              setResults(null);
              setShowDropdown(false);
            } else {
              setIsExpanded(false);
            }
          }}
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          aria-label="Search"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : query ? (
            <X className="w-4 h-4" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>

        {/* Input - only visible when expanded */}
        {isExpanded && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => {
              if (results && hasResults) setShowDropdown(true);
            }}
            placeholder="Search shows, episodes..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
          />
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* No results */}
          {!hasResults && !isLoading && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No results for &ldquo;
                <span className="font-medium text-foreground">{query}</span>
                &rdquo;
              </p>
            </div>
          )}

          {/* Shows section */}
          {results && results.shows.length > 0 && (
            <div>
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Mic2 className="w-3 h-3" /> Shows
                </p>
              </div>
              {results.shows.map((show) => (
                <Link
                  key={`search-show-${show.id}`}
                  href={`/discover/shows/${show.channel_id}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                    {show.channel_thumbnail ? (
                      <img
                        src={show.channel_thumbnail}
                        alt={show.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base">
                        🎙️
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {show.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {show.episode_count} episodes
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Episodes section */}
          {results && results.episodes.length > 0 && (
            <div
              className={
                results.shows.length > 0 ? "border-t border-gray-100" : ""
              }
            >
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Episodes
                </p>
              </div>
              {results.episodes.map((ep) => (
                <Link
                  key={`search-ep-${ep.id}`}
                  href={`/episode/${ep.id}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                    {ep.youtube_thumbnail_url ? (
                      <img
                        src={ep.youtube_thumbnail_url}
                        alt={ep.youtube_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base">
                        📄
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {ep.youtube_title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ep.show_name && <span>{ep.show_name} · </span>}
                      {ep.published_at && formatRelativeDate(ep.published_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* People section */}
          {results && results.people.length > 0 && (
            <div
              className={
                results.shows.length > 0 || results.episodes.length > 0
                  ? "border-t border-gray-100"
                  : ""
              }
            >
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> People
                </p>
              </div>
              {results.people.map((person) => (
                <Link
                  key={`search-person-${person.id}`}
                  href={`/discover/people/${person.slug}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
                    {person.avatar_url ? (
                      <img
                        src={person.avatar_url}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base">
                        👤
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {person.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Footer hint */}
          {hasResults && (
            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/30">
              <p className="text-[11px] text-muted-foreground">
                Press{" "}
                <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px]">
                  Esc
                </kbd>{" "}
                to close
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
