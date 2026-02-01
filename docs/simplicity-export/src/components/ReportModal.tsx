import { X, Calendar, Clock, Bookmark, Share2, Download, FileText, Globe, BarChart3, ChevronDown, AlertTriangle, TrendingUp, Newspaper } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ReportModalProps {
  reportId: string;
  onClose: () => void;
}

interface ReportDetail {
  id: string;
  title: string;
  podcastTitle: string;
  date: string;
  readTime: string;
  episodeCount: number;
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  executiveSummary: string;
  economy: string[];
  geoPolitics: string[];
  markets: string[];
}

// Mock detailed report data
const mockReportDetails: Record<string, ReportDetail> = {
  'w1': {
    id: 'w1',
    title: 'Weekly Market Digest - January 13, 2026',
    podcastTitle: 'Weekly Market Digest',
    date: 'Jan 13, 2026',
    readTime: '25 min read',
    episodeCount: 12,
    reportType: 'weekly',
    executiveSummary: 'This week\'s analysis reveals surprising strength in technology equities despite persistent interest rate concerns. Major tech companies demonstrated robust earnings power, while emerging markets showed signs of stabilization.',
    economy: [
      'GDP growth tracking above consensus at 2.4% annualized, driven by resilient consumer spending.',
      'Inflation continues moderating with core PCE at 2.6%, down from 2.8% prior month.',
    ],
    geoPolitics: [
      'US-China relations showing signs of stabilization with renewed dialogue on trade issues.',
      'European energy security improving with diversified supply chains.',
    ],
    markets: [
      'S&P 500 advanced 1.8% for the week, led by technology (+2.4%) and communications (+2.1%).',
      'Treasury yields modestly higher with 10-year at 4.35%, up 8 basis points.',
    ],
  },
  'd1': {
    id: 'd1',
    title: 'Daily Brief - January 12, 2026',
    podcastTitle: 'Daily Brief',
    date: 'Jan 12, 2026',
    readTime: '8 min read',
    episodeCount: 3,
    reportType: 'daily',
    executiveSummary: 'Federal Reserve meeting minutes released today revealed policymakers\' cautious stance on potential rate cuts, emphasizing the need for sustained progress on inflation.',
    economy: [
      'Fed minutes showed unanimous agreement that inflation progress has been slower than hoped.',
      'Jobless claims came in at 215,000, slightly below expectations.',
    ],
    geoPolitics: [
      'US Treasury Secretary met with Chinese counterpart in Zurich.',
      'European Central Bank officials echoed Fed caution.',
    ],
    markets: [
      'S&P 500 closed down -0.3% at 4,785 after intraday low of -0.8%.',
      '10-year Treasury yield spiked to 4.42% before settling at 4.38%.',
    ],
  },
};

export function ReportModal({ reportId, onClose }: ReportModalProps) {
  const report = mockReportDetails[reportId] || mockReportDetails['w1'];
  
  // State for collapsible sections
  const [economyExpanded, setEconomyExpanded] = useState(true);
  const [geoPoliticsExpanded, setGeoPoliticsExpanded] = useState(true);
  const [marketsExpanded, setMarketsExpanded] = useState(true);

  // Format date to "Friday, 9th of January, 2026"
  const formatDateLong = (dateStr: string) => {
    // Parse the date string (assuming "Jan 13, 2026" format)
    const date = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Get ordinal suffix
    const getOrdinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };
    
    return `${dayName}, ${day}${getOrdinal(day)} of ${monthName}, ${year}`;
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
          marginLeft: '256px',
          marginRight: '320px',
          width: 'calc(100vw - 256px - 320px)',
          height: 'calc(100vh - 24px)',
          marginTop: '12px',
          marginBottom: '12px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-secondary hover:bg-muted transition-all"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5 text-foreground" />
        </button>

        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto p-4 md:p-5">
          {/* Report Header - EXACT COPY FROM SUMMARY MODAL */}
          <div className="mb-5">
            {/* Title Row with Icon & Actions */}
            <div className="flex gap-2 items-center mb-3 pb-3 border-b border-border/30">
              {/* Report Icon - Newspaper */}
              <div className="flex-shrink-0">
                <Newspaper className="w-[14px] h-[14px] text-foreground" />
              </div>

              {/* Title */}
              <h1 className="flex-1 text-sm font-semibold leading-snug text-foreground">
                {report.title}
              </h1>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  className="p-2 rounded-lg hover:bg-muted transition-all"
                  title="Save to notebook"
                  aria-label="Save to notebook"
                >
                  <Bookmark className="w-4 h-4 text-foreground" />
                </button>

                <button
                  className="p-2 rounded-lg hover:bg-muted transition-all"
                  title="Share report"
                  aria-label="Share report"
                >
                  <Share2 className="w-4 h-4 text-foreground" />
                </button>

                <button
                  className="p-2 rounded-lg hover:bg-muted transition-all"
                  title="Download report"
                  aria-label="Download report"
                >
                  <Download className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>

            {/* Two Column Layout: Metadata + Executive Summary */}
            <div className="flex gap-6">
              {/* Left Column: Metadata Stack */}
              <div className="flex flex-col gap-1.5 flex-shrink-0" style={{ width: '280px' }}>
                {/* Report Type */}
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="capitalize truncate">{report.reportType} Report</span>
                </div>
                
                {/* Number of Summaries */}
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{report.episodeCount} summaries</span>
                </div>
                
                {/* Date */}
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{formatDateLong(report.date)}</span>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="w-px bg-border/30 flex-shrink-0" />

              {/* Right Column: Executive Summary */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {report.executiveSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border/30 my-7" />

          {/* Economy Section - Collapsible */}
          <div className="mb-6">
            <button
              className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 mb-2 rounded-lg bg-muted/30 border border-border/40 shadow-sm hover:bg-muted/50 hover:shadow-md transition-all"
              onClick={() => setEconomyExpanded(!economyExpanded)}
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded bg-card border border-border/50 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-foreground" />
                </div>
                <h2 className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Economy</h2>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${economyExpanded ? 'rotate-180' : ''}`} />
            </button>
            {economyExpanded && (
              <div className="space-y-2.5 mt-3">
                {report.economy.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[11px] text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-t border-border/30 my-7" />

          {/* Geo-Politics Section - Collapsible */}
          {report.geoPolitics.length > 0 && (
            <>
              <div className="mb-6">
                <button
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 mb-2 rounded-lg bg-muted/30 border border-border/40 shadow-sm hover:bg-muted/50 hover:shadow-md transition-all"
                  onClick={() => setGeoPoliticsExpanded(!geoPoliticsExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded bg-card border border-border/50 flex items-center justify-center">
                      <Globe className="w-3 h-3 text-foreground" />
                    </div>
                    <h2 className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Geo-Politics</h2>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${geoPoliticsExpanded ? 'rotate-180' : ''}`} />
                </button>
                {geoPoliticsExpanded && (
                  <div className="space-y-2.5 mt-3">
                    {report.geoPolitics.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                        <p className="text-[11px] text-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Separator */}
              <div className="border-t border-border/30 my-7" />
            </>
          )}

          {/* Markets Section - Collapsible */}
          <div className="mb-6">
            <button
              className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 mb-2 rounded-lg bg-muted/30 border border-border/40 shadow-sm hover:bg-muted/50 hover:shadow-md transition-all"
              onClick={() => setMarketsExpanded(!marketsExpanded)}
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded bg-card border border-border/50 flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 text-foreground" />
                </div>
                <h2 className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Markets</h2>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${marketsExpanded ? 'rotate-180' : ''}`} />
            </button>
            {marketsExpanded && (
              <div className="space-y-2.5 mt-3">
                {report.markets.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[11px] text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disclaimer Section - EXACT COPY FROM SUMMARY MODAL */}
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