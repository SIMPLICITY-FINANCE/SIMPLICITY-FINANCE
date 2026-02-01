import { TrendingUp, Globe, Cpu, Users, Play, ChevronRight, CheckCircle2, ChevronLeft, Bell, Check, Mic, User, Search, Clock, Calendar, Filter, ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFilterState } from '../src/hooks';
import { PREDEFINED_TAGS } from '../data/podcasts';
import { copy } from '../src/copy/en';

interface Podcast {
  id: string;
  title: string;
  host: string;
  imageUrl: string;
  episodeCount: number;
  description: string;
  category: 'geo-politics' | 'finance' | 'technology';
  views?: number;
  lastUpdated?: string;
}

interface Person {
  id: string;
  name: string;
  handle: string;
  imageUrl: string;
  bio: string;
  frequentShows: string[];
  totalAppearances: number;
  isVerified: boolean;
  category: 'geo-politics' | 'finance' | 'technology';
  lastAppearance: string;
}

type FilterTab = string; // Changed to string to support tag filtering

interface PodcastCatalogProps {
  onPodcastClick?: (podcastId: string) => void;
  onPersonClick?: (personId: string) => void;
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
  onTopShowsClick?: () => void;
  onNewShowsClick?: () => void;
  onTopPeopleClick?: () => void;
  followedShows?: Set<string>;
  followedPeople?: Set<string>;
  onToggleFollowShow?: (showId: string) => void;
  onToggleFollowPerson?: (personId: string) => void;
}

const mockPodcasts: Podcast[] = [
  {
    id: '1',
    title: 'The Compound and Friends',
    host: 'Josh Brown',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    episodeCount: 156,
    description: 'Financial markets, investing, and wealth management insights',
    category: 'finance',
    views: 125000,
    lastUpdated: '2d'
  },
  {
    id: '2',
    title: 'Planet Money',
    host: 'NPR',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    episodeCount: 892,
    description: 'The economy explained with stories and fun',
    category: 'finance',
    views: 234000,
    lastUpdated: '5d'
  },
  {
    id: '3',
    title: 'All-In Podcast',
    host: 'All-In',
    imageUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop',
    episodeCount: 142,
    description: 'Technology, business, and economics discussion',
    category: 'technology',
    views: 456000,
    lastUpdated: '15 Jan'
  },
  {
    id: '4',
    title: 'Odd Lots',
    host: 'Bloomberg',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    episodeCount: 328,
    description: 'Bloomberg\'s markets and finance podcast',
    category: 'geo-politics',
    views: 187000,
    lastUpdated: '7d'
  },
  {
    id: '5',
    title: 'Animal Spirits',
    host: 'Michael Batnick & Ben Carlson',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    episodeCount: 245,
    description: 'Markets, life, and investing with Ben and Michael',
    category: 'finance',
    views: 98000,
    lastUpdated: '3d'
  },
  {
    id: '6',
    title: 'Invest Like the Best',
    host: 'Patrick O\'Shaughnessy',
    imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop',
    episodeCount: 187,
    description: 'Conversations with the best investors and thinkers',
    category: 'technology',
    views: 312000,
    lastUpdated: '10 Jan'
  },
  {
    id: '7',
    title: 'Masters in Business',
    host: 'Barry Ritholtz',
    imageUrl: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400&h=400&fit=crop',
    episodeCount: 412,
    description: 'Interviews with finance and investing leaders',
    category: 'finance',
    views: 276000,
    lastUpdated: '1d'
  },
  {
    id: '8',
    title: 'The Indicator',
    host: 'NPR',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    episodeCount: 645,
    description: 'Quick economic news and insights',
    category: 'geo-politics',
    views: 189000,
    lastUpdated: '6d'
  },
  {
    id: '9',
    title: 'Rational Reminder',
    host: 'Cameron Passmore & Ben Felix',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    episodeCount: 234,
    description: 'Evidence-based investing and portfolio management',
    category: 'technology',
    views: 145000,
    lastUpdated: '8 Jan'
  },
  {
    id: '10',
    title: 'Capital Allocators',
    host: 'Ted Seides',
    imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop',
    episodeCount: 298,
    description: 'Institutional investing insights',
    category: 'finance',
    views: 167000,
    lastUpdated: '4d'
  },
  {
    id: '11',
    title: 'Motley Fool Money',
    host: 'The Motley Fool',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    episodeCount: 521,
    description: 'Stock market news and investment advice',
    category: 'geo-politics',
    views: 203000,
    lastUpdated: '12 Jan'
  },
  {
    id: '12',
    title: 'We Study Billionaires',
    host: 'The Investor\'s Podcast',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    episodeCount: 376,
    description: 'Learn from the world\'s best investors',
    category: 'technology',
    views: 298000,
    lastUpdated: '5d'
  }
];

