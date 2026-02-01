import { X, Star, ChevronRight, Clock, Bookmark, Share2, MoreVertical, CheckCircle2, Youtube, Twitter, Globe, FileText, Download, Podcast, User, Tag, TrendingUp, Calendar, List } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import React from 'react';

interface Episode {
  id: string;
  title: string;
  description: string;
  publishedDate: string;
  readTime: string;
  thumbnailUrl: string;
  guest?: string;
  tags?: string[];
}

interface Podcast {
  id: string;
  title: string;
  host: string;
  coverUrl: string;
  category: string;
  tag: string;
  description: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  substackUrl?: string;
  websiteUrl?: string;
  episodes: Episode[];
}

interface PodcastDetailModalProps {
  podcastId: string;
  onClose: () => void;
  onEpisodeClick?: (podcastId: string, episodeId: string) => void;
}

// Mock podcast data
const mockPodcastData: Record<string, Podcast> = {
  '1': {
    id: '1',
    title: 'The Compound and Friends',
    host: 'Josh Brown',
    coverUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    category: 'Investing',
    tag: 'Finance',
    description: 'The Compound and Friends is your guide to navigating the financial markets with confidence. Hosted by Josh Brown, CEO of Ritholtz Wealth Management, this podcast brings together the smartest minds in finance to discuss market trends, investment strategies, and the forces shaping our economy.',
    youtubeUrl: 'https://www.youtube.com/channel/UC1234567890',
    twitterUrl: 'https://twitter.com/compoundfriends',
    substackUrl: 'https://compoundfriends.substack.com',
    websiteUrl: 'https://www.compoundfriends.com',
    episodes: [
      {
        id: 'e1',
        title: 'Market Outlook for Q1 2026: What Investors Need to Know',
        description: 'In this episode, Josh discusses the key market trends heading into Q1 2026. We explore inflation concerns, interest rate predictions, and sector rotation strategies. Josh breaks down how geopolitical tensions are affecting global markets and provides actionable insights for portfolio positioning.',
        publishedDate: '2d ago',
        readTime: '8 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
        guest: 'Michael Batnick',
        tags: ['Markets', 'Investing', 'Q1 2026', 'Fed Policy', 'Inflation']
      },
      {
        id: 'e2',
        title: 'The Future of AI Investing: Separating Hype from Reality',
        description: 'Artificial Intelligence continues to dominate headlines and portfolios. Josh sits down with AI investment experts to discuss which companies have sustainable moats, where the bubble risks lie, and how retail investors can navigate this rapidly evolving sector without getting caught in the hype.',
        publishedDate: '5d ago',
        readTime: '12 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
        guest: 'Ben Carlson',
        tags: ['Technology', 'AI', 'Innovation', 'Tech Stocks', 'Valuation']
      },
      {
        id: 'e3',
        title: 'Building Wealth in Your 30s: Strategies That Actually Work',
        description: 'This episode focuses on practical wealth-building strategies for millennials. Josh covers emergency funds, 401(k) optimization, real estate investing, and side hustles. Learn how to balance paying off debt while building long-term wealth through disciplined investing.',
        publishedDate: '1 Jan',
        readTime: '10 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
        guest: 'Nick Maggiulli',
        tags: ['Wealth', 'Millennials', 'Retirement', '401(k)', 'Real Estate']
      },
      {
        id: 'e4',
        title: 'Understanding Market Volatility: A Behavioral Finance Perspective',
        description: 'Market volatility can trigger emotional investing decisions. Josh explores behavioral finance principles that explain why investors make poor decisions during market swings. Learn practical techniques to stay disciplined and avoid common psychological traps that derail long-term investment success.',
        publishedDate: '8 Jan',
        readTime: '9 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
        guest: 'Morgan Housel',
        tags: ['Psychology', 'Behavioral Finance', 'Risk Management']
      },
      {
        id: 'e5',
        title: 'The Case for International Diversification in 2026',
        description: 'Should US investors look beyond domestic markets? Josh examines the case for international diversification, discussing emerging markets, currency risks, and geographic allocation strategies. Discover why global diversification might be more important than ever in today\'s interconnected economy.',
        publishedDate: '15 Jan',
        readTime: '11 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
        guest: 'Barry Ritholtz',
        tags: ['Global Markets', 'Diversification', 'Emerging Markets', 'Currency']
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Planet Money',
    host: 'NPR',
    coverUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    category: 'Economics',
    tag: 'Economic',
    description: 'Planet Money explains the economy with stories and fun. Join NPR\'s team of economic journalists as they decode the mysteries of the global economy, one fascinating story at a time.',
    youtubeUrl: 'https://www.youtube.com/channel/UC1234567890',
    twitterUrl: 'https://twitter.com/planetmoney',
    substackUrl: 'https://planetmoney.substack.com',
    websiteUrl: 'https://www.planetmoney.com',
    episodes: [
      {
        id: 'e1',
        title: 'Why Prices Are Still Rising Despite Fed Actions',
        description: 'The Federal Reserve has been raising interest rates, but inflation persists. We investigate the complex web of supply chains, labor markets, and corporate pricing power to understand why bringing down inflation is proving more difficult than expected.',
        publishedDate: '1d ago',
        readTime: '7 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop'
      },
      {
        id: 'e2',
        title: 'The Economics of Coffee: From Bean to Cup',
        description: 'Ever wonder why your morning coffee costs what it does? We trace the journey of coffee from farms in Ethiopia to your local café, uncovering the economic forces, trade agreements, and market dynamics that determine the price of your daily brew.',
        publishedDate: '3d ago',
        readTime: '9 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop'
      },
      {
        id: 'e3',
        title: 'Universal Basic Income: What the Data Actually Shows',
        description: 'UBI experiments are happening around the world. We examine real data from pilot programs in Kenya, Finland, and California to understand what happens when people receive unconditional cash payments. The results might surprise you.',
        publishedDate: '6d ago',
        readTime: '10 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop'
      }
    ]
  }
};

export function PodcastDetailModal({ podcastId, onClose, onEpisodeClick }: PodcastDetailModalProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [hoveredEpisode, setHoveredEpisode] = useState<string | null>(null);
  const [savedEpisodes, setSavedEpisodes] = useState<Set<string>>(new Set());
  const podcast = mockPodcastData[podcastId];

  const handleSaveToggle = (episodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedEpisodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

  // Helper function to determine icon for date
  const getDateIcon = (dateStr: string) => {
    // If it contains "ago", use Clock icon, otherwise use Calendar icon
    return dateStr.includes('ago') ? Clock : Calendar;
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!podcast) {
    return null;
  }

  const truncatedDescription = podcast.description.slice(0, 200);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Container - Aligned with sidebars */}
      <div 
        className="relative bg-background rounded-xl shadow-sm overflow-hidden border border-border"
        style={{
          marginLeft: '256px', // Left sidebar width (w-64)
          marginRight: '320px', // Right sidebar width (w-80)
          width: 'calc(100vw - 256px - 320px)', // Fill space between sidebars
          height: 'calc(100vh - 24px)', // Match sidebar height (accounting for p-3 = 12px top + 12px bottom)
          marginTop: '12px',
          marginBottom: '12px',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-secondary hover:bg-muted transition-all backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto p-4 md:p-5">
          {/* Hero Section - Redesigned */}
          <div className="bg-card border border-border/50 rounded-xl p-4 mb-5 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200">
            <div className="flex gap-4 items-start">
              {/* Podcast Cover */}
              <div className="flex-shrink-0">
                <img
                  src={podcast.coverUrl}
                  alt={podcast.title}
                  className="w-20 h-20 rounded-lg object-cover border border-border/50 shadow-sm"
                />
              </div>

              {/* Podcast Info */}
              <div className="flex-1 min-w-0">
                {/* Title row with social buttons */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  {/* Title with host and podcast icon */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Podcast className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <h1 className="text-[11px] font-semibold text-foreground truncate">
                      {podcast.title} <span className="text-[10px] text-muted-foreground font-normal">- Hosted by {podcast.host}</span>
                    </h1>
                  </div>

                  {/* Social Links - Horizontal on title line */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {podcast.youtubeUrl && (
                      <a
                        href={podcast.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-6 h-6 rounded-lg bg-background border border-border/50 hover:bg-muted hover:shadow-sm transition-all flex items-center justify-center"
                        title="YouTube"
                      >
                        <Youtube className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    )}
                    {podcast.twitterUrl && (
                      <a
                        href={podcast.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-6 h-6 rounded-lg bg-background border border-border/50 hover:bg-muted hover:shadow-sm transition-all flex items-center justify-center"
                        title="X (Twitter)"
                      >
                        <svg className="w-3.5 h-3.5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    )}
                    {podcast.substackUrl && (
                      <a
                        href={podcast.substackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-6 h-6 rounded-lg bg-background border border-border/50 hover:bg-muted hover:shadow-sm transition-all flex items-center justify-center"
                        title="Substack"
                      >
                        <svg className="w-3.5 h-3.5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                        </svg>
                      </a>
                    )}
                    {podcast.websiteUrl && (
                      <a
                        href={podcast.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-6 h-6 rounded-lg bg-background border border-border/50 hover:bg-muted hover:shadow-sm transition-all flex items-center justify-center"
                        title="Website"
                      >
                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Separator */}
                <div className="border-t border-border/30 mb-2.5" />

                {/* Description - matching summary card size */}
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {podcast.description}
                </p>
              </div>
            </div>
          </div>

          {/* Separator before episodes */}
          <div className="border-t border-border/30 mb-4" />

          {/* Episodes Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <List className="w-3.5 h-3.5 text-foreground" />
                <h2 className="text-xs font-semibold text-foreground">Recent Episodes</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">
                  {podcast.episodes.length} Episodes
                </span>
              </div>
            </div>

            {/* Episodes List */}
            <div className="space-y-3">
              {podcast.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    onEpisodeClick?.(podcastId, episode.id);
                    onClose();
                  }}
                >
                  <div className="p-3">
                    <div className="flex gap-3">
                      {/* Episode Image */}
                      <img
                        src={episode.thumbnailUrl}
                        alt={episode.title}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title Row with Action Buttons */}
                        <div className="flex items-start justify-between gap-3 mb-2 pb-2 border-b border-border/30">
                          {/* Title - Left Aligned */}
                          <div className="flex items-start gap-1.5 flex-1 min-w-0">
                            <FileText className="w-3.5 h-3.5 text-foreground flex-shrink-0 mt-0.5" />
                            <h3 className="text-[11px] font-semibold text-foreground leading-snug line-clamp-2">
                              {episode.title}
                            </h3>
                          </div>

                          {/* Action Buttons - Right Side */}
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <button 
                              onClick={(e) => handleSaveToggle(episode.id, e)}
                              className="p-1 rounded-lg hover:bg-muted transition-all" 
                              title="Save"
                              aria-label="Save"
                            >
                              <Bookmark className={`w-3.5 h-3.5 transition-colors ${savedEpisodes.has(episode.id) ? 'fill-foreground text-foreground' : 'text-muted-foreground hover:text-foreground'}`} />
                            </button>
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-lg hover:bg-muted transition-all" 
                              title="Share"
                              aria-label="Share"
                            >
                              <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-lg hover:bg-muted transition-all" 
                              title="Download"
                              aria-label="Download"
                            >
                              <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </div>
                        </div>

                        {/* Guest and Date Row */}
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2 pb-2 border-b border-border/30">
                          {/* Guest */}
                          {episode.guest && (
                            <>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{episode.guest}</span>
                              </div>
                              <div className="h-3 w-px bg-border/40 flex-shrink-0" />
                            </>
                          )}
                          {/* Date */}
                          <div className="flex items-center gap-1">
                            {episode.publishedDate.includes('ago') ? (
                              <Clock className="w-3 h-3" />
                            ) : (
                              <Calendar className="w-3 h-3" />
                            )}
                            <span>{episode.publishedDate}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 mb-2 pb-2 border-b border-border/30">
                          {episode.description}
                        </p>

                        {/* Tags at bottom - evenly distributed like summary card */}
                        {episode.tags && episode.tags.length > 0 && (
                          <div className="flex items-center justify-between gap-1">
                            {episode.tags.slice(0, 5).map((tag, tagIndex) => (
                              <React.Fragment key={tagIndex}>
                                <span
                                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted border border-border/40 text-[10px] font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {tag}
                                </span>
                                {tagIndex < Math.min(episode.tags.length, 5) - 1 && (
                                  <div className="h-3 w-px bg-border/40 flex-shrink-0" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}