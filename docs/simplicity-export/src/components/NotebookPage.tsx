import { BookMarked, FileDown, Mail, Download, ChevronRight, ChevronLeft, X, Check, BookOpen, Share2, Bookmark, Mic, User, Calendar, FileText, Search, Filter, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import { podcasts, episodes } from '../data/podcasts';
import { copy } from '../src/copy/en';

interface NoteItem {
  text: string;
  checked: boolean;
}

interface NoteCategory {
  title: string;
  items: NoteItem[];
}

interface EpisodeSummary {
  id: string;
  podcastId: string;
  podcastName: string;
  episodeTitle: string;
  date: string;
  noteCategories?: NoteCategory[];
  thumbnailUrl: string;
}

type TimeFilter = 'all' | 'today' | 'this-week' | 'this-month' | 'this-quarter' | 'this-year';

interface NotebookPageProps {
  isPremium: boolean;
  onUpgrade: () => void;
  onChatClick: () => void;
  isLoggedIn: boolean;
  userImage?: string;
  userName: string;
  onSignIn: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
  onSignOut: () => void;
  onEpisodeClick?: (podcastId: string, episodeId: string) => void;
}

const mockSummaries: EpisodeSummary[] = [
  {
    id: episodes[0].id,
    podcastId: episodes[0].podcastId,
    podcastName: podcasts.find(p => p.id === episodes[0].podcastId)?.title || '',
    episodeTitle: episodes[0].title,
    date: episodes[0].date,
    noteCategories: [
      {
        title: 'GEO-POLITICS',
        items: [
          { text: 'Discussion on how US-China trade relations are affecting tech stock valuations and supply chain dynamics', checked: true },
          { text: 'Coverage of emerging market opportunities in Southeast Asia amid shifting global manufacturing', checked: false }
        ]
      },
      {
        title: 'ECONOMY',
        items: [
          { text: 'Federal Reserve expected to maintain current rates through Q1 2026 despite persistent inflation signals', checked: true },
          { text: 'Consumer spending patterns indicate shift toward value-oriented purchases as credit card debt reaches new highs', checked: true }
        ]
      },
      {
        title: 'MARKETS',
        items: [
          { text: 'S&P 500 trading at 21x forward earnings, above historical average, suggesting limited upside without earnings growth', checked: true }
        ]
      }
    ],
    thumbnailUrl: podcasts.find(p => p.id === episodes[0].podcastId)?.imageUrl || ''
  },
  {
    id: episodes[1].id,
    podcastId: episodes[1].podcastId,
    podcastName: podcasts.find(p => p.id === episodes[1].podcastId)?.title || '',
    episodeTitle: episodes[1].title,
    date: episodes[1].date,
    noteCategories: [
      {
        title: 'Technology Trends',
        items: [
          { text: 'AI infrastructure (NVIDIA, AMD) clearer profitability', checked: true },
          { text: 'Picks and shovels strategy remains valid', checked: true },
          { text: 'Research energy infrastructure bottlenecks', checked: false }
        ]
      }
    ],
    thumbnailUrl: podcasts.find(p => p.id === episodes[1].podcastId)?.imageUrl || ''
  },
  {
    id: episodes[3].id,
    podcastId: episodes[3].podcastId,
    podcastName: podcasts.find(p => p.id === episodes[3].podcastId)?.title || '',
    episodeTitle: episodes[3].title,
    date: episodes[3].date,
    noteCategories: [
      {
        title: 'Agricultural Impact',
        items: [
          { text: 'Bird flu wiped out 58M birds creating supply constraints', checked: true },
          { text: 'Egg industry highly consolidated', checked: true },
          { text: 'Monitor agricultural commodity trends', checked: false }
        ]
      }
    ],
    thumbnailUrl: podcasts.find(p => p.id === episodes[3].podcastId)?.imageUrl || ''
  },
  {
    id: episodes[4].id,
    podcastId: episodes[4].podcastId,
    podcastName: podcasts.find(p => p.id === episodes[4].podcastId)?.title || '',
    episodeTitle: episodes[4].title,
    date: episodes[4].date,
    noteCategories: [
      {
        title: 'AI and Innovation',
        items: [
          { text: 'AI deflationary long-term but requires upfront capital', checked: true },
          { text: 'Regulatory capture biggest risk to innovation', checked: true },
          { text: 'Follow differentiated AI companies vs commodity providers', checked: false }
        ]
      }
    ],
    thumbnailUrl: podcasts.find(p => p.id === episodes[4].podcastId)?.imageUrl || ''
  },
  {
    id: episodes[2].id,
    podcastId: episodes[2].podcastId,
    podcastName: podcasts.find(p => p.id === episodes[2].podcastId)?.title || '',
    episodeTitle: episodes[2].title,
    date: episodes[2].date,
    noteCategories: [
      {
        title: 'Portfolio Diversification',
        items: [
          { text: 'Bond-stock correlations broken down', checked: true },
          { text: 'Add commodities and real estate for diversification', checked: true },
          { text: 'Review asset allocation strategy', checked: false }
        ]
      }
    ],
    thumbnailUrl: podcasts.find(p => p.id === episodes[2].podcastId)?.imageUrl || ''
  },
  {
    id: episodes[5]?.id || 'e6',
    podcastId: episodes[5]?.podcastId || '4',
    podcastName: podcasts.find(p => p.id === (episodes[5]?.podcastId || '4'))?.title || 'All-In Podcast',
    episodeTitle: episodes[5]?.title || 'Tech Trends and Market Analysis',
    date: episodes[5]?.date || '2025-12-20',
    noteCategories: [
      {
        title: 'Tech Sector Analysis',
        items: [
          { text: 'Silicon Valley talent concentration advantage', checked: true },
          { text: 'Tech sector volatility presents opportunities', checked: true },
          { text: 'Deep dive into emerging tech sectors', checked: false }
        ]
      }
    ],
    thumbnailUrl: podcasts.find(p => p.id === (episodes[5]?.podcastId || '4'))?.imageUrl || ''
  }
];

export function NotebookPage({ 
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
  onEpisodeClick
}: NotebookPageProps) {
  const [summaries, setSummaries] = useState<EpisodeSummary[]>(mockSummaries);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'main' | 'all-summaries'>('main');

  // Scroll handlers for Recent Summaries
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Format date to match Discover Shows style (e.g., "2d", "5d", "15 Jan")
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}-${day}-${year}`;
  };

  // Get filter display label
  const getFilterLabel = () => {
    switch (timeFilter) {
      case 'all': return copy.notebook.filterAll;
      case 'today': return copy.notebook.filterToday;
      case 'this-week': return copy.notebook.filterThisWeek;
      case 'this-month': return copy.notebook.filterThisMonth;
      case 'this-quarter': return copy.notebook.filterThisQuarter;
      case 'this-year': return copy.notebook.filterThisYear;
      default: return copy.notebook.filterAll;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto relative">
      {/* Conditional Content based on current view */}
      {currentView === 'main' && (
        <>
          {/* Search and Filter Controls */}
          <div className="flex items-center gap-3 mb-7">
            {/* Search Bar - Always visible, extends to the right */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
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

              {/* Filter Dropdown Menu */}
              {showFilterDropdown && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowFilterDropdown(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/50 rounded-xl shadow-lg z-20 overflow-hidden">
                    <div className="p-2 space-y-0.5">
                      {/* All option */}
                      <button
                        onClick={() => {
                          setTimeFilter('all');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'all'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterAll}
                      </button>
                      
                      {/* Separator */}
                      <div className="border-t border-border/30 my-1" />
                      
                      {/* Today option */}
                      <button
                        onClick={() => {
                          setTimeFilter('today');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'today'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterToday}
                      </button>
                      
                      {/* This Week option */}
                      <button
                        onClick={() => {
                          setTimeFilter('this-week');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'this-week'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterThisWeek}
                      </button>
                      
                      {/* This Month option */}
                      <button
                        onClick={() => {
                          setTimeFilter('this-month');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'this-month'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterThisMonth}
                      </button>
                      
                      {/* This Quarter option */}
                      <button
                        onClick={() => {
                          setTimeFilter('this-quarter');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'this-quarter'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterThisQuarter}
                      </button>
                      
                      {/* This Year option */}
                      <button
                        onClick={() => {
                          setTimeFilter('this-year');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'this-year'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterThisYear}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recent Summaries Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={() => setCurrentView('all-summaries')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border shadow-sm rounded-lg text-[11px] font-medium text-foreground hover:bg-muted/50 transition-all"
              >
                <span>Recent Summaries</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              
              {/* Scroll Navigation */}
              <div className="flex items-center bg-card border border-border/50 shadow-sm rounded-lg overflow-hidden">
                <button
                  onClick={scrollLeft}
                  className="w-7 h-7 hover:bg-muted/60 transition-colors flex items-center justify-center"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
                </button>
                <div className="w-px h-4 bg-border/40" />
                <button
                  onClick={scrollRight}
                  className="w-7 h-7 hover:bg-muted/60 transition-colors flex items-center justify-center"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-foreground" />
                </button>
              </div>
            </div>
            
            {/* Horizontal Scrollable Container */}
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto hide-scrollbar -mx-1 px-1"
            >
              <div className="flex gap-3 pb-2">
                {mockSummaries.map((episode) => {
                  // Get podcast host for this episode
                  const podcast = podcasts.find(p => p.id === episode.podcastId);
                  const host = podcast?.host || '';
                  
                  return (
                  <div
                    key={episode.id}
                    className="flex-shrink-0 w-40 group"
                  >
                    {/* Card */}
                    <div className="bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all overflow-hidden">
                      {/* Thumbnail - Small */}
                      <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden flex-shrink-0">
                        <img 
                          src={episode.thumbnailUrl} 
                          alt={episode.podcastName}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-2">
                        {/* Title with Icon */}
                        <div className="mb-1.5 pb-1.5 border-b border-border/30">
                          <button
                            onClick={() => onEpisodeClick?.(episode.podcastId, episode.id)}
                            className="w-full text-left flex items-start gap-1"
                          >
                            <FileText className="w-[10px] h-[10px] text-foreground flex-shrink-0 mt-0.5" />
                            <h3 className="text-[10px] font-semibold text-foreground line-clamp-2 leading-tight flex-1">
                              {episode.episodeTitle}
                            </h3>
                          </button>
                        </div>
                        
                        {/* Metadata Stack */}
                        <div className="flex flex-col gap-0.5">
                          {/* Show */}
                          <div className="flex items-center gap-1">
                            <Mic className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-[9px] text-muted-foreground truncate">
                              {episode.podcastName}
                            </span>
                          </div>
                          
                          {/* Host/Guest */}
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-[9px] text-muted-foreground truncate">
                              {host}
                            </span>
                          </div>
                          
                          {/* Date */}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-[9px] text-muted-foreground">
                              {formatDateForDisplay(episode.date)}
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
          </div>

          {/* Separator after Recent Summaries */}
          <div className="border-t border-border/30 my-7" />

          {/* Notes List */}
          {summaries.length === 0 ? (
            <div className="text-center py-12">
              <BookMarked className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-xs text-muted-foreground mb-1">No saved notes yet</p>
              <p className="text-[10px] text-muted-foreground">
                Your notes from episode summaries will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {summaries.map((summary, index) => (
                <div key={summary.id}>
                  <div
                    className="relative bg-card border border-border/40 rounded-2xl p-4 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all group overflow-hidden"
                  >
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0)',
                      backgroundSize: '24px 24px'
                    }} />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title & Action Buttons Row */}
                        <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/30">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="w-[13px] h-[13px] text-foreground flex-shrink-0" />
                            <button
                              onClick={() => onEpisodeClick?.(summary.podcastId, summary.id)}
                              className="text-left flex-1 min-w-0"
                            >
                              <h3 className="text-xs font-semibold text-foreground line-clamp-2">
                                {summary.episodeTitle}
                              </h3>
                            </button>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              className="p-1.5 rounded-lg hover:bg-muted transition-all"
                              title="Share note"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle share
                              }}
                            >
                              <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-muted transition-all"
                              title="Download note"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle download
                              }}
                            >
                              <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Note Content - Clickable Area */}
                        <button
                          onClick={() => onEpisodeClick?.(summary.podcastId, summary.id)}
                          className="text-left w-full"
                        >
                          {/* Metadata Horizontal Row */}
                          <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-border/30 text-[10px] text-muted-foreground">
                            {/* Show */}
                            <div className="flex items-center gap-1.5">
                              <Mic className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                {summary.podcastName}
                              </span>
                            </div>
                            
                            {/* Vertical Separator */}
                            <div className="h-4 w-px bg-border/60 flex-shrink-0" />
                            
                            {/* Guest */}
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                {podcasts.find(p => p.id === summary.podcastId)?.host || 'Host'}
                              </span>
                            </div>
                            
                            {/* Vertical Separator */}
                            <div className="h-4 w-px bg-border/60 flex-shrink-0" />
                            
                            {/* Date */}
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="whitespace-nowrap">
                                {summary.date}
                              </span>
                            </div>
                          </div>
                          
                          {/* Note Categories */}
                          {summary.noteCategories && (
                            <div className="space-y-1.5">
                              {summary.noteCategories.map((category, categoryIndex) => (
                                <div key={categoryIndex}>
                                  <div className="space-y-1.5">
                                    <h4 className="text-[10px] font-semibold text-foreground leading-relaxed">
                                      {category.title}
                                    </h4>
                                    {category.items.map((item, itemIndex) => (
                                      <div key={itemIndex} className="flex items-start gap-2">
                                        {/* Checkbox styled like summary modal */}
                                        <div className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                                          item.checked 
                                            ? 'bg-gray-600 dark:bg-gray-500 border-gray-600 dark:border-gray-500' 
                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                        }`}>
                                          {item.checked && (
                                            <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                                          )}
                                        </div>
                                        <p className="text-[11px] text-foreground leading-relaxed flex-1">
                                          {item.text}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {/* Separator between categories */}
                                  {categoryIndex < summary.noteCategories.length - 1 && (
                                    <div className="border-t border-border/30 my-2.5" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Separator between notes */}
                  {index < summaries.length - 1 && (
                    <div className="border-t border-border/30 my-7" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Separator before About section */}
          <div className="border-t border-border/30 my-7" />

          {/* Page Footer Info */}
          <div className="bg-muted/50 border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex gap-2 items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT NOTEBOOK</h2>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
                  Your Notebook is your personal collection of insights and key takeaways saved from podcast summaries. Each note preserves the important points you've bookmarked, organized by category for easy reference.
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">How to use:</span> Filter notes by time period using the tabs above, browse recent summaries in the horizontal carousel, or scroll through your saved notes below. Click any note card to revisit the full episode summary. Use the download button to export notes as PDF or email them to yourself.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* All Summaries View */}
      {currentView === 'all-summaries' && (
        <div className="mb-7">
          {/* Search and Filter Controls */}
          <div className="flex items-center gap-3 mb-7">
            {/* Search Bar - Always visible, extends to the right */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search summaries..."
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

              {/* Filter Dropdown Menu */}
              {showFilterDropdown && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowFilterDropdown(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/50 rounded-xl shadow-lg z-20 overflow-hidden">
                    <div className="p-2 space-y-0.5">
                      {/* All option */}
                      <button
                        onClick={() => {
                          setTimeFilter('all');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'all'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterAll}
                      </button>
                      
                      {/* Separator */}
                      <div className="border-t border-border/30 my-1" />
                      
                      {/* Today option */}
                      <button
                        onClick={() => {
                          setTimeFilter('today');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'today'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterToday}
                      </button>
                      
                      {/* This Week option */}
                      <button
                        onClick={() => {
                          setTimeFilter('this-week');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'this-week'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterThisWeek}
                      </button>
                      
                      {/* This Month option */}
                      <button
                        onClick={() => {
                          setTimeFilter('this-month');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'this-month'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterThisMonth}
                      </button>
                      
                      {/* This Quarter option */}
                      <button
                        onClick={() => {
                          setTimeFilter('this-quarter');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'this-quarter'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterThisQuarter}
                      </button>
                      
                      {/* This Year option */}
                      <button
                        onClick={() => {
                          setTimeFilter('this-year');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          timeFilter === 'this-year'
                            ? 'bg-muted text-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {copy.notebook.filterThisYear}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center gap-1.5 px-3 py-1.5 mb-3 bg-card border border-border shadow-sm rounded-lg text-[11px] font-medium text-foreground hover:bg-muted/50 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Recent Summaries</span>
          </button>

          {/* Grid of all summaries */}
          <div className="space-y-5">
            {Array.from({ length: Math.ceil(mockSummaries.length / 3) }).map((_, rowIndex) => (
              <div key={rowIndex}>
                <div className="flex justify-between">
                  {mockSummaries.slice(rowIndex * 3, (rowIndex + 1) * 3).map((episode) => {
                    const podcast = podcasts.find(p => p.id === episode.podcastId);
                    const host = podcast?.host || '';
                    
                    return (
                      <div
                        key={episode.id}
                        onClick={() => {
                          onEpisodeClick?.(episode.podcastId, episode.id);
                          setCurrentView('main');
                        }}
                        className="group cursor-pointer flex-shrink-0 w-40"
                      >
                        {/* Card */}
                        <div className="bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all overflow-hidden">
                          {/* Thumbnail */}
                          <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                            <img
                              src={episode.thumbnailUrl}
                              alt={episode.episodeTitle}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-2.5">
                            {/* Title with Icon */}
                            <div className="mb-2">
                              <div className="flex items-start gap-1">
                                <FileText className="w-[11px] h-[11px] text-foreground flex-shrink-0 mt-0.5" />
                                <h3 className="text-[11px] font-semibold text-foreground line-clamp-2 leading-tight flex-1">
                                  {episode.episodeTitle}
                                </h3>
                              </div>
                            </div>
                            
                            {/* Metadata Stack */}
                            <div className="flex flex-col gap-1">
                              {/* Show */}
                              <div className="flex items-center gap-1.5">
                                <Mic className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-[10px] text-muted-foreground truncate">
                                  {episode.podcastName}
                                </span>
                              </div>
                              
                              {/* Host/Guest */}
                              <div className="flex items-center gap-1.5">
                                <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-[10px] text-muted-foreground truncate">
                                  {host}
                                </span>
                              </div>
                              
                              {/* Date */}
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-[10px] text-muted-foreground">
                                  {formatDateForDisplay(episode.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}</div>
                
                {/* Separator between rows (except after last row) */}
                {rowIndex < Math.ceil(mockSummaries.length / 3) - 1 && (
                  <div className="border-t border-border/30 mt-5" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}