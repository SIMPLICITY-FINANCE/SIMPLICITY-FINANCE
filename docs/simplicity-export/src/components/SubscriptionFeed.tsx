import { episodes, podcasts } from '../data/podcasts';
import { Bookmark, Share2, Download, Crown, Sparkles, ExternalLink, Zap, Mic, User, Calendar, FileText, TrendingUp, Globe, Cpu } from 'lucide-react';
import React, { useState } from 'react';
import type { Episode, Podcast } from '../src/types';

type EpisodeWithPodcast = Episode & { podcast: Podcast };

interface SubscriptionFeedProps {
  searchQuery?: string;
  viewMode?: 'full-feed' | 'following-feed';
  onEpisodeClick?: (podcastId: string, episodeId: string) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
  episodes?: EpisodeWithPodcast[];
  followedShows?: Set<string>;
}

// Mock thumbnail images for episodes
const episodeThumbnails: { [key: string]: string } = {
  'e1': 'https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  'e2': 'https://images.unsplash.com/photo-1758518726609-c551f858cd5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  'e3': 'https://images.unsplash.com/photo-1709846485906-30b28e7ed651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  'e4': 'https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  'e5': 'https://images.unsplash.com/photo-1758518726609-c551f858cd5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  'e6': 'https://images.unsplash.com/photo-1709846485906-30b28e7ed651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  'e7': 'https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  'e8': 'https://images.unsplash.com/photo-1758518726609-c551f858cd5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  'e9': 'https://images.unsplash.com/photo-1709846485906-30b28e7ed651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
};

