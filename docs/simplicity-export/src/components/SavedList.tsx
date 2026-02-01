import { useState } from 'react';
import { Bookmark, Clock, BookOpen, Calendar, User, FileText, Mic, Search, Filter, ChevronDown, Share2, Download, BarChart2, X, TrendingUp, Newspaper } from 'lucide-react';
import { copy } from '../src/copy/en';
import { useFilterState, useSavedState } from '../src/hooks';

type TypeFilter = 'all' | 'summary' | 'report';
type SavedItemType = 'summary' | 'report';

interface SavedEpisode {
  id: string;
  podcastTitle: string;
  podcastImage: string;
  episodeTitle: string;
  duration: string;
  publishedAt: string;
  type: SavedItemType;
  host?: string; // Only for summaries
  episodeCount?: number; // Only for reports
  reportType?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'; // Only for reports
  content?: string; // Full content for modal
}

interface SavedListProps {
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
}

const mockSavedEpisodes: SavedEpisode[] = [
  {
    id: '1',
    podcastTitle: 'Animal Spirits',
    podcastImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    episodeTitle: 'Portfolio Rebalancing Strategies for 2026',
    duration: '38:22',
    publishedAt: '2026-01-07',
    type: 'summary',
    host: 'Dr. Jane Smith',
    content: `# Portfolio Rebalancing Strategies for 2026

## Key Takeaways
In this comprehensive episode, the Animal Spirits team explores portfolio rebalancing strategies for the upcoming year. They discuss the importance of maintaining a balanced investment portfolio and provide actionable insights for investors.

## Main Discussion Points
- **Market Volatility**: Understanding how to navigate uncertain market conditions
- **Asset Allocation**: Optimal distribution across stocks, bonds, and alternative investments
- **Tax Efficiency**: Strategies to minimize tax impact during rebalancing
- **Frequency**: When and how often to rebalance your portfolio

## Expert Recommendations
The hosts recommend a systematic approach to rebalancing, typically on a quarterly or semi-annual basis. They emphasize the importance of staying disciplined and not letting emotions drive investment decisions.

## Conclusion
Portfolio rebalancing remains a critical component of long-term investment success, especially in the dynamic market environment of 2026.`
  },
  {
    id: '2',
    podcastTitle: 'Invest Like the Best',
    podcastImage: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop',
    episodeTitle: 'Annual Financial Markets Review - January 6, 2026',
    duration: '52:10',
    publishedAt: '2026-01-06',
    type: 'report',
    host: 'Dr. John Doe',
    episodeCount: 576,
    reportType: 'annual',
    content: `# Annual Financial Markets Review - Analysis Report

## Executive Summary
This report provides a comprehensive analysis of financial markets trends and their impact on the global economy. Key findings indicate a permanent shift in market dynamics with significant implications for investment strategies and risk management.

## Market Data & Statistics
- 68% of companies have adopted hybrid investment models
- Market productivity up 12% compared to pre-2020 levels
- Commercial real estate demand down 23% in major metro areas
- Technology spending on collaboration tools up 45%

## Investment Opportunities
1. **Cloud Infrastructure**: Companies enabling remote collaboration
2. **Cybersecurity**: Protecting distributed workforces
3. **PropTech**: Adaptive real estate solutions
4. **Digital Communication**: Next-gen collaboration platforms

## Risk Factors
- Regulatory challenges across different jurisdictions
- Potential backlash from traditional management approaches
- Cybersecurity vulnerabilities in distributed networks

## Forecast
The financial markets trend shows no signs of reversal, with projected growth in hybrid models through 2030. Investors should position portfolios accordingly.`
  },
  {
    id: '3',
    podcastTitle: 'The Compound and Friends',
    podcastImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
    episodeTitle: 'Crypto Market Analysis Q1 2026',
    duration: '45:30',
    publishedAt: '2026-01-04',
    type: 'summary',
    host: 'Dr. Emily Johnson',
    content: `# Crypto Market Analysis Q1 2026

## Overview
The Compound team breaks down the crypto market performance in Q1 2026, analyzing major movements in Bitcoin, Ethereum, and emerging altcoins.

## Key Points Discussed
- **Bitcoin Performance**: Testing new all-time highs with institutional adoption accelerating
- **Ethereum Updates**: Layer 2 scaling solutions gaining significant traction
- **DeFi Growth**: Total value locked reaching unprecedented levels
- **Regulatory Landscape**: Clearer frameworks emerging in major economies

## Market Sentiment
The overall sentiment remains cautiously optimistic, with increasing institutional participation providing stability to the market. However, the hosts caution against over-leveraging and emphasize the importance of risk management.

## Looking Ahead
Q2 2026 is expected to bring further clarity on regulatory frameworks, potentially unlocking new institutional capital flows into the crypto ecosystem.`
  },
  {
    id: '4',
    podcastTitle: 'Masters in Business',
    podcastImage: 'https://images.unsplash.com/photo-1579532536935-619928decd08?w=400&h=400&fit=crop',
    episodeTitle: 'Quarterly Economic Outlook - January 3, 2026',
    duration: '48:15',
    publishedAt: '2026-01-03',
    type: 'report',
    host: 'Dr. Robert Brown',
    episodeCount: 142,
    reportType: 'quarterly',
    content: `# AI in Financial Services - Impact Report

## Introduction
This comprehensive report examines the transformative impact of artificial intelligence on financial services, from wealth management to credit underwriting.

## Key Findings
**Adoption Rates:**
- 82% of financial institutions have deployed AI in some capacity
- ROI on AI investments averaging 23% annually
- Customer satisfaction scores up 31% with AI-assisted services

**Use Cases:**
1. Algorithmic Trading: 67% of trading volume now AI-influenced
2. Risk Assessment: 89% accuracy in credit scoring models
3. Fraud Detection: 94% reduction in false positives
4. Personalized Wealth Management: 3x increase in client engagement

## Economic Impact
The AI revolution in finance is projected to generate $1.2 trillion in value by 2030, with productivity gains and cost reductions driving profitability.

## Investment Thesis
Companies at the forefront of financial AI integration present compelling investment opportunities, particularly those with proprietary data advantages and strong regulatory compliance.

## Risks & Considerations
- Algorithmic bias and fairness concerns
- Regulatory scrutiny and compliance costs
- Talent acquisition challenges
- Cybersecurity vulnerabilities`
  },
  {
    id: '5',
    podcastTitle: 'Odd Lots',
    podcastImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    episodeTitle: 'Global Supply Chain Dynamics',
    duration: '56:40',
    publishedAt: '2026-01-02',
    type: 'summary',
    host: 'Dr. Sarah Lee',
    content: `# Global Supply Chain Dynamics

## Episode Summary
Bloomberg's Odd Lots dives deep into the evolving global supply chain landscape, examining the shift from just-in-time to just-in-case inventory management.

## Key Themes
- **Reshoring Trends**: Manufacturing returning to domestic markets
- **China Plus One**: Diversification strategies gaining momentum
- **Technology Integration**: IoT and blockchain transforming logistics
- **Geopolitical Factors**: Trade policy impacts on supply chains

## Expert Insights
Industry leaders emphasize the importance of supply chain resilience over pure cost optimization. Companies that invested in redundancy during recent disruptions are now seeing competitive advantages.

## Sector Implications
- **Industrial**: Increased capex for domestic manufacturing
- **Technology**: Semiconductor supply chain restructuring
- **Retail**: Inventory strategies shifting to buffer stock
- **Logistics**: Investment in visibility and tracking systems

## Takeaway
The era of frictionless globalization is over; investors need to adjust expectations and identify winners in the new supply chain paradigm.`
  },
  {
    id: '6',
    podcastTitle: 'The Investor\'s Podcast',
    podcastImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=400&fit=crop',
    episodeTitle: 'Monthly Market Review - December 30, 2025',
    duration: '42:18',
    publishedAt: '2025-12-30',
    type: 'report',
    host: 'Dr. Michael Green',
    episodeCount: 48,
    reportType: 'monthly',
    content: `# Monthly Market Review

## Overview
This report provides a comprehensive analysis of financial markets trends and performance for December 2025, highlighting key developments and their implications for investors.

## Market Data & Statistics
- **Stock Market**: S&P 500 up 2.5%, NASDAQ up 3.1%
- **Bond Market**: 10-year Treasury yield down 0.2%
- **Commodities**: Oil prices stable, gold prices up 1.8%
- **Currency**: USD strengthens against major currencies

## Investment Opportunities
1. **Technology**: Leading tech companies showing strong earnings growth
2. **Healthcare**: Biotech and pharmaceutical sectors outperforming
3. **Consumer Staples**: Defensive sectors providing stability
4. **Energy**: Renewable energy companies gaining momentum

## Risk Factors
- **Economic Growth**: Slowing global economic growth concerns
- **Inflation**: Rising inflation rates in some regions
- **Geopolitical Tensions**: Ongoing geopolitical conflicts impacting markets
- **Regulatory Changes**: Potential regulatory changes affecting industries

## Forecast
The financial markets are expected to remain volatile in the short term, with potential for further gains in the tech and healthcare sectors. Investors should maintain a diversified portfolio and be prepared for market fluctuations.

## Investment Recommendations
The report suggests continued allocation to high-growth sectors, particularly in technology and healthcare. However, investors should remain vigilant about market risks and focus on companies with strong fundamentals.

## Conclusion
The monthly market review provides valuable insights into current market conditions and helps investors make informed decisions in a dynamic financial landscape.`
  }
];

