import { Podcast, Users, Check, Bell, ChevronDown, CheckCircle2 } from 'lucide-react';
import { podcasts } from '../data/podcasts';
import { copy, formatCopy } from '../src/copy/en';
import { useFilterState, useHoverState } from '../src/hooks';

interface FollowingPodcast {
  id: string;
  title: string;
  author: string;
  handle: string;
  imageUrl: string;
  episodeCount: number;
  subscriberCount: string;
  description: string;
  isVerified: boolean;
  category: 'geo-politics' | 'finance' | 'technology';
}

interface FollowingPerson {
  id: string;
  name: string;
  handle: string;
  imageUrl: string;
  bio: string;
  frequentShows: string[];
  totalAppearances: number;
  isVerified: boolean;
  category: 'geo-politics' | 'finance' | 'technology';
}

type FilterTab = 'all' | 'shows' | 'people';

interface FollowingListProps {
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
  followedShows?: Set<string>;
  followedPeople?: Set<string>;
  onToggleFollowShow?: (showId: string) => void;
  onToggleFollowPerson?: (personId: string) => void;
}

const mockFollowingPodcasts: FollowingPodcast[] = [
  {
    id: '1',
    title: 'The Compound and Friends',
    author: 'Michael Batnick & Josh Brown',
    handle: '@thecompound',
    imageUrl: 'https://images.unsplash.com/photo-1648522168698-537da0654bb9?w=400&h=400&fit=crop',
    episodeCount: 156,
    subscriberCount: '125K subscribers',
    description: 'Weekly discussions on markets, investing, and wealth management with industry experts and practitioners.',
    isVerified: true,
    category: 'finance'
  },
  {
    id: '2',
    title: 'Planet Money',
    author: 'NPR',
    handle: '@planetmoney',
    imageUrl: 'https://images.unsplash.com/photo-1650513737281-882e597ee5e5?w=400&h=400&fit=crop',
    episodeCount: 892,
    subscriberCount: '2.1M subscribers',
    description: 'The economy explained. Imagine you could call up a friend and say, "Meet me at the bar and tell me what\'s going on with the economy." Now imagine that\'s actually a fun evening.',
    isVerified: true,
    category: 'finance'
  },
  {
    id: '3',
    title: 'Invest Like the Best',
    author: 'Patrick O\'Shaughnessy',
    handle: '@investlikebest',
    imageUrl: 'https://images.unsplash.com/photo-1673767296837-8106e1b94d34?w=400&h=400&fit=crop',
    episodeCount: 234,
    subscriberCount: '98K subscribers',
    description: 'Deep dives with the world\'s best investors, operators, and allocators to learn from their mistakes and successes.',
    isVerified: true,
    category: 'finance'
  },
  {
    id: '4',
    title: 'All-In Podcast',
    author: 'Chamath, Jason, Sacks & Friedberg',
    handle: '@allinpodcast',
    imageUrl: 'https://images.unsplash.com/photo-1653378972336-103e1ea62721?w=400&h=400&fit=crop',
    episodeCount: 178,
    subscriberCount: '450K subscribers',
    description: 'The tech industry\'s most controversial and honest podcast. Technology, business, economics, and politics from Silicon Valley insiders.',
    isVerified: true,
    category: 'technology'
  },
  {
    id: '5',
    title: 'Odd Lots',
    author: 'Tracy Alloway & Joe Weisenthal',
    handle: '@oddlots',
    imageUrl: 'https://images.unsplash.com/photo-1599414275896-93076b7c493c?w=400&h=400&fit=crop',
    episodeCount: 456,
    subscriberCount: '180K subscribers',
    description: 'Bloomberg\'s markets podcast exploring the most interesting topics in finance through conversations with traders, economists, and researchers.',
    isVerified: true,
    category: 'finance'
  },
  {
    id: '6',
    title: 'The Prof G Pod',
    author: 'Scott Galloway',
    handle: '@profgpod',
    imageUrl: 'https://images.unsplash.com/photo-1643875180552-03b9bb103768?w=400&h=400&fit=crop',
    episodeCount: 267,
    subscriberCount: '215K subscribers',
    description: 'Scott Galloway offers sharp insights and no-mercy analysis on business, tech, and the economy, plus answers to audience questions.',
    isVerified: true,
    category: 'technology'
  }
];

const mockFollowingPeople: FollowingPerson[] = [
  {
    id: '1',
    name: 'John Doe',
    handle: '@johndoe',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    bio: 'John is a seasoned investor with over 20 years of experience in the financial markets.',
    frequentShows: ['The Compound and Friends', 'Planet Money'],
    totalAppearances: 5,
    isVerified: true,
    category: 'finance'
  },
  {
    id: '2',
    name: 'Jane Smith',
    handle: '@janesmith',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    bio: 'Jane is a renowned economist with expertise in macroeconomic trends and policy analysis.',
    frequentShows: ['Planet Money', 'Odd Lots'],
    totalAppearances: 8,
    isVerified: true,
    category: 'finance'
  },
  {
    id: '3',
    name: 'Alice Johnson',
    handle: '@alicejohnson',
    imageUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop',
    bio: 'Alice is a tech entrepreneur and investor, known for her insights on emerging technologies and market trends.',
    frequentShows: ['All-In Podcast', 'Odd Lots'],
    totalAppearances: 6,
    isVerified: true,
    category: 'technology'
  },
  {
    id: '4',
    name: 'Bob Brown',
    handle: '@bobbrown',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    bio: 'Bob is a financial analyst with a focus on portfolio strategy and risk management.',
    frequentShows: ['Odd Lots', 'Invest Like the Best'],
    totalAppearances: 7,
    isVerified: true,
    category: 'finance'
  },
  {
    id: '5',
    name: 'Charlie Davis',
    handle: '@charliedavis',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    bio: 'Charlie is a trading strategist with a deep understanding of market behavior and statistical analysis.',
    frequentShows: ['Animal Spirits', 'Odd Lots'],
    totalAppearances: 4,
    isVerified: false,
    category: 'finance'
  },
  {
    id: '6',
    name: 'Diana White',
    handle: '@dianawhite',
    imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop',
    bio: 'Diana is a financial advisor with a passion for empowering individuals to make informed investment decisions.',
    frequentShows: ['Invest Like the Best', 'Planet Money'],
    totalAppearances: 9,
    isVerified: true,
    category: 'finance'
  }
];

