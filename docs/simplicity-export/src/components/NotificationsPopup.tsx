import { Settings, MoreVertical, X, Download, Bookmark, Share2, Clock, Bell, TrendingUp, ChevronRight, FileText, Newspaper, Mic, User, Calendar } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Notification {
  id: string;
  type?: 'episode' | 'report';
  reportType?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  podcastTitle: string;
  podcastImage: string;
  episodeTitle: string;
  duration: string;
  timeAgo: string;
  publishedAt: string;
  host?: string;
  episodeCount?: number;
  dateRange?: string;
  isUnread: boolean;
}

interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  anchorRef: React.RefObject<HTMLElement>;
}

const mockNotifications: Notification[] = [
  {
    id: 'report-1',
    type: 'report',
    reportType: 'daily',
    podcastTitle: 'Daily Report',
    podcastImage: 'https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBjaGFydCUyMGRhdGF8ZW58MXx8fHwxNzY4NjU4ODY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    episodeTitle: 'Daily Report',
    duration: 'Report',
    timeAgo: '1h ago',
    publishedAt: '2026-01-17',
    dateRange: 'January 17, 2026',
    episodeCount: 3,
    isUnread: true
  },
  {
    id: 'report-2',
    type: 'report',
    reportType: 'weekly',
    podcastTitle: 'Weekly Report',
    podcastImage: 'https://images.unsplash.com/photo-1738996747326-65b5d7d7fe9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGdyYXBofGVufDF8fHx8MTc2ODY1ODg2NHww&ixlib=rb-4.1.0&q=80&w=1080',
    episodeTitle: 'Weekly Report',
    duration: 'Report',
    timeAgo: '3h ago',
    publishedAt: '2026-01-16',
    dateRange: 'January 13 - January 17, 2026',
    episodeCount: 12,
    isUnread: true
  },
  {
    id: '1',
    type: 'episode',
    podcastTitle: 'The Compound and Friends',
    podcastImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    episodeTitle: 'Market Outlook for Q1 2026',
    duration: '45:20',
    timeAgo: '2h ago',
    publishedAt: '2026-01-17',
    host: 'Michael Batnick',
    isUnread: true
  },
  {
    id: '2',
    type: 'episode',
    podcastTitle: 'Planet Money',
    podcastImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    episodeTitle: 'Why Prices Are Still Rising',
    duration: '28:15',
    timeAgo: '5h ago',
    publishedAt: '2026-01-16',
    host: 'Sarah Gonzalez',
    isUnread: true
  },
  {
    id: '3',
    type: 'episode',
    podcastTitle: 'All-In Podcast',
    podcastImage: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop',
    episodeTitle: 'AI Regulation: What\'s Next?',
    duration: '1:15:30',
    timeAgo: '1d ago',
    publishedAt: '2026-01-15',
    host: 'Chamath Palihapitiya',
    isUnread: false
  },
  {
    id: '4',
    type: 'episode',
    podcastTitle: 'Odd Lots',
    podcastImage: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    episodeTitle: 'Understanding Treasury Yields',
    duration: '38:45',
    timeAgo: '2d ago',
    publishedAt: '2026-01-14',
    host: 'Tracy Alloway',
    isUnread: false
  },
  {
    id: '5',
    type: 'episode',
    podcastTitle: 'Animal Spirits',
    podcastImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    episodeTitle: 'Investor Psychology in 2026',
    duration: '42:10',
    timeAgo: '3d ago',
    publishedAt: '2026-01-13',
    host: 'Ben Carlson',
    isUnread: false
  }
];

const periodLabels = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
};

