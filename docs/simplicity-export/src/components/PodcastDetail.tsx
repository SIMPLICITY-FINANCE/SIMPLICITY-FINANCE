import { ArrowLeft, Star, ChevronRight, Clock, Bookmark, Share2, MoreVertical, Calendar, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Episode {
  id: string;
  title: string;
  description: string;
  publishedDate: string;
  readTime: string;
  thumbnailUrl: string;
}

interface Podcast {
  id: string;
  title: string;
  host: string;
  coverUrl: string;
  rating: number;
  totalRatings: string;
  category: string;
  updateFrequency: string;
  description: string;
  episodes: Episode[];
}

interface PodcastDetailProps {
  podcastId: string;
  onBack: () => void;
  onEpisodeClick?: (episodeId: string) => void;
}

// Mock podcast data
const mockPodcastData: Record<string, Podcast> = {
  '1': {
    id: '1',
    title: 'The Compound and Friends',
    host: 'Josh Brown',
    coverUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    rating: 4.7,
    totalRatings: '3.2K',
    category: 'Investing',
    updateFrequency: 'Updated weekly',
    description: 'The Compound and Friends is your guide to navigating the financial markets with confidence. Hosted by Josh Brown, CEO of Ritholtz Wealth Management, this podcast brings together the smartest minds in finance to discuss market trends, investment strategies, and the forces shaping our economy.',
    episodes: [
      {
        id: 'e1',
        title: 'Market Outlook for Q1 2026: What Investors Need to Know',
        description: 'In this episode, Josh discusses the key market trends heading into Q1 2026. We explore inflation concerns, interest rate predictions, and sector rotation strategies. Josh breaks down how geopolitical tensions are affecting global markets and provides actionable insights for portfolio positioning.',
        publishedDate: '2d ago',
        readTime: '8 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop'
      },
      {
        id: 'e2',
        title: 'The Future of AI Investing: Separating Hype from Reality',
        description: 'Artificial Intelligence continues to dominate headlines and portfolios. Josh sits down with AI investment experts to discuss which companies have sustainable moats, where the bubble risks lie, and how retail investors can navigate this rapidly evolving sector without getting caught in the hype.',
        publishedDate: '5d ago',
        readTime: '12 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop'
      },
      {
        id: 'e3',
        title: 'Building Wealth in Your 30s: Strategies That Actually Work',
        description: 'This episode focuses on practical wealth-building strategies for millennials. Josh covers emergency funds, 401(k) optimization, real estate investing, and side hustles. Learn how to balance paying off debt while building long-term wealth through disciplined investing.',
        publishedDate: '1 Jan',
        readTime: '10 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop'
      },
      {
        id: 'e4',
        title: 'Understanding Market Volatility: A Behavioral Finance Perspective',
        description: 'Market volatility can trigger emotional investing decisions. Josh explores behavioral finance principles that explain why investors make poor decisions during market swings. Learn practical techniques to stay disciplined and avoid common psychological traps that derail long-term investment success.',
        publishedDate: '8 Jan',
        readTime: '9 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop'
      },
      {
        id: 'e5',
        title: 'The Case for International Diversification in 2026',
        description: 'Should US investors look beyond domestic markets? Josh examines the case for international diversification, discussing emerging markets, currency risks, and geographic allocation strategies. Discover why global diversification might be more important than ever in today\'s interconnected economy.',
        publishedDate: '15 Jan',
        readTime: '11 min read',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Planet Money',
    host: 'NPR',
    coverUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    rating: 4.8,
    totalRatings: '12.5K',
    category: 'Economics',
    updateFrequency: 'Updated twice weekly',
    description: 'Planet Money explains the economy with stories and fun. Join NPR\'s team of economic journalists as they decode the mysteries of the global economy, one fascinating story at a time.',
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

export function PodcastDetail({ podcastId, onBack, onEpisodeClick }: PodcastDetailProps) {
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

  if (!podcast) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs">Back</span>
        </button>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">Podcast not found</h2>
          <p className="text-muted-foreground text-xs">This podcast doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const truncatedDescription = podcast.description.slice(0, 150);

  return (
    <div className="max-w-xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs">Back to Browse</span>
      </button>

      {/* Hero Section */}
      <div className="relative bg-muted/30 border border-border/50 rounded-xl overflow-hidden mb-6">
        <div className="relative p-6 flex flex-col md:flex-row gap-6 items-start">
          {/* Podcast Cover */}
          <div className="flex-shrink-0">
            <img
              src={podcast.coverUrl}
              alt={podcast.title}
              className="w-28 h-28 rounded-lg object-cover border-2 border-border"
            />
          </div>

          {/* Podcast Info */}
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <h1 className="text-xl font-semibold text-foreground">{podcast.title}</h1>
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mb-3">{podcast.host}</p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="font-medium text-foreground">{podcast.rating}</span>
                <span className="text-muted-foreground">({podcast.totalRatings})</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{podcast.category}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{podcast.updateFrequency}</span>
            </div>

            {/* Description */}
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              {showFullDescription ? podcast.description : truncatedDescription}
              {podcast.description.length > 150 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="ml-1 text-foreground hover:underline transition-colors font-medium"
                >
                  {showFullDescription ? 'LESS' : 'MORE'}
                </button>
              )}
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Website
              </a>
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Podcast
              </a>
            </div>

            {/* Follow Button */}
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              onMouseEnter={() => setHoveredEpisode('follow-btn')}
              onMouseLeave={() => setHoveredEpisode(null)}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                isFollowing
                  ? 'bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/20 ' +
                    (hoveredEpisode === 'follow-btn' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground')
                  : 'bg-foreground text-background hover:opacity-90'
              }`}
            >
              <span>{isFollowing ? (hoveredEpisode === 'follow-btn' ? 'Unfollow' : 'Following') : 'Follow'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-foreground">Recent Episodes</h2>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Episodes List */}
        <div className="space-y-3">
          {podcast.episodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-card border border-border/50 rounded-xl p-3 hover:border-border hover:bg-accent/30 transition-all cursor-pointer group"
              onClick={() => onEpisodeClick?.(episode.id)}
            >
              <div className="flex gap-3">
                {/* Episode Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted border border-border">
                    <img
                      src={episode.thumbnailUrl}
                      alt={episode.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Episode Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground mb-0.5">{episode.publishedDate}</p>
                  <h3 className="text-xs font-semibold mb-1 text-foreground line-clamp-2 group-hover:text-foreground/80">
                    {episode.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {episode.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex-shrink-0 flex items-start gap-1">
                  <button
                    onClick={(e) => handleSaveToggle(episode.id, e)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-all group/save"
                    title={savedEpisodes.has(episode.id) ? 'Unsave' : 'Save'}
                  >
                    <Bookmark 
                      className={`w-3.5 h-3.5 transition-all ${
                        savedEpisodes.has(episode.id)
                          ? 'fill-foreground text-foreground'
                          : 'text-muted-foreground group-hover/save:text-foreground'
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg hover:bg-muted transition-all group/share"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5 text-muted-foreground group-hover/share:text-foreground transition-all" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}