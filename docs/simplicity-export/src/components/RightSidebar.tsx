import { TrendingUp, ArrowUpRight, Crown, Sparkles, Bell, User, ArrowUp, ArrowDown, ChevronDown, ChevronUp, ChevronRight, Bot, Sun, Moon, Calendar, Newspaper, TrendingDown, Building2, Bookmark, BarChart3, MessageSquare, Twitter, ChevronLeft, Radio, Gem, LineChart, DollarSign, FileText, Package, Cpu, Briefcase, Landmark, Zap, Flame, Heart, Repeat2, Share2, Download, AlertCircle, Lightbulb, PlayCircle, RefreshCw, Globe2, DollarSignIcon as DollarSignAlt, Mic } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import { UserProfileButton } from './UserProfileButton';
import { NotificationsPopup } from './NotificationsPopup';
import { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { copy } from '../src/copy/en';

// Custom Calendar Icon with Date
function CalendarWithDate({ date }: { date: number }) {
  return (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
      </svg>
      <span className="relative text-[7.5px] font-bold text-muted-foreground leading-none" style={{ marginTop: '4px' }}>
        {date}
      </span>
    </div>
  );
}

interface RightSidebarProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
  notificationsCount?: number;
  onNotificationClick?: () => void;
  isLoggedIn?: boolean;
  userImage?: string;
  userName?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onSignOut?: () => void;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

interface Asset {
  name: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  chartData?: number[]; // Mini sparkline data points
}

interface AssetCategory {
  title: string;
  assets: Asset[];
}

type MenuType = 'calendar' | 'earnings' | 'news' | 'markets' | 'predictions' | 'tweets' | null;

// Mini Sparkline Chart Component
function MiniSparkline({ data, isPositive }: { data: number[], isPositive: boolean }) {
  if (!data || data.length < 2) return null;
  
  const width = 40;
  const height = 16;
  const padding = 2;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');
  
  const color = isPositive ? 'rgb(5, 150, 105)' : 'rgb(220, 38, 38)';
  const bgColor = isPositive ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)';
  
  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`0,${height} ${points} ${width},${height}`}
        fill={bgColor}
        stroke="none"
      />
    </svg>
  );
}