export function NotificationsPopup({ isOpen, onClose, anchorRef }: NotificationsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  // Calculate position based on anchor element
  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;

    const updatePosition = () => {
      // Match chat menu positioning
      setPosition({
        top: 110, // Matches chat menu top position
        right: 32, // Matches chat menu right position
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, anchorRef]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  // Filter notifications based on selected filter
  const filteredNotifications = mockNotifications
    .filter(notification => !dismissedNotifications.includes(notification.id));

  const handleDismiss = (id: string) => {
    setDismissedNotifications(prev => [...prev, id]);
  };

  return (
    createPortal(
      <div
        ref={popupRef}
        className="fixed w-[336px] h-[calc(100vh-241px)] bg-background rounded-xl shadow-sm border border-border overflow-hidden z-50 flex flex-col"
        style={{ top: position.top, right: position.right }}
      >
        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 pb-5 pt-5">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-2">
              {filteredNotifications.map((notification, index) => {
                // Report Style - Matches Reports section design
                if (notification.type === 'report' && notification.reportType) {
                  const periodLabel = periodLabels[notification.reportType] || 'Daily';
                  
                  return (
                    <div key={notification.id}>
                      <div
                        className={`relative group rounded-2xl p-2.5 transition-all cursor-pointer overflow-hidden border border-border/40 hover:shadow-md hover:border-border ${
                          notification.isUnread 
                            ? 'bg-muted/60 hover:bg-muted/80' 
                            : 'bg-card hover:bg-accent/30'
                        }`}
                      >
                        {/* Line 1: Icon + Title + Red Dot, then Action Buttons */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <Newspaper className="w-3 h-3 text-foreground flex-shrink-0" />
                            <h3 className="text-[10px] font-semibold text-foreground whitespace-nowrap">
                              {periodLabel} Report
                            </h3>
                            {notification.isUnread && (
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-lg hover:bg-muted transition-all"
                              title="Save"
                            >
                              <Bookmark className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-lg hover:bg-muted transition-all"
                              title="Share"
                            >
                              <Share2 className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-lg hover:bg-muted transition-all"
                              title="Download"
                            >
                              <Download className="w-3 h-3 text-muted-foreground transition-colors" />
                            </button>
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-border/30 my-2" />

                        {/* Line 2: Metadata with evenly distributed separators */}
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                          {/* Report Type */}
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-2.5 h-2.5 flex-shrink-0" />
                            <span className="truncate">{periodLabel} Report</span>
                          </div>

                          {/* Vertical Separator */}
                          <div className="h-2.5 w-px bg-border/40 flex-shrink-0" />

                          {/* Episode Count */}
                          <div className="flex items-center gap-1">
                            <FileText className="w-2.5 h-2.5 flex-shrink-0" />
                            <span className="truncate">{notification.episodeCount} summaries</span>
                          </div>

                          {/* Vertical Separator */}
                          <div className="h-2.5 w-px bg-border/40 flex-shrink-0" />

                          {/* Date */}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                            <span className="truncate">
                              {(() => {
                                const date = new Date(notification.publishedAt);
                                return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Regular Episode Notification Style - Matches Saved section design
                return (
                  <div key={notification.id}>
                    <div
                      className={`relative group rounded-2xl p-2.5 transition-all cursor-pointer overflow-hidden border border-border/40 hover:shadow-md hover:border-border ${
                        notification.isUnread 
                          ? 'bg-muted/60 hover:bg-muted/80' 
                          : 'bg-card hover:bg-accent/30'
                      }`}
                    >
                      {/* Line 1: Icon + Title + Red Dot, then Action Buttons */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <FileText className="w-3 h-3 text-foreground flex-shrink-0" />
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="text-[10px] font-semibold text-foreground line-clamp-1">
                              {notification.episodeTitle}
                            </h3>
                            {notification.isUnread && (
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg hover:bg-muted transition-all"
                            title="Save"
                          >
                            <Bookmark className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg hover:bg-muted transition-all"
                            title="Share"
                          >
                            <Share2 className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg hover:bg-muted transition-all"
                            title="Download"
                          >
                            <Download className="w-3 h-3 text-muted-foreground transition-colors" />
                          </button>
                        </div>
                      </div>

                      {/* Separator */}
                      <div className="border-t border-border/30 my-2" />

                      {/* Line 2: Metadata on left, Date on right */}
                      <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                        {/* Podcast */}
                        <div className="flex items-center gap-1">
                          <Mic className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">{notification.podcastTitle}</span>
                        </div>

                        {/* Vertical Separator */}
                        <div className="h-2.5 w-px bg-border/40 flex-shrink-0" />

                        {/* Host */}
                        <div className="flex items-center gap-1">
                          <User className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">{notification.host}</span>
                        </div>

                        {/* Vertical Separator */}
                        <div className="h-2.5 w-px bg-border/40 flex-shrink-0" />

                        {/* Date */}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">
                            {(() => {
                              const date = new Date(notification.publishedAt);
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              const year = date.getFullYear();
                              return `${month}-${day}-${year}`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                <Bell className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-1.5 text-foreground">No notifications yet</h3>
              <p className="text-xs text-muted-foreground">
                You'll see notifications here when podcasts you follow release new episodes
              </p>
            </div>
          )}
        </div>
      </div>,
      document.body
    )
  );
}