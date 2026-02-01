import { FileText, TrendingUp, Clock, Download, BookOpen, Bookmark, Share2, Lock, Crown, ChevronLeft, ChevronRight, Calendar, Newspaper, Search, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ReportModal } from './ReportModal';
import { copy } from '../src/copy/en';

type Period = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'all';

interface Report {
  id: string;
  period: Period;
  dateRange: string;
  title: 'Weekly Market Digest' | 'Daily Brief' | 'Monthly Market Review' | 'Quarterly Economic Outlook' | 'Annual Financial Markets Review';
  episodeCount: number;
  readTime: string;
  createdDate: string;
}

interface ReportsPageProps {
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

// Mock reports data
const mockReports: Report[] = [
  {
    id: 'w1',
    period: 'weekly',
    dateRange: 'January 6 - January 12, 2026',
    title: 'Weekly Market Digest',
    episodeCount: 12,
    readTime: '25 min read',
    createdDate: 'January 13, 2026',
  },
  {
    id: 'd1',
    period: 'daily',
    dateRange: 'January 12, 2026',
    title: 'Daily Brief',
    episodeCount: 3,
    readTime: '3 min read',
    createdDate: 'January 12, 2026',
  },
  {
    id: 'd2',
    period: 'daily',
    dateRange: 'January 11, 2026',
    title: 'Daily Brief',
    episodeCount: 2,
    readTime: '3 min read',
    createdDate: 'January 11, 2026',
  },
  {
    id: 'm1',
    period: 'monthly',
    dateRange: 'December 2025',
    title: 'Monthly Market Review',
    episodeCount: 48,
    readTime: '45 min read',
    createdDate: 'January 1, 2026',
  },
  {
    id: 'q1',
    period: 'quarterly',
    dateRange: 'Q4 2025',
    title: 'Quarterly Economic Outlook',
    episodeCount: 142,
    readTime: '90 min read',
    createdDate: 'January 1, 2026',
  },
  {
    id: 'a1',
    period: 'annual',
    dateRange: '2025',
    title: 'Annual Financial Markets Review',
    episodeCount: 576,
    readTime: '4 hours read',
    createdDate: 'January 1, 2026',
  },
];

const periodColors = {
  daily: 'from-blue-500 to-cyan-500',
  weekly: 'from-indigo-500 to-purple-500',
  monthly: 'from-purple-500 to-pink-500',
  quarterly: 'from-orange-500 to-red-500',
  annual: 'from-amber-500 to-yellow-500',
};

const periodLabels = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
};

