import { SubscriptionFeed } from './SubscriptionFeed';
import { podcasts, episodes } from '../data/podcasts';
import { Home, Search, Filter, ChevronDown } from 'lucide-react';
import { copy } from '../src/copy/en';
import { useFilterState } from '../src/hooks';
import { useState } from 'react';

interface FeedProps {
  onEpisodeClick?: (podcastId: string, episodeId: string) => void;
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
  followedShows?: Set<string>;
}

export function Feed({ 
  onEpisodeClick, 
  isPremium, 
  onUpgrade, 
  onChatClick,
  isLoggedIn,
  userImage,
  userName,
  onSignIn,
  onProfileClick,
  onSettingsClick,
  onHelpClick,
  onSignOut,
  followedShows = new Set(),
}: FeedProps) {
  const { currentFilter: viewMode, setFilter: setViewMode } = useFilterState<'full-feed' | 'following-feed'>('full-feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Combine episodes with their podcast data
  const episodesWithPodcasts = episodes.map(episode => {
    const podcast = podcasts.find(p => p.id === episode.podcastId);
    return podcast ? { ...episode, podcast } : null;
  }).filter(Boolean) as Array<typeof episodes[0] & { podcast: typeof podcasts[0] }>;

  // Get current filter label
  const getFilterLabel = () => {
    return viewMode === 'full-feed' ? copy.feed.fullFeed : copy.feed.followingFeed;
  };

  return (
    <div className="w-full">
      {/* Search and Filter Controls */}
      <div className="flex items-center gap-3 mb-7 max-w-xl mx-auto">
        {/* Search Bar - Always visible, extends to the right */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search episodes..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        {/* Filter - Right Side */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-xs font-medium hover:bg-muted transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{getFilterLabel()}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Filter Dropdown */}
          {showFilterDropdown && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowFilterDropdown(false)}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border/50 rounded-xl shadow-lg z-20 overflow-hidden">
                <div className="p-2 space-y-0.5">
                  {(['full-feed', 'following-feed'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setViewMode(filter);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        viewMode === filter
                          ? 'bg-muted text-foreground'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {filter === 'full-feed' ? copy.feed.fullFeed : copy.feed.followingFeed}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-4 max-w-xl mx-auto">
        <SubscriptionFeed 
          episodes={episodesWithPodcasts}
          viewMode={viewMode}
          onEpisodeClick={onEpisodeClick}
          isPremium={isPremium}
          onUpgrade={onUpgrade}
          followedShows={followedShows}
        />
      </div>

      {/* Separator before About section */}
      <div className="border-t border-border/30 my-7 max-w-xl mx-auto" />

      {/* Page Footer Info */}
      <div className="bg-muted/50 border border-border/50 rounded-xl p-3 max-w-xl mx-auto shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-2 items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Home className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold mb-1 text-foreground">{copy.feed.aboutTitle}</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
              {copy.feed.aboutDescription}
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">How to use:</span> {copy.feed.aboutHowTo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}