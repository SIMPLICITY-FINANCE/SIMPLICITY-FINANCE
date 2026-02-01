import { X, FileText, Bookmark, TrendingUp, Calendar, Bell, Share2, Download, Mic, User } from 'lucide-react';
import { useState } from 'react';
import { copy } from '../src/copy/en';

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

interface NotificationsListProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
  onChatClick?: () => void;
  isLoggedIn?: boolean;
  userImage?: string;
  userName?: string;
  onSignIn?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onSignOut?: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: 'report-1',
    type: 'report',
    reportType: 'daily',
    podcastTitle: 'Daily Market Pulse',
    podcastImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    episodeTitle: 'Inflation Worsening',
    duration: 'Report',
    timeAgo: '1h ago',
    publishedAt: 'January 17, 2026',
    dateRange: 'January 17, 2026',
    episodeCount: 3,
    isUnread: true
  },
  {
    id: 'report-2',
    type: 'report',
    reportType: 'weekly',
    podcastTitle: 'Weekly Summary',
    podcastImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    episodeTitle: 'Fed Meeting Tomorrow: Rate Decision Expected',
    duration: 'Report',
    timeAgo: '3h ago',
    publishedAt: 'January 13 - January 17, 2026',
    dateRange: 'January 13 - Janua...',
    episodeCount: 12,
    isUnread: true
  },
  {
    id: '1',
    type: 'episode',
    podcastTitle: 'The Compound and Friends',
    podcastImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    episodeTitle: 'Market Outlook for...',
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
    episodeTitle: 'Why Prices Are Still...',
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
    episodeTitle: 'AI Regulation:...',
    duration: '1:15:30',
    timeAgo: '1d ago',
    publishedAt: '2026-01-15',
    host: 'Chamath Palin...',
    isUnread: false
  },
  {
    id: '4',
    type: 'episode',
    podcastTitle: 'Odd Lots',
    podcastImage: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    episodeTitle: 'Understanding...',
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
    episodeTitle: 'Investor Psycholog...',
    duration: '42:10',
    timeAgo: '3d ago',
    publishedAt: '2026-01-13',
    host: 'Ben Carlson',
    isUnread: false
  }
];

export function NotificationsList({ isPremium, onUpgrade, onChatClick, isLoggedIn, userImage, userName, onSignIn, onProfileClick, onSettingsClick, onHelpClick, onSignOut }: NotificationsListProps) {
  const [filter, setFilter] = useState<'all' | 'summary' | 'report'>('all');
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);
  const unreadCount = mockNotifications.filter(n => n.isUnread).length;

  const reportTypeColors: Record<string, string> = {
    daily: 'from-blue-600/90 to-blue-700/90',
    weekly: 'from-indigo-600/90 to-indigo-700/90',
    monthly: 'from-purple-600/90 to-purple-700/90',
    quarterly: 'from-violet-600/90 to-violet-700/90',
    annual: 'from-pink-600/90 to-pink-700/90',
  };

  // Filter notifications based on selected filter
  const filteredNotifications = mockNotifications
    .filter(notification => !dismissedNotifications.includes(notification.id))
    .filter(notification => {
      if (filter === 'summary') return notification.type === 'episode';
      if (filter === 'report') return notification.type === 'report';
      return true;
    });

  const handleDismiss = (id: string) => {
    setDismissedNotifications(prev => [...prev, id]);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Filter Bar - Rounded Pill Style */}
      <div className="bg-secondary rounded-full p-1 flex gap-1 mb-4 w-full">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            filter === 'all'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('summary')}
          className={`flex-1 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            filter === 'summary'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setFilter('report')}
          className={`flex-1 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            filter === 'report'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Report
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            // Report Card
            if (notification.type === 'report' && notification.reportType) {
              return (
                <div
                  key={notification.id}
                  className="bg-card border border-border/40 rounded-xl p-2.5 transition-all cursor-pointer hover:shadow-md hover:bg-accent/30 hover:border-border group"
                >
                  {/* Line 1: Icon + Title + Red Dot, then Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <FileText className="w-3 h-3 text-foreground flex-shrink-0" />
                      <h3 className="text-[11px] font-medium text-foreground whitespace-nowrap">
                        {notification.reportType.charAt(0).toUpperCase() + notification.reportType.slice(1)} Report
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
                        <Bookmark className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all"
                        title="Share"
                      >
                        <Share2 className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all"
                        title="Download"
                      >
                        <Download className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-border/30 my-2" />

                  {/* Line 2: Metadata on left, Date on right */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{notification.reportType?.charAt(0).toUpperCase()}{notification.reportType?.slice(1)} Report</span>
                      </div>
                      <div className="h-3 w-px bg-border/40" />
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{notification.episodeCount} summaries</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span className="whitespace-nowrap">
                        {(() => {
                          const dateStr = notification.dateRange || notification.publishedAt;
                          if (dateStr.includes(' - ')) {
                            const [start, end] = dateStr.split(' - ');
                            const startDate = new Date(start);
                            const endDate = new Date(end);
                            const startFormatted = `${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}-${startDate.getFullYear()}`;
                            const endFormatted = `${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}-${endDate.getFullYear()}`;
                            return `${startFormatted} - ${endFormatted}`;
                          }
                          const date = new Date(dateStr);
                          return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            // Episode Card
            return (
              <div
                key={notification.id}
                className="bg-card border border-border/40 rounded-xl p-2.5 transition-all cursor-pointer hover:shadow-md hover:bg-accent/30 hover:border-border group"
              >
                {/* Line 1: Icon + Title + Red Dot, then Action Buttons */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <FileText className="w-3 h-3 text-foreground flex-shrink-0" />
                    <h3 className="text-[11px] font-medium text-foreground line-clamp-1 flex-1">
                      {notification.episodeTitle}
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
                      <Bookmark className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-lg hover:bg-muted transition-all"
                      title="Share"
                    >
                      <Share2 className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-lg hover:bg-muted transition-all"
                      title="Download"
                    >
                      <Download className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Separator */}
                <div className="border-t border-border/30 my-2" />

                {/* Line 2: Metadata on left, Date on right */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Mic className="w-3 h-3" />
                      <span className="truncate">{notification.podcastTitle}</span>
                    </div>
                    <div className="h-3 w-px bg-border/40" />
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{notification.host}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="whitespace-nowrap">
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
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-1.5 text-foreground">No notifications yet</h3>
          <p className="text-[11px] text-muted-foreground">
            You'll see notifications here when podcasts you follow release new episodes
          </p>
        </div>
      )}

      {/* Page Footer Info */}
      <div className="bg-muted/50 border border-border/50 rounded-xl p-3 mt-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-2 items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT NOTIFICATIONS</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
              Stay updated with new daily and weekly reports automatically generated from your podcast library. Report alerts appear at the top with colored badges (blue for daily, purple for weekly), while regular podcast episodes from shows you follow appear below.
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">How to use:</span> New reports are highlighted at the top in colored alert boxes. Click any alert to view the full report. Follow podcasts from the Discover page to receive episode notifications. The notification badge shows how many new reports are ready to read.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}