// Sort by views for Top Shows
const topShows = [...mockPodcasts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8);

// Latest shows (simulated by reversing the array)
const newShows = [...mockPodcasts].reverse().slice(0, 8);

const mockPeople: Person[] = [
  {
    id: '1',
    name: 'Ray Dalio',
    handle: '@raydalio',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Founder of Bridgewater Associates, one of the world\'s largest hedge funds. Author of Principles.',
    frequentShows: ['The Compound and Friends', 'Planet Money', 'All-In Podcast'],
    totalAppearances: 24,
    isVerified: true,
    category: 'finance',
    lastAppearance: '10 Jan'
  },
  {
    id: '2',
    name: 'Cathie Wood',
    handle: '@cathiewood',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Founder and CEO of ARK Invest, focused on disruptive innovation in tech and healthcare.',
    frequentShows: ['All-In Podcast', 'Invest Like the Best', 'Odd Lots'],
    totalAppearances: 18,
    isVerified: true,
    category: 'technology',
    lastAppearance: '14 Jan'
  },
  {
    id: '3',
    name: 'Michael Burry',
    handle: '@michaelburry',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Hedge fund manager known for predicting the 2008 financial crisis. Featured in The Big Short.',
    frequentShows: ['Odd Lots', 'Masters in Business', 'Planet Money'],
    totalAppearances: 12,
    isVerified: true,
    category: 'geo-politics',
    lastAppearance: '3 Jan'
  },
  {
    id: '4',
    name: 'Janet Yellen',
    handle: '@janetyellen',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'U.S. Treasury Secretary, former Federal Reserve Chair. Expert in monetary policy and economics.',
    frequentShows: ['Planet Money', 'The Indicator', 'Odd Lots'],
    totalAppearances: 15,
    isVerified: true,
    category: 'geo-politics',
    lastAppearance: '12 Jan'
  },
  {
    id: '5',
    name: 'Warren Buffett',
    handle: '@warrenbuffett',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'Chairman and CEO of Berkshire Hathaway. One of the most successful investors of all time.',
    frequentShows: ['Invest Like the Best', 'Masters in Business', 'We Study Billionaires'],
    totalAppearances: 21,
    isVerified: true,
    category: 'finance',
    lastAppearance: '16 Jan'
  },
  {
    id: '6',
    name: 'Christine Lagarde',
    handle: '@christinelagarde',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    bio: 'President of the European Central Bank, former IMF Managing Director. Expert on global finance.',
    frequentShows: ['Planet Money', 'Odd Lots', 'The Indicator'],
    totalAppearances: 14,
    isVerified: true,
    category: 'technology',
    lastAppearance: '8 Jan'
  }
];

