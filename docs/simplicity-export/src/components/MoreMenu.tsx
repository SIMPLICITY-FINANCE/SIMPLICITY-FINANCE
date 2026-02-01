import { X, Home, Bell, Bookmark, Compass, FileText, BookOpen, User, Settings, HelpCircle, Moon, Sun, Crown, Plus, Lock, Sparkles, Bot, Upload, Newspaper, Calendar, DollarSign, Twitter as TwitterIcon, TrendingUp, LineChart, Mail, Share2, Download, ChevronLeft, ChevronRight, ChevronDown, AlertCircle, Building2, Landmark, Briefcase, Zap, Gem, Cpu, Package, MessageSquare, Repeat2, Heart, Radio, Lightbulb, PlayCircle, Mic } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  isPremium: boolean;
  onTogglePremium: () => void;
  onOpenChatBot: () => void;
  newReportsCount: number;
  followingCount: number;
  notificationsCount: number;
}

type MenuType = 'calendar' | 'earnings' | 'news' | 'markets' | 'predictions' | 'tweets' | 'upload' | 'discover' | null;

// Mini Sparkline Chart Component for Mobile
function MiniSparkline({ data, isPositive }: { data: number[], isPositive: boolean }) {
  if (!data || data.length < 2) return null;
  
  const width = 32;
  const height = 12;
  const padding = 1.5;
  
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
        strokeWidth="1.2"
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

export function MoreMenu({ 
  isOpen, 
  onClose, 
  currentView, 
  onNavigate, 
  isPremium, 
  onTogglePremium,
  onOpenChatBot,
  newReportsCount,
  followingCount,
  notificationsCount
}: MoreMenuProps) {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  
  // Collapsible state for news sections
  const [isTrendingWeekExpanded, setIsTrendingWeekExpanded] = useState(true);
  const [isTrendingTodayExpanded, setIsTrendingTodayExpanded] = useState(true);
  
  // Collapsible state for tweets sections
  const [isShowsTweetsExpanded, setIsShowsTweetsExpanded] = useState(true);
  const [isPeopleTweetsExpanded, setIsPeopleTweetsExpanded] = useState(true);
  
  // State for Up Next show more
  const [showAllUpNext, setShowAllUpNext] = useState(false);
  
  // Collapsible state for prediction and market categories
  const [expandedPredictionCategories, setExpandedPredictionCategories] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
  });
  const [expandedMarketCategories, setExpandedMarketCategories] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });
  
  // Collapsible state for calendar and earnings days
  const [expandedCalendarDays, setExpandedCalendarDays] = useState<Record<string, boolean>>({
    'Mon': true,
    'Tue': true,
    'Wed': true,
    'Thu': true,
    'Fri': true,
  });
  const [expandedEarningsDays, setExpandedEarningsDays] = useState<Record<string, boolean>>({
    'Mon': true,
    'Tue': true,
    'Wed': true,
    'Thu': true,
    'Fri': true,
  });
  
  const handleNavigate = (view: string) => {
    onNavigate(view);
    onClose();
  };

  const handleToggleTheme = () => {
    // Toggle between light and dark (ignore system for now)
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  const handleMenuClick = (menuId: string) => {
    // Navigate to Upload or Discover pages instead of opening a menu
    if (menuId === 'upload') {
      handleNavigate('upload');
      return;
    }
    if (menuId === 'discover') {
      handleNavigate('discover');
      return;
    }
    // For other menu items, toggle the menu
    setActiveMenu(activeMenu === menuId ? null : menuId as MenuType);
  };
  
  const togglePredictionCategory = (index: number) => {
    setExpandedPredictionCategories(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const toggleMarketCategory = (index: number) => {
    setExpandedMarketCategories(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const toggleCalendarDay = (day: string) => {
    setExpandedCalendarDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  const toggleEarningsDay = (day: string) => {
    setExpandedEarningsDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  if (!isOpen) return null;

  // Mock data for Next-up feed
  const nextUpItems = [
    {
      id: '1',
      title: 'Quarterly Economic Outlook - January 14, 2026',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
      podcast: 'Report',
      show: 'Quarterly Report',
      guest: '142 summaries',
      date: '01-14-2026'
    },
    {
      id: '2',
      title: "Understanding the Federal Reserve's Balance Sheet",
      image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
      podcast: 'Summary',
      show: 'Odd Lots',
      guest: 'Tracy Alloway',
      date: '01-13-2026'
    },
    {
      id: '3',
      title: 'Cryptocurrency Trends 2026',
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=400&fit=crop',
      podcast: 'Report',
      show: 'The Compound',
      guest: 'Josh Brown',
      date: '01-12-2026'
    }
  ];

  // Mock data for Suggestions
  const suggestions = [
    { id: '1', name: 'Planet Money', image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=200&h=200&fit=crop' },
    { id: '2', name: 'Josh Brown', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
    { id: '3', name: 'Masters in Business', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
    { id: '4', name: 'Chamath Palihapitiya', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
    { id: '5', name: 'Odd Lots', image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop' }
  ];

  // Financial insights features
  const insightMenuItems = [
    { id: 'news', label: 'NEWS', icon: Newspaper },
    { id: 'calendar', label: 'CALENDAR', icon: Calendar },
    { id: 'earnings', label: 'EARNINGS', icon: DollarSign },
    { id: 'upload', label: 'UPLOAD', icon: Upload },
    { id: 'tweets', label: 'TWEETS', icon: TwitterIcon },
    { id: 'predictions', label: 'PREDICTIONS', icon: LineChart },
    { id: 'markets', label: 'MARKETS', icon: TrendingUp },
    { id: 'discover', label: 'DISCOVER', icon: Compass },
  ];

  // Mock data for Calendar
  const catalystsThisWeek = [
    { day: 'Mon', event: 'Consumer Confidence Index', time: '10:00 AM', actual: '110.2', forecast: '109.5', previous: '108.8' },
    { day: 'Mon', event: 'Manufacturing PMI', time: '9:45 AM', actual: '52.3', forecast: '51.8', previous: '51.5' },
    { day: 'Tue', event: 'Retail Sales Data', time: '8:30 AM', actual: '0.4%', forecast: '0.3%', previous: '0.2%' },
    { day: 'Tue', event: 'Core CPI (MoM)', time: '8:30 AM', actual: '0.3%', forecast: '0.2%', previous: '0.3%' },
    { day: 'Wed', event: 'FOMC Minutes', time: '2:00 PM', actual: '-', forecast: '-', previous: '-' },
    { day: 'Wed', event: 'Crude Oil Inventories', time: '10:30 AM', actual: '-2.1M', forecast: '-1.5M', previous: '-0.8M' },
    { day: 'Thu', event: 'GDP Preliminary Estimate', time: '8:30 AM', actual: '2.8%', forecast: '2.5%', previous: '2.3%' },
    { day: 'Thu', event: 'Initial Jobless Claims', time: '8:30 AM', actual: '225K', forecast: '230K', previous: '232K' },
    { day: 'Fri', event: 'NFP Jobs Report', time: '8:30 AM', actual: '185K', forecast: '175K', previous: '165K' },
    { day: 'Fri', event: 'Unemployment Rate', time: '8:30 AM', actual: '3.8%', forecast: '3.9%', previous: '3.9%' },
  ];

  // Mock data for Earnings
  const earningsThisWeek = [
    { day: 'Mon', company: 'Apple Inc.', ticker: 'AAPL', time: 'After Close', actualEPS: '2.18', forecastEPS: '2.10', surprise: '+3.8%' },
    { day: 'Mon', company: 'JPMorgan Chase', ticker: 'JPM', time: 'Before Open', actualEPS: '3.97', forecastEPS: '3.89', surprise: '+2.1%' },
    { day: 'Tue', company: 'Microsoft Corp.', ticker: 'MSFT', time: 'After Close', actualEPS: '2.93', forecastEPS: '2.78', surprise: '+5.4%' },
    { day: 'Tue', company: 'Bank of America', ticker: 'BAC', time: 'Before Open', actualEPS: '0.82', forecastEPS: '0.77', surprise: '+6.5%' },
    { day: 'Wed', company: 'Tesla Inc.', ticker: 'TSLA', time: 'After Close', actualEPS: '0.71', forecastEPS: '0.73', surprise: '-2.7%' },
    { day: 'Wed', company: 'Netflix Inc.', ticker: 'NFLX', time: 'After Close', actualEPS: '4.54', forecastEPS: '4.21', surprise: '+7.8%' },
    { day: 'Thu', company: 'Amazon.com Inc.', ticker: 'AMZN', time: 'After Close', actualEPS: '1.43', forecastEPS: '1.56', surprise: '-8.3%' },
    { day: 'Thu', company: 'Intel Corp.', ticker: 'INTC', time: 'After Close', actualEPS: '0.54', forecastEPS: '0.43', surprise: '+25.6%' },
    { day: 'Fri', company: 'Meta Platforms', ticker: 'META', time: 'After Close', actualEPS: '5.33', forecastEPS: '5.19', surprise: '+2.7%' },
    { day: 'Fri', company: 'Visa Inc.', ticker: 'V', time: 'After Close', actualEPS: '2.51', forecastEPS: '2.44', surprise: '+2.9%' },
  ];

  // Mock data for News
  const newsThisWeek = [
    { source: 'Bloomberg', title: 'Fed Signals Potential Rate Cut in Q2', color: 'bg-purple-500', timeAgo: '2h ago', isHot: true },
    { source: 'Reuters', title: 'Oil Prices Surge on Middle East Tensions', color: 'bg-orange-500', timeAgo: '3h ago', isHot: true },
    { source: 'WSJ', title: 'Tech Giants Report Record Q4 Earnings', color: 'bg-blue-600', timeAgo: '4h ago', isHot: true },
    { source: 'CNBC', title: 'S&P 500 Hits All-Time High Amid Rally', color: 'bg-red-500', timeAgo: '5h ago', isHot: false },
    { source: 'FT', title: 'Dollar Weakens Against Major Currencies', color: 'bg-pink-500', timeAgo: '6h ago', isHot: false },
    { source: 'Bloomberg', title: 'China Economic Growth Beats Expectations', color: 'bg-purple-500', timeAgo: '8h ago', isHot: false },
    { source: 'Reuters', title: 'European Markets Rally on ECB Comments', color: 'bg-orange-500', timeAgo: '10h ago', isHot: false },
    { source: 'WSJ', title: 'Cryptocurrency Regulation Framework Announced', color: 'bg-blue-600', timeAgo: '12h ago', isHot: false },
    { source: 'CNBC', title: 'Housing Market Shows Signs of Recovery', color: 'bg-red-500', timeAgo: '14h ago', isHot: false },
    { source: 'FT', title: 'Global Supply Chain Pressures Ease', color: 'bg-pink-500', timeAgo: '16h ago', isHot: false },
  ];

  // Prediction market data
  const predictionMarkets = [
    {
      category: 'Politics',
      predictions: [
        { id: 'pol-1', question: 'Will the Fed cut rates by March 2026?', yesPercent: 67, noPercent: 33 },
        { id: 'pol-2', question: 'Will Trump win the 2024 election?', yesPercent: 52, noPercent: 48 },
        { id: 'pol-3', question: 'Will inflation fall below 2% in 2026?', yesPercent: 41, noPercent: 59 },
        { id: 'pol-4', question: 'Will Biden run for re-election?', yesPercent: 28, noPercent: 72 },
      ]
    },
    {
      category: 'Finance',
      predictions: [
        { id: 'fin-1', question: 'Bitcoin above $100k by end of Q1?', yesPercent: 73, noPercent: 27 },
        { id: 'fin-2', question: 'S&P 500 to hit 7,000 in 2026?', yesPercent: 58, noPercent: 42 },
        { id: 'fin-3', question: 'Will Tesla reach $500 per share?', yesPercent: 45, noPercent: 55 },
        { id: 'fin-4', question: 'Gold above $3,000 per ounce?', yesPercent: 62, noPercent: 38 },
      ]
    },
    {
      category: 'Technology',
      predictions: [
        { id: 'tech-1', question: 'Will Apple release AR glasses in 2026?', yesPercent: 34, noPercent: 66 },
        { id: 'tech-2', question: 'OpenAI IPO by end of 2026?', yesPercent: 45, noPercent: 55 },
        { id: 'tech-3', question: 'Will Meta launch a new VR headset?', yesPercent: 78, noPercent: 22 },
        { id: 'tech-4', question: 'Will NVIDIA reach $1 trillion market cap?', yesPercent: 81, noPercent: 19 },
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
  ];

  // Markets/Assets data
  const assetCategories = [
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

  return (
    <>
      {/* Menu Panel - Fits between top and bottom bars with rounded frame */}
      <div className="md:hidden fixed top-[4.5rem] bottom-20 left-0 right-0 z-30 px-3">
        <div className="h-full bg-card border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col">
          {/* Scrollable Content Area - Next-up Feed OR Active Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {activeMenu === null ? (
              /* Next-up Feed */
              <div className="p-3 space-y-2">
                {/* Up Next Header */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <PlayCircle className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[9px] font-medium text-muted-foreground">Up Next</span>
                </div>

                {nextUpItems.slice(0, showAllUpNext ? nextUpItems.length : 2).map((item) => (
                  <div
                    key={item.id}
                    className="bg-background border border-border rounded-lg p-2 hover:shadow-md hover:bg-accent/30 hover:border-border transition-all"
                  >
                    <div className="flex gap-2 items-start">
                      {/* Episode Image */}
                      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Episode Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-1 mb-1">
                          <FileText className="w-2.5 h-2.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <h3 className="text-[10px] font-semibold text-foreground line-clamp-2 leading-tight">{item.title}</h3>
                        </div>
                        {/* Separator */}
                        <div className="border-t border-border/30 mb-1"></div>
                        {/* Metadata Stack */}
                        <div className="flex flex-col gap-0.5 text-[8px] text-muted-foreground">
                          <div className="flex items-center gap-0.5">
                            <Mic className="w-2 h-2 flex-shrink-0" />
                            <span className="truncate">{item.show}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <User className="w-2 h-2 flex-shrink-0" />
                            <span className="truncate">{item.guest}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Calendar className="w-2 h-2 flex-shrink-0" />
                            <span className="whitespace-nowrap">{item.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-0.5 flex-shrink-0">
                        <button className="w-5 h-5 rounded hover:bg-muted transition-all flex items-center justify-center">
                          <Bookmark className="w-2.5 h-2.5 text-muted-foreground" />
                        </button>
                        <button className="w-5 h-5 rounded hover:bg-muted transition-all flex items-center justify-center">
                          <Share2 className="w-2.5 h-2.5 text-muted-foreground" />
                        </button>
                        <button className="w-5 h-5 rounded hover:bg-muted transition-all flex items-center justify-center">
                          <Download className="w-2.5 h-2.5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Show more/less button */}
                <div className="flex justify-center mt-2">
                  <button 
                    onClick={() => setShowAllUpNext(!showAllUpNext)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-card border border-border shadow-sm rounded-lg text-[10px] font-medium text-foreground hover:bg-muted/50 transition-all"
                  >
                    <span>{showAllUpNext ? 'Show Less' : 'Show More'}</span>
                    {showAllUpNext ? <ChevronDown className="w-3 h-3 rotate-180" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ) : (
              /* Active Menu Content */
              <div className="p-2.5">
                {/* Calendar Menu */}
                {activeMenu === 'calendar' && (
                  <div className="space-y-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                      const dayEvents = catalystsThisWeek.filter(catalyst => catalyst.day === day);
                      if (dayEvents.length === 0) return null;
                      
                      // Get the date for this day
                      const dayDates: Record<string, string> = {
                        'Mon': 'Jan 20',
                        'Tue': 'Jan 21',
                        'Wed': 'Jan 22',
                        'Thu': 'Jan 23',
                        'Fri': 'Jan 24',
                      };
                      
                      return (
                        <div key={day}>
                          {/* Day Header - Clickable */}
                          <button
                            onClick={() => toggleCalendarDay(day)}
                            className="w-full flex items-center justify-between gap-1.5 px-2 py-1 mb-1.5 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all"
                          >
                            <div className="flex items-center gap-1.5">
                              <div className="flex-shrink-0 w-4 h-4 rounded bg-card border border-border/50 flex items-center justify-center">
                                <Calendar className="w-2.5 h-2.5 text-muted-foreground" />
                              </div>
                              <h3 className="text-[9px] font-semibold text-foreground uppercase tracking-wider">
                                {day} · {dayDates[day]}
                              </h3>
                            </div>
                            <ChevronDown 
                              className={`w-3 h-3 text-muted-foreground transition-transform ${
                                expandedCalendarDays[day] ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          
                          {/* Day Events - Collapsible */}
                          {expandedCalendarDays[day] && (
                            <div className="space-y-1.5 mb-2">
                              {dayEvents.map((catalyst, idx) => (
                                <div key={idx} className="p-2 rounded-lg bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
                                  {/* Header */}
                                  <div className="flex items-start gap-2 mb-1.5">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-muted/50 flex items-center justify-center">
                                      <Calendar className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] font-semibold text-foreground leading-tight">{catalyst.event}</p>
                                      <p className="text-[8px] text-muted-foreground mt-0.5">{catalyst.time}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Data - Three columns */}
                                  <div className="grid grid-cols-3 gap-1.5 mt-1.5 pt-1.5 border-t border-border/30">
                                    <div className="text-center">
                                      <p className="text-[7px] font-medium text-muted-foreground uppercase mb-0.5">Actual</p>
                                      <p className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">{catalyst.actual}</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[7px] font-medium text-muted-foreground uppercase mb-0.5">Forecast</p>
                                      <p className="text-[9px] font-semibold text-foreground">{catalyst.forecast}</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[7px] font-medium text-muted-foreground uppercase mb-0.5">Prior</p>
                                      <p className="text-[9px] font-semibold text-muted-foreground">{catalyst.previous}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Earnings Menu */}
                {activeMenu === 'earnings' && (
                  <div className="space-y-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                      const dayEarnings = earningsThisWeek.filter(earning => earning.day === day);
                      if (dayEarnings.length === 0) return null;
                      
                      // Get the date for this day
                      const dayDates: Record<string, string> = {
                        'Mon': 'Jan 20',
                        'Tue': 'Jan 21',
                        'Wed': 'Jan 22',
                        'Thu': 'Jan 23',
                        'Fri': 'Jan 24',
                      };
                      
                      return (
                        <div key={day}>
                          {/* Day Header - Clickable */}
                          <button
                            onClick={() => toggleEarningsDay(day)}
                            className="w-full flex items-center justify-between gap-1.5 px-2 py-1 mb-1.5 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all"
                          >
                            <div className="flex items-center gap-1.5">
                              <div className="flex-shrink-0 w-4 h-4 rounded bg-card border border-border/50 flex items-center justify-center">
                                <Calendar className="w-2.5 h-2.5 text-muted-foreground" />
                              </div>
                              <h3 className="text-[9px] font-semibold text-foreground uppercase tracking-wider">
                                {day} · {dayDates[day]}
                              </h3>
                            </div>
                            <ChevronDown 
                              className={`w-3 h-3 text-muted-foreground transition-transform ${
                                expandedEarningsDays[day] ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          
                          {/* Day Earnings - Collapsible */}
                          {expandedEarningsDays[day] && (
                            <div className="space-y-1.5 mb-2">
                              {dayEarnings.map((earning, idx) => (
                                <div key={idx} className="p-2 rounded-lg bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
                                  {/* Header */}
                                  <div className="flex items-start gap-2 mb-1.5">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-muted/50 flex items-center justify-center">
                                      <Building2 className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] font-semibold text-foreground leading-tight">{earning.company}</p>
                                      <p className="text-[8px] text-muted-foreground mt-0.5">{earning.time} · {earning.ticker}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Data - Three columns */}
                                  <div className="grid grid-cols-3 gap-1.5 mt-1.5 pt-1.5 border-t border-border/30">
                                    <div className="text-center">
                                      <p className="text-[7px] font-medium text-muted-foreground uppercase mb-0.5">Actual EPS</p>
                                      <p className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">${earning.actualEPS}</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[7px] font-medium text-muted-foreground uppercase mb-0.5">Forecast</p>
                                      <p className="text-[9px] font-semibold text-foreground">${earning.forecastEPS}</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[7px] font-medium text-muted-foreground uppercase mb-0.5">Surprise</p>
                                      <p className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">{earning.surprise}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* News Menu */}
                {activeMenu === 'news' && (
                  <div className="space-y-2">
                    {/* Trending This Week Section */}
                    <div>
                      {/* Category Header - Clickable */}
                      <button
                        onClick={() => setIsTrendingWeekExpanded(!isTrendingWeekExpanded)}
                        className="w-full flex items-center justify-between gap-1.5 px-2 py-1 mb-1.5 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="flex-shrink-0 w-4 h-4 rounded bg-card border border-border/50 flex items-center justify-center">
                            <AlertCircle className="w-2.5 h-2.5 text-orange-500" />
                          </div>
                          <h3 className="text-[9px] font-semibold text-foreground uppercase tracking-wider">
                            Trending This Week
                          </h3>
                        </div>
                        <ChevronDown 
                          className={`w-3 h-3 text-muted-foreground transition-transform ${
                            isTrendingWeekExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {/* Hot News Articles - Collapsible */}
                      {isTrendingWeekExpanded && (
                        <div className="space-y-1.5 mb-2">
                          {newsThisWeek.filter(news => news.isHot).map((news, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
                              <div className="flex items-start gap-2">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-md ${news.color} flex items-center justify-center`}>
                                  <span className="text-[7px] font-bold text-white">
                                    {news.source === 'Bloomberg' ? 'BB' : 
                                     news.source === 'Reuters' ? 'R' : 
                                     news.source === 'WSJ' ? 'WSJ' :
                                     news.source === 'CNBC' ? 'C' :
                                     news.source === 'FT' ? 'FT' : 'N'}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-foreground leading-snug mb-0.5">{news.title}</p>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[8px] text-muted-foreground">{news.source}</span>
                                    <span className="text-[8px] text-muted-foreground">·</span>
                                    <span className="text-[8px] text-muted-foreground">{news.timeAgo}</span>
                                    <AlertCircle className="w-2.5 h-2.5 text-orange-500 ml-auto" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Trending Today Section */}
                    <div>
                      {/* Category Header - Clickable */}
                      <button
                        onClick={() => setIsTrendingTodayExpanded(!isTrendingTodayExpanded)}
                        className="w-full flex items-center justify-between gap-1.5 px-2 py-1 mb-1.5 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="flex-shrink-0 w-4 h-4 rounded bg-card border border-border/50 flex items-center justify-center">
                            <Newspaper className="w-2.5 h-2.5 text-muted-foreground" />
                          </div>
                          <h3 className="text-[9px] font-semibold text-foreground uppercase tracking-wider">
                            Trending Today
                          </h3>
                        </div>
                        <ChevronDown 
                          className={`w-3 h-3 text-muted-foreground transition-transform ${
                            isTrendingTodayExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {/* Regular News Articles - Collapsible */}
                      {isTrendingTodayExpanded && (
                        <div className="space-y-1.5">
                          {newsThisWeek.filter(news => !news.isHot).map((news, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
                              <div className="flex items-start gap-2">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-md ${news.color} flex items-center justify-center`}>
                                  <span className="text-[7px] font-bold text-white">
                                    {news.source === 'Bloomberg' ? 'BB' : 
                                     news.source === 'Reuters' ? 'R' : 
                                     news.source === 'WSJ' ? 'WSJ' :
                                     news.source === 'CNBC' ? 'C' :
                                     news.source === 'FT' ? 'FT' : 'N'}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-foreground leading-snug mb-0.5">{news.title}</p>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[8px] text-muted-foreground">{news.source}</span>
                                    <span className="text-[8px] text-muted-foreground">·</span>
                                    <span className="text-[8px] text-muted-foreground">{news.timeAgo}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tweets Menu */}
                {activeMenu === 'tweets' && (
                  <div className="space-y-2">
                    {/* Shows Section */}
                    <div>
                      {/* Shows Header - Clickable */}
                      <button
                        onClick={() => setIsShowsTweetsExpanded(!isShowsTweetsExpanded)}
                        className="w-full flex items-center justify-between gap-1.5 px-2 py-1 mb-1.5 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="flex-shrink-0 w-4 h-4 rounded bg-card border border-border/50 flex items-center justify-center">
                            <Radio className="w-2.5 h-2.5 text-muted-foreground" />
                          </div>
                          <h3 className="text-[9px] font-semibold text-foreground uppercase tracking-wider">
                            Shows
                          </h3>
                        </div>
                        <ChevronDown 
                          className={`w-3 h-3 text-muted-foreground transition-transform ${
                            isShowsTweetsExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Shows Tweets - Collapsible */}
                      {isShowsTweetsExpanded && (
                        <div className="space-y-1.5 mb-2">
                          {tweetFeed.filter(tweet => tweet.type === 'show').map((tweet) => (
                            <div key={tweet.id} className="p-2 rounded-lg bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all relative">
                              {/* X Logo in top right */}
                              <div className="absolute top-2 right-2">
                                <svg className="w-2.5 h-2.5 text-muted-foreground/40" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                              </div>
                              
                              <div className="flex gap-2">
                                {/* Avatar */}
                                <img
                                  src={tweet.authorAvatar}
                                  alt={tweet.authorName}
                                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                />
                                {/* Content */}
                                <div className="flex-1 min-w-0 pr-4">
                                  {/* Header */}
                                  <div className="flex items-center gap-0.5 mb-1">
                                    <span className="text-[9px] font-semibold text-foreground truncate">{tweet.authorName}</span>
                                    {tweet.isVerified && (
                                      <svg className="w-2.5 h-2.5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
                                      </svg>
                                    )}
                                  </div>
                                  <p className="text-[8px] text-muted-foreground mb-1">{tweet.authorHandle} · {tweet.timeAgo}</p>
                                  
                                  {/* Tweet Content */}
                                  <p className="text-[9px] text-foreground leading-snug mb-1.5">{tweet.content}</p>
                                  
                                  {/* Engagement Stats */}
                                  <div className="flex items-center gap-2.5 text-[8px] text-muted-foreground">
                                    <span className="flex items-center gap-0.5">
                                      <MessageSquare className="w-2.5 h-2.5" />
                                      {tweet.replies}
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                      <Repeat2 className="w-2.5 h-2.5" />
                                      {tweet.retweets}
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                      <Heart className="w-2.5 h-2.5" />
                                      {tweet.likes}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* People Section */}
                    <div>
                      {/* People Header - Clickable */}
                      <button
                        onClick={() => setIsPeopleTweetsExpanded(!isPeopleTweetsExpanded)}
                        className="w-full flex items-center justify-between gap-1.5 px-2 py-1 mb-1.5 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="flex-shrink-0 w-4 h-4 rounded bg-card border border-border/50 flex items-center justify-center">
                            <User className="w-2.5 h-2.5 text-muted-foreground" />
                          </div>
                          <h3 className="text-[9px] font-semibold text-foreground uppercase tracking-wider">
                            People
                          </h3>
                        </div>
                        <ChevronDown 
                          className={`w-3 h-3 text-muted-foreground transition-transform ${
                            isPeopleTweetsExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* People Tweets - Collapsible */}
                      {isPeopleTweetsExpanded && (
                        <div className="space-y-1.5">
                          {tweetFeed.filter(tweet => tweet.type === 'person').map((tweet) => (
                            <div key={tweet.id} className="p-2 rounded-lg bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all relative">
                              {/* X Logo in top right */}
                              <div className="absolute top-2 right-2">
                                <svg className="w-2.5 h-2.5 text-muted-foreground/40" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                              </div>
                              
                              <div className="flex gap-2">
                                {/* Avatar */}
                                <img
                                  src={tweet.authorAvatar}
                                  alt={tweet.authorName}
                                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                />
                                {/* Content */}
                                <div className="flex-1 min-w-0 pr-4">
                                  {/* Header */}
                                  <div className="flex items-center gap-0.5 mb-1">
                                    <span className="text-[9px] font-semibold text-foreground truncate">{tweet.authorName}</span>
                                    {tweet.isVerified && (
                                      <svg className="w-2.5 h-2.5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
                                      </svg>
                                    )}
                                  </div>
                                  <p className="text-[8px] text-muted-foreground mb-1">{tweet.authorHandle} · {tweet.timeAgo}</p>
                                  
                                  {/* Tweet Content */}
                                  <p className="text-[9px] text-foreground leading-snug mb-1.5">{tweet.content}</p>
                                  
                                  {/* Engagement Stats */}
                                  <div className="flex items-center gap-2.5 text-[8px] text-muted-foreground">
                                    <span className="flex items-center gap-0.5">
                                      <MessageSquare className="w-2.5 h-2.5" />
                                      {tweet.replies}
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                      <Repeat2 className="w-2.5 h-2.5" />
                                      {tweet.retweets}
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                      <Heart className="w-2.5 h-2.5" />
                                      {tweet.likes}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Predictions Menu */}
                {activeMenu === 'predictions' && (
                  <div className="space-y-3">
                    {predictionMarkets.map((market, idx) => (
                      <div key={idx}>
                        {/* Category Header with Icon - Clickable */}
                        <button
                          onClick={() => togglePredictionCategory(idx)}
                          className="w-full flex items-center justify-between gap-1.5 px-2 py-1 mb-2 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all"
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="flex-shrink-0 w-4 h-4 rounded bg-card border border-border/50 flex items-center justify-center">
                              {market.category === 'Politics' && <Landmark className="w-2.5 h-2.5 text-muted-foreground" />}
                              {market.category === 'Finance' && <Briefcase className="w-2.5 h-2.5 text-muted-foreground" />}
                              {market.category === 'Technology' && <Zap className="w-2.5 h-2.5 text-muted-foreground" />}
                            </div>
                            <h3 className="text-[9px] font-semibold text-foreground uppercase tracking-wider">
                              {market.category}
                            </h3>
                          </div>
                          <ChevronDown 
                            className={`w-3 h-3 text-muted-foreground transition-transform ${
                              expandedPredictionCategories[idx] ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {/* Predictions Grid - Collapsible */}
                        {expandedPredictionCategories[idx] && (
                          <div className="space-y-2 mb-3">
                            {market.predictions.map((prediction) => (
                              <div
                                key={prediction.id}
                                className="p-2 rounded-lg bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all"
                              >
                                {/* Question */}
                                <p className="text-[9px] font-semibold text-foreground leading-snug mb-2">
                                  {prediction.question}
                                </p>

                                {/* Yes/No Compact Display */}
                                <div className="space-y-1.5">
                                  {/* Yes */}
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[8px] font-medium text-muted-foreground w-6">Yes</span>
                                    <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all"
                                        style={{ width: `${prediction.yesPercent}%` }}
                                      />
                                    </div>
                                    <span className="text-[8px] font-semibold text-foreground w-7 text-right tabular-nums">
                                      {prediction.yesPercent}%
                                    </span>
                                  </div>

                                  {/* No */}
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[8px] font-medium text-muted-foreground w-6">No</span>
                                    <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-red-500 dark:bg-red-600 rounded-full transition-all"
                                        style={{ width: `${prediction.noPercent}%` }}
                                      />
                                    </div>
                                    <span className="text-[8px] font-semibold text-foreground w-7 text-right tabular-nums">
                                      {prediction.noPercent}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Separator between categories (except last) */}
                        {idx < predictionMarkets.length - 1 && (
                          <div className="border-t border-border/30 my-2" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Markets Menu */}
                {activeMenu === 'markets' && (
                  <div className="space-y-3">
                    {assetCategories.map((category, idx) => (
                      <div key={idx}>
                        {/* Category Header with Icon - Clickable */}
                        <button
                          onClick={() => toggleMarketCategory(idx)}
                          className="w-full flex items-center justify-between gap-1.5 px-2 py-1 mb-2 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all"
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="flex-shrink-0 w-4 h-4 rounded bg-card border border-border/50 flex items-center justify-center">
                              {category.title === 'METALS' && <Gem className="w-2.5 h-2.5 text-muted-foreground" />}
                              {category.title === 'Equities' && <LineChart className="w-2.5 h-2.5 text-muted-foreground" />}
                              {category.title === 'Crypto' && <Cpu className="w-2.5 h-2.5 text-muted-foreground" />}
                              {category.title === 'Currencies' && <DollarSign className="w-2.5 h-2.5 text-muted-foreground" />}
                              {category.title === 'Bonds' && <FileText className="w-2.5 h-2.5 text-muted-foreground" />}
                              {category.title === 'Commodities' && <Package className="w-2.5 h-2.5 text-muted-foreground" />}
                            </div>
                            <h3 className="text-[9px] font-semibold text-foreground uppercase tracking-wider">
                              {category.title}
                            </h3>
                          </div>
                          <ChevronDown 
                            className={`w-3 h-3 text-muted-foreground transition-transform ${
                              expandedMarketCategories[idx] ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {/* Assets Grid - 2 columns - Collapsible */}
                        {expandedMarketCategories[idx] && (
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {category.assets.map((asset, assetIdx) => (
                              <div
                                key={assetIdx}
                                className="p-2 rounded-lg bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all"
                              >
                                {/* Asset Name */}
                                <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                  {asset.name}
                                </p>
                                
                                {/* Value with Sparkline Chart */}
                                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                  <p className="text-[11px] font-bold text-foreground tabular-nums">
                                    {asset.value}
                                  </p>
                                  {asset.chartData && (
                                    <MiniSparkline data={asset.chartData} isPositive={asset.isPositive} />
                                  )}
                                </div>
                                
                                {/* Change Info - Below with border */}
                                <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-border/30">
                                  <span className={`text-[8px] font-semibold tabular-nums ${
                                    asset.isPositive 
                                      ? 'text-emerald-600 dark:text-emerald-400' 
                                      : 'text-red-600 dark:text-red-400'
                                  }`}>
                                    {asset.change}
                                  </span>
                                  <div className={`px-1 py-0.5 rounded text-[7px] font-semibold flex items-center gap-0.5 ${
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
                        )}
                        
                        {/* Separator between categories (except last) */}
                        {idx < assetCategories.length - 1 && (
                          <div className="border-t border-border/30 my-2" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Suggestions Section - Fixed Above Bottom Buttons */}
          <div className="flex-shrink-0 px-3 py-3 border-t border-border/30">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3 text-muted-foreground" />
                <h3 className="text-[10px] font-medium text-foreground">Suggestions</h3>
              </div>
              <div className="flex items-center bg-card border border-border/50 shadow-sm rounded-md overflow-hidden">
                <button className="w-5 h-5 hover:bg-muted/60 transition-colors flex items-center justify-center">
                  <ChevronLeft className="w-2.5 h-2.5 text-muted-foreground" />
                </button>
                <div className="w-px h-3 bg-border/40" />
                <button className="w-5 h-5 hover:bg-muted/60 transition-colors flex items-center justify-center">
                  <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            {/* Suggestions Carousel */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex-shrink-0 w-16">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted mb-1.5 hover:opacity-80 transition-opacity cursor-pointer border border-border/50">
                    <img src={suggestion.image} alt={suggestion.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] text-center text-foreground font-medium line-clamp-2 leading-tight">
                    {suggestion.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Insights - Fixed at Bottom */}
          <div className="flex-shrink-0 bg-card border-t border-border/30 p-2">
            <div className="grid grid-cols-4 gap-1">
              {insightMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`flex flex-col items-center justify-center gap-0.5 p-1.5 rounded-lg transition-all touch-manipulation ${
                      isActive
                        ? 'bg-muted'
                        : 'hover:bg-muted bg-background border border-border/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} />
                    <span className={`text-[7px] font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