export function SubscriptionFeed({ searchQuery = '', viewMode = 'full-feed', onEpisodeClick, isPremium, onUpgrade, episodes: episodesProp, followedShows = new Set() }: SubscriptionFeedProps) {
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  // Emoji mapping for tags
  const tagEmojis: { [key: string]: string } = {
    'Crypto': '₿',
    'Equities': '📈',
    'Currencies': '💱',
    'Bonds': '📜',
    'Metals': '🥇',
    'Energy': '⚡',
    'Real-Estate': '🏠'
  };

  // Use prop if provided, otherwise combine from imports
  const episodesWithPodcasts = episodesProp || episodes.map(episode => {
    const podcast = podcasts.find(p => p.id === episode.podcastId);
    return podcast ? { ...episode, podcast } : null;
  }).filter(Boolean);

  // Filter episodes based on search query
  const filteredEpisodes = episodesWithPodcasts.filter(episode => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      episode.title.toLowerCase().includes(query) ||
      episode.summary.toLowerCase().includes(query) ||
      episode.podcast.title.toLowerCase().includes(query) ||
      episode.topics.some(topic => topic.toLowerCase().includes(query))
    );
  });

  // Further filter based on view mode
  const displayedEpisodes = viewMode === 'following-feed' 
    ? filteredEpisodes.filter(episode => followedShows.has(episode.podcast.id))
    : filteredEpisodes;

  const toggleSave = (episodeId: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

  if (episodesWithPodcasts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="mb-4">Your feed is empty</h2>
        <p className="text-muted-foreground mb-6">
          Subscribe to podcasts to see their latest episode summaries here.
        </p>
      </div>
    );
  }

  if (displayedEpisodes.length === 0 && viewMode === 'following-feed') {
    return (
      <div className="text-center py-16">
        <h2 className="mb-4">No followed feed yet</h2>
        <p className="text-muted-foreground">
          Follow some podcasts to see their episodes here
        </p>
      </div>
    );
  }

  if (displayedEpisodes.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="mb-4">No results found</h2>
        <p className="text-muted-foreground">
          Try adjusting your search terms
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {displayedEpisodes.map((episode, index) => {
        const isSaved = savedPosts.has(episode.id);
        const thumbnail = episodeThumbnails[episode.id] || episodeThumbnails['e1'];
        
        // Format the date in full format: "Monday, 9th of January, 2026"
        const formatFullDate = (dateString: string) => {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return dateString;
          
          const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
          const day = date.getDate();
          const month = date.toLocaleDateString('en-US', { month: 'long' });
          const year = date.getFullYear();
          
          // Add ordinal suffix (st, nd, rd, th)
          const getOrdinal = (n: number) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
          };
          
          return `${weekday}, ${getOrdinal(day)} of ${month}, ${year}`;
        };

        // Mock guest data - in real app, this would come from episode data
        const mockGuests: { [key: string]: string } = {
          'e1': 'Barry Ritholtz',
          'e2': 'Michael Batnick',
          'e3': 'Ben Carlson',
          'e4': 'Sarah Gonzalez',
          'e5': 'Marc Andreessen',
          'e6': 'Jason Calacanis',
        };

        const guest = mockGuests[episode.id] || 'Special Guest';

        // Get category from episode data or fall back to finance
        const category = episode.category || 'finance';
        
        // Category icon mapping
        const getCategoryIcon = () => {
          switch (category) {
            case 'geo-politics':
              return Globe;
            case 'finance':
              return TrendingUp;
            case 'technology':
              return Cpu;
            default:
              return TrendingUp;
          }
        };

        const CategoryIcon = getCategoryIcon();

        // Determine which ad to show (cycles through different ad types)
        const adType = Math.floor(index / 2) % 4;
        const shouldShowAd = !isPremium && (index + 1) % 2 === 0 && index < displayedEpisodes.length - 1;

        return (
          <div key={episode.id}>
            <article 
              className="rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200 cursor-pointer"
              onClick={() => onEpisodeClick?.(episode.podcast.id, episode.id)}
            >
              {/* Main Content - Vertical Stack */}
              <div className="p-4 md:p-5">
                {/* Title Row */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/30">
                  {/* Title with Summary Icon */}
                  <FileText className="w-[13px] h-[13px] text-foreground flex-shrink-0" />
                  <h3 
                    className="flex-1 text-xs font-semibold cursor-pointer hover:text-indigo-500 transition-colors text-foreground line-clamp-2"
                  >
                    {episode.title}
                  </h3>
                  
                  {/* Action Buttons - Top Right (Desktop Only) */}
                  <div className="hidden md:flex items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(episode.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-muted transition-all"
                      title="Save"
                      aria-label={isSaved ? 'Unsave' : 'Save'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 transition-colors ${isSaved ? 'fill-current text-foreground' : 'text-muted-foreground hover:text-foreground'}`} />
                    </button>

                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg hover:bg-muted transition-all"
                      title="Share"
                      aria-label="Share"
                    >
                      <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>

                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg hover:bg-muted transition-all"
                      title="Download"
                      aria-label="Download"
                    >
                      <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Participants & Date */}
                <div className="mb-3 pb-3 border-b border-border/30">
                  {/* Single Row: Show | Guest | Date */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    {/* Podcast Show */}
                    <div className="flex items-center gap-1.5">
                      <Mic className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{episode.podcast.title}</span>
                    </div>

                    {/* Vertical Separator */}
                    <div className="h-3 w-px bg-border/40 flex-shrink-0" />

                    {/* Guest */}
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{guest}</span>
                    </div>

                    {/* Vertical Separator */}
                    <div className="h-3 w-px bg-border/40 flex-shrink-0" />

                    {/* Date */}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{formatFullDate(episode.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Exec Summary */}
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 pb-3 border-b border-border/30">
                  {episode.summary}
                </p>

                {/* Episode Thumbnail */}
                <div 
                  className="relative rounded-lg overflow-hidden bg-gradient-to-br from-muted/50 to-muted aspect-video cursor-pointer group mb-3"
                >
                  <img
                    src={thumbnail}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                    <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-2xl">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Tags - AI-assigned keywords */}
                {episode.tags && episode.tags.length > 0 && (
                  <>
                    {/* Separator between thumbnail and tags */}
                    <div className="border-t border-border/30 mb-3" />
                    
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      {episode.tags.map((tag, tagIndex) => (
                        <React.Fragment key={tagIndex}>
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted border border-border/40 text-[10px] font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {tag}
                          </span>
                          {tagIndex < episode.tags.length - 1 && (
                            <div className="h-3 w-px bg-border/40 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                )}

                {/* Separator */}
                <div className="border-t border-border/30 mb-3 md:hidden" />

                {/* Action Buttons - At Bottom with Separators (Mobile Only) */}
                <div className="flex items-center justify-center gap-1 md:hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(episode.id);
                    }}
                    className="p-2 rounded-lg hover:bg-muted transition-all"
                    title="Save"
                    aria-label={isSaved ? 'Unsave' : 'Save'}
                  >
                    <Bookmark className={`w-4 h-4 transition-colors ${isSaved ? 'fill-current text-foreground' : 'text-muted-foreground hover:text-foreground'}`} />
                  </button>

                  {/* Vertical Separator */}
                  <div className="h-4 w-px bg-border/40" />

                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-muted transition-all"
                    title="Share"
                    aria-label="Share"
                  >
                    <Share2 className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>

                  {/* Vertical Separator */}
                  <div className="h-4 w-px bg-border/40" />

                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-muted transition-all"
                    title="Download"
                    aria-label="Download"
                  >
                    <Download className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </div>
              </div>
            </article>

            {/* Separator Line - Only show if not the last item and not showing an ad */}
            {index < displayedEpisodes.length - 1 && !shouldShowAd && (
              <div className="border-t border-border/30 my-7" />
            )}

            {/* Ad Section */}
            {shouldShowAd && (
              <div>
                {/* Separator before ad */}
                <div className="border-t border-border/30 my-7" />
                
                {adType === 0 && (
                  // Premium Upgrade Ad
                  <div className="rounded-xl overflow-hidden bg-card border border-border shadow-sm">
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Crown className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-sm font-semibold text-foreground">Upgrade to Premium</h3>
                            <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium text-muted-foreground">Limited Offer</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                            Unlock unlimited summaries, AI chat assistant, and exclusive insights. Ad-free experience included!
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={onUpgrade}
                              className="px-4 py-1.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all text-[11px]"
                            >
                              Get Premium
                            </button>
                            <span className="text-[10px] text-muted-foreground">From $9.99/mo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {adType === 1 && (
                  // External Ad - Financial Newsletter
                  <div className="rounded-xl overflow-hidden bg-card border border-border shadow-sm">
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-sm font-semibold text-foreground">The Daily Brief Newsletter</h3>
                            <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium text-muted-foreground">Sponsored</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                            Get market insights delivered to your inbox every morning. Join 500K+ investors staying ahead.
                          </p>
                          <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all text-[11px]"
                          >
                            Subscribe Free
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {adType === 2 && (
                  // External Ad - Trading Platform
                  <div className="rounded-xl overflow-hidden bg-card border border-border shadow-sm">
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-sm font-semibold text-foreground">TradeSmart Platform</h3>
                            <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium text-muted-foreground">Ad</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                            Commission-free trading with real-time analytics. Get $50 bonus when you open an account today!
                          </p>
                          <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all text-[11px]"
                          >
                            Start Trading
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {adType === 3 && (
                  // AI Assistant Premium Feature Ad
                  <div className="rounded-xl overflow-hidden bg-card border border-border shadow-sm">
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-sm font-semibold text-foreground">AI-Powered Insights</h3>
                            <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium text-muted-foreground">Premium Feature</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                            Chat with our AI assistant for personalized podcast recommendations and market analysis.
                          </p>
                          <button
                            onClick={onUpgrade}
                            className="px-4 py-1.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all text-[11px]"
                          >
                            Try AI Assistant
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Separator after ad */}
                {index < displayedEpisodes.length - 1 && (
                  <div className="border-t border-border/30 my-7" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}