export function ReportsPage({ isPremium = false, onUpgrade }: ReportsPageProps) {
  const [timeFilter, setTimeFilter] = useState<Period>('all');
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = previous week, 1 = next week
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Calculate week date range based on offset
  const getWeekRange = (offset: number) => {
    const today = new Date(2026, 0, 16); // January 16, 2026 (Friday)
    const currentDay = today.getDay(); // 5 (Friday)
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Days to Monday
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + (offset * 7));
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const startMonth = monthNames[monday.getMonth()];
    const endMonth = monthNames[sunday.getMonth()];
    const startDay = monday.getDate();
    const endDay = sunday.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  };

  const getWeekLabel = (offset: number) => {
    if (offset === 0) return 'This Week';
    if (offset === -1) return 'Last Week';
    if (offset === 1) return 'Next Week';
    if (offset < 0) return `${Math.abs(offset)} Weeks Ago`;
    return `In ${offset} Weeks`;
  };

  const filteredReports = mockReports.filter(r => {
    const matchesPeriod = timeFilter === 'all' || r.period === timeFilter;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPeriod && matchesSearch;
  });

  // Get filter label
  const getFilterLabel = () => {
    if (timeFilter === 'all') return copy.reports.filterAll;
    const labels = {
      daily: copy.reports.filterDaily,
      weekly: copy.reports.filterWeekly,
      monthly: copy.reports.filterMonthly,
      quarterly: copy.reports.filterQuarterly,
      annual: copy.reports.filterAnnual
    };
    return labels[timeFilter] || copy.reports.filterAll;
  };

  return (
    <div className="w-full max-w-xl mx-auto relative">
      {/* Premium Lock Overlay - Only affects center column */}
      {!isPremium && showPremiumOverlay && (
        <>
          {/* Gradient Blur Overlay - positioned absolute to center column only */}
          <div className="absolute inset-0 z-50 bg-gradient-to-b from-transparent via-background/50 to-background backdrop-blur-[1px] pointer-events-auto" style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)'
          }} />
          
          {/* Bottom Subscription Bar - Fixed position aligned with sidebars */}
          <div className="fixed bottom-4 left-0 right-0 md:left-[calc(256px+1rem)] md:right-[calc(320px+1rem)] z-50 px-4 md:px-0 pointer-events-none">
            <div className="bg-gray-50 dark:bg-gray-900/30 border border-border/50 rounded-3xl shadow-lg p-6 pointer-events-auto max-w-xl mx-auto">
              <div className="text-center space-y-3">
                <div className="space-y-1">
                  <h3 className="text-[15px] font-semibold text-foreground">
                    Upgrade to Premium to access Reports
                  </h3>
                  <p className="text-[13px] text-muted-foreground">
                    Get AI-generated daily, weekly, and monthly reports for €1.99/month
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={onUpgrade}
                    className="px-6 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all text-[13px]"
                  >
                    Upgrade to Premium
                  </button>
                  <p className="text-[11px] text-muted-foreground">
                    Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content - disabled when not premium */}
      <div className={!isPremium ? 'pointer-events-none' : ''}>
        {/* Search and Filter Controls */}
        <div className="flex items-center gap-3 mb-7">
          {/* Search Bar - Always visible, extends to the right */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
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
                      {copy.reports.filterAll}
                    </button>
                    
                    {/* Separator */}
                    <div className="border-t border-border/30 my-1" />
                    
                    {/* Daily option */}
                    <button
                      onClick={() => {
                        setTimeFilter('daily');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        timeFilter === 'daily'
                          ? 'bg-muted text-foreground'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {copy.reports.filterDaily}
                    </button>
                    
                    {/* Weekly option */}
                    <button
                      onClick={() => {
                        setTimeFilter('weekly');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        timeFilter === 'weekly'
                          ? 'bg-muted text-foreground'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {copy.reports.filterWeekly}
                    </button>
                    
                    {/* Monthly option */}
                    <button
                      onClick={() => {
                        setTimeFilter('monthly');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        timeFilter === 'monthly'
                          ? 'bg-muted text-foreground'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {copy.reports.filterMonthly}
                    </button>
                    
                    {/* Quarterly option */}
                    <button
                      onClick={() => {
                        setTimeFilter('quarterly');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        timeFilter === 'quarterly'
                          ? 'bg-muted text-foreground'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {copy.reports.filterQuarterly}
                    </button>
                    
                    {/* Annual option */}
                    <button
                      onClick={() => {
                        setTimeFilter('annual');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        timeFilter === 'annual'
                          ? 'bg-muted text-foreground'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {copy.reports.filterAnnual}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id}>
              <div
                className="relative bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer group overflow-hidden"
                onClick={() => setSelectedReportId(report.id)}
              >
                {/* First Row: Title with icon (left) and Action Buttons (right) */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-1.5 flex-1">
                    <Newspaper className="w-3 h-3 text-foreground flex-shrink-0 mt-0.5" />
                    <h2 className="text-[13px] font-semibold text-foreground leading-snug flex-1">
                      {report.title} - {report.createdDate}
                    </h2>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      className="p-1.5 rounded-lg hover:bg-muted transition-all"
                      title="Save report"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle save
                      }}
                    >
                      <Bookmark className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-muted transition-all"
                      title="Share report"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle share
                      }}
                    >
                      <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-muted transition-all"
                      title="Download report"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle download
                      }}
                    >
                      <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Separator */}
                <div className="border-t border-border/30 mb-3" />

                {/* Second Row: Report Type, Summary Count, and Date with vertical separators */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{periodLabels[report.period]} Report</span>
                  </div>
                  <div className="h-3 w-px bg-border/40" />
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{report.episodeCount} summaries</span>
                  </div>
                  <div className="h-3 w-px bg-border/40" />
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {(() => {
                        const date = new Date(report.createdDate);
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
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-10">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-foreground">No reports available</h3>
            <p className="text-[11px] text-muted-foreground">
              Reports will appear here as you listen to episodes
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
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT REPORTS</h2>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
                Comprehensive summaries automatically generated from your podcast episodes across different time periods. Daily reports are published each morning, weekly reports every Monday, and monthly reports at the start of each month. New report uploads are indicated with notification badges on the Reports navigation item.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">How to use:</span> Select a time period filter (Daily, Weekly, Monthly, etc.) to view reports for that timeframe. Click on any report card to read the detailed summary. The notification badge shows how many new reports have been uploaded since your last visit.
              </p>
            </div>
          </div>
        </div>

        {/* Report Modal */}
        {selectedReportId && (
          <ReportModal
            reportId={selectedReportId}
            onClose={() => setSelectedReportId(null)}
          />
        )}
      </div>
    </div>
  );
}