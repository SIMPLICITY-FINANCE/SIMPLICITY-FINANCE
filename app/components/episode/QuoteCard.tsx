"use client";

import { useState } from "react";

interface QuoteCardProps {
  id: string;
  text: string;
  speaker: string;
}

export function QuoteCard({ id, text, speaker }: QuoteCardProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex gap-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded border-gray-300"
        id={`quote-${id}`}
      />
      <div className="flex-1">
        <p className="text-xs text-gray-900 leading-snug mb-1">
          "{text}"
        </p>
        <p className="text-xs text-gray-600">
          — {speaker}
        </p>
      </div>
    </div>
  );
}