export function RightSidebar({ isPremium = false, onUpgrade, notificationsCount, onNotificationClick, isLoggedIn, userImage, userName, onProfileClick, onSettingsClick, onHelpClick, onSignOut, onToggleChat, isChatOpen }: RightSidebarProps) {
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [selectedMarketCategory, setSelectedMarketCategory] = useState<number>(0); // Track selected market category
  const [selectedPredictionCategory, setSelectedPredictionCategory] = useState<number>(0); // Track selected prediction category
  const [expandedPredictionCategories, setExpandedPredictionCategories] = useState<Record<number, boolean>>({
    0: true, // Geo-Politics expanded by default
    1: true, // Economy expanded by default
    2: true, // Technology expanded by default
    3: true, // MARKETS expanded by default
    4: true, // TRENDING expanded by default
    5: true, // BREAKING expanded by default
  });
  const [isTrendingTodayExpanded, setIsTrendingTodayExpanded] = useState(true);
  const [isTrendingWeekExpanded, setIsTrendingWeekExpanded] = useState(true);
  const [showAllUpNext, setShowAllUpNext] = useState(false);

  // State for Calendar - Tab-based selection (only one day shown at a time)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string>('Mon');
  const [showCriticalCalendar, setShowCriticalCalendar] = useState<boolean>(false);
  
  // State for Earnings - Tab-based selection (matching calendar)
  const [selectedEarningsDay, setSelectedEarningsDay] = useState<string>('Mon');
  const [showCriticalEarnings, setShowCriticalEarnings] = useState<boolean>(false);

  // State for Tweets category selection
  const [selectedTweetCategory, setSelectedTweetCategory] = useState<number>(0); // Track selected tweet category

  // State for News category selection
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<number>(0); // Track selected news category

  // Helper function to parse numeric values from strings
  const parseNumericValue = (value: string): number | null => {
    if (value === '-') return null;
    // Remove %, K, M, and other non-numeric characters except minus sign and decimal point
    const cleanValue = value.replace(/[%KM]/g, '').replace(/,/g, '');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? null : parsed;
  };

  // Helper function to get color class based on comparison
  const getComparisonColor = (value1: string, value2: string, higherIsBetter: boolean = true): string => {
    const num1 = parseNumericValue(value1);
    const num2 = parseNumericValue(value2);
    
    if (num1 === null || num2 === null) return 'text-foreground';
    
    if (num1 > num2) {
      return higherIsBetter ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500';
    } else if (num1 < num2) {
      return higherIsBetter ? 'text-red-600 dark:text-red-500' : 'text-emerald-600 dark:text-emerald-500';
    }
    return 'text-foreground';
  };

  const assetCategories: AssetCategory[] = [
    {
      title: 'METALS',
      assets: [
        { name: 'GOLD', value: '2,654.32', change: '+12.45', changePercent: '+0.47%', isPositive: true, chartData: [2640, 2638, 2642, 2645, 2643, 2648, 2651, 2654] },
        { name: 'SILVER', value: '30.18', change: '-0.23', changePercent: '-0.76%', isPositive: false, chartData: [30.5, 30.4, 30.6, 30.3, 30.2, 30.4, 30.3, 30.18] },
        { name: 'COPPER', value: '4.12', change: '+0.08', changePercent: '+1.98%', isPositive: true, chartData: [4.02, 4.04, 4.03, 4.06, 4.08, 4.10, 4.09, 4.12] },
        { name: 'PLATINUM', value: '982.50', change: '-5.20', changePercent: '-0.53%', isPositive: false, chartData: [990, 988, 992, 985, 987, 986, 984, 982.5] },
      ]
    },
    {
      title: 'Equities',
      assets: [
        { name: 'SMP-500', value: '6,963.74', change: '-13.53', changePercent: '-0.19%', isPositive: false, chartData: [6980, 6975, 6985, 6970, 6965, 6968, 6972, 6963.74] },
        { name: 'STOXX-50', value: '5,124.88', change: '+28.92', changePercent: '+0.57%', isPositive: true, chartData: [5095, 5100, 5098, 5105, 5110, 5115, 5120, 5124.88] },
        { name: 'NIKKEI-225', value: '39,894.54', change: '+156.32', changePercent: '+0.39%', isPositive: true, chartData: [39750, 39780, 39760, 39800, 39820, 39850, 39870, 39894.54] },
        { name: 'HSI-50', value: '19,432.76', change: '-87.45', changePercent: '-0.45%', isPositive: false, chartData: [19550, 19520, 19540, 19500, 19480, 19470, 19450, 19432.76] },
      ]
    },
    {
      title: 'Crypto',
      assets: [
        { name: 'BITCOIN', value: '94,582.40', change: '+1,234.56', changePercent: '+1.32%', isPositive: true, chartData: [93200, 93500, 93300, 93800, 94100, 94300, 94500, 94582.4] },
        { name: 'ETHERIUM', value: '3,248.92', change: '-45.78', changePercent: '-1.39%', isPositive: false, chartData: [3310, 3290, 3305, 3280, 3270, 3265, 3255, 3248.92] },
        { name: 'SOLANA', value: '187.65', change: '+8.92', changePercent: '+4.99%', isPositive: true, chartData: [178, 180, 179, 182, 184, 185, 186, 187.65] },
        { name: 'RIPPLE', value: '2.87', change: '+0.12', changePercent: '+4.36%', isPositive: true, chartData: [2.75, 2.76, 2.77, 2.79, 2.81, 2.83, 2.85, 2.87] },
      ]
    },
    {
      title: 'Currencies',
      assets: [
        { name: 'DOLLAR-INDEX', value: '103.45', change: '+0.32', changePercent: '+0.31%', isPositive: true, chartData: [103.1, 103.2, 103.15, 103.25, 103.3, 103.35, 103.4, 103.45] },
        { name: 'EURO-INDEX', value: '1.0892', change: '-0.0012', changePercent: '-0.11%', isPositive: false, chartData: [1.0905, 1.0900, 1.0903, 1.0898, 1.0895, 1.0893, 1.0890, 1.0892] },
        { name: 'YEN-INDEX', value: '143.28', change: '+0.58', changePercent: '+0.41%', isPositive: true, chartData: [142.7, 142.8, 142.75, 142.9, 143.0, 143.1, 143.2, 143.28] },
        { name: 'YUAN-INDEX', value: '7.2456', change: '-0.0089', changePercent: '-0.12%', isPositive: false, chartData: [7.2550, 7.2540, 7.2530, 7.2510, 7.2490, 7.2480, 7.2470, 7.2456] },
      ]
    },
    {
      title: 'Bonds',
      assets: [
        { name: 'US-10Y', value: '4.652', change: '+0.023', changePercent: '+0.50%', isPositive: true, chartData: [4.625, 4.630, 4.628, 4.635, 4.640, 4.645, 4.648, 4.652] },
        { name: 'EU-10Y', value: '2.387', change: '-0.012', changePercent: '-0.50%', isPositive: false, chartData: [2.400, 2.398, 2.399, 2.395, 2.393, 2.390, 2.388, 2.387] },
        { name: 'JP-10Y', value: '1.145', change: '+0.008', changePercent: '+0.70%', isPositive: true, chartData: [1.137, 1.138, 1.139, 1.140, 1.142, 1.143, 1.144, 1.145] },
        { name: 'CH-10Y', value: '2.234', change: '-0.015', changePercent: '-0.67%', isPositive: false, chartData: [2.250, 2.248, 2.246, 2.244, 2.242, 2.240, 2.237, 2.234] },
      ]
    },
    {
      title: 'Commodities',
      assets: [
        { name: 'BRENT-OIL', value: '78.45', change: '+1.23', changePercent: '+1.59%', isPositive: true, chartData: [77.2, 77.4, 77.3, 77.6, 77.9, 78.1, 78.3, 78.45] },
        { name: 'NAT-GAS', value: '3.42', change: '-0.08', changePercent: '-2.29%', isPositive: false, chartData: [3.51, 3.49, 3.50, 3.48, 3.46, 3.45, 3.44, 3.42] },
        { name: 'SOY-BEANS', value: '1,024.50', change: '+15.75', changePercent: '+1.56%', isPositive: true, chartData: [1008, 1010, 1012, 1015, 1018, 1020, 1022, 1024.5] },
        { name: 'WHEAT', value: '542.25', change: '-8.50', changePercent: '-1.54%', isPositive: false, chartData: [551, 550, 548, 547, 546, 544, 543, 542.25] },
      ]
    },
  ];

  const [isNotificationsPopupOpen, setNotificationsPopupOpen] = useState(false);
  const notificationsRef = useRef<HTMLButtonElement>(null);
  
  const [isCatalystsExpanded, setIsCatalystsExpanded] = useState(true);
  const [isEarningsExpanded, setIsEarningsExpanded] = useState(true);
  const [isNewsExpanded, setIsNewsExpanded] = useState(true);
  const [showAllCatalysts, setShowAllCatalysts] = useState(false);
  const [showAllEarnings, setShowAllEarnings] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);

  const catalystsThisWeek = [
    { day: 'Mon', event: 'Consumer Confidence Index', time: '10:00 AM', actual: '110.2', forecast: '109.5', previous: '108.8', importance: 2 },
    { day: 'Mon', event: 'Manufacturing PMI', time: '9:45 AM', actual: '52.3', forecast: '51.8', previous: '51.5', importance: 2 },
    { day: 'Tue', event: 'Retail Sales Data', time: '8:30 AM', actual: '0.4%', forecast: '0.3%', previous: '0.2%', importance: 3 },
    { day: 'Tue', event: 'Core CPI (MoM)', time: '8:30 AM', actual: '0.3%', forecast: '0.2%', previous: '0.3%', importance: 3 },
    { day: 'Wed', event: 'FOMC Minutes', time: '2:00 PM', actual: '-', forecast: '-', previous: '-', importance: 3 },
    { day: 'Wed', event: 'Crude Oil Inventories', time: '10:30 AM', actual: '-2.1M', forecast: '-1.5M', previous: '-0.8M', importance: 1 },
    { day: 'Thu', event: 'GDP Preliminary Estimate', time: '8:30 AM', actual: '2.8%', forecast: '2.5%', previous: '2.3%', importance: 3 },
    { day: 'Thu', event: 'Initial Jobless Claims', time: '8:30 AM', actual: '225K', forecast: '230K', previous: '232K', importance: 2 },
    { day: 'Fri', event: 'NFP Jobs Report', time: '8:30 AM', actual: '185K', forecast: '175K', previous: '165K', importance: 3 },
    { day: 'Fri', event: 'Unemployment Rate', time: '8:30 AM', actual: '3.8%', forecast: '3.9%', previous: '3.9%', importance: 2 },
  ];

  const earningsThisWeek = [
    { day: 'Mon', company: 'Apple Inc.', ticker: 'AAPL', time: 'After Close', actualEPS: '2.18', forecastEPS: '2.10', surprise: '+3.8%', importance: 3 },
    { day: 'Mon', company: 'JPMorgan Chase', ticker: 'JPM', time: 'Before Open', actualEPS: '3.97', forecastEPS: '3.89', surprise: '+2.1%', importance: 2 },
    { day: 'Tue', company: 'Microsoft Corp.', ticker: 'MSFT', time: 'After Close', actualEPS: '2.93', forecastEPS: '2.78', surprise: '+5.4%', importance: 3 },
    { day: 'Tue', company: 'Bank of America', ticker: 'BAC', time: 'Before Open', actualEPS: '0.82', forecastEPS: '0.77', surprise: '+6.5%', importance: 2 },
    { day: 'Wed', company: 'Tesla Inc.', ticker: 'TSLA', time: 'After Close', actualEPS: '0.71', forecastEPS: '0.73', surprise: '-2.7%', importance: 3 },
    { day: 'Wed', company: 'Netflix Inc.', ticker: 'NFLX', time: 'After Close', actualEPS: '4.54', forecastEPS: '4.21', surprise: '+7.8%', importance: 2 },
    { day: 'Thu', company: 'Amazon.com Inc.', ticker: 'AMZN', time: 'After Close', actualEPS: '1.43', forecastEPS: '1.56', surprise: '-8.3%', importance: 3 },
    { day: 'Thu', company: 'Intel Corp.', ticker: 'INTC', time: 'After Close', actualEPS: '0.54', forecastEPS: '0.43', surprise: '+25.6%', importance: 1 },
    { day: 'Fri', company: 'Meta Platforms', ticker: 'META', time: 'After Close', actualEPS: '5.33', forecastEPS: '5.19', surprise: '+2.7%', importance: 3 },
    { day: 'Fri', company: 'Visa Inc.', ticker: 'V', time: 'After Close', actualEPS: '2.51', forecastEPS: '2.44', surprise: '+2.9%', importance: 2 },
  ];

  const newsThisWeek = [
    // Today
    { source: 'Bloomberg', title: 'Fed Signals Potential Rate Cut in Q2', color: 'bg-purple-500', timeAgo: '2h ago', type: 'today', importance: 3 },
    { source: 'Reuters', title: 'Oil Prices Surge on Middle East Tensions', color: 'bg-orange-500', timeAgo: '3h ago', type: 'today', importance: 3 },
    { source: 'WSJ', title: 'Tech Giants Report Record Q4 Earnings', color: 'bg-blue-600', timeAgo: '4h ago', type: 'today', importance: 2 },
    { source: 'CNBC', title: 'S&P 500 Hits All-Time High Amid Rally', color: 'bg-red-500', timeAgo: '5h ago', type: 'today', importance: 2 },
    // Trending
    { source: 'FT', title: 'Dollar Weakens Against Major Currencies', color: 'bg-pink-500', timeAgo: '6h ago', type: 'trending', importance: 2 },
    { source: 'Bloomberg', title: 'China Economic Growth Beats Expectations', color: 'bg-purple-500', timeAgo: '8h ago', type: 'trending', importance: 2 },
    { source: 'Reuters', title: 'European Markets Rally on ECB Comments', color: 'bg-orange-500', timeAgo: '10h ago', type: 'trending', importance: 1 },
    { source: 'WSJ', title: 'Cryptocurrency Regulation Framework Announced', color: 'bg-blue-600', timeAgo: '12h ago', type: 'trending', importance: 2 },
    // Breaking
    { source: 'CNBC', title: '🚨 BREAKING: Major tech merger announced', color: 'bg-red-500', timeAgo: '30m ago', type: 'breaking', importance: 3 },
    { source: 'FT', title: '⚡️ ALERT: Emergency Fed meeting scheduled', color: 'bg-pink-500', timeAgo: '1h ago', type: 'breaking', importance: 3 },
    { source: 'Bloomberg', title: '🔴 JUST IN: Treasury yields spike sharply', color: 'bg-purple-500', timeAgo: '1h ago', type: 'breaking', importance: 3 },
    { source: 'Reuters', title: '📢 DEVELOPING: Major bank reports losses', color: 'bg-orange-500', timeAgo: '2h ago', type: 'breaking', importance: 3 },
  ];

  const togglePredictionCategory = (index: number) => {
    setExpandedPredictionCategories(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };



  // Importance indicator component
  const ImportanceIndicator = ({ level }: { level: 1 | 2 | 3 }) => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-yellow-500',
      3: 'bg-red-500'
    };
    
    return (
      <div className="flex items-end gap-[2px]">
        <div className={`w-[3px] h-2 rounded-sm ${colors[level]}`} />
        {level >= 2 && <div className={`w-[3px] h-2.5 rounded-sm ${colors[level]}`} />}
        {level >= 3 && <div className={`w-[3px] h-3 rounded-sm ${colors[level]}`} />}
      </div>
    );
  };

  // News importance indicator with exclamation mark
  const NewsIndicator = ({ level }: { level: 1 | 2 | 3 }) => {
    const colors = {
      1: 'text-green-500',
      2: 'text-yellow-500',
      3: 'text-red-500'
    };
    
    return (
      <AlertCircle className={`w-4 h-4 ${colors[level]}`} />
    );
  };

  // News source icon component
  const NewsSourceIcon = ({ source }: { source: string }) => {
    // Map news sources to their appropriate icons
    const getIcon = () => {
      switch(source) {
        case 'Bloomberg':
          return <Newspaper className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
        case 'Reuters':
          return <Radio className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
        case 'WSJ':
          return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
        case 'CNBC':
          return <BarChart3 className="w-4 h-4 text-red-600 dark:text-red-400" />;
        case 'FT':
          return <Briefcase className="w-4 h-4 text-pink-600 dark:text-pink-400" />;
        default:
          return <Newspaper className="w-4 h-4 text-muted-foreground" />;
      }
    };
    
    return getIcon();
  };

  // Mock notifications data
  const mockNotifications = [
    {
      id: 'report-1',
      type: 'report' as const,
      reportType: 'daily' as const,
      podcastTitle: 'Daily Market Pulse',
      podcastImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop',
      episodeTitle: 'Bitcoin reaches new all-time high',
      duration: 'Report',
      timeAgo: '18 hours ago',
      isUnread: true
    },
    {
      id: 'report-2',
      type: 'report' as const,
      reportType: 'weekly' as const,
      podcastTitle: 'Weekly Summary',
      podcastImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
      episodeTitle: 'Tech Earnings Analysis',
      duration: 'Report',
      timeAgo: '1 day ago',
      isUnread: true
    },
    {
      id: '3',
      type: 'episode' as const,
      podcastTitle: 'The Compound and Friends',
      podcastImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      episodeTitle: 'Understanding Crypto Markets',
      duration: '45 min',
      timeAgo: '2 days ago',
      isUnread: false
    },
    {
      id: '4',
      type: 'report' as const,
      reportType: 'monthly' as const,
      podcastTitle: 'Monthly Report',
      podcastImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      episodeTitle: 'Q4 Financial Outlook',
      duration: 'Report',
      timeAgo: '3 days ago',
      isUnread: false
    },
    {
      id: '5',
      type: 'episode' as const,
      podcastTitle: 'All-In Podcast',
      podcastImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      episodeTitle: 'The Future of DeFi and Web3',
      duration: '52 min',
      timeAgo: '4 days ago',
      isUnread: false
    },
  ];

  const { effectiveTheme, setTheme } = useTheme();

  // Prediction market data
  const predictionMarkets = [
    {
      category: 'Geo-Politics',
      predictions: [
        {
          id: 'geo-1',
          question: 'Will the US-China trade deal be signed by Q3?',
          yesPercent: 62,
          noPercent: 38,
        },
        {
          id: 'geo-2',
          question: 'Will NATO expand to include new members?',
          yesPercent: 48,
          noPercent: 52,
        },
        {
          id: 'geo-3',
          question: 'Will Ukraine join the EU by 2027?',
          yesPercent: 35,
          noPercent: 65,
        },
        {
          id: 'geo-4',
          question: 'Will there be a G7 summit in Asia?',
          yesPercent: 71,
          noPercent: 29,
        },
      ]
    },
    {
      category: 'Economy',
      predictions: [
        {
          id: 'eco-1',
          question: 'Will the Fed cut rates by March 2026?',
          yesPercent: 67,
          noPercent: 33,
        },
        {
          id: 'eco-2',
          question: 'Will inflation fall below 2% in 2026?',
          yesPercent: 41,
          noPercent: 59,
        },
        {
          id: 'eco-3',
          question: 'Will unemployment drop below 3.5%?',
          yesPercent: 54,
          noPercent: 46,
        },
        {
          id: 'eco-4',
          question: 'Will US GDP growth exceed 3%?',
          yesPercent: 58,
          noPercent: 42,
        },
      ]
    },
    {
      category: 'Technology',
      predictions: [
        {
          id: 'tech-1',
          question: 'Will Apple release AR glasses in 2026?',
          yesPercent: 34,
          noPercent: 66,
        },
        {
          id: 'tech-2',
          question: 'OpenAI IPO by end of 2026?',
          yesPercent: 45,
          noPercent: 55,
        },
        {
          id: 'tech-3',
          question: 'Will Meta launch a new VR headset?',
          yesPercent: 78,
          noPercent: 22,
        },
        {
          id: 'tech-4',
          question: 'Will NVIDIA reach $1 trillion market cap?',
          yesPercent: 81,
          noPercent: 19,
        },
      ]
    },
    {
      category: 'MARKETS',
      predictions: [
        {
          id: 'mkt-1',
          question: 'Bitcoin above $100k by end of Q1?',
          yesPercent: 73,
          noPercent: 27,
        },
        {
          id: 'mkt-2',
          question: 'S&P 500 to hit 7,000 in 2026?',
          yesPercent: 58,
          noPercent: 42,
        },
        {
          id: 'mkt-3',
          question: 'Will Tesla reach $500 per share?',
          yesPercent: 45,
          noPercent: 55,
        },
        {
          id: 'mkt-4',
          question: 'Gold above $3,000 per ounce?',
          yesPercent: 62,
          noPercent: 38,
        },
      ]
    },
    {
      category: 'TRENDING',
      predictions: [
        {
          id: 'trd-1',
          question: 'Will AI replace 10% of jobs by 2027?',
          yesPercent: 68,
          noPercent: 32,
        },
        {
          id: 'trd-2',
          question: 'Will remote work become permanent norm?',
          yesPercent: 82,
          noPercent: 18,
        },
        {
          id: 'trd-3',
          question: 'Will electric cars outsell gas cars?',
          yesPercent: 39,
          noPercent: 61,
        },
        {
          id: 'trd-4',
          question: 'Will a new social media platform emerge?',
          yesPercent: 56,
          noPercent: 44,
        },
      ]
    },
    {
      category: 'BREAKING',
      predictions: [
        {
          id: 'brk-1',
          question: 'Will there be a major tech acquisition?',
          yesPercent: 75,
          noPercent: 25,
        },
        {
          id: 'brk-2',
          question: 'Will oil prices spike above $100?',
          yesPercent: 42,
          noPercent: 58,
        },
        {
          id: 'brk-3',
          question: 'Will a new variant emerge by Q2?',
          yesPercent: 36,
          noPercent: 64,
        },
        {
          id: 'brk-4',
          question: 'Will major climate summit succeed?',
          yesPercent: 51,
          noPercent: 49,
        },
      ]
    },
  ];

  // Tweet feed data
  const tweetFeed = [
    {
      id: 'tweet-1',
      authorName: 'The Compound',
      authorHandle: '@thecompoundnews',
      authorAvatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=100&h=100&fit=crop',
      content: 'Bitcoin reaching new highs as institutional adoption accelerates. This is a pivotal moment for digital assets.',
      timeAgo: '2h',
      isVerified: true,
      likes: 342,
      retweets: 89,
      replies: 23,
      type: 'show',
    },
    {
      id: 'tweet-2',
      authorName: 'All-In Podcast',
      authorHandle: '@allinpodcast',
      authorAvatar: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=100&h=100&fit=crop',
      content: 'Latest episode: Deep dive into AI regulation and the future of tech policy. Link in bio.',
      timeAgo: '4h',
      isVerified: true,
      likes: 528,
      retweets: 142,
      replies: 67,
      type: 'show',
    },
    {
      id: 'tweet-3',
      authorName: 'Planet Money',
      authorHandle: '@planetmoney',
      authorAvatar: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop',
      content: 'The Fed\'s next move could reshape the entire market landscape. Our analysis breaks it down.',
      timeAgo: '6h',
      isVerified: true,
      likes: 891,
      retweets: 234,
      replies: 112,
      type: 'show',
    },
    {
      id: 'tweet-4',
      authorName: 'Odd Lots',
      authorHandle: '@oddlots',
      authorAvatar: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=100&h=100&fit=crop',
      content: 'Commodity markets are sending mixed signals. What does this mean for inflation?',
      timeAgo: '8h',
      isVerified: true,
      likes: 456,
      retweets: 78,
      replies: 34,
      type: 'show',
    },
    {
      id: 'tweet-5',
      authorName: 'Bloomberg Markets',
      authorHandle: '@markets',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      content: 'BREAKING: Tech stocks rally on stronger-than-expected earnings reports. Nasdaq up 2.3% in early trading.',
      timeAgo: '12h',
      isVerified: true,
      likes: 1243,
      retweets: 412,
      replies: 178,
      type: 'person',
    },
    {
      id: 'tweet-6',
      authorName: 'CNBC',
      authorHandle: '@CNBC',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      content: 'Treasury yields fall as investors digest latest inflation data. 10-year note at 4.12%.',
      timeAgo: '15h',
      isVerified: true,
      likes: 687,
      retweets: 156,
      replies: 91,
      type: 'person',
    },
    {
      id: 'tweet-7',
      authorName: 'Financial Times',
      authorHandle: '@FT',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      content: 'Oil prices surge as OPEC+ extends production cuts through Q2. WTI crude crosses $85/barrel.',
      timeAgo: '18h',
      isVerified: true,
      likes: 923,
      retweets: 267,
      replies: 143,
      type: 'person',
    },
    {
      id: 'tweet-8',
      authorName: 'WSJ Markets',
      authorHandle: '@WSJmarkets',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      content: 'Dollar strengthens against major currencies as safe-haven demand rises amid geopolitical tensions.',
      timeAgo: '22h',
      isVerified: true,
      likes: 534,
      retweets: 129,
      replies: 67,
      type: 'person',
    },
    // Trending tweets
    {
      id: 'tweet-9',
      authorName: 'Reuters',
      authorHandle: '@Reuters',
      authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
      content: '🔥 TRENDING: Federal Reserve signals potential policy shift. Markets react with cautious optimism.',
      timeAgo: '1h',
      isVerified: true,
      likes: 2834,
      retweets: 892,
      replies: 456,
      type: 'trending',
    },
    {
      id: 'tweet-10',
      authorName: 'TechCrunch',
      authorHandle: '@TechCrunch',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      content: '⚡️ AI startup valued at $10B after latest funding round. Investors betting big on AGI race.',
      timeAgo: '3h',
      isVerified: true,
      likes: 1923,
      retweets: 645,
      replies: 287,
      type: 'trending',
    },
    {
      id: 'tweet-11',
      authorName: 'Bloomberg',
      authorHandle: '@business',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      content: '📈 Crypto markets surge 15% overnight. Bitcoin ETF approvals driving institutional demand.',
      timeAgo: '5h',
      isVerified: true,
      likes: 3421,
      retweets: 1234,
      replies: 678,
      type: 'trending',
    },
    {
      id: 'tweet-12',
      authorName: 'The Economist',
      authorHandle: '@TheEconomist',
      authorAvatar: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=100&h=100&fit=crop',
      content: '🌍 Global supply chains stabilizing after years of disruption. What this means for inflation.',
      timeAgo: '7h',
      isVerified: true,
      likes: 1567,
      retweets: 423,
      replies: 234,
      type: 'trending',
    },
  ];

  return (
    <aside className="w-[400px] h-screen sticky top-0 flex flex-col bg-background p-4 overflow-y-auto">
      {/* Framed Container - Single unified container like left sidebar */}
      <div className="bg-card border border-border/50 rounded-3xl shadow-lg overflow-hidden flex flex-col h-full">
        {/* Top Section - User Actions Bar */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-2.5 relative">
            {/* Left side: Premium, Chatbot, and Refresh */}
            <div className="flex items-center gap-2.5">
              {/* Premium Button */}
              {onUpgrade && (
                <button
                  onClick={onUpgrade}
                  className={`relative w-10 h-10 rounded-lg transition-all flex items-center justify-center shadow-sm border ${
                    isPremium 
                      ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border-amber-200 dark:border-amber-900/50' 
                      : 'bg-card border-border/50 hover:bg-muted'
                  }`}
                  title={isPremium ? 'Premium Member' : 'Upgrade to Premium'}
                >
                  <Crown className={`w-5 h-5 ${isPremium ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground'}`} />
                </button>
              )}

              {/* AI Chat Bot Button */}
              {onToggleChat && (
                <button
                  onClick={onToggleChat}
                  className={`relative w-10 h-10 rounded-lg transition-all flex items-center justify-center shadow-sm border ${
                    isChatOpen 
                      ? 'bg-muted/80 border-border/50' 
                      : 'bg-card border-border/50 hover:bg-muted'
                  }`}
                  title={isChatOpen ? copy.sidebar.closeAIAssistant : copy.sidebar.openAIAssistant}
                >
                  <Bot className={`w-5 h-5 ${isChatOpen ? 'text-foreground' : 'text-muted-foreground'}`} />
                </button>
              )}
              
              {/* Refresh Button - for News/Calendar/Earnings/Tweets/Predictions/Markets */}
              <button
                onClick={() => {
                  // TODO: Implement refresh functionality
                  console.log('Refresh data: News, Calendar, Earnings, Tweets, Predictions, Markets');
                }}
                className="relative w-10 h-10 rounded-lg bg-card border border-border/50 hover:bg-muted transition-all flex items-center justify-center shadow-sm group"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </div>

            {/* Separator - Centered in the gap */}
            <div className="w-px h-7 bg-border/50" />

            {/* Right side: Notifications, User */}
            <div className="flex items-center gap-2.5">
              {/* Notification Bell */}
              <button
                ref={notificationsRef}
                onClick={() => setNotificationsPopupOpen(!isNotificationsPopupOpen)}
                className={`relative w-10 h-10 rounded-lg transition-all flex items-center justify-center shadow-sm border ${
                  isNotificationsPopupOpen
                    ? 'bg-muted/80 border-border/50'
                    : 'bg-card border-border/50 hover:bg-muted'
                }`}
                title={copy.nav.notifications}
              >
                <Bell className={`w-5 h-5 ${isNotificationsPopupOpen ? 'text-foreground' : 'text-muted-foreground'}`} />
                {notificationsCount !== undefined && notificationsCount > 0 && (
                  <NotificationBadge count={notificationsCount} />
                )}
              </button>

              {/* User Profile Button */}
              <UserProfileButton
                isLoggedIn={isLoggedIn}
                isPremium={isPremium}
                userImage={userImage}
                userName={userName}
                onProfileClick={onProfileClick}
                onPremiumClick={onUpgrade}
                onSettingsClick={onSettingsClick}
                onHelpClick={onHelpClick}
                onSignOut={onSignOut}
              />
            </div>
          </div>
        </div>

        {/* Separator after top section */}
        <div className="mx-4 border-t border-border/30" />

        {/* Middle Section - Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Calendar Menu */}
          {activeMenu === 'calendar' && (
            <div className="space-y-4">
              {/* Day Tabs with Critical Button Integrated */}
              <div className="flex gap-1.5 p-1.5 bg-muted/30 rounded-lg border border-border/30">
                {/* Day Tabs */}
                {[
                  { short: 'Mon', full: 'Monday', date: 20 },
                  { short: 'Tue', full: 'Tuesday', date: 21 },
                  { short: 'Wed', full: 'Wednesday', date: 22 },
                  { short: 'Thu', full: 'Thursday', date: 23 },
                  { short: 'Fri', full: 'Friday', date: 24 }
                ].map((dayInfo) => {
                  const dayEvents = catalystsThisWeek.filter(catalyst => catalyst.day === dayInfo.short);
                  const hasEvents = dayEvents.length > 0;
                  const isSelected = !showCriticalCalendar && selectedCalendarDay === dayInfo.short;
                  
                  return (
                    <button
                      key={dayInfo.short}
                      onClick={() => {
                        setShowCriticalCalendar(false);
                        setSelectedCalendarDay(dayInfo.short);
                      }}
                      disabled={!hasEvents}
                      className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-md transition-all ${
                        isSelected
                          ? 'bg-card border border-border/50 shadow-sm'
                          : hasEvents
                          ? 'hover:bg-muted/50 border border-transparent'
                          : 'opacity-40 cursor-not-allowed border border-transparent'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${
                        isSelected ? 'bg-muted/50' : 'bg-transparent'
                      }`}>
                        <span className={`text-[10px] font-bold tabular-nums ${
                          isSelected ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {dayInfo.date}
                        </span>
                      </div>
                      <span className={`text-[8px] font-semibold uppercase tracking-wider ${
                        isSelected ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {dayInfo.short}
                      </span>
                      {hasEvents && (
                        <div className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-foreground' : 'bg-muted-foreground'
                        }`} />
                      )}
                    </button>
                  );
                })}
                
                {/* Separator */}
                <div className="w-px bg-border/50 my-1.5" />
                
                {/* Critical This Week Button */}
                <button
                  onClick={() => setShowCriticalCalendar(!showCriticalCalendar)}
                  className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-md transition-all ${
                    showCriticalCalendar
                      ? 'bg-card border border-border/50 shadow-sm'
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${
                    showCriticalCalendar ? 'bg-muted/50' : 'bg-transparent'
                  }`}>
                    <AlertCircle className={`w-3.5 h-3.5 ${
                      showCriticalCalendar ? 'text-red-500' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <span className={`text-[10px] font-bold tabular-nums ${
                    showCriticalCalendar ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {catalystsThisWeek.filter(c => c.importance === 3).length}
                  </span>
                </button>
              </div>

              {/* Selected Day Events or Critical Events View */}
              {(() => {
                // Critical Events View
                if (showCriticalCalendar) {
                  const criticalEvents = catalystsThisWeek.filter(catalyst => catalyst.importance === 3);
                  
                  if (criticalEvents.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-xs text-muted-foreground">No critical events</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">this week</p>
                      </div>
                    );
                  }

                  // Group critical events by day
                  const daysWithCritical = [
                    { short: 'Mon', full: 'Monday', date: 20 },
                    { short: 'Tue', full: 'Tuesday', date: 21 },
                    { short: 'Wed', full: 'Wednesday', date: 22 },
                    { short: 'Thu', full: 'Thursday', date: 23 },
                    { short: 'Fri', full: 'Friday', date: 24 }
                  ].filter(day => criticalEvents.some(e => e.day === day.short));

                  return (
                    <div className="space-y-3">
                      {daysWithCritical.map((dayInfo) => {
                        const dayCriticalEvents = criticalEvents.filter(e => e.day === dayInfo.short);
                        
                        return (
                          <div key={dayInfo.short}>
                            {/* Day Header for Critical View */}
                            <div className="flex items-center gap-2 px-2.5 py-1.5 mb-2 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 shadow-sm hover:border-border hover:shadow-md transition-all">
                              <div className="flex-shrink-0 w-5 h-5 rounded bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 tabular-nums">
                                  {dayInfo.date}
                                </span>
                              </div>
                              <h3 className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                                {dayInfo.full}
                              </h3>
                              <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40">
                                <span className="text-[9px] font-bold text-red-600 dark:text-red-400 tabular-nums">
                                  {dayCriticalEvents.length}
                                </span>
                              </div>
                            </div>

                            {/* Critical Events for this day */}
                            <div className="space-y-2 mb-3">
                              {dayCriticalEvents.map((catalyst, catalystIndex) => (
                                <div 
                                  key={catalystIndex} 
                                  className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer"
                                >
                                  {/* Event Header */}
                                  <div className="flex items-start gap-2.5 mb-2.5">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                                      <Calendar className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-foreground">{catalyst.event}</p>
                                      <p className="text-[10px] text-muted-foreground mt-0.5">{catalyst.time}</p>
                                    </div>
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center" title="Importance: High">
                                      <ImportanceIndicator level={3} />
                                    </div>
                                  </div>
                                  
                                  {/* Economic Data - Three columns */}
                                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border/30">
                                    {/* Actual */}
                                    <div className="text-center">
                                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{copy.sidebar.actual}</p>
                                      <p className={`text-[11px] font-semibold tabular-nums ${getComparisonColor(catalyst.actual, catalyst.forecast)}`}>{catalyst.actual}</p>
                                    </div>
                                    
                                    {/* Forecast */}
                                    <div className="text-center">
                                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{copy.sidebar.forecast}</p>
                                      <p className={`text-[11px] font-semibold tabular-nums ${
                                        parseNumericValue(catalyst.actual) !== null && parseNumericValue(catalyst.previous) !== null
                                          ? getComparisonColor(catalyst.forecast, catalyst.actual, false)
                                          : getComparisonColor(catalyst.forecast, catalyst.previous, false)
                                      }`}>{catalyst.forecast}</p>
                                    </div>
                                    
                                    {/* Previous */}
                                    <div className="text-center">
                                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{copy.sidebar.prior}</p>
                                      <p className={`text-[11px] font-semibold tabular-nums ${getComparisonColor(catalyst.previous, catalyst.forecast)}`}>{catalyst.previous}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // Normal Day View
                const selectedDayInfo = [
                  { short: 'Mon', full: 'Monday', date: 20 },
                  { short: 'Tue', full: 'Tuesday', date: 21 },
                  { short: 'Wed', full: 'Wednesday', date: 22 },
                  { short: 'Thu', full: 'Thursday', date: 23 },
                  { short: 'Fri', full: 'Friday', date: 24 }
                ].find(d => d.short === selectedCalendarDay);
                
                const dayEvents = catalystsThisWeek.filter(catalyst => catalyst.day === selectedCalendarDay);
                
                if (dayEvents.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-muted-foreground">No events scheduled</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">for {selectedDayInfo?.full}</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    {dayEvents.map((catalyst, catalystIndex) => (
                      <div 
                        key={catalystIndex} 
                        className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer"
                      >
                        {/* Event Header */}
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{catalyst.event}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{catalyst.time}</p>
                          </div>
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center" title={`Importance: ${catalyst.importance === 1 ? 'Low' : catalyst.importance === 2 ? 'Medium' : 'High'}`}>
                            <ImportanceIndicator level={catalyst.importance as 1 | 2 | 3} />
                          </div>
                        </div>
                        
                        {/* Economic Data - Three columns */}
                        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border/30">
                          {/* Actual */}
                          <div className="text-center">
                            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{copy.sidebar.actual}</p>
                            <p className={`text-[11px] font-semibold tabular-nums ${getComparisonColor(catalyst.actual, catalyst.forecast)}`}>{catalyst.actual}</p>
                          </div>
                          
                          {/* Forecast */}
                          <div className="text-center">
                            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{copy.sidebar.forecast}</p>
                            <p className={`text-[11px] font-semibold tabular-nums ${
                              parseNumericValue(catalyst.actual) !== null && parseNumericValue(catalyst.previous) !== null
                                ? getComparisonColor(catalyst.forecast, catalyst.actual, false)
                                : getComparisonColor(catalyst.forecast, catalyst.previous, false)
                            }`}>{catalyst.forecast}</p>
                          </div>
                          
                          {/* Previous */}
                          <div className="text-center">
                            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{copy.sidebar.prior}</p>
                            <p className={`text-[11px] font-semibold tabular-nums ${getComparisonColor(catalyst.previous, catalyst.forecast)}`}>{catalyst.previous}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Earnings Menu */}
          {activeMenu === 'earnings' && (
            <div className="space-y-4">
              {/* Day Tabs with Critical Button Integrated */}
              <div className="flex gap-1.5 p-1.5 bg-muted/30 rounded-lg border border-border/30">
                {/* Day Tabs */}
                {[
                  { short: 'Mon', full: 'Monday', date: 20 },
                  { short: 'Tue', full: 'Tuesday', date: 21 },
                  { short: 'Wed', full: 'Wednesday', date: 22 },
                  { short: 'Thu', full: 'Thursday', date: 23 },
                  { short: 'Fri', full: 'Friday', date: 24 }
                ].map((dayInfo) => {
                  const dayEarnings = earningsThisWeek.filter(earning => earning.day === dayInfo.short);
                  const hasEarnings = dayEarnings.length > 0;
                  const isSelected = !showCriticalEarnings && selectedEarningsDay === dayInfo.short;
                  
                  return (
                    <button
                      key={dayInfo.short}
                      onClick={() => {
                        setShowCriticalEarnings(false);
                        setSelectedEarningsDay(dayInfo.short);
                      }}
                      disabled={!hasEarnings}
                      className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-md transition-all ${
                        isSelected
                          ? 'bg-card border border-border/50 shadow-sm'
                          : hasEarnings
                          ? 'hover:bg-muted/50 border border-transparent'
                          : 'opacity-40 cursor-not-allowed border border-transparent'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${
                        isSelected ? 'bg-muted/50' : 'bg-transparent'
                      }`}>
                        <span className={`text-[10px] font-bold tabular-nums ${
                          isSelected ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {dayInfo.date}
                        </span>
                      </div>
                      <span className={`text-[8px] font-semibold uppercase tracking-wider ${
                        isSelected ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {dayInfo.short}
                      </span>
                      {hasEarnings && (
                        <div className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-foreground' : 'bg-muted-foreground'
                        }`} />
                      )}
                    </button>
                  );
                })}
                
                {/* Separator */}
                <div className="w-px bg-border/50 my-1.5" />
                
                {/* Critical Earnings Button */}
                <button
                  onClick={() => setShowCriticalEarnings(!showCriticalEarnings)}
                  className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-md transition-all ${
                    showCriticalEarnings
                      ? 'bg-card border border-border/50 shadow-sm'
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${
                    showCriticalEarnings ? 'bg-muted/50' : 'bg-transparent'
                  }`}>
                    <AlertCircle className={`w-3.5 h-3.5 ${
                      showCriticalEarnings ? 'text-red-500' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <span className={`text-[10px] font-bold tabular-nums ${
                    showCriticalEarnings ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {earningsThisWeek.filter(e => e.importance === 3).length}
                  </span>
                </button>
              </div>

              {/* Selected Day Earnings or Critical Earnings View */}
              {(() => {
                // Critical Earnings View
                if (showCriticalEarnings) {
                  const criticalEarnings = earningsThisWeek.filter(earning => earning.importance === 3);
                  
                  if (criticalEarnings.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-xs text-muted-foreground">No critical earnings</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">this week</p>
                      </div>
                    );
                  }

                  // Group critical earnings by day
                  const daysWithCritical = [
                    { short: 'Mon', full: 'Monday', date: 20 },
                    { short: 'Tue', full: 'Tuesday', date: 21 },
                    { short: 'Wed', full: 'Wednesday', date: 22 },
                    { short: 'Thu', full: 'Thursday', date: 23 },
                    { short: 'Fri', full: 'Friday', date: 24 }
                  ].filter(day => criticalEarnings.some(e => e.day === day.short));

                  return (
                    <div className="space-y-3">
                      {daysWithCritical.map((dayInfo) => {
                        const dayCriticalEarnings = criticalEarnings.filter(e => e.day === dayInfo.short);
                        
                        return (
                          <div key={dayInfo.short}>
                            {/* Day Header for Critical View */}
                            <div className="flex items-center gap-2 px-2.5 py-1.5 mb-2 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 shadow-sm hover:border-border hover:shadow-md transition-all">
                              <div className="flex-shrink-0 w-5 h-5 rounded bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 tabular-nums">
                                  {dayInfo.date}
                                </span>
                              </div>
                              <h3 className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                                {dayInfo.full}
                              </h3>
                              <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40">
                                <span className="text-[9px] font-bold text-red-600 dark:text-red-400 tabular-nums">
                                  {dayCriticalEarnings.length}
                                </span>
                              </div>
                            </div>

                            {/* Critical Earnings for this day */}
                            <div className="space-y-2 mb-3">
                              {dayCriticalEarnings.map((earning, earningIndex) => (
                                <div 
                                  key={earningIndex} 
                                  className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer"
                                >
                                  {/* Company Header */}
                                  <div className="flex items-start gap-2.5 mb-2.5">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                                      <Building2 className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-foreground">{earning.company}</p>
                                      <p className="text-[10px] text-muted-foreground mt-0.5">{earning.time} · {earning.ticker}</p>
                                    </div>
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center" title="Importance: High">
                                      <ImportanceIndicator level={3} />
                                    </div>
                                  </div>
                                  
                                  {/* EPS Data - Three columns */}
                                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border/30">
                                    {/* Actual EPS */}
                                    <div className="text-center">
                                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Actual EPS</p>
                                      <p className={`text-[11px] font-semibold tabular-nums ${getComparisonColor(earning.actualEPS, earning.forecastEPS)}`}>${earning.actualEPS}</p>
                                    </div>
                                    
                                    {/* Forecast EPS */}
                                    <div className="text-center">
                                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Forecast EPS</p>
                                      <p className={`text-[11px] font-semibold tabular-nums ${getComparisonColor(earning.forecastEPS, earning.actualEPS, false)}`}>${earning.forecastEPS}</p>
                                    </div>
                                    
                                    {/* Surprise */}
                                    <div className="text-center">
                                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Surprise</p>
                                      <p className={`text-[11px] font-semibold tabular-nums ${
                                        earning.surprise.startsWith('+') 
                                          ? 'text-emerald-600 dark:text-emerald-400' 
                                          : 'text-red-600 dark:text-red-400'
                                      }`}>{earning.surprise}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // Normal Day View
                const selectedDayInfo = [
                  { short: 'Mon', full: 'Monday', date: 20 },
                  { short: 'Tue', full: 'Tuesday', date: 21 },
                  { short: 'Wed', full: 'Wednesday', date: 22 },
                  { short: 'Thu', full: 'Thursday', date: 23 },
                  { short: 'Fri', full: 'Friday', date: 24 }
                ].find(d => d.short === selectedEarningsDay);
                
                const dayEarnings = earningsThisWeek.filter(earning => earning.day === selectedEarningsDay);
                
                if (dayEarnings.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-muted-foreground">No earnings scheduled</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">for {selectedDayInfo?.full}</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    {dayEarnings.map((earning, earningIndex) => (
                      <div 
                        key={earningIndex} 
                        className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer"
                      >
                        {/* Company Header */}
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{earning.company}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{earning.time} · {earning.ticker}</p>
                          </div>
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center" title={`Importance: ${earning.importance === 1 ? 'Low' : earning.importance === 2 ? 'Medium' : 'High'}`}>
                            <ImportanceIndicator level={earning.importance as 1 | 2 | 3} />
                          </div>
                        </div>
                        
                        {/* EPS Data - Three columns */}
                        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border/30">
                          {/* Actual EPS */}
                          <div className="text-center">
                            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Actual EPS</p>
                            <p className={`text-[11px] font-semibold tabular-nums ${getComparisonColor(earning.actualEPS, earning.forecastEPS)}`}>${earning.actualEPS}</p>
                          </div>
                          
                          {/* Forecast EPS */}
                          <div className="text-center">
                            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Forecast EPS</p>
                            <p className={`text-[11px] font-semibold tabular-nums ${getComparisonColor(earning.forecastEPS, earning.actualEPS, false)}`}>${earning.forecastEPS}</p>
                          </div>
                          
                          {/* Surprise */}
                          <div className="text-center">
                            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Surprise</p>
                            <p className={`text-[11px] font-semibold tabular-nums ${
                              earning.surprise.startsWith('+') 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>{earning.surprise}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* News Menu */}
          {activeMenu === 'news' && (
            <div className="space-y-4">
              {/* Category Cards - Box Style */}
              <div className="grid grid-cols-3 gap-2">
                {/* Today */}
                <button
                  onClick={() => setSelectedNewsCategory(0)}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                    selectedNewsCategory === 0 
                      ? 'bg-muted border-border shadow-md' 
                      : 'bg-card border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                    selectedNewsCategory === 0 ? 'bg-muted/50' : ''
                  }`}>
                    <Newspaper className={`w-4 h-4 ${selectedNewsCategory === 0 ? 'text-blue-500' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider text-center leading-tight ${
                    selectedNewsCategory === 0 ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    Today
                  </span>
                </button>

                {/* Trending */}
                <button
                  onClick={() => setSelectedNewsCategory(1)}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                    selectedNewsCategory === 1 
                      ? 'bg-muted border-border shadow-md' 
                      : 'bg-card border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                    selectedNewsCategory === 1 ? 'bg-muted/50' : ''
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${selectedNewsCategory === 1 ? 'text-green-500' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider text-center leading-tight ${
                    selectedNewsCategory === 1 ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    Trending
                  </span>
                </button>

                {/* Breaking */}
                <button
                  onClick={() => setSelectedNewsCategory(2)}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                    selectedNewsCategory === 2 
                      ? 'bg-muted border-border shadow-md' 
                      : 'bg-card border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                    selectedNewsCategory === 2 ? 'bg-muted/50' : ''
                  }`}>
                    <AlertCircle className={`w-4 h-4 ${selectedNewsCategory === 2 ? 'text-red-500' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider text-center leading-tight ${
                    selectedNewsCategory === 2 ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    Breaking
                  </span>
                </button>
              </div>

              {/* Selected Category News */}
              <div className="space-y-2">
                {newsThisWeek.filter(news => 
                  (selectedNewsCategory === 0 && news.type === 'today') ||
                  (selectedNewsCategory === 1 && news.type === 'trending') ||
                  (selectedNewsCategory === 2 && news.type === 'breaking')
                ).map((news, newsIndex) => (
                  <div 
                    key={newsIndex} 
                    className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        <NewsSourceIcon source={news.source} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-snug mb-1">{news.title}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground">{news.source}</span>
                          <span className="text-[10px] text-muted-foreground">·</span>
                          <span className="text-[10px] text-muted-foreground">{news.timeAgo}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center" title={`Importance: ${news.importance === 1 ? 'Low' : news.importance === 2 ? 'Medium' : 'High'}`}>
                        <NewsIndicator level={news.importance as 1 | 2 | 3} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Markets Menu */}
          {activeMenu === 'markets' && (
            <div className="space-y-4">
              {/* Category Cards - Box Style */}
              <div className="grid grid-cols-3 gap-2">
                {assetCategories.map((category, categoryIndex) => {
                  const isSelected = selectedMarketCategory === categoryIndex;
                  return (
                    <button
                      key={categoryIndex}
                      onClick={() => setSelectedMarketCategory(categoryIndex)}
                      className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-muted border-border shadow-md' 
                          : 'bg-card border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-muted/50' : ''
                      }`}>
                        {category.title === 'METALS' && <Gem className={`w-4 h-4 ${isSelected ? 'text-yellow-500' : 'text-muted-foreground'}`} />}
                        {category.title === 'Equities' && <LineChart className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-muted-foreground'}`} />}
                        {category.title === 'Crypto' && <Cpu className={`w-4 h-4 ${isSelected ? 'text-purple-500' : 'text-muted-foreground'}`} />}
                        {category.title === 'Currencies' && <DollarSign className={`w-4 h-4 ${isSelected ? 'text-green-500' : 'text-muted-foreground'}`} />}
                        {category.title === 'Bonds' && <FileText className={`w-4 h-4 ${isSelected ? 'text-orange-500' : 'text-muted-foreground'}`} />}
                        {category.title === 'Commodities' && <Package className={`w-4 h-4 ${isSelected ? 'text-amber-500' : 'text-muted-foreground'}`} />}
                      </div>
                      <span className={`text-[9px] font-semibold uppercase tracking-wider text-center leading-tight ${
                        isSelected ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {category.title === 'METALS' ? 'Metals' : category.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Category Assets */}
              <div className="grid grid-cols-2 gap-2">
                {assetCategories[selectedMarketCategory].assets.map((asset, assetIndex) => (
                  <div 
                    key={assetIndex}
                    className="p-2.5 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer"
                  >
                    {/* Asset Name */}
                    <p className="text-[10px] font-semibold text-foreground mb-2">
                      {asset.name}
                    </p>
                    
                    {/* Asset Value with Chart */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-xs font-bold text-foreground tabular-nums">
                        {asset.value}
                      </p>
                      {asset.chartData && (
                        <MiniSparkline data={asset.chartData} isPositive={asset.isPositive} />
                      )}
                    </div>
                    
                    {/* Change Info */}
                    <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-border/30">
                      {/* Change Amount */}
                      <span className={`text-[10px] font-semibold tabular-nums ${
                        asset.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {asset.change}
                      </span>
                      
                      {/* Change Percentage with arrow */}
                      <div className={`px-1.5 py-0.5 rounded text-[9px] font-semibold flex items-center gap-0.5 ${
                        asset.isPositive 
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' 
                          : 'text-red-600 bg-red-50 dark:bg-red-950/30'
                      }`}>
                        {asset.isPositive ? '▲' : '▼'}
                        {asset.changePercent.replace(/[+-]/, '')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Predictions Menu */}
          {activeMenu === 'predictions' && (
            <div className="space-y-4">
              {/* Category Cards - Box Style */}
              <div className="grid grid-cols-3 gap-2">
                {predictionMarkets.map((market, marketIndex) => {
                  const isSelected = selectedPredictionCategory === marketIndex;
                  return (
                    <button
                      key={marketIndex}
                      onClick={() => setSelectedPredictionCategory(marketIndex)}
                      className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-muted border-border shadow-md' 
                          : 'bg-card border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-muted/50' : ''
                      }`}>
                        {market.category === 'Geo-Politics' && <Globe2 className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-muted-foreground'}`} />}
                        {market.category === 'Economy' && <Briefcase className={`w-4 h-4 ${isSelected ? 'text-green-500' : 'text-muted-foreground'}`} />}
                        {market.category === 'Technology' && <Zap className={`w-4 h-4 ${isSelected ? 'text-purple-500' : 'text-muted-foreground'}`} />}
                        {market.category === 'MARKETS' && <LineChart className={`w-4 h-4 ${isSelected ? 'text-emerald-500' : 'text-muted-foreground'}`} />}
                        {market.category === 'TRENDING' && <Flame className={`w-4 h-4 ${isSelected ? 'text-orange-500' : 'text-muted-foreground'}`} />}
                        {market.category === 'BREAKING' && <Zap className={`w-4 h-4 ${isSelected ? 'text-red-500' : 'text-muted-foreground'}`} />}
                      </div>
                      <span className={`text-[9px] font-semibold uppercase tracking-wider text-center leading-tight ${
                        isSelected ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {market.category}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Category Predictions */}
              <div className="grid grid-cols-2 gap-2">
                {predictionMarkets[selectedPredictionCategory].predictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="p-2.5 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer"
                  >
                    {/* Question */}
                    <p className="text-[10px] font-semibold text-foreground leading-snug mb-2.5 line-clamp-2 min-h-[28px]">
                      {prediction.question}
                    </p>

                    {/* Yes/No Compact Display */}
                    <div className="space-y-1.5">
                      {/* Yes */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-medium text-muted-foreground w-6">Yes</span>
                        <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all"
                            style={{ width: `${prediction.yesPercent}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-semibold text-foreground w-7 text-right tabular-nums">
                          {prediction.yesPercent}%
                        </span>
                      </div>

                      {/* No */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-medium text-muted-foreground w-6">No</span>
                        <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 dark:bg-red-600 rounded-full transition-all"
                            style={{ width: `${prediction.noPercent}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-semibold text-foreground w-7 text-right tabular-nums">
                          {prediction.noPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tweets Menu */}
          {activeMenu === 'tweets' && (
            <div className="space-y-4">
              {/* Category Cards - Box Style */}
              <div className="grid grid-cols-3 gap-2">
                {/* Shows */}
                <button
                  onClick={() => setSelectedTweetCategory(0)}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTweetCategory === 0 
                      ? 'bg-muted border-border shadow-md' 
                      : 'bg-card border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                    selectedTweetCategory === 0 ? 'bg-muted/50' : ''
                  }`}>
                    <Radio className={`w-4 h-4 ${selectedTweetCategory === 0 ? 'text-blue-500' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider text-center leading-tight ${
                    selectedTweetCategory === 0 ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    Shows
                  </span>
                </button>

                {/* People */}
                <button
                  onClick={() => setSelectedTweetCategory(1)}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTweetCategory === 1 
                      ? 'bg-muted border-border shadow-md' 
                      : 'bg-card border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                    selectedTweetCategory === 1 ? 'bg-muted/50' : ''
                  }`}>
                    <User className={`w-4 h-4 ${selectedTweetCategory === 1 ? 'text-green-500' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider text-center leading-tight ${
                    selectedTweetCategory === 1 ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    People
                  </span>
                </button>

                {/* Trending */}
                <button
                  onClick={() => setSelectedTweetCategory(2)}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTweetCategory === 2 
                      ? 'bg-muted border-border shadow-md' 
                      : 'bg-card border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                    selectedTweetCategory === 2 ? 'bg-muted/50' : ''
                  }`}>
                    <Flame className={`w-4 h-4 ${selectedTweetCategory === 2 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider text-center leading-tight ${
                    selectedTweetCategory === 2 ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    Trending
                  </span>
                </button>
              </div>

              {/* Selected Category Tweets */}
              <div className="space-y-2">
                {tweetFeed.filter(tweet => 
                  (selectedTweetCategory === 0 && tweet.type === 'show') ||
                  (selectedTweetCategory === 1 && tweet.type === 'person') ||
                  (selectedTweetCategory === 2 && tweet.type === 'trending')
                ).map((tweet) => (
                      <div 
                        key={tweet.id} 
                        className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all cursor-pointer relative"
                      >
                        {/* X Logo in top right */}
                        <div className="absolute top-3 right-3">
                          <svg className="w-3.5 h-3.5 text-muted-foreground/40" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </div>
                        
                        <div className="flex gap-2.5">
                          {/* Avatar */}
                          <img
                            src={tweet.authorAvatar}
                            alt={tweet.authorName}
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                          />
                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-6">
                            {/* Header */}
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs font-bold text-foreground">{tweet.authorName}</span>
                              {tweet.isVerified && (
                                <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
                                </svg>
                              )}
                              <span className="text-[11px] text-muted-foreground">{tweet.authorHandle}</span>
                              <span className="text-[11px] text-muted-foreground">·</span>
                              <span className="text-[11px] text-muted-foreground">{tweet.timeAgo}</span>
                            </div>
                            {/* Tweet Content */}
                            <p className="text-xs text-foreground leading-relaxed mb-2.5">{tweet.content}</p>
                            {/* Engagement Metrics */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 group cursor-pointer">
                                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{tweet.replies}</span>
                              </div>
                              <div className="flex items-center gap-1.5 group cursor-pointer">
                                <Repeat2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{tweet.retweets}</span>
                              </div>
                              <div className="flex items-center gap-1.5 group cursor-pointer">
                                <Heart className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{tweet.likes}</span>
                              </div>
                              <button className="flex items-center gap-1.5 group cursor-pointer ml-auto" aria-label="Share" title="Share">
                                <Share2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - No menu selected */}
          {!activeMenu && (
            <div className="space-y-3">
              {/* Up Next Header */}
              <div className="flex items-center gap-1.5 px-1">
                <PlayCircle className="w-3 h-3 text-muted-foreground" />
                <span className="text-[9px] font-medium text-muted-foreground">Up Next</span>
              </div>

              {/* Summary Card 1 */}
              <div className="rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200 cursor-pointer">
                <div className="p-3">
                  <div className="flex gap-3">
                    {/* Episode Image */}
                    <img
                      src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop"
                      alt="Episode"
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <div className="flex items-start gap-1.5 mb-1.5">
                        <FileText className="w-3 h-3 text-foreground flex-shrink-0 mt-0.5" />
                        <h3 className="text-[11px] font-semibold text-foreground leading-snug line-clamp-2 flex-1">
                          Market Analysis: Fed Policy and Tech Earnings
                        </h3>
                      </div>
                      {/* Separator */}
                      <div className="border-t border-border/30 mb-1.5"></div>
                      {/* Metadata Stack */}
                      <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mic className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">All-In Podcast</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">Chamath</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="whitespace-nowrap">01-15-2026</span>
                        </div>
                      </div>
                    </div>
                    {/* Action Buttons - Vertical */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all" 
                        title="Save"
                        aria-label="Save"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all" 
                        title="Share"
                        aria-label="Share"
                      >
                        <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all" 
                        title="Download"
                        aria-label="Download"
                      >
                        <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Card 1 */}
              <div className="rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200 cursor-pointer">
                <div className="p-3">
                  <div className="flex gap-3">
                    {/* Report Image */}
                    <img
                      src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop"
                      alt="Report"
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <div className="flex items-start gap-1.5 mb-1.5">
                        <Newspaper className="w-3 h-3 text-foreground flex-shrink-0 mt-0.5" />
                        <h3 className="text-[11px] font-semibold text-foreground leading-snug line-clamp-2 flex-1">
                          Quarterly Economic Outlook - January 14, 2026
                        </h3>
                      </div>
                      {/* Separator */}
                      <div className="border-t border-border/30 mb-1.5"></div>
                      {/* Metadata Stack */}
                      <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">Quarterly Report</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">142 summaries</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="whitespace-nowrap">01-14-2026</span>
                        </div>
                      </div>
                    </div>
                    {/* Action Buttons - Vertical */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all" 
                        title="Save"
                        aria-label="Save"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all" 
                        title="Share"
                        aria-label="Share"
                      >
                        <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all" 
                        title="Download"
                        aria-label="Download"
                      >
                        <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Card 2 */}
              <div className="rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200 cursor-pointer">
                <div className="p-3">
                  <div className="flex gap-3">
                    {/* Episode Image */}
                    <img
                      src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop"
                      alt="Episode"
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <div className="flex items-start gap-1.5 mb-1.5">
                        <FileText className="w-3 h-3 text-foreground flex-shrink-0 mt-0.5" />
                        <h3 className="text-[11px] font-semibold text-foreground leading-snug line-clamp-2 flex-1">
                          Understanding the Federal Reserve's Balance Sheet
                        </h3>
                      </div>
                      {/* Separator */}
                      <div className="border-t border-border/30 mb-1.5"></div>
                      {/* Metadata Stack */}
                      <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mic className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">Odd Lots</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">Tracy Alloway</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="whitespace-nowrap">01-13-2026</span>
                        </div>
                      </div>
                    </div>
                    {/* Action Buttons - Vertical */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all" 
                        title="Save"
                        aria-label="Save"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all" 
                        title="Share"
                        aria-label="Share"
                      >
                        <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-muted transition-all" 
                        title="Download"
                        aria-label="Download"
                      >
                        <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional cards shown only when expanded */}
              {showAllUpNext && (
                <>
                  {/* Report Card 2 */}
                  <div className="rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200 cursor-pointer">
                    <div className="p-3">
                      <div className="flex gap-3">
                        {/* Report Image */}
                        <img
                          src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=400&fit=crop"
                          alt="Report"
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <div className="flex items-start gap-1.5 mb-1.5">
                            <Newspaper className="w-3.5 h-3.5 text-foreground flex-shrink-0 mt-0.5" />
                            <h3 className="text-[11px] font-semibold text-foreground leading-snug line-clamp-2 flex-1">
                              Cryptocurrency Trends 2026
                            </h3>
                          </div>
                          {/* Separator */}
                          <div className="border-t border-border/30 mb-1.5"></div>
                          {/* Metadata Stack */}
                          <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mic className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="truncate">The Compound</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="truncate">Josh Brown</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="whitespace-nowrap">01-12-2026</span>
                            </div>
                          </div>
                        </div>
                        {/* Action Buttons - Vertical */}
                        <div className="flex flex-col gap-0.5 flex-shrink-0">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg hover:bg-muted transition-all" 
                            title="Save"
                            aria-label="Save"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg hover:bg-muted transition-all" 
                            title="Share"
                            aria-label="Share"
                          >
                            <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg hover:bg-muted transition-all" 
                            title="Download"
                            aria-label="Download"
                          >
                            <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card 3 */}
                  <div className="rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200 cursor-pointer">
                    <div className="p-3">
                      <div className="flex gap-3">
                        {/* Episode Image */}
                        <img
                          src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop"
                          alt="Episode"
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <div className="flex items-start gap-1.5 mb-1.5">
                            <FileText className="w-3.5 h-3.5 text-foreground flex-shrink-0 mt-0.5" />
                            <h3 className="text-[11px] font-semibold text-foreground leading-snug line-clamp-2 flex-1">
                              AI Regulation and the Future of Technology Policy
                            </h3>
                          </div>
                          {/* Separator */}
                          <div className="border-t border-border/30 mb-1.5"></div>
                          {/* Metadata Stack */}
                          <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mic className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="truncate">All-In Podcast</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="truncate">Jason Calacanis</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="whitespace-nowrap">01-11-2026</span>
                            </div>
                          </div>
                        </div>
                        {/* Action Buttons - Vertical */}
                        <div className="flex flex-col gap-0.5 flex-shrink-0">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg hover:bg-muted transition-all" 
                            title="Save"
                            aria-label="Save"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg hover:bg-muted transition-all" 
                            title="Share"
                            aria-label="Share"
                          >
                            <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg hover:bg-muted transition-all" 
                            title="Download"
                            aria-label="Download"
                          >
                            <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Show More/Less Button */}
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => setShowAllUpNext(!showAllUpNext)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-card border border-border shadow-sm rounded-lg text-[10px] font-medium text-foreground hover:bg-muted/50 transition-all"
                  aria-label={showAllUpNext ? 'Show Less' : 'Show More'}
                >
                  <span>{showAllUpNext ? 'Show Less' : 'Show More'}</span>
                  {showAllUpNext ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section - Navigation Buttons (Fixed at bottom) */}
        {/* Separator before bottom section */}
        <div className="mx-4 border-t border-border/30" />
        
        {/* Suggestions Section - Above buttons, only when no menu is active */}
        {!activeMenu && (
          <div className="px-4 pt-3 pb-4">
            <div className="space-y-2.5">
              {/* Header with title and navigation arrows */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-medium text-foreground">{copy.sidebar.suggestions}</span>
                </div>
                <div className="flex items-center bg-card border border-border/50 shadow-sm rounded-md overflow-hidden">
                  <button className="w-5 h-5 hover:bg-muted/60 transition-colors flex items-center justify-center" aria-label={copy.sidebar.previousSuggestions} title={copy.sidebar.previous}>
                    <ChevronLeft className="w-2.5 h-2.5 text-muted-foreground" />
                  </button>
                  <div className="w-px h-3 bg-border/40" />
                  <button className="w-5 h-5 hover:bg-muted/60 transition-colors flex items-center justify-center" aria-label={copy.sidebar.nextSuggestions} title={copy.sidebar.next}>
                    <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              
              {/* Show/Account Suggestions - Horizontal scrolling */}
              <div className="flex gap-[13.5px] overflow-x-auto scrollbar-hide">
                {/* Suggestion Card 1 */}
                <div className="flex-shrink-0 w-[72px]">
                  <button className="w-full group cursor-pointer transition-all p-2 rounded-lg bg-card border border-border/40 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border">
                    <img
                      src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=100&h=100&fit=crop"
                      alt="Show"
                      className="w-full aspect-square rounded-md object-cover mb-1.5"
                    />
                    <p className="text-[10px] font-medium text-foreground line-clamp-2 leading-tight text-center min-h-[20px]">
                      Planet Money
                    </p>
                  </button>
                </div>

                {/* Suggestion Card 2 */}
                <div className="flex-shrink-0 w-[72px]">
                  <button className="w-full group cursor-pointer transition-all p-2 rounded-lg bg-card border border-border/40 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                      alt="Show"
                      className="w-full aspect-square rounded-md object-cover mb-1.5"
                    />
                    <p className="text-[10px] font-medium text-foreground line-clamp-2 leading-tight text-center min-h-[20px]">
                      Josh Brown
                    </p>
                  </button>
                </div>

                {/* Suggestion Card 3 */}
                <div className="flex-shrink-0 w-[72px]">
                  <button className="w-full group cursor-pointer transition-all p-2 rounded-lg bg-card border border-border/40 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                      alt="Show"
                      className="w-full aspect-square rounded-md object-cover mb-1.5"
                    />
                    <p className="text-[10px] font-medium text-foreground line-clamp-2 leading-tight text-center min-h-[20px]">
                      Masters in Business
                    </p>
                  </button>
                </div>

                {/* Suggestion Card 4 */}
                <div className="flex-shrink-0 w-[72px]">
                  <button className="w-full group cursor-pointer transition-all p-2 rounded-lg bg-card border border-border/40 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                      alt="Show"
                      className="w-full aspect-square rounded-md object-cover mb-1.5"
                    />
                    <p className="text-[10px] font-medium text-foreground line-clamp-2 leading-tight text-center min-h-[20px]">
                      Chamath Palihapitiya
                    </p>
                  </button>
                </div>

                {/* Suggestion Card 5 */}
                <div className="flex-shrink-0 w-[72px]">
                  <button className="w-full group cursor-pointer transition-all p-2 rounded-lg bg-card border border-border/40 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border">
                    <img
                      src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=100&h=100&fit=crop"
                      alt="Show"
                      className="w-full aspect-square rounded-md object-cover mb-1.5"
                    />
                    <p className="text-[10px] font-medium text-foreground line-clamp-2 leading-tight text-center min-h-[20px]">
                      Odd Lots
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Separator before buttons */}
        {!activeMenu && <div className="mx-4 border-t border-border/30" />}
        
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {/* News Button */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'news' ? null : 'news')}
              className={`flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg transition-all border shadow-sm ${
                activeMenu === 'news'
                  ? 'bg-muted/80 border-border/50'
                  : 'bg-card border-border/50 hover:bg-muted'
              }`}
              aria-label={copy.sidebar.news}
            >
              <Newspaper className={`w-3 h-3 ${activeMenu === 'news' ? 'text-foreground' : 'text-muted-foreground'}`} />
              <span className={`text-[8px] font-semibold uppercase tracking-wider ${activeMenu === 'news' ? 'text-foreground' : 'text-muted-foreground'}`}>{copy.sidebar.news}</span>
            </button>

            {/* Calendar Button */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'calendar' ? null : 'calendar')}
              className={`flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg transition-all border shadow-sm ${
                activeMenu === 'calendar'
                  ? 'bg-muted/80 border-border/50'
                  : 'bg-card border-border/50 hover:bg-muted'
              }`}
              aria-label={copy.sidebar.calendar}
            >
              <Calendar className={`w-3 h-3 ${activeMenu === 'calendar' ? 'text-foreground' : 'text-muted-foreground'}`} />
              <span className={`text-[8px] font-semibold uppercase tracking-wider ${activeMenu === 'calendar' ? 'text-foreground' : 'text-muted-foreground'}`}>{copy.sidebar.calendar}</span>
            </button>

            {/* Earnings Button */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'earnings' ? null : 'earnings')}
              className={`flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg transition-all border shadow-sm ${
                activeMenu === 'earnings'
                  ? 'bg-muted/80 border-border/50'
                  : 'bg-card border-border/50 hover:bg-muted'
              }`}
              aria-label={copy.sidebar.earnings}
            >
              <Building2 className={`w-3 h-3 ${activeMenu === 'earnings' ? 'text-foreground' : 'text-muted-foreground'}`} />
              <span className={`text-[8px] font-semibold uppercase tracking-wider ${activeMenu === 'earnings' ? 'text-foreground' : 'text-muted-foreground'}`}>{copy.sidebar.earnings}</span>
            </button>

            {/* Tweets Button */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'tweets' ? null : 'tweets')}
              className={`flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg transition-all border shadow-sm ${
                activeMenu === 'tweets'
                  ? 'bg-muted/80 border-border/50'
                  : 'bg-card border-border/50 hover:bg-muted'
              }`}
              aria-label={copy.sidebar.tweets}
            >
              <Twitter className={`w-3 h-3 ${activeMenu === 'tweets' ? 'text-foreground' : 'text-muted-foreground'}`} />
              <span className={`text-[8px] font-semibold uppercase tracking-wider ${activeMenu === 'tweets' ? 'text-foreground' : 'text-muted-foreground'}`}>{copy.sidebar.tweets}</span>
            </button>

            {/* Predictions Button */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'predictions' ? null : 'predictions')}
              className={`flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg transition-all border shadow-sm ${
                activeMenu === 'predictions'
                  ? 'bg-muted/80 border-border/50'
                  : 'bg-card border-border/50 hover:bg-muted'
              }`}
              aria-label={copy.sidebar.predictions}
            >
              <BarChart3 className={`w-3 h-3 ${activeMenu === 'predictions' ? 'text-foreground' : 'text-muted-foreground'}`} />
              <span className={`text-[8px] font-semibold uppercase tracking-wider ${activeMenu === 'predictions' ? 'text-foreground' : 'text-muted-foreground'}`}>{copy.sidebar.predictions}</span>
            </button>

            {/* Markets Button */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'markets' ? null : 'markets')}
              className={`flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg transition-all border shadow-sm ${
                activeMenu === 'markets'
                  ? 'bg-muted/80 border-border/50'
                  : 'bg-card border-border/50 hover:bg-muted'
              }`}
              aria-label={copy.sidebar.markets}
            >
              <TrendingUp className={`w-3 h-3 ${activeMenu === 'markets' ? 'text-foreground' : 'text-muted-foreground'}`} />
              <span className={`text-[8px] font-semibold uppercase tracking-wider ${activeMenu === 'markets' ? 'text-foreground' : 'text-muted-foreground'}`}>{copy.sidebar.markets}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Popup */}
      {isNotificationsPopupOpen && (
        <NotificationsPopup
          isOpen={isNotificationsPopupOpen}
          onClose={() => setNotificationsPopupOpen(false)}
          notifications={mockNotifications}
          anchorRef={notificationsRef}
        />
      )}
    </aside>
  );
}