export function PodcastCatalog({ onPodcastClick, onPersonClick, onTopShowsClick, onNewShowsClick, onTopPeopleClick, followedShows, followedPeople, onToggleFollowShow, onToggleFollowPerson }: PodcastCatalogProps) {
  const newShowsRef = useRef<HTMLDivElement>(null);
  const topPeopleRef = useRef<HTMLDivElement>(null);
  const { currentFilter: filterTab, setFilter: setFilterTab } = useFilterState<FilterTab>('all');
  const [currentView, setCurrentView] = useState<'main' | 'all-shows' | 'all-people'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Helper function to get category icon and label
  const getCategoryInfo = (category: 'geo-politics' | 'finance' | 'technology') => {
    switch (category) {
      case 'geo-politics':
        return { icon: Globe, label: 'Geo-Politics' };
      case 'finance':
        return { icon: TrendingUp, label: 'Finance' };
      case 'technology':
        return { icon: Cpu, label: 'Technology' };
    }
  };

  // Filter shows and people by category
  const filteredShows = filterTab === 'all' 
    ? newShows 
    : newShows.filter(podcast => podcast.category === filterTab);
  
  const filteredPeople = filterTab === 'all' 
    ? mockPeople 
    : mockPeople.filter(person => person.category === filterTab);

  const categories = [
    {
      id: 'geo-politics',
      title: 'Geo-Politics',
      description: 'Podcasts covering international relations, global conflicts, and geopolitical strategies.',
      gradient: 'from-purple-400 via-pink-400 to-red-400',
      badge: 'Featured Category'
    },
    {
      id: 'economics',
      title: 'Economics',
      description: 'Deep dives into economic theory, market analysis, and financial policy discussions.',
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      badge: 'Featured Category'
    },
    {
      id: 'technology',
      title: 'Technology',
      description: 'Exploring innovation, AI advancements, and the future of tech in society.',
      gradient: 'from-amber-400 via-orange-400 to-red-400',
      badge: 'Featured Category'
    }
  ];

  // Get filter label
  const getFilterLabel = () => {
    if (filterTab === 'all') return copy.discover.filterAll;
    return filterTab;
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Search and Filter Controls */}
      <div className="flex items-center gap-3 mb-7">
        {/* Search Bar - Always visible, extends to the right */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shows and people..."
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
              
              {/* Dropdown Menu - Tags List */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/50 rounded-xl shadow-lg z-20 overflow-hidden max-h-96 overflow-y-auto">
                <div className="p-2 space-y-0.5">
                  {/* All option */}
                  <button
                    onClick={() => {
                      setFilterTab('all');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      filterTab === 'all'
                        ? 'bg-muted text-foreground'
                        : 'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    All
                  </button>
                  
                  {/* Separator */}
                  <div className="border-t border-border/30 my-1" />
                  
                  {/* Tags */}
                  {PREDEFINED_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setFilterTab(tag);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        filterTab === tag
                          ? 'bg-muted text-foreground'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Conditional Content based on current view */}
      {currentView === 'main' && (
        <>
          {/* All Shows Section */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setCurrentView('all-shows')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border shadow-sm rounded-lg text-[11px] font-medium text-foreground hover:bg-muted/50 transition-all"
              >
                <span>Discover Shows</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center bg-card border border-border/50 shadow-sm rounded-lg overflow-hidden">
                <button
                  onClick={() => scrollLeft(newShowsRef)}
                  className="w-7 h-7 hover:bg-muted/60 transition-colors flex items-center justify-center"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
                </button>
                <div className="w-px h-4 bg-border/40" />
                <button
                  onClick={() => scrollRight(newShowsRef)}
                  className="w-7 h-7 hover:bg-muted/60 transition-colors flex items-center justify-center"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-foreground" />
                </button>
              </div>
            </div>

            {/* New Shows - Horizontal Scroll */}
            <div 
              ref={newShowsRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredShows.map((podcast) => {
                const categoryInfo = getCategoryInfo(podcast.category);
                const CategoryIcon = categoryInfo.icon;
                
                return (
                <div
                  key={podcast.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Podcast clicked:', podcast.id, podcast.title);
                    if (onPodcastClick) {
                      console.log('Calling onPodcastClick');
                      onPodcastClick(podcast.id);
                    } else {
                      console.log('onPodcastClick is undefined!');
                    }
                  }}
                  className="group cursor-pointer flex-shrink-0 w-40"
                >
                  {/* Card */}
                  <div className="bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border active:scale-[0.98] transition-all overflow-hidden">
                    {/* Thumbnail */}
                    <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                      <img
                        src={podcast.imageUrl}
                        alt={podcast.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-2">
                      {/* Title with Icon and Date - Single Line */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-start gap-1 flex-1 min-w-0">
                          <Mic className="w-[9px] h-[9px] text-foreground flex-shrink-0 mt-0.5" />
                          <h3 className="text-[9px] font-semibold text-foreground truncate leading-tight flex-1">
                            {podcast.title}
                          </h3>
                        </div>
                        
                        {/* Vertical Separator */}
                        <div className="h-4 w-px bg-border/40 flex-shrink-0" />
                        
                        {/* Date */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {podcast.lastUpdated?.endsWith('d') ? (
                            <Clock className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <Calendar className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="text-[8px] text-muted-foreground whitespace-nowrap">
                            {podcast.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Separator after Discover Shows */}
          <div className="border-t border-border/30 my-7" />

          {/* Top People Section */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setCurrentView('all-people')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border shadow-sm rounded-lg text-[11px] font-medium text-foreground hover:bg-muted/50 transition-all"
              >
                <span>Discover People</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center bg-card border border-border/50 shadow-sm rounded-lg overflow-hidden">
                <button
                  onClick={() => scrollLeft(topPeopleRef)}
                  className="w-7 h-7 hover:bg-muted/60 transition-colors flex items-center justify-center"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
                </button>
                <div className="w-px h-4 bg-border/40" />
                <button
                  onClick={() => scrollRight(topPeopleRef)}
                  className="w-7 h-7 hover:bg-muted/60 transition-colors flex items-center justify-center"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Top People - Horizontal Scroll */}
            <div 
              ref={topPeopleRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredPeople.map((person) => {
                const categoryInfo = getCategoryInfo(person.category);
                const CategoryIcon = categoryInfo.icon;
                
                return (
                <div
                  key={person.id}
                  onClick={() => onPersonClick?.(person.id)}
                  className="group cursor-pointer flex-shrink-0 w-40"
                >
                  {/* Card */}
                  <div className="bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all overflow-hidden">
                    {/* Thumbnail */}
                    <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                      <img
                        src={person.imageUrl}
                        alt={person.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-2">
                      {/* Name with Icon and Date - Single Line */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-start gap-1 flex-1 min-w-0">
                          <User className="w-[9px] h-[9px] text-foreground flex-shrink-0 mt-0.5" />
                          <h3 className="text-[9px] font-semibold text-foreground truncate leading-tight flex-1">
                            {person.name}
                          </h3>
                        </div>
                        
                        {/* Vertical Separator */}
                        <div className="h-4 w-px bg-border/40 flex-shrink-0" />
                        
                        {/* Date */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Calendar className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-[8px] text-muted-foreground whitespace-nowrap">
                            {person.lastAppearance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* All Shows View */}
      {currentView === 'all-shows' && (
        <div className="mb-7">
          {/* Back Button */}
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center gap-1.5 px-3 py-1.5 mb-3 bg-card border border-border shadow-sm rounded-lg text-[11px] font-medium text-foreground hover:bg-muted/50 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Discover Shows</span>
          </button>

          {/* Grid of all shows */}
          <div className="space-y-5">
            {Array.from({ length: Math.ceil(mockPodcasts.length / 3) }).map((_, rowIndex) => (
              <div key={rowIndex}>
                <div className="flex justify-between">
                  {mockPodcasts.slice(rowIndex * 3, (rowIndex + 1) * 3).map((podcast) => {
                    const categoryInfo = getCategoryInfo(podcast.category);
                    const CategoryIcon = categoryInfo.icon;
                    
                    return (
                      <div
                        key={podcast.id}
                        onClick={() => onPodcastClick?.(podcast.id)}
                        className="group cursor-pointer flex-shrink-0 w-40"
                      >
                        {/* Card */}
                        <div className="bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all overflow-hidden">
                          {/* Thumbnail */}
                          <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                            <img
                              src={podcast.imageUrl}
                              alt={podcast.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-2">
                            {/* Title with Icon and Date - Single Line */}
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-start gap-1 flex-1 min-w-0">
                                <Mic className="w-[9px] h-[9px] text-foreground flex-shrink-0 mt-0.5" />
                                <h3 className="text-[9px] font-semibold text-foreground truncate leading-tight flex-1">
                                  {podcast.title}
                                </h3>
                              </div>
                              
                              {/* Vertical Separator */}
                              <div className="h-4 w-px bg-border/40 flex-shrink-0" />
                              
                              {/* Date */}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {podcast.lastUpdated?.endsWith('d') ? (
                                  <Clock className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                                ) : (
                                  <Calendar className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                                )}
                                <span className="text-[8px] text-muted-foreground whitespace-nowrap">
                                  {podcast.lastUpdated}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Separator between rows (except after last row) */}
                {rowIndex < Math.ceil(mockPodcasts.length / 3) - 1 && (
                  <div className="border-t border-border/30 mt-5" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All People View */}
      {currentView === 'all-people' && (
        <div className="mb-7">
          {/* Back Button */}
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center gap-1.5 px-3 py-1.5 mb-3 bg-card border border-border shadow-sm rounded-lg text-[11px] font-medium text-foreground hover:bg-muted/50 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Discover People</span>
          </button>

          {/* Grid of all people */}
          <div className="space-y-5">
            {Array.from({ length: Math.ceil(mockPeople.length / 3) }).map((_, rowIndex) => (
              <div key={rowIndex}>
                <div className="flex justify-between">
                  {mockPeople.slice(rowIndex * 3, (rowIndex + 1) * 3).map((person) => {
                    const categoryInfo = getCategoryInfo(person.category);
                    const CategoryIcon = categoryInfo.icon;
                    
                    return (
                      <div
                        key={person.id}
                        onClick={() => onPersonClick?.(person.id)}
                        className="group cursor-pointer flex-shrink-0 w-40"
                      >
                        {/* Card */}
                        <div className="bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all overflow-hidden">
                          {/* Thumbnail */}
                          <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                            <img
                              src={person.imageUrl}
                              alt={person.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-2">
                            {/* Name with Icon and Date - Single Line */}
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-start gap-1 flex-1 min-w-0">
                                <User className="w-[9px] h-[9px] text-foreground flex-shrink-0 mt-0.5" />
                                <h3 className="text-[9px] font-semibold text-foreground truncate leading-tight flex-1">
                                  {person.name}
                                </h3>
                              </div>
                              
                              {/* Vertical Separator */}
                              <div className="h-4 w-px bg-border/40 flex-shrink-0" />
                              
                              {/* Date */}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Calendar className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-[8px] text-muted-foreground whitespace-nowrap">
                                  {person.lastAppearance}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Separator between rows (except after last row) */}
                {rowIndex < Math.ceil(mockPeople.length / 3) - 1 && (
                  <div className="border-t border-border/30 mt-5" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Separator before About section */}
      <div className="border-t border-border/30 my-7" />

      {/* About Section */}
      <div className="bg-muted/50 border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-2 items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT DISCOVER</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
              Explore our comprehensive catalog of financial podcasts covering markets, economics, investing, and business. Discover new shows from industry experts, financial analysts, and economic commentators to expand your knowledge and stay informed.
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">How to use:</span> Browse through featured categories to find podcasts by topic. Check out Top Shows based on popularity, or explore New Shows for the latest additions. Click any podcast to view episode list and summaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}