export function SavedList({ isPremium, onUpgrade, onChatClick, isLoggedIn, userImage, userName, onSignIn, onProfileClick, onSettingsClick, onHelpClick, onSignOut }: SavedListProps) {
  const { currentFilter: typeFilter, setFilter: setTypeFilter } = useFilterState<TypeFilter>('all');
  const { savedItems: savedPosts, toggleSaved } = useSavedState(new Set(mockSavedEpisodes.map(ep => ep.id)));
  const [selectedItem, setSelectedItem] = useState<SavedEpisode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter episodes based on type
  const filteredEpisodes = mockSavedEpisodes.filter(episode => {
    if (!savedPosts.has(episode.id)) return false;
    if (typeFilter === 'all') return true;
    return episode.type === typeFilter;
  });

  // Get filter label
  const getFilterLabel = () => {
    if (typeFilter === 'all') return copy.saved.filterAll;
    if (typeFilter === 'summary') return copy.saved.filterSummary;
    return copy.saved.filterReport;
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
            placeholder="Search saved items..."
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
                      setTypeFilter('all');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      typeFilter === 'all'
                        ? 'bg-muted text-foreground'
                        : 'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {copy.saved.filterAll}
                  </button>
                  
                  {/* Separator */}
                  <div className="border-t border-border/30 my-1" />
                  
                  {/* Summaries option */}
                  <button
                    onClick={() => {
                      setTypeFilter('summary');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      typeFilter === 'summary'
                        ? 'bg-muted text-foreground'
                        : 'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {copy.saved.filterSummary}
                  </button>
                  
                  {/* Reports option */}
                  <button
                    onClick={() => {
                      setTypeFilter('report');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      typeFilter === 'report'
                        ? 'bg-muted text-foreground'
                        : 'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {copy.saved.filterReport}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Episodes List */}
      {filteredEpisodes.length > 0 ? (
        <div className="space-y-4">
          {filteredEpisodes.map((episode) => (
            <div key={episode.id}>
              <div
                onClick={() => setSelectedItem(episode)}
                className="relative group bg-card border border-border/40 rounded-2xl p-4 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer overflow-hidden"
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }} />

                <div className="relative flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 relative w-32 h-20 rounded-xl overflow-hidden bg-muted">
                    <img
                      src={episode.podcastImage}
                      alt={episode.episodeTitle}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                      {episode.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title with Icon and Action Buttons Row */}
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {episode.type === 'report' ? (
                          <Newspaper className="w-[13px] h-[13px] text-foreground flex-shrink-0" />
                        ) : (
                          <FileText className="w-[13px] h-[13px] text-foreground flex-shrink-0" />
                        )}
                        <h3 className="text-xs font-semibold text-foreground line-clamp-2 flex-1">
                          {episode.episodeTitle}
                        </h3>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1.5 rounded-lg hover:bg-muted transition-all"
                          title="Saved"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-foreground fill-current" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1.5 rounded-lg hover:bg-muted transition-all"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1.5 rounded-lg hover:bg-muted transition-all"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Separator */}
                    <div className="border-t border-border/30 mb-2" />

                    {/* Metadata Row with Separators - Different for Reports vs Summaries */}
                    {episode.type === 'report' ? (
                      <div className="mb-2">
                        {/* Single Row: Report Type | Episode Count | Date */}
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          {/* Report Type */}
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="capitalize">{episode.reportType || 'Daily'} Report</span>
                          </div>

                          {/* Vertical Separator */}
                          <div className="h-3 w-px bg-border/40 flex-shrink-0" />

                          {/* Episode Count */}
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{episode.episodeCount} summaries</span>
                          </div>

                          {/* Vertical Separator */}
                          <div className="h-3 w-px bg-border/40 flex-shrink-0" />

                          {/* Date */}
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              {(() => {
                                const date = new Date(episode.publishedAt);
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                const year = date.getFullYear();
                                return `${month}-${day}-${year}`;
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-2">
                        {/* Single Row: Show | Guest | Date */}
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          {/* Podcast Show */}
                          <div className="flex items-center gap-1.5">
                            <Mic className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{episode.podcastTitle}</span>
                          </div>

                          {/* Vertical Separator */}
                          <div className="h-3 w-px bg-border/40 flex-shrink-0" />

                          {/* Guest */}
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{episode.host}</span>
                          </div>

                          {/* Vertical Separator */}
                          <div className="h-3 w-px bg-border/40 flex-shrink-0" />

                          {/* Date */}
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              {(() => {
                                const date = new Date(episode.publishedAt);
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                const year = date.getFullYear();
                                return `${month}-${day}-${year}`;
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <Bookmark className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-300">{copy.saved.emptyState.title}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            {copy.saved.emptyState.description}
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
              <Bookmark className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold mb-1 text-foreground">{copy.saved.aboutTitle}</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
              {copy.saved.aboutDescription}
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">How to use:</span> {copy.saved.aboutHowTo}
            </p>
          </div>
        </div>
      </div>

      {/* Content Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {selectedItem.type === 'report' ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg">
                      <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">REPORT</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 rounded-lg">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">SUMMARY</span>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedItem.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-foreground mb-1">
                  {selectedItem.episodeTitle}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {selectedItem.podcastTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-shrink-0 p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {selectedItem.content?.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-xl font-bold mb-4 text-foreground">{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-base font-semibold mt-6 mb-3 text-foreground">{line.substring(3)}</h2>;
                  } else if (line.startsWith('- **') && line.includes('**:')) {
                    const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                    if (match) {
                      return (
                        <div key={index} className="ml-4 mb-2 text-xs">
                          <span className="font-semibold text-foreground">{match[1]}:</span>{' '}
                          <span className="text-muted-foreground">{match[2]}</span>
                        </div>
                      );
                    }
                  } else if (line.startsWith('- ')) {
                    return <li key={index} className="ml-4 mb-1.5 text-xs text-muted-foreground">{line.substring(2)}</li>;
                  } else if (line.match(/^\d+\. \*\*/)) {
                    const match = line.match(/^\d+\. \*\*(.*?)\*\*: (.*)/);
                    if (match) {
                      return (
                        <div key={index} className="ml-4 mb-2 text-xs">
                          <span className="font-semibold text-foreground">{match[1]}:</span>{' '}
                          <span className="text-muted-foreground">{match[2]}</span>
                        </div>
                      );
                    }
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={index} className="font-semibold mb-2 text-xs text-foreground">{line.replace(/\*\*/g, '')}</p>;
                  } else if (line.trim() === '') {
                    return <div key={index} className="h-2" />;
                  } else {
                    return <p key={index} className="mb-2 text-xs text-muted-foreground leading-relaxed">{line}</p>;
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-card border-t border-border p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white text-xs font-medium rounded-lg hover:bg-indigo-600 transition-colors">
                  <Bookmark className="w-3 h-3" />
                  <span>Saved</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground text-xs font-medium rounded-lg hover:bg-muted/80 transition-colors">
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </button>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-lg hover:bg-emerald-500/20 transition-colors">
                <Download className="w-3 h-3" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}