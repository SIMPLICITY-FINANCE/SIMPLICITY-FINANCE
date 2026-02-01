import { ArrowLeft, Sparkles } from 'lucide-react';

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
  isNew?: boolean;
}

interface NewShowsListProps {
  onBack: () => void;
  onPodcastClick?: (podcastId: string) => void;
}

const mockNewPodcasts: Podcast[] = [
  {
    id: '20',
    title: 'A16Z Podcast',
    host: 'Andreessen Horowitz',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    episodeCount: 567,
    description: 'Tech and the future',
    category: 'Technology',
    views: 32000,
    lastUpdated: 'Added 2 days ago',
    isNew: true
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
    lastUpdated: 'Added 5 days ago',
    isNew: true
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
    lastUpdated: 'Added 1 week ago',
    isNew: true
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
    lastUpdated: 'Added 1 week ago',
    isNew: true
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
    lastUpdated: 'Added 2 weeks ago',
    isNew: true
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
    lastUpdated: 'Added 2 weeks ago',
    isNew: true
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
    lastUpdated: 'Added 3 weeks ago',
    isNew: true
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
    lastUpdated: 'Added 3 weeks ago',
    isNew: true
  },
  {
    id: '21',
    title: 'The Breakdown',
    host: 'Nathaniel Whittemore',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    episodeCount: 234,
    description: 'Daily crypto news and analysis',
    category: 'Cryptocurrency',
    views: 28000,
    lastUpdated: 'Added 4 weeks ago',
    isNew: true
  },
  {
    id: '22',
    title: 'Bankless',
    host: 'Ryan Sean Adams & David Hoffman',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    episodeCount: 312,
    description: 'Guide to crypto finance',
    category: 'Cryptocurrency',
    views: 45000,
    lastUpdated: 'Added 1 month ago',
    isNew: true
  },
  {
    id: '23',
    title: 'The Pomp Podcast',
    host: 'Anthony Pompliano',
    imageUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop',
    episodeCount: 567,
    description: 'Bitcoin and business insights',
    category: 'Cryptocurrency',
    views: 67000,
    lastUpdated: 'Added 1 month ago',
    isNew: true
  },
  {
    id: '24',
    title: 'The Scoop',
    host: 'The Block',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    episodeCount: 189,
    description: 'Inside the crypto industry',
    category: 'Cryptocurrency',
    views: 39000,
    lastUpdated: 'Added 1 month ago',
    isNew: true
  },
  {
    id: '25',
    title: 'What Goes Up',
    host: 'Bloomberg',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    episodeCount: 145,
    description: 'Markets, finance, and business stories',
    category: 'Economics',
    views: 52000,
    lastUpdated: 'Added 1 month ago',
    isNew: true
  },
  {
    id: '26',
    title: 'Capital Gains',
    host: 'Colby Smith',
    imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop',
    episodeCount: 98,
    description: 'Weekly markets podcast',
    category: 'Economics',
    views: 41000,
    lastUpdated: 'Added 2 months ago',
    isNew: true
  },
  {
    id: '27',
    title: 'The Forward Guidance',
    host: 'Bloomberg',
    imageUrl: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400&h=400&fit=crop',
    episodeCount: 112,
    description: 'Central banking and economics',
    category: 'Economics',
    views: 34000,
    lastUpdated: 'Added 2 months ago',
    isNew: true
  },
  {
    id: '28',
    title: 'Grant\'s Current Yield',
    host: 'Grant\'s Interest Rate Observer',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    episodeCount: 87,
    description: 'Fixed income and credit markets',
    category: 'Economics',
    views: 29000,
    lastUpdated: 'Added 2 months ago',
    isNew: true
  },
  {
    id: '29',
    title: 'The Riff',
    host: 'Preet Bharara',
    imageUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop',
    episodeCount: 156,
    description: 'Politics, law, and policy',
    category: 'Politics',
    views: 55000,
    lastUpdated: 'Added 2 months ago',
    isNew: true
  },
  {
    id: '30',
    title: 'FT News Briefing',
    host: 'Financial Times',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    episodeCount: 423,
    description: 'Daily global business news',
    category: 'News',
    views: 78000,
    lastUpdated: 'Added 3 months ago',
    isNew: true
  },
  {
    id: '31',
    title: 'Behind the Money',
    host: 'Financial Times',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    episodeCount: 134,
    description: 'Stories of business and finance',
    category: 'Economics',
    views: 46000,
    lastUpdated: 'Added 3 months ago',
    isNew: true
  },
  {
    id: '32',
    title: 'The Money Maze',
    host: 'Simon Brewer',
    imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop',
    episodeCount: 67,
    description: 'Navigating financial markets',
    category: 'Economics',
    views: 38000,
    lastUpdated: 'Added 3 months ago',
    isNew: true
  }
];

export function NewShowsList({ onBack, onPodcastClick }: NewShowsListProps) {
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">New Shows</h1>
            <p className="text-sm text-muted-foreground">Recently added podcasts to Simplicity</p>
          </div>
        </div>
      </div>

      {/* Grid of Shows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
        {mockNewPodcasts.map((podcast) => (
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
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {podcast.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-1">
                {podcast.host}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                {podcast.lastUpdated}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="bg-muted/50 border border-border/50 rounded-xl p-3 mt-8 shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-2 items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT NEW SHOWS</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Explore the latest podcasts added to Simplicity. These shows cover a wide range of financial topics including markets, investing, cryptocurrency, economics, and business. Check back regularly to discover fresh content and new perspectives from top hosts and experts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}