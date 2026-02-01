import { X, Calendar, Download, ExternalLink, Bookmark, Share2, Quote, Globe, TrendingUp, DollarSign, Target, Clock, User, Link as LinkIcon, ChevronDown, ChevronUp, Mic, FileText, AlertTriangle, Youtube, Twitter, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { copy } from '../src/copy/en';

interface EpisodeSummaryModalProps {
  podcastId: string;
  episodeId: string;
  onClose: () => void;
}

interface QuoteItem {
  text: string;
  speaker: string;
}

interface Chapter {
  timestamp: string;
  title: string;
  bulletPoints: string[];
}

interface PersonLinks {
  name: string;
  role: string;
  links: Array<{ platform: string; url: string }>;
}

interface EpisodeSummaryData {
  title: string;
  podcastTitle: string;
  host: string;
  guest: string;
  publishedDate: string;
  coverUrl: string;
  
  // Executive Summary
  executiveSummary: string;
  
  // Quotes Section
  quotes: QuoteItem[];
  
  // Summary Section (4 categories with bullet points)
  summary: {
    geoPolitics: string[];
    technology: string[];
    economy: string[];
    markets: string[];
    forecasts: string[];
    targets: string[];
  };
  
  // Chapters Section
  chapters: Chapter[];
  
  // Links and References
  hostLinks: PersonLinks;
  guestLinks: PersonLinks;
  
  // Watch Full Episode
  youtubeVideoId: string;
  transcriptUrl: string;
}

// Mock summary data
const mockSummaryData: Record<string, EpisodeSummaryData> = {
  'e1': {
    title: 'Market Outlook for Q1 2026: What Investors Need to Know',
    podcastTitle: 'The Compound and Friends',
    host: 'Josh Brown',
    guest: 'Barry Ritholtz',
    publishedDate: 'January 9, 2026',
    coverUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    
    // Executive Summary
    executiveSummary: "In this episode, Barry Ritholtz and Josh Brown discuss the market outlook for Q1 2026, focusing on key factors such as Federal Reserve policy, sector rotation, geopolitical risks, and fixed income opportunities. They provide insights into the current market environment, potential investment strategies, and the importance of maintaining a diversified portfolio.",
    
    quotes: [
      {
        text: "The market doesn't care about your feelings, but it does care about earnings growth. Right now, we're at a valuation level that demands perfection.",
        speaker: 'Barry Ritholtz',
      },
      {
        text: "If you're not thinking about international diversification in 2026, you're leaving money on the table. U.S. exceptionalism can't last forever.",
        speaker: 'Barry Ritholtz',
      },
      {
        text: "The Fed is in a pickle - inflation is sticky, but the labor market is cooling. They're going to stay patient, which means higher for longer is the base case.",
        speaker: 'Barry Ritholtz',
      },
    ],
    
    summary: {
      geoPolitics: [
        'Discussion on how US-China trade relations are affecting tech stock valuations and supply chain dynamics',
        'Analysis of European central bank policy divergence and its impact on currency markets',
        'Coverage of emerging market opportunities in Southeast Asia amid shifting global manufacturing',
        'Middle East tensions continue to create volatility in energy markets with implications for inflation',
      ],
      technology: [
        'Impact of AI and automation on job markets and productivity gains',
        'Emerging technologies in healthcare and their potential to transform the industry',
        'Cybersecurity challenges and the need for robust data protection measures',
        'Blockchain technology and its applications in finance and supply chain management',
      ],
      economy: [
        'Federal Reserve expected to maintain current rates through Q1 2026 despite persistent inflation signals',
        'Labor market showing signs of cooling with unemployment ticking up to 4.2%, but wage growth remains sticky at 4.5%',
        'Consumer spending patterns indicate shift toward value-oriented purchases as credit card debt reaches new highs',
        'Housing market stabilization with inventory improving but affordability challenges persist in major metros',
        'Corporate profit margins under pressure from wage costs, but productivity gains from technology providing some offset',
      ],
      markets: [
        'S&P 500 trading at 21x forward earnings, above historical average, suggesting limited upside without earnings growth',
        'Tech sector concentration risk highlighted - top 7 stocks represent 30% of index weight',
        'Opportunities emerging in mid-cap value stocks and international developed markets trading at discounts',
        'Fixed income showing attractive yields with 10-year Treasury at 4.3% and investment-grade corporates at 5.1%',
        'Commodities outlook: energy sector facing headwinds while precious metals showing strength amid uncertainty',
        'Small-cap stocks trading at widest discount to large-caps in over a decade, presenting potential value opportunity',
      ],
      forecasts: [
        'S&P 500 expected to deliver 6-8% total returns in 2026, below historical averages but positive nonetheless',
        'First Fed rate cut not likely until Q3 2026, assuming inflation continues to moderate gradually',
        'International stocks, particularly Europe and Japan, projected to outperform U.S. equities on valuation basis',
        'Corporate earnings growth forecast at 8-10% for 2026, driven by continued economic expansion and margin improvement',
        'U.S. dollar expected to weaken modestly against major currencies as rate differentials narrow',
      ],
      targets: [
        'Targeting a 60/40 portfolio allocation between equities and fixed income',
        'Setting a 10% annual return target for the portfolio over the next 5 years',
        'Aiming for a 3% dividend yield from fixed income investments',
        'Striving for a 5% annual growth rate in real estate investments',
      ],
    },
    
    chapters: [
      {
        timestamp: '0:00',
        title: 'Introduction and Market Overview',
        bulletPoints: [
          'Josh opens discussing current market environment entering Q1 2026',
          'S&P 500 recovery from last year\'s volatility but increased sector dispersion',
          'Concentration in mega-cap tech stocks remains a concern with "Magnificent 7" driving returns',
          'Importance of looking beyond index-level performance to understand underlying dynamics',
        ],
      },
      {
        timestamp: '8:45',
        title: 'Federal Reserve Policy and Interest Rates',
        bulletPoints: [
          'Fed taking patient approach despite inflation running above 2% target at 2.8%',
          'Central bank particularly focused on labor market data showing some cooling',
          'Rates likely to remain steady through Q1 with first potential cut in Q2 or Q3',
          'Important implications for both equity valuations and fixed income positioning',
        ],
      },
      {
        timestamp: '22:15',
        title: 'Sector Rotation and Investment Opportunities',
        bulletPoints: [
          'Shift away from growth-at-any-price momentum toward quality companies with strong cash flows',
          'Bullish on financials benefiting from higher-for-longer rate environment',
          'Select industrials tied to infrastructure spending showing promise',
          'Energy faces headwinds from oversupply concerns',
          'Healthcare offers defensive characteristics with reasonable valuations',
          'Emphasis on active management rather than passive index exposure',
        ],
      },
      {
        timestamp: '35:30',
        title: 'Geopolitical Risks and Global Markets',
        bulletPoints: [
          'US-China relationship showing more stability than in previous years despite ongoing tensions',
          'European markets trading at significant discounts to US equities with solid fundamentals',
          'Emerging markets in Southeast Asia attracting attention as manufacturing diversifies',
          'Warning to maintain geographic diversification rather than assuming US outperformance continues',
        ],
      },
      {
        timestamp: '48:00',
        title: 'Fixed Income and Alternative Investments',
        bulletPoints: [
          'Compelling case for fixed income with bonds offering genuinely attractive risk-adjusted returns',
          'Investment-grade corporate bonds yielding over 5% with Treasuries providing real yields',
          'Discussion of REITs that have been beaten down but may offer value',
          'Role of commodities as an inflation hedge explored',
          'Key message: 60/40 portfolio might actually make sense again',
        ],
      },
      {
        timestamp: '59:20',
        title: 'Investor Behavior and Portfolio Positioning',
        bulletPoints: [
          'Warning against chasing last year\'s winners and importance of rebalancing',
          'Specific advice: maintain diversification and don\'t try to time the market',
          'Focus on total return rather than just price appreciation',
          'Ensure allocation matches risk tolerance and time horizon',
          'Reminder that boring often beats exciting in investing',
          'Consistency and discipline are real keys to long-term wealth building',
        ],
      },
    ],
    
    hostLinks: {
      name: 'Josh Brown',
      role: 'Host & CEO of Ritholtz Wealth Management',
      links: [
        { platform: 'Twitter/X', url: 'https://twitter.com/reformedbroker' },
        { platform: 'YouTube', url: 'https://youtube.com/@thereformedbroker' },
        { platform: 'Substack', url: 'https://thereformedbroker.substack.com' },
        { platform: 'Website', url: 'https://ritholtzwealth.com' },
      ],
    },
    
    guestLinks: {
      name: 'Barry Ritholtz',
      role: 'Guest & Chairman of Ritholtz Wealth Management',
      links: [
        { platform: 'Twitter/X', url: 'https://twitter.com/ritholtz' },
        { platform: 'YouTube', url: 'https://youtube.com/@barryritholtz' },
        { platform: 'Substack', url: 'https://ritholtz.substack.com' },
        { platform: 'Website', url: 'https://ritholtz.com' },
      ],
    },
    
    youtubeVideoId: 'dQw4w9WgXcQ',
    transcriptUrl: '#',
  },
};

export function EpisodeSummaryModal({ podcastId, episodeId, onClose }: EpisodeSummaryModalProps) {
  const episode = mockSummaryData[episodeId];
  const [executiveSummaryExpanded, setExecutiveSummaryExpanded] = useState(true);
  const [quotesExpanded, setQuotesExpanded] = useState(true);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [chaptersExpanded, setChaptersExpanded] = useState(true);
  const [linksExpanded, setLinksExpanded] = useState(true);
  const [videoExpanded, setVideoExpanded] = useState(true);
  
  // Track saved items (quotes and bullet points)
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const toggleSaveItem = (itemId: string) => {
    setSavedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
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

  if (!episode) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Container - Aligned with sidebars */}
      <div 
        className="relative bg-background dark:bg-background rounded-xl shadow-sm overflow-hidden border border-border"
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
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-secondary hover:bg-muted transition-all"
          aria-label={copy.actions.close}
        >
          <X className="w-3.5 h-3.5 text-foreground" />
        </button>

        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto p-4 md:p-5">
          {/* Episode Header */}
          <div className="mb-5">
            {/* Title Row with Thumbnail & Actions */}
            <div className="flex gap-2 items-center mb-3 pb-3 border-b border-border/30">
              {/* Summary Icon */}
              <div className="flex-shrink-0">
                <FileText className="w-[14px] h-[14px] text-foreground" />
              </div>

              {/* Title */}
              <h1 className="flex-1 text-sm font-semibold leading-snug text-foreground">
                {episode.title}
              </h1>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  className="p-2 rounded-lg hover:bg-muted transition-all"
                  title={copy.actions.save}
                  aria-label={copy.actions.save}
                >
                  <Bookmark className="w-4 h-4 text-foreground" />
                </button>

                <button
                  className="p-2 rounded-lg hover:bg-muted transition-all"
                  title={copy.actions.share}
                  aria-label={copy.actions.share}
                >
                  <Share2 className="w-4 h-4 text-foreground" />
                </button>

                <button
                  className="p-2 rounded-lg hover:bg-muted transition-all"
                  title={copy.actions.download}
                  aria-label={copy.actions.download}
                >
                  <Download className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>

            {/* Two Column Layout: Metadata + Executive Summary */}
            <div className="flex gap-6">
              {/* Left Column: Metadata Stack (aligned with thumbnail) */}
              <div className="flex flex-col gap-1.5 flex-shrink-0" style={{ width: '280px' }}>
                {/* Show/Host */}
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Mic className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{episode.podcastTitle}</span>
                </div>
                
                {/* Guest */}
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{episode.host} & {episode.guest}</span>
                </div>
                
                {/* Date */}
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    {(() => {
                      const date = new Date(episode.publishedDate);
                      if (isNaN(date.getTime())) return episode.publishedDate;
                      
                      const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
                      const day = date.getDate();
                      const month = date.toLocaleDateString('en-US', { month: 'long' });
                      const year = date.getFullYear();
                      
                      const getOrdinal = (n: number) => {
                        const s = ['th', 'st', 'nd', 'rd'];
                        const v = n % 100;
                        return n + (s[(v - 20) % 10] || s[v] || s[0]);
                      };
                      
                      return `${weekday}, ${getOrdinal(day)} of ${month}, ${year}`;
                    })()}
                  </span>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="w-px bg-border/30 flex-shrink-0" />

              {/* Right Column: Executive Summary */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {episode.executiveSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border/30 my-7" />

          {/* Quotes Section */}
          {episode.quotes.length > 0 && (
            <>
              <div className="mb-6">
                <button
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 mb-2 rounded-lg bg-muted/30 border border-border/40 shadow-sm hover:bg-muted/50 hover:shadow-md transition-all"
                  onClick={() => setQuotesExpanded(!quotesExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded bg-card border border-border/50 flex items-center justify-center">
                      <Quote className="w-3 h-3 text-foreground" />
                    </div>
                    <h2 className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Key Quotes</h2>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${quotesExpanded ? 'rotate-180' : ''}`} />
                </button>
                {quotesExpanded && (
                  <div className="space-y-2.5 mt-3">
                    {episode.quotes.map((quote, index) => {
                      const quoteId = `quote-${index}`;
                      const isSaved = savedItems.has(quoteId);
                      
                      return (
                        <div key={index} className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => toggleSaveItem(quoteId)}
                              className="flex-shrink-0 mt-0.5 transition-colors"
                              aria-label={isSaved ? "Remove from notes" : "Save to notes"}
                            >
                              <div className={`w-4 h-4 rounded border transition-all ${
                                isSaved 
                                  ? 'bg-muted-foreground border-muted-foreground' 
                                  : 'border-border hover:border-muted-foreground'
                              }`}>
                                {isSaved && (
                                  <svg className="w-4 h-4 text-background" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            </button>
                            <div className="flex-1 pl-3 border-l-2 border-border/50">
                              <p className="text-[11px] leading-relaxed text-foreground mb-1 italic">
                                "{quote.text}"
                              </p>
                              <p className="text-[10px] text-muted-foreground font-medium">
                                — {quote.speaker}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="border-t border-border/30 my-7" />
            </>
          )}

          {/* Summary Section */}
          <div className="mb-6">
            <button
              className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 mb-2 rounded-lg bg-muted/30 border border-border/40 shadow-sm hover:bg-muted/50 hover:shadow-md transition-all"
              onClick={() => setSummaryExpanded(!summaryExpanded)}
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded bg-card border border-border/50 flex items-center justify-center">
                  <FileText className="w-3 h-3 text-foreground" />
                </div>
                <h2 className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Summary</h2>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${summaryExpanded ? 'rotate-180' : ''}`} />
            </button>
            {summaryExpanded && (
              <div className="space-y-3 mt-3">
                {/* Geo-Politics */}
                {episode.summary.geoPolitics.length > 0 && (
                  <div className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Geo-Politics</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {episode.summary.geoPolitics.map((item, index) => {
                        const itemId = `geo-politics-${index}`;
                        const isSaved = savedItems.has(itemId);
                        
                        return (
                          <li key={index} className="group flex items-start gap-2.5">
                            <button
                              onClick={() => toggleSaveItem(itemId)}
                              className="flex-shrink-0 mt-0.5 transition-colors"
                              aria-label={isSaved ? "Remove from notes" : "Save to notes"}
                            >
                              <div className={`w-4 h-4 rounded border transition-all ${
                                isSaved 
                                  ? 'bg-muted-foreground border-muted-foreground' 
                                  : 'border-border hover:border-muted-foreground'
                              }`}>
                                {isSaved && (
                                  <svg className="w-4 h-4 text-background" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            </button>
                            <span className="flex-1 leading-relaxed text-[11px] text-foreground">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Technology */}
                {episode.summary.technology.length > 0 && (
                  <div className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Technology</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {episode.summary.technology.map((item, index) => {
                        const itemId = `technology-${index}`;
                        const isSaved = savedItems.has(itemId);
                        
                        return (
                          <li key={index} className="group flex items-start gap-2.5">
                            <button
                              onClick={() => toggleSaveItem(itemId)}
                              className="flex-shrink-0 mt-0.5 transition-colors"
                              aria-label={isSaved ? "Remove from notes" : "Save to notes"}
                            >
                              <div className={`w-4 h-4 rounded border transition-all ${
                                isSaved 
                                  ? 'bg-muted-foreground border-muted-foreground' 
                                  : 'border-border hover:border-muted-foreground'
                              }`}>
                                {isSaved && (
                                  <svg className="w-4 h-4 text-background" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            </button>
                            <span className="flex-1 leading-relaxed text-[11px] text-foreground">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Economy */}
                {episode.summary.economy.length > 0 && (
                  <div className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                      <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Economy</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {episode.summary.economy.map((item, index) => {
                        const itemId = `economy-${index}`;
                        const isSaved = savedItems.has(itemId);
                        
                        return (
                          <li key={index} className="group flex items-start gap-2.5">
                            <button
                              onClick={() => toggleSaveItem(itemId)}
                              className="flex-shrink-0 mt-0.5 transition-colors"
                              aria-label={isSaved ? "Remove from notes" : "Save to notes"}
                            >
                              <div className={`w-4 h-4 rounded border transition-all ${
                                isSaved 
                                  ? 'bg-muted-foreground border-muted-foreground' 
                                  : 'border-border hover:border-muted-foreground'
                              }`}>
                                {isSaved && (
                                  <svg className="w-4 h-4 text-background" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            </button>
                            <span className="flex-1 leading-relaxed text-[11px] text-foreground">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Markets */}
                {episode.summary.markets.length > 0 && (
                  <div className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                      <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Markets</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {episode.summary.markets.map((item, index) => {
                        const itemId = `markets-${index}`;
                        const isSaved = savedItems.has(itemId);
                        
                        return (
                          <li key={index} className="group flex items-start gap-2.5">
                            <button
                              onClick={() => toggleSaveItem(itemId)}
                              className="flex-shrink-0 mt-0.5 transition-colors"
                              aria-label={isSaved ? "Remove from notes" : "Save to notes"}
                            >
                              <div className={`w-4 h-4 rounded border transition-all ${
                                isSaved 
                                  ? 'bg-muted-foreground border-muted-foreground' 
                                  : 'border-border hover:border-muted-foreground'
                              }`}>
                                {isSaved && (
                                  <svg className="w-4 h-4 text-background" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            </button>
                            <span className="flex-1 leading-relaxed text-[11px] text-foreground">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Forecasts */}
                {episode.summary.forecasts.length > 0 && (
                  <div className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-3.5 h-3.5 text-muted-foreground" />
                      <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Forecasts</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {episode.summary.forecasts.map((item, index) => {
                        const itemId = `forecasts-${index}`;
                        const isSaved = savedItems.has(itemId);
                        
                        return (
                          <li key={index} className="group flex items-start gap-2.5">
                            <button
                              onClick={() => toggleSaveItem(itemId)}
                              className="flex-shrink-0 mt-0.5 transition-colors"
                              aria-label={isSaved ? "Remove from notes" : "Save to notes"}
                            >
                              <div className={`w-4 h-4 rounded border transition-all ${
                                isSaved 
                                  ? 'bg-muted-foreground border-muted-foreground' 
                                  : 'border-border hover:border-muted-foreground'
                              }`}>
                                {isSaved && (
                                  <svg className="w-4 h-4 text-background" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            </button>
                            <span className="flex-1 leading-relaxed text-[11px] text-foreground">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Targets */}
                {episode.summary.targets.length > 0 && (
                  <div className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-3.5 h-3.5 text-muted-foreground" />
                      <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Targets</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {episode.summary.targets.map((item, index) => {
                        const itemId = `targets-${index}`;
                        const isSaved = savedItems.has(itemId);
                        
                        return (
                          <li key={index} className="group flex items-start gap-2.5">
                            <button
                              onClick={() => toggleSaveItem(itemId)}
                              className="flex-shrink-0 mt-0.5 transition-colors"
                              aria-label={isSaved ? "Remove from notes" : "Save to notes"}
                            >
                              <div className={`w-4 h-4 rounded border transition-all ${
                                isSaved 
                                  ? 'bg-muted-foreground border-muted-foreground' 
                                  : 'border-border hover:border-muted-foreground'
                              }`}>
                                {isSaved && (
                                  <svg className="w-4 h-4 text-background" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            </button>
                            <span className="flex-1 leading-relaxed text-[11px] text-foreground">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chapters Section */}
          <>
            <div className="border-t border-border/30 my-7" />
            <div className="mb-6">
              <button
                className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 mb-2 rounded-lg bg-muted/30 border border-border/40 shadow-sm hover:bg-muted/50 hover:shadow-md transition-all"
                onClick={() => setChaptersExpanded(!chaptersExpanded)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded bg-card border border-border/50 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-foreground" />
                  </div>
                  <h2 className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Chapters</h2>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${chaptersExpanded ? 'rotate-180' : ''}`} />
              </button>
              {chaptersExpanded && (
                <div className="space-y-3 mt-3">
                  {episode.chapters.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-baseline gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                          <span className="text-[10px] font-mono text-muted-foreground font-medium">
                            {chapter.timestamp}
                          </span>
                        </div>
                        <h3 className="text-[11px] font-semibold flex-1 text-foreground uppercase tracking-wide">{chapter.title}</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {chapter.bulletPoints.map((point, idx) => {
                          const itemId = `chapter-${chapterIndex}-${idx}`;
                          const isSaved = savedItems.has(itemId);
                          
                          return (
                            <li key={idx} className="group flex items-start gap-2.5">
                              <button
                                onClick={() => toggleSaveItem(itemId)}
                                className="flex-shrink-0 mt-0.5 transition-colors"
                                aria-label={isSaved ? "Remove from notes" : "Save to notes"}
                              >
                                <div className={`w-4 h-4 rounded border transition-all ${
                                  isSaved 
                                    ? 'bg-muted-foreground border-muted-foreground' 
                                    : 'border-border hover:border-muted-foreground'
                                }`}>
                                  {isSaved && (
                                    <svg className="w-4 h-4 text-background" viewBox="0 0 16 16" fill="none">
                                      <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                              <span className="flex-1 leading-relaxed text-[11px] text-foreground">{point}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>

          {/* Links & References Section */}
          <>
            <div className="border-t border-border/30 my-7" />
            <div className="mb-6">
              <button
                className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 mb-2 rounded-lg bg-muted/30 border border-border/40 shadow-sm hover:bg-muted/50 hover:shadow-md transition-all"
                onClick={() => setLinksExpanded(!linksExpanded)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded bg-card border border-border/50 flex items-center justify-center">
                    <LinkIcon className="w-3 h-3 text-foreground" />
                  </div>
                  <h2 className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Links & References</h2>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${linksExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {linksExpanded && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {/* Host Column */}
                  <div>
                    <div className="mb-2">
                      <p className="text-[12px] font-semibold text-foreground">{episode.hostLinks.name}</p>
                      <p className="text-[10px] text-muted-foreground">{episode.hostLinks.role}</p>
                    </div>
                    <div className="space-y-1.5">
                      {episode.hostLinks.links.map((link, index) => {
                        const getIcon = () => {
                          if (link.platform === 'Twitter/X') return <Twitter className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-shrink-0" />;
                          if (link.platform === 'YouTube') return <Youtube className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-shrink-0" />;
                          if (link.platform === 'Substack') return <Mail className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-shrink-0" />;
                          if (link.platform === 'Website') return <Globe className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-shrink-0" />;
                          return <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-shrink-0" />;
                        };
                        
                        return (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 p-2 rounded-lg border border-border shadow-sm hover:border-violet-400 dark:hover:border-violet-500 hover:bg-muted hover:shadow-md transition-all group text-[11px]"
                          >
                            {getIcon()}
                            <span className="text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">{link.platform}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Guest Column */}
                  <div>
                    <div className="mb-2">
                      <p className="text-[12px] font-semibold text-foreground">{episode.guestLinks.name}</p>
                      <p className="text-[10px] text-muted-foreground">{episode.guestLinks.role}</p>
                    </div>
                    <div className="space-y-1.5">
                      {episode.guestLinks.links.map((link, index) => {
                        const getIcon = () => {
                          if (link.platform === 'Twitter/X') return <Twitter className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-shrink-0" />;
                          if (link.platform === 'YouTube') return <Youtube className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-shrink-0" />;
                          if (link.platform === 'Substack') return <Mail className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-shrink-0" />;
                          if (link.platform === 'Website') return <Globe className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-shrink-0" />;
                          return <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-shrink-0" />;
                        };
                        
                        return (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 p-2 rounded-lg border border-border shadow-sm hover:border-violet-400 dark:hover:border-violet-500 hover:bg-muted hover:shadow-md transition-all group text-[11px]"
                          >
                            {getIcon()}
                            <span className="text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">{link.platform}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>

          {/* Watch Full Episode Section */}
          <>
            <div className="border-t border-border/30 my-7" />
            <div className="mb-6">
              <button
                className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 mb-2 rounded-lg bg-muted/30 border border-border/40 shadow-sm hover:bg-muted/50 hover:shadow-md transition-all"
                onClick={() => setVideoExpanded(!videoExpanded)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded bg-card border border-border/50 flex items-center justify-center">
                    <ExternalLink className="w-3 h-3 text-foreground" />
                  </div>
                  <h2 className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Watch Full Episode</h2>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${videoExpanded ? 'rotate-180' : ''}`} />
              </button>
              {videoExpanded && (
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mt-3">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${episode.youtubeVideoId}`}
                    title={episode.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}
            </div>
          </>

          {/* Disclaimer Section */}
          <div className="bg-muted/50 border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex gap-2 items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h2 className="text-xs font-semibold mb-1 text-foreground">IMPORTANT DISCLAIMERS</h2>
                
                <div className="space-y-2 text-[11px] leading-relaxed">
                  {/* Investment Advice Disclaimer */}
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Not Investment Advice:</span> The content provided in this summary is for informational and educational purposes only and should not be construed as financial, investment, legal, or tax advice. This summary does not constitute a recommendation to buy, sell, or hold any security or investment. You should consult with a qualified financial advisor before making any investment decisions based on this content.
                  </p>

                  {/* AI-Generated Content Disclaimer */}
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">AI-Generated Summary:</span> This summary was generated using artificial intelligence technology. While we strive for accuracy, AI-generated content may contain errors, omissions, or misinterpretations of the original podcast content. Do not rely solely on this AI summary for making financial decisions. Always verify important information with the original source material and consult qualified professionals before taking any financial action.
                  </p>

                  {/* General Disclaimer */}
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">No Guarantees:</span> Past performance is not indicative of future results. All investments carry risk, including the potential loss of principal. Market conditions, economic factors, and individual circumstances vary. Simplicity and its content providers make no representations or warranties regarding the accuracy, completeness, or timeliness of this information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}