import { Bookmark, Share2, Download, FileText, Mic, User, Calendar } from "lucide-react";

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
    <div className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200">
      {/* Header: Title + Actions */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <FileText size={18} className="text-foreground/70 flex-shrink-0 mt-0.5" />
          <h3 className="text-base font-semibold text-foreground leading-snug">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
            <Bookmark size={16} className="text-foreground/60" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
            <Share2 size={16} className="text-foreground/60" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
            <Download size={16} className="text-foreground/60" />
          </button>
        </div>
      </div>

      {/* Metadata Row */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Mic size={14} className="flex-shrink-0" />
          <span>{show}</span>
        </div>
        {host && (
          <div className="flex items-center gap-1.5">
            <User size={14} className="flex-shrink-0" />
            <span>{host}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="flex-shrink-0" />
          <span>{date}</span>
        </div>
      </div>

      {/* Summary Text */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {summary}
      </p>

      {/* Thumbnail */}
      {thumbnail && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Topics/Tags Row */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-muted text-foreground/70 text-xs rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
