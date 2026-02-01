import { User, Mail, Calendar, BookOpen, Bookmark, TrendingUp, Award, Edit2, FileText, Eye, Clock } from 'lucide-react';
import { useState } from 'react';

interface ProfilePageProps {
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

export function ProfilePage({ isPremium, onUpgrade, onChatClick, isLoggedIn, userImage, userName, onSignIn, onProfileClick, onSettingsClick, onHelpClick, onSignOut }: ProfilePageProps) {
  
  // Mock user data
  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    joinDate: 'January 2024',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Financial analyst and podcast enthusiast. I love reading podcast summaries to stay informed on investing, economics, and personal finance.'
  };

  // Mock stats
  const stats = {
    summariesRead: 47,
    readingTimeMinutes: 892,
    podcastsFollowed: 10,
    episodesSaved: 28,
    streakDays: 12
  };

  // Mock recent reading history
  const recentEpisodes = [
    {
      id: '1',
      title: 'Understanding Market Volatility in 2024',
      podcastTitle: 'The Investor\'s Podcast',
      readingTime: '8 min read',
      progress: 75
    },
    {
      id: '2',
      title: 'Building Wealth Through Index Funds',
      podcastTitle: 'Planet Money',
      readingTime: '6 min read',
      progress: 100
    },
    {
      id: '3',
      title: 'Real Estate Investment Strategies',
      podcastTitle: 'Money For the Rest of Us',
      readingTime: '10 min read',
      progress: 45
    },
    {
      id: '4',
      title: 'The Psychology of Spending',
      podcastTitle: 'Financial Independence Podcast',
      readingTime: '12 min read',
      progress: 30
    },
    {
      id: '5',
      title: 'Crypto Market Analysis',
      podcastTitle: 'The Indicator',
      readingTime: '5 min read',
      progress: 90
    }
  ];

  // Mock following shows
  const followingShows = [
    {
      id: '1',
      name: 'The Investor\'s Podcast',
      avatar: 'https://images.unsplash.com/photo-1517048676732-d65d257591e2?w=400&h=400&fit=crop',
      newEpisodes: 3
    },
    {
      id: '2',
      name: 'Planet Money',
      avatar: 'https://images.unsplash.com/photo-1517048676732-d65d257591e2?w=400&h=400&fit=crop',
      newEpisodes: 2
    },
    {
      id: '3',
      name: 'Money For the Rest of Us',
      avatar: 'https://images.unsplash.com/photo-1517048676732-d65d257591e2?w=400&h=400&fit=crop',
      newEpisodes: 1
    },
    {
      id: '4',
      name: 'Financial Independence Podcast',
      avatar: 'https://images.unsplash.com/photo-1517048676732-d65d257591e2?w=400&h=400&fit=crop',
      newEpisodes: 4
    },
    {
      id: '5',
      name: 'The Indicator',
      avatar: 'https://images.unsplash.com/photo-1517048676732-d65d257591e2?w=400&h=400&fit=crop',
      newEpisodes: 5
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Profile Card */}
      <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-lg object-cover ring-2 ring-border"
            />
            <button className="absolute -bottom-1 -right-1 p-1 bg-foreground text-background rounded-md hover:opacity-80 transition-opacity">
              <Edit2 className="w-3 h-3" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-semibold text-foreground">{user.name}</h2>
              <span className="px-1.5 py-0.5 bg-muted border border-border text-foreground text-[10px] font-medium rounded">
                PREMIUM
              </span>
            </div>
            
            <div className="space-y-0.5 mb-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="w-3 h-3" />
                <span className="text-[11px]">{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span className="text-[11px]">Joined {user.joinDate}</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
              {user.bio}
            </p>

            <button className="px-3 py-1.5 bg-background border border-border rounded-lg hover:bg-muted/50 transition-colors font-medium text-[11px] text-foreground">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Separator before YOUR STATISTICS */}
      <div className="border-t border-border/30 my-7" />

      {/* Stats Grid */}
      <div className="mb-0">
        <h3 className="text-xs font-semibold mb-2 text-foreground uppercase tracking-wide">YOUR STATISTICS</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card border border-border rounded-xl p-2.5 hover:bg-muted/30 transition-all">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-1 bg-muted rounded">
                <FileText className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{stats.summariesRead}</div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">Summaries Read</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-2.5 hover:bg-muted/30 transition-all">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-1 bg-muted rounded">
                <Clock className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{stats.readingTimeMinutes}</div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">Minutes Reading</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-2.5 hover:bg-muted/30 transition-all">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-1 bg-muted rounded">
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{stats.podcastsFollowed}</div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">Podcasts Following</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-2.5 hover:bg-muted/30 transition-all">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-1 bg-muted rounded">
                <Bookmark className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{stats.episodesSaved}</div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">Summaries Saved</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-2.5 hover:bg-muted/30 transition-all">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-1 bg-muted rounded">
                <Award className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{stats.streakDays}</div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Separator before FOLLOWING */}
      <div className="border-t border-border/30 my-7" />

      {/* Following Shows */}
      <div className="mb-0">
        <h3 className="text-xs font-semibold mb-2 text-foreground uppercase tracking-wide">FOLLOWING</h3>
        <div className="grid grid-cols-2 gap-2">
          {followingShows.map((show) => (
            <button
              key={show.id}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-muted/50 transition-all text-left group border border-border hover:border-border bg-card"
            >
              {/* Avatar */}
              <img 
                src={show.avatar} 
                alt={show.name} 
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0" 
              />
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[11px] line-clamp-1 group-hover:text-foreground transition-colors mb-0.5 text-foreground">
                  {show.name}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  {show.newEpisodes} new episodes
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Separator before RECENT READING HISTORY */}
      <div className="border-t border-border/30 my-7" />

      {/* Recent Reading History */}
      <div className="mb-0">
        <h3 className="text-xs font-semibold mb-2 text-foreground uppercase tracking-wide">RECENT READING HISTORY</h3>
        <div className="space-y-1.5">
          {recentEpisodes.map((episode) => (
            <button
              key={episode.id}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-all text-left group border border-transparent hover:border-border"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[11px] line-clamp-1 group-hover:text-foreground transition-colors mb-0.5 text-foreground">
                  {episode.title}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  {episode.podcastTitle}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex-shrink-0 w-20">
                <div className="text-[10px] text-muted-foreground mb-0.5 text-right">
                  {episode.progress}%
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-muted-foreground rounded-full"
                    style={{ width: `${episode.progress}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Separator before ABOUT PROFILE */}
      <div className="border-t border-border/30 my-7" />

      {/* Page Footer Info */}
      <div className="bg-muted/50 border border-border/50 rounded-xl p-3 mb-0 shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-2 items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT PROFILE</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
              Your personal dashboard showing your reading statistics, activity streak, and recent episode history. Track your progress and see how much you've learned from financial podcast summaries.
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">How to use:</span> View your reading stats and achievements in the statistics grid. Browse your recent reading history to continue where you left off. Click Edit Profile to update your bio and preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}