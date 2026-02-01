import { Bookmark, Share2, Download, FileText, Mic, User, Calendar } from "lucide-react";
import { IconButton } from "../ui/IconButton.js";
import { Chip } from "../ui/Chip.js";

interface FeedEpisodeCardProps {
  title: string;
  show: string;
  host?: string;
  date: string;
  summary: string;
  thumbnail?: string;
  topics: string[];
  videoId: string;
  episodeId: string;
}

export function FeedEpisodeCard({
  title,
  show,
  host,
  date,
  summary,
  thumbnail,
  topics,
  videoId,
  episodeId,
}: FeedEpisodeCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header: Title + Actions */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <FileText size={18} className="text-foreground/70 flex-shrink-0 mt-0.5" />
          <h3 className="text-base font-semibold text-foreground leading-tight">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <IconButton>
            <Bookmark size={16} className="text-foreground/60" />
          </IconButton>
          <IconButton>
            <Share2 size={16} className="text-foreground/60" />
          </IconButton>
          <IconButton>
            <Download size={16} className="text-foreground/60" />
          </IconButton>
        </div>
      </div>

      {/* Metadata Row */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Mic size={12} className="flex-shrink-0" />
          <span>{show}</span>
        </div>
        {host && (
          <div className="flex items-center gap-1.5">
            <User size={12} className="flex-shrink-0" />
            <span>{host}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="flex-shrink-0" />
          <span>{date}</span>
        </div>
      </div>

      {/* Summary Text */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {summary}
      </p>

      {/* Thumbnail */}
      {thumbnail && (
        <div className="mb-4 rounded-xl overflow-hidden aspect-video">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Topics/Tags Row */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, idx) => (
            <Chip key={idx}>{topic}</Chip>
          ))}
        </div>
      )}
    </div>
  );
}
