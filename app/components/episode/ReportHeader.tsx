"use client";

import { Bookmark, Share2, Download, Mic, User, Calendar } from "lucide-react";

interface ReportHeaderProps {
  title: string;
  showName: string;
  peopleLine: string;
  publishedAt: string;
  intro: string;
  tags: string[];
  heroImageUrl?: string;
}

export function ReportHeader({
  title,
  showName,
  peopleLine,
  publishedAt,
  intro,
  tags,
  heroImageUrl,
}: ReportHeaderProps) {
  const handleAction = (action: string) => {
    alert(`${action} - Coming soon!`);
  };

  return (
    <div className="space-y-4">
      {/* Title and Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <span className="text-sm mt-0.5 flex-shrink-0">📄</span>
          <h1 className="text-base font-bold text-gray-900 leading-tight break-words">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleAction("Bookmark")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Bookmark"
          >
            <Bookmark size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleAction("Share")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Share"
          >
            <Share2 size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleAction("Download")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Download"
          >
            <Download size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
        <div className="flex items-center gap-2">
          <Mic size={16} />
          <span>{showName}</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{peopleLine}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{publishedAt}</span>
        </div>
      </div>

      {/* Intro Paragraph */}
      <p className="text-[11px] text-gray-700 leading-snug">
        {intro}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200" />
    </div>
  );
}
