import { Bookmark, Share2, Download, FileText, Mic, User, Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { IconButton } from "../ui/IconButton.js";
import { Chip } from "../ui/Chip.js";

interface FeedEpisodeCardProps {
  title: string;
  show: string;
  host?: string;
  date: string;
  summary: string;
  thumbnail?: string | undefined;
  topics: string[];
  videoId: string;
  episodeId: string;
  qcStatus?: string | null;
  qcScore?: number | null;
  approvalStatus?: string;
  quoteCount?: number;
  onClick?: () => void;
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
  qcStatus,
  qcScore,
  approvalStatus,
  quoteCount,
  onClick,
}: FeedEpisodeCardProps) {
  // Determine badge display
  const showQCBadge = qcStatus && qcStatus !== 'pass';
  const showPendingBadge = approvalStatus === 'pending';
  return (
    <div 
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Header: Title + Actions */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <FileText size={18} className="text-foreground/70 flex-shrink-0 mt-0.5" />
          <h3 className="text-base font-semibold text-foreground leading-tight">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
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
        
        {/* Status Badges */}
        {showQCBadge && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800">
            <AlertTriangle size={10} />
            <span className="text-xs font-medium">
              QC: {qcStatus} {qcScore !== null && `(${qcScore}/100)`}
            </span>
          </div>
        )}
        {showPendingBadge && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
            <span className="text-xs font-medium">Pending Review</span>
          </div>
        )}
        {approvalStatus === 'approved' && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
            <CheckCircle size={10} />
            <span className="text-xs font-medium">Approved</span>
          </div>
        )}
        {approvalStatus === 'rejected' && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
            <XCircle size={10} />
            <span className="text-xs font-medium">Rejected</span>
          </div>
        )}
      </div>

      {/* Summary Text */}
      <div className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
        {summary}
      </div>

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
      <div className="flex flex-wrap gap-2 items-center">
        {topics.map((topic, idx) => (
          <Chip key={idx}>{topic}</Chip>
        ))}
        {quoteCount !== undefined && quoteCount > 0 && (
          <span className="text-xs text-muted-foreground ml-2">
            📝 {quoteCount} key {quoteCount === 1 ? 'quote' : 'quotes'}
          </span>
        )}
      </div>
    </div>
  );
}
