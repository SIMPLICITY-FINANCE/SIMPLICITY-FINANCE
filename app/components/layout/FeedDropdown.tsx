"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, Check, ChevronDown } from "lucide-react";

type FeedMode = "full" | "followed" | "custom";

const LABELS: Record<FeedMode, string> = {
  full: "Full Feed",
  followed: "Followed Only",
  custom: "Customised",
};

const DESCS: Record<FeedMode, string> = {
  full: "All episodes, newest first",
  followed: "Only from shows you follow",
  custom: "Filter by category",
};

const MODES: FeedMode[] = ["full", "followed", "custom"];
const KEY = "simplicity-feed-mode";
const CAT_KEY = "simplicity-feed-category";
const CATEGORIES = ["markets", "macro", "technology", "geopolitics", "business"];

export function FeedDropdown() {
  const [mode, setMode] = useState<FeedMode>("full");
  const [category, setCategory] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "full" || v === "followed" || v === "custom") setMode(v);
      const c = localStorage.getItem(CAT_KEY);
      if (c && CATEGORIES.includes(c)) setCategory(c);
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const pick = (m: FeedMode) => {
    setMode(m);
    setOpen(false);
    try { localStorage.setItem(KEY, m); } catch { /* noop */ }
    window.dispatchEvent(new CustomEvent("feed-mode-change", { detail: m }));
    console.log(`[FeedDropdown] Switched to: ${m}`);
  };

  const pickCategory = (cat: string) => {
    const next = cat === category ? null : cat;
    setCategory(next);
    try {
      if (next) localStorage.setItem(CAT_KEY, next);
      else localStorage.removeItem(CAT_KEY);
    } catch { /* noop */ }
    window.dispatchEvent(new CustomEvent("feed-category-change", { detail: next }));
    console.log(`[FeedDropdown] Category: ${next || "none"}`);
  };

  return (
    <div className="flex items-center gap-2">
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors shadow-sm"
        >
          <Filter size={18} />
          <span>{LABELS[mode]}</span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            {MODES.map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => pick(m)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${active ? "bg-gray-50" : ""}`}
                >
                  <div className="w-4 flex-shrink-0">
                    {active && <Check size={16} className="text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${active ? "text-blue-600" : "text-foreground"}`}>
                      {LABELS[m]}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{DESCS[m]}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Category pills — visible when "Customised" is active */}
      {mode === "custom" && (
        <div className="flex items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => pickCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