export function FollowingList({ onPodcastClick, onPersonClick, isPremium, onUpgrade, onChatClick, isLoggedIn, userImage, userName, onSignIn, onProfileClick, onSettingsClick, onHelpClick, onSignOut, followedShows = new Set(), followedPeople = new Set(), onToggleFollowShow, onToggleFollowPerson }: FollowingListProps) {
  const { currentFilter: filterTab, setFilter: setFilterTab } = useFilterState<FilterTab>('all');
  const { hoveredId: hoveredShowId, handleMouseEnter: handleShowMouseEnter, handleMouseLeave: handleShowMouseLeave } = useHoverState();
  const { hoveredId: hoveredPersonId, handleMouseEnter: handlePersonMouseEnter, handleMouseLeave: handlePersonMouseLeave } = useHoverState();

  // Filter to only show followed podcasts and people based on type
  const filteredPodcasts = filterTab === 'all' || filterTab === 'shows' 
    ? mockFollowingPodcasts.filter(podcast => followedShows.has(podcast.id)) 
    : [];
  const filteredPeople = filterTab === 'all' || filterTab === 'people' 
    ? mockFollowingPeople.filter(person => followedPeople.has(person.id)) 
    : [];

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-secondary rounded-full p-1 mb-7">
        <button
          onClick={() => setFilterTab('all')}
          className={`flex-1 px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
            filterTab === 'all'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background'
          }`}
        >
          {copy.following.filterAll}
        </button>
        <button
          onClick={() => setFilterTab('shows')}
          className={`flex-1 px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
            filterTab === 'shows'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background'
          }`}
        >
          {copy.following.filterShows}
        </button>
        <button
          onClick={() => setFilterTab('people')}
          className={`flex-1 px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
            filterTab === 'people'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background'
          }`}
        >
          {copy.following.filterPeople}
        </button>
      </div>

      {/* YouTube-style List */}
      {filteredPodcasts.length > 0 || filteredPeople.length > 0 ? (
        <div className="space-y-0">
          {/* Show List - Always show for any category */}
          {filteredPodcasts.map((podcast, index) => (
            <div key={podcast.id}>
              <div
                className="bg-card border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer"
                onClick={() => onPodcastClick?.(podcast.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Left: Large Circular Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={podcast.imageUrl}
                      alt={podcast.title}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>

                  {/* Middle: Channel Info */}
                  <div className="flex-1 min-w-0">
                    {/* Channel Name with Verification Badge */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {podcast.title}
                      </h3>
                      {podcast.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                      )}
                    </div>

                    {/* Handle and Subscriber Count */}
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
                      <span>{podcast.handle}</span>
                      <span>•</span>
                      <span>{podcast.subscriberCount}</span>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {podcast.description}
                    </p>
                  </div>

                  {/* Right: Following Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFollowShow?.(podcast.id);
                      }}
                      onMouseEnter={() => handleShowMouseEnter(podcast.id)}
                      onMouseLeave={() => handleShowMouseLeave()}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    >
                      <span className={`text-[11px] font-medium ${hoveredShowId === podcast.id ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                        {hoveredShowId === podcast.id ? copy.following.unfollow : copy.following.following}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t border-border/30 my-7" />
            </div>
          ))}

          {/* People List - Always show for any category */}
          {filteredPeople.map((person, index) => (
            <div key={person.id}>
              <div
                className="bg-card border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer"
                onClick={() => onPersonClick?.(person.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Left: Large Circular Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>

                  {/* Middle: Channel Info */}
                  <div className="flex-1 min-w-0">
                    {/* Channel Name with Verification Badge */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {person.name}
                      </h3>
                      {person.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                      )}
                    </div>

                    {/* Handle and Subscriber Count */}
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
                      <span>{person.handle}</span>
                      <span>•</span>
                      <span>{person.totalAppearances} appearances</span>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {person.bio}
                    </p>
                  </div>

                  {/* Right: Following Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFollowPerson?.(person.id);
                      }}
                      onMouseEnter={() => handlePersonMouseEnter(person.id)}
                      onMouseLeave={() => handlePersonMouseLeave()}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    >
                      <span className={`text-[11px] font-medium ${hoveredPersonId === person.id ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                        {hoveredPersonId === person.id ? copy.following.unfollow : copy.following.following}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {index < filteredPeople.length - 1 && <div className="border-t border-border/30 my-7" />}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <Podcast className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-300">
            {formatCopy(copy.following.emptyState.title, { type: filterTab })}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            {formatCopy(copy.following.emptyState.description, { type: filterTab })}
          </p>
        </div>
      )}

      {/* Separator before About section */}
      <div className="border-t border-border/30 my-7" />

      {/* Page Footer Info */}
      <div className="bg-muted/50 border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-2 items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold mb-1 text-foreground">{copy.following.aboutTitle}</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
              {copy.following.aboutDescription}
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">How to use:</span> {copy.following.aboutHowTo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}