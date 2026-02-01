import { ArrowLeft, TrendingUp } from 'lucide-react';

interface Podcast {
  id: string;
  title: string;
  host: string;
  imageUrl: string;
  episodeCount: number;
  description: string;
  category: string;
  views?: number;
  lastUpdated?: string;
}

interface TopShowsListProps {
  onBack: () => void;
  onPodcastClick?: (podcastId: string) => void;
}

const mockPodcasts: Podcast[] = [
  {
    id: '3',
    title: 'All-In Podcast',
    host: 'All-In',
    imageUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop',
    episodeCount: 142,
    description: 'Technology, business, and economics discussion',
    category: 'Technology',
    views: 456000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '6',
    title: 'Invest Like the Best',
    host: 'Patrick O\'Shaughnessy',
    imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop',
    episodeCount: 187,
    description: 'Conversations with the best investors and thinkers',
    category: 'Economics',
    views: 312000,
    lastUpdated: 'Updated monthly'
  },
  {
    id: '12',
    title: 'We Study Billionaires',
    host: 'The Investor\'s Podcast',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    episodeCount: 376,
    description: 'Learn from the world\'s best investors',
    category: 'Economics',
    views: 298000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '7',
    title: 'Masters in Business',
    host: 'Barry Ritholtz',
    imageUrl: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400&h=400&fit=crop',
    episodeCount: 412,
    description: 'Interviews with finance and investing leaders',
    category: 'Economics',
    views: 276000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '2',
    title: 'Planet Money',
    host: 'NPR',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    episodeCount: 892,
    description: 'The economy explained with stories and fun',
    category: 'Economics',
    views: 234000,
    lastUpdated: 'Updated daily'
  },
  {
    id: '11',
    title: 'Motley Fool Money',
    host: 'The Motley Fool',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    episodeCount: 521,
    description: 'Stock market news and investment advice',
    category: 'Economics',
    views: 203000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '8',
    title: 'The Indicator',
    host: 'NPR',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    episodeCount: 645,
    description: 'Quick economic news and insights',
    category: 'Economics',
    views: 189000,
    lastUpdated: 'Updated daily'
  },
  {
    id: '4',
    title: 'Odd Lots',
    host: 'Bloomberg',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    episodeCount: 328,
    description: 'Bloomberg\'s markets and finance podcast',
    category: 'Economics',
    views: 187000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '10',
    title: 'Capital Allocators',
    host: 'Ted Seides',
    imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop',
    episodeCount: 298,
    description: 'Institutional investing insights',
    category: 'Economics',
    views: 167000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '9',
    title: 'Rational Reminder',
    host: 'Cameron Passmore & Ben Felix',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    episodeCount: 234,
    description: 'Evidence-based investing and portfolio management',
    category: 'Economics',
    views: 145000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '1',
    title: 'The Compound and Friends',
    host: 'Josh Brown',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    episodeCount: 156,
    description: 'Financial markets, investing, and wealth management insights',
    category: 'Economics',
    views: 125000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '5',
    title: 'Animal Spirits',
    host: 'Michael Batnick & Ben Carlson',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    episodeCount: 245,
    description: 'Markets, life, and investing with Ben and Michael',
    category: 'Economics',
    views: 98000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '13',
    title: 'The Investor\'s Field Guide',
    host: 'Patrick O\'Shaughnessy',
    imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop',
    episodeCount: 89,
    description: 'Deep conversations with successful investors',
    category: 'Economics',
    views: 87000,
    lastUpdated: 'Updated monthly'
  },
  {
    id: '14',
    title: 'The Money Game',
    host: 'Bloomberg',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    episodeCount: 165,
    description: 'Stories about money and markets',
    category: 'Economics',
    views: 76000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '15',
    title: 'Macro Voices',
    host: 'Erik Townsend',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    episodeCount: 423,
    description: 'Institutional investing and macroeconomic analysis',
    category: 'Economics',
    views: 65000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '16',
    title: 'The Tim Ferriss Show',
    host: 'Tim Ferriss',
    imageUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop',
    episodeCount: 678,
    description: 'Deconstruct world-class performers',
    category: 'Business',
    views: 54000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '17',
    title: 'Exchanges at Goldman Sachs',
    host: 'Goldman Sachs',
    imageUrl: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400&h=400&fit=crop',
    episodeCount: 312,
    description: 'Insights from Goldman Sachs experts',
    category: 'Economics',
    views: 48000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '18',
    title: 'Real Vision Podcast',
    host: 'Real Vision',
    imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop',
    episodeCount: 289,
    description: 'Financial markets and macro investing',
    category: 'Economics',
    views: 42000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '19',
    title: 'The Prof G Pod',
    host: 'Scott Galloway',
    imageUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop',
    episodeCount: 198,
    description: 'Markets, tech, and big ideas',
    category: 'Business',
    views: 36000,
    lastUpdated: 'Updated weekly'
  },
  {
    id: '20',
    title: 'A16Z Podcast',
    host: 'Andreessen Horowitz',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    episodeCount: 567,
    description: 'Tech and the future',
    category: 'Technology',
    views: 32000,
    lastUpdated: 'Updated weekly'
  }
];

// Sort by views for Top 20
const topShows = [...mockPodcasts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 20);

export function TopShowsList({ onBack, onPodcastClick }: TopShowsListProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Discover</span>
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Top Shows</h1>
            <p className="text-sm text-muted-foreground">The 20 most popular financial podcasts</p>
          </div>
        </div>
      </div>

      {/* Grid of Shows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
        {topShows.map((podcast, index) => (
          <div
            key={podcast.id}
            onClick={() => onPodcastClick?.(podcast.id)}
            className="group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-md">
              <img
                src={podcast.imageUrl}
                alt={podcast.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Views Badge */}
              <div className="absolute bottom-2 right-2">
                <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="text-white text-xs font-semibold">
                    {podcast.views ? `${(podcast.views / 1000).toFixed(0)}K` : '0'}
                  </span>
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </div>

            {/* Info */}
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {podcast.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-1">
                {podcast.host}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {podcast.episodeCount} episodes
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/50 dark:border-indigo-900/30 rounded-xl p-6">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">About Top Shows</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These are the most popular financial podcasts on Simplicity, ranked by total views and listener engagement. Each show has been selected for its high-quality content, expert hosts, and valuable insights for investors and finance enthusiasts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}