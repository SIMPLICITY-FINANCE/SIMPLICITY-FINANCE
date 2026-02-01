import { Podcast, Episode } from '../src/types';

// Pre-defined tags that AI will automatically assign to episode summaries
export const PREDEFINED_TAGS = [
  'Federal Reserve',
  'Stock Market',
  'Real Estate',
  'Inflation',
  'Cryptocurrency',
  'AI & Innovation',
  'Interest Rates',
  'Portfolio Strategy',
  'Geopolitics',
  'Regulation',
  'Earnings',
  'Valuation',
  'Commodities',
  'Startup Ecosystem',
  'Recession Risk'
] as const;

export const podcasts: Podcast[] = [
  {
    id: '1',
    title: 'The Compound and Friends',
    host: 'Michael Batnick & Josh Brown',
    description: 'Weekly discussions on markets, investing, and wealth management with industry experts and practitioners.',
    category: 'Investing & Markets',
    frequency: 'Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1648522168698-537da0654bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwcG9kY2FzdCUyMG1pY3JvcGhvbmV8ZW58MXx8fHwxNzY4MDUwMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '125K',
    episodeCount: 156
  },
  {
    id: '2',
    title: 'Planet Money',
    host: 'NPR',
    description: 'The economy explained. Imagine you could call up a friend and say, "Meet me at the bar and tell me what\'s going on with the economy." Now imagine that\'s actually a fun evening.',
    category: 'Economics',
    frequency: 'Twice Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1650513737281-882e597ee5e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvZGNhc3QlMjBzdHVkaW98ZW58MXx8fHwxNzY4MDUwMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '2.1M',
    episodeCount: 892
  },
  {
    id: '3',
    title: 'Invest Like the Best',
    host: 'Patrick O\'Shaughnessy',
    description: 'Deep dives with the world\'s best investors, operators, and allocators to learn from their mistakes and successes.',
    category: 'Investing & VC',
    frequency: 'Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1673767296837-8106e1b94d34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29ub21pY3MlMjBwb2RjYXN0fGVufDF8fHx8MTc2ODA1MDM0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '98K',
    episodeCount: 234
  },
  {
    id: '4',
    title: 'All-In Podcast',
    host: 'Chamath, Jason, Sacks & Friedberg',
    description: 'The tech industry\'s most controversial and honest podcast. Technology, business, economics, and politics from Silicon Valley insiders.',
    category: 'Tech & Business',
    frequency: 'Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1653378972336-103e1ea62721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnZlc3RtZW50JTIwcG9kY2FzdHxlbnwxfHx8fDE3NjgwNTAzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '450K',
    episodeCount: 178
  },
  {
    id: '5',
    title: 'Odd Lots',
    host: 'Tracy Alloway & Joe Weisenthal',
    description: 'Bloomberg\'s markets podcast exploring the most interesting topics in finance through conversations with traders, economists, and researchers.',
    category: 'Markets & Trading',
    frequency: 'Twice Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1599414275896-93076b7c493c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25leSUyMHBvZGNhc3R8ZW58MXx8fHwxNzY4MDUwMzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '180K',
    episodeCount: 456
  },
  {
    id: '6',
    title: 'The Prof G Pod',
    host: 'Scott Galloway',
    description: 'Scott Galloway offers sharp insights and no-mercy analysis on business, tech, and the economy, plus answers to audience questions.',
    category: 'Business Strategy',
    frequency: 'Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1643875180552-03b9bb103768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHBvZGNhc3R8ZW58MXx8fHwxNzY4MDUwMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '215K',
    episodeCount: 267
  },
  {
    id: '7',
    title: 'The Meb Faber Show',
    host: 'Meb Faber',
    description: 'Interviews with legends in investing, finance, and entrepreneurship. Covers everything from trend-following to value investing.',
    category: 'Investing',
    frequency: 'Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1648522168698-537da0654bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwcG9kY2FzdCUyMG1pY3JvcGhvbmV8ZW58MXx8fHwxNzY4MDUwMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '67K',
    episodeCount: 389
  },
  {
    id: '8',
    title: 'Animal Spirits',
    host: 'Ben Carlson & Michael Batnick',
    description: 'A down-to-earth discussion on investing, markets, life, and money with a healthy dose of skepticism and humor.',
    category: 'Personal Finance',
    frequency: 'Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1650513737281-882e597ee5e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvZGNhc3QlMjBzdHVkaW98ZW58MXx8fHwxNzY4MDUwMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '89K',
    episodeCount: 312
  },
  {
    id: '9',
    title: 'Acquired',
    host: 'Ben Gilbert & David Rosenthal',
    description: 'Deep dives into the stories behind the greatest companies and acquisitions in tech and business history.',
    category: 'Business History',
    frequency: 'Monthly',
    imageUrl: 'https://images.unsplash.com/photo-1643875180552-03b9bb103768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHBvZGNhc3R8ZW58MXx8fHwxNzY4MDUwMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '320K',
    episodeCount: 142
  },
  {
    id: '10',
    title: 'Masters in Business',
    host: 'Barry Ritholtz',
    description: 'In-depth conversations with the most interesting people in finance, markets, and economics.',
    category: 'Finance Interviews',
    frequency: 'Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1673767296837-8106e1b94d34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29ub21pY3MlMjBwb2RjYXN0fGVufDF8fHx8MTc2ODA1MDM0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '275K',
    episodeCount: 498
  },
  {
    id: '11',
    title: 'The Indicator',
    host: 'NPR',
    description: 'Quick, digestible explanations of the economy and markets in under 10 minutes per episode.',
    category: 'Economics',
    frequency: 'Daily',
    imageUrl: 'https://images.unsplash.com/photo-1599414275896-93076b7c493c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25leSUyMHBvZGNhc3R8ZW58MXx8fHwxNzY4MDUwMzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '1.8M',
    episodeCount: 1245
  },
  {
    id: '12',
    title: 'We Study Billionaires',
    host: 'The Investor\'s Podcast Network',
    description: 'Learn from the world\'s wealthiest investors through detailed analysis of their strategies and philosophies.',
    category: 'Wealth & Investing',
    frequency: 'Twice Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1653378972336-103e1ea62721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnZlc3RtZW50JTIwcG9kY2FzdHxlbnwxfHx8fDE3NjgwNTAzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '430K',
    episodeCount: 687
  },
  {
    id: '13',
    title: 'Capital Allocators',
    host: 'Ted Seides',
    description: 'Conversations with the leaders in the investment industry to demystify the people and process behind allocating capital.',
    category: 'Investment Management',
    frequency: 'Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1648522168698-537da0654bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwcG9kY2FzdCUyMG1pY3JvcGhvbmV8ZW58MXx8fHwxNzY4MDUwMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '52K',
    episodeCount: 378
  },
  {
    id: '14',
    title: 'Money For The Rest Of Us',
    host: 'David Stein',
    description: 'Personal finance and investing made accessible with a focus on practical strategies for everyday investors.',
    category: 'Personal Finance',
    frequency: 'Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1650513737281-882e597ee5e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvZGNhc3QlMjBzdHVkaW98ZW58MXx8fHwxNzY4MDUwMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '145K',
    episodeCount: 421
  },
  {
    id: '15',
    title: 'The Tim Ferriss Show',
    host: 'Tim Ferriss',
    description: 'Deconstruct world-class performers from finance, business, and beyond to extract tactics and tools.',
    category: 'Business & Self-Improvement',
    frequency: 'Twice Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1643875180552-03b9bb103768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHBvZGNhc3R8ZW58MXx8fHwxNzY4MDUwMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    subscriberCount: '890K',
    episodeCount: 743
  }
];

export const episodes: Episode[] = [
  {
    id: 'e1',
    podcastId: '1',
    title: 'Market Outlook for Q1 2026: What Investors Need to Know',
    date: '2026-01-09',
    duration: '62 min',
    summary: 'In this episode, Josh discusses the key market trends heading into Q1 2026. We explore inflation concerns, interest rate predictions, and sector rotation strategies. Josh breaks down how geopolitical tensions are affecting global markets and provides actionable insights for portfolio positioning.',
    keyTakeaways: [
      'Federal Reserve expected to maintain current rates through Q1 2026 despite persistent inflation signals',
      'S&P 500 trading at 21x forward earnings - concentration risk in mega-cap tech stocks highlighted',
      'Opportunities emerging in mid-cap value stocks and international developed markets trading at discounts',
      'Fixed income showing attractive yields with investment-grade corporates at 5.1%',
      'Importance of rebalancing and avoiding chasing last year\'s winners'
    ],
    topics: ['Federal Reserve', 'Interest Rates', 'Sector Rotation', 'Portfolio Strategy', 'Geopolitics'],
    category: 'finance',
    tags: ['Federal Reserve', 'Interest Rates', 'Stock Market', 'Portfolio Strategy', 'Geopolitics']
  },
  {
    id: 'e2',
    podcastId: '1',
    title: 'The AI Investment Thesis: Separating Hype from Reality',
    date: '2026-01-08',
    duration: '58 min',
    summary: 'Josh and Michael break down the current state of AI investments, examining which companies have sustainable competitive advantages and which are riding the hype wave. They discuss capital allocation strategies in the AI sector and debate whether we\'re in a bubble or the early innings of a generational shift.',
    keyTakeaways: [
      'AI infrastructure companies (NVIDIA, AMD) have clearer paths to profitability than application-layer startups',
      'The "picks and shovels" strategy remains valid - invest in the companies selling tools to AI builders',
      'Most AI valuations assume winner-take-all dynamics that may not materialize',
      'Energy infrastructure will be a critical bottleneck for AI scaling'
    ],
    topics: ['Artificial Intelligence', 'Tech Investing', 'Valuation', 'Market Cycles'],
    category: 'technology',
    tags: ['AI & Innovation', 'Valuation', 'Stock Market', 'Startup Ecosystem']
  },
  {
    id: 'e3',
    podcastId: '1',
    title: 'The Death of the 60/40 Portfolio?',
    date: '2026-01-01',
    duration: '52 min',
    summary: 'A deep dive into whether the classic 60/40 stock-bond portfolio still makes sense in a world of persistent inflation and changing correlation dynamics. The hosts explore alternative allocation strategies and discuss what the modern portfolio should look like.',
    keyTakeaways: [
      'Bond-stock correlations have broken down in recent years, reducing diversification benefits',
      'Adding alternative assets like commodities and real estate can improve risk-adjusted returns',
      'The 60/40 isn\'t dead, but it needs to be more dynamic and global',
      'Retirees may need to accept lower safe withdrawal rates than the traditional 4% rule'
    ],
    topics: ['Portfolio Construction', 'Asset Allocation', 'Retirement Planning', 'Modern Portfolio Theory'],
    category: 'finance',
    tags: ['Portfolio Strategy', 'Inflation', 'Commodities', 'Real Estate']
  },
  {
    id: 'e4',
    podcastId: '2',
    title: 'Why Are Eggs So Expensive?',
    date: '2026-01-06',
    duration: '28 min',
    summary: 'An exploration of the recent surge in egg prices, tracing the economic factors from bird flu outbreaks to supply chain consolidation. The episode examines how small disruptions in agricultural markets can create outsized price impacts for consumers.',
    keyTakeaways: [
      'Avian flu wiped out 58 million birds in 2022-2023, creating lasting supply constraints',
      'The egg industry is highly consolidated with just a few major producers controlling most supply',
      'Eggs are relatively inelastic - people buy similar amounts regardless of price',
      'Recovery is slow because it takes 5-6 months to raise a hen to egg-laying maturity'
    ],
    topics: ['Economics', 'Supply Chain', 'Agriculture', 'Inflation'],
    category: 'finance',
    tags: ['Inflation', 'Commodities', 'Regulation']
  },
  {
    id: 'e5',
    podcastId: '3',
    title: 'Marc Andreessen: AI, Regulation, and the Future of Tech',
    date: '2026-01-05',
    duration: '105 min',
    summary: 'Patrick sits down with Marc Andreessen to discuss the investment landscape in AI, the regulatory challenges facing tech companies, and why he remains bullish on American innovation despite increasing government intervention.',
    keyTakeaways: [
      'AI will be deflationary in the long run but requires massive capital investment upfront',
      'Regulatory capture is the biggest risk to innovation, not technological limitations',
      'The next decade will separate truly differentiated AI companies from commodity providers',
      'Building in America is becoming harder, but the talent concentration still makes it worthwhile'
    ],
    topics: ['Venture Capital', 'Artificial Intelligence', 'Regulation', 'Innovation'],
    category: 'technology',
    tags: ['AI & Innovation', 'Regulation', 'Startup Ecosystem', 'Valuation']
  },
  {
    id: 'e6',
    podcastId: '4',
    title: 'The 2026 Economic Outlook: Soft Landing or Recession?',
    date: '2026-01-03',
    duration: '89 min',
    summary: 'The besties debate whether the Fed has successfully engineered a soft landing or if a recession is still on the horizon. They discuss inflation trends, labor market dynamics, and what it means for startup valuations and fundraising.',
    keyTakeaways: [
      'Inflation is moderating but remains above the Fed\'s 2% target',
      'The labor market is cooling but not collapsing - exactly what the Fed wants',
      'Commercial real estate remains a significant risk factor for regional banks',
      'Startup valuations are stabilizing but remain well below 2021 peaks'
    ],
    topics: ['Macroeconomics', 'Federal Reserve', 'Startups', 'Real Estate'],
    category: 'finance',
    tags: ['Federal Reserve', 'Recession Risk', 'Real Estate', 'Startup Ecosystem']
  },
  {
    id: 'e7',
    podcastId: '5',
    title: 'Inside the World of Sports Betting Arbitrage',
    date: '2026-01-07',
    duration: '45 min',
    summary: 'Tracy and Joe explore the growing world of sports betting and how professional bettors exploit pricing inefficiencies across sportsbooks. They discuss the economics of the betting industry and why the house doesn\'t always win.',
    keyTakeaways: [
      'Sports betting is now a $100B+ industry in the US following legalization',
      'Professional bettors use sophisticated algorithms to find arbitrage opportunities',
      'Sportsbooks lose money on promotions but make it back on retail bettors',
      'The industry consolidation mirrors what happened with online poker in the 2000s'
    ],
    topics: ['Sports Betting', 'Arbitrage', 'Market Efficiency', 'Regulation'],
    category: 'finance',
    tags: ['Regulation', 'Valuation', 'Earnings']
  },
  {
    id: 'e8',
    podcastId: '6',
    title: 'The Algebra of Wealth: 2026 Edition',
    date: '2025-12-30',
    duration: '38 min',
    summary: 'Scott Galloway updates his framework for building wealth in 2026, discussing how rising interest rates and inflation have changed the playbook. He shares contrarian views on homeownership, career choices, and investment strategies.',
    keyTakeaways: [
      'Focus > Diversification when you\'re young - go all-in on your career',
      'Homeownership is still the best forced savings mechanism for most people',
      'The S&P 500 remains the best investment for 95% of people',
      'Stoicism is the key to wealth - living below your means compounds over time'
    ],
    topics: ['Wealth Building', 'Personal Finance', 'Career Strategy', 'Real Estate'],
    category: 'finance',
    tags: ['Real Estate', 'Stock Market', 'Interest Rates', 'Portfolio Strategy']
  },
  {
    id: 'e9',
    podcastId: '7',
    title: 'Cliff Asness: Factor Investing and Market Efficiency',
    date: '2025-12-28',
    duration: '72 min',
    summary: 'Meb interviews Cliff Asness of AQR Capital about factor investing, market efficiency, and why value investing has struggled in recent years. They debate whether the value premium still exists and what it means for quantitative investors.',
    keyTakeaways: [
      'Value investing works but requires patience - it can underperform for a decade',
      'The rise of passive investing has created both opportunities and challenges for active managers',
      'Factor investing requires discipline - most investors bail out at exactly the wrong time',
      'Diversification across factors (value, momentum, quality) is crucial for long-term success'
    ],
    topics: ['Factor Investing', 'Quantitative Investing', 'Value Investing', 'Market Efficiency'],
    category: 'finance',
    tags: ['Stock Market', 'Valuation', 'Portfolio Strategy']
  },
  {
    id: 'e10',
    podcastId: '8',
    title: 'The Psychology of Market Timing',
    date: '2026-01-04',
    duration: '41 min',
    summary: 'Ben and Michael discuss why market timing is so tempting yet so difficult, examining behavioral biases that lead investors astray. They share stories of their own mistakes and what they\'ve learned about managing emotions in investing.',
    keyTakeaways: [
      'Market timing is intellectually appealing but practically impossible to execute consistently',
      'The best times to invest often feel the worst - markets bottom when sentiment is darkest',
      'Dollar-cost averaging removes the emotional burden of timing decisions',
      'Most investors would be better off with automatic rebalancing and less news consumption'
    ],
    topics: ['Behavioral Finance', 'Market Timing', 'Investment Psychology', 'Personal Finance'],
    category: 'finance',
    tags: ['Stock Market', 'Portfolio Strategy', 'Recession Risk']
  },
  {
    id: 'e11',
    podcastId: '2',
    title: 'The Economics of Taylor Swift',
    date: '2026-01-10',
    duration: '32 min',
    summary: 'How one artist\'s tour became a significant economic force, driving measurable impacts on local economies, hotel prices, and even inflation metrics. An exploration of the monetization of cultural phenomena.',
    keyTakeaways: [
      'The Eras Tour generated an estimated $5 billion in economic activity',
      'Concert ticket pricing demonstrates perfect price discrimination in action',
      'Local inflation spikes correlated with tour stops in multiple cities',
      'The tour economy shows how cultural capital translates to economic impact'
    ],
    topics: ['Economics', 'Entertainment', 'Pricing', 'Cultural Economics'],
    category: 'finance',
    tags: ['Inflation', 'Earnings']
  },
  {
    id: 'e12',
    podcastId: '4',
    title: 'Is College Still Worth It?',
    date: '2026-01-10',
    duration: '95 min',
    summary: 'The besties tackle the rising cost of college education and whether a traditional 4-year degree still provides positive ROI. They discuss alternatives, the skills gap, and what higher education needs to change.',
    keyTakeaways: [
      'College ROI varies dramatically by major and institution',
      'Elite schools still provide unmatched networking benefits',
      'Coding bootcamps and trade schools are viable alternatives for many',
      'The credential inflation arms race is unsustainable long-term'
    ],
    topics: ['Education', 'Economics', 'Career Planning', 'Student Debt'],
    category: 'technology',
    tags: ['AI & Innovation', 'Startup Ecosystem', 'Regulation']
  },
  {
    id: 'e13',
    podcastId: '10',
    title: 'Howard Marks on Market Cycles',
    date: '2026-01-08',
    duration: '68 min',
    summary: 'Barry sits down with Oaktree Capital\'s Howard Marks to discuss his framework for understanding market cycles and how investors can position themselves accordingly.',
    keyTakeaways: [
      'We\'re in the mid-to-late stage of the current market cycle',
      'The pendulum always swings too far in both directions',
      'Risk tolerance should decrease as valuations increase',
      'Second-level thinking separates great investors from good ones'
    ],
    topics: ['Market Cycles', 'Value Investing', 'Risk Management', 'Investment Philosophy'],
    category: 'finance',
    tags: ['Stock Market', 'Valuation', 'Recession Risk', 'Portfolio Strategy']
  },
  {
    id: 'e14',
    podcastId: '9',
    title: 'Costco: The Retail Phenomenon',
    date: '2026-01-02',
    duration: '128 min',
    summary: 'An epic deep dive into Costco\'s business model, examining how the warehouse retailer built one of the most successful subscription businesses in history.',
    keyTakeaways: [
      'Membership fees, not product sales, drive Costco\'s profitability',
      'The treasure hunt shopping experience creates psychological engagement',
      'Costco\'s employee compensation strategy reduces turnover and increases productivity',
      'Limited SKU count (4,000 vs Walmart\'s 100,000+) is a strategic advantage'
    ],
    topics: ['Business Strategy', 'Retail', 'Subscription Models', 'Operations'],
    category: 'finance',
    tags: ['Earnings', 'Valuation', 'Real Estate']
  },
  {
    id: 'e15',
    podcastId: '11',
    title: 'Why Housing Keeps Getting More Expensive',
    date: '2026-01-15',
    duration: '12 min',
    summary: 'A quick explanation of the structural factors driving housing prices higher: zoning restrictions, NIMBYism, construction costs, and demographic demand.',
    keyTakeaways: [
      'Housing supply hasn\'t kept pace with household formation since 2008',
      'Zoning laws effectively ban affordable housing in most desirable areas',
      'Construction costs have risen 40% faster than general inflation',
      'Remote work increased demand for space while constraining supply'
    ],
    topics: ['Housing', 'Real Estate', 'Policy', 'Economics'],
    category: 'finance',
    tags: ['Real Estate', 'Inflation', 'Regulation']
  },
  {
    id: 'e16',
    podcastId: '12',
    title: 'Warren Buffett\'s 2026 Letter Breakdown',
    date: '2026-01-14',
    duration: '54 min',
    summary: 'A detailed analysis of Warren Buffett\'s annual letter to Berkshire Hathaway shareholders, extracting timeless investing wisdom and current market insights.',
    keyTakeaways: [
      'Berkshire is sitting on record $180B cash - signals market valuations are stretched',
      'Buffett emphasizes the importance of float in the insurance business model',
      'Quality businesses with pricing power are worth paying up for',
      'The best investment is in yourself - skills compound like interest'
    ],
    topics: ['Value Investing', 'Berkshire Hathaway', 'Investment Philosophy', 'Business Quality'],
    category: 'finance',
    tags: ['Stock Market', 'Valuation', 'Portfolio Strategy', 'Earnings']
  },
  {
    id: 'e17',
    podcastId: '3',
    title: 'Naval Ravikant: Building Wealth in the Age of AI',
    date: '2026-01-12',
    duration: '118 min',
    summary: 'Patrick and Naval discuss how AI changes the wealth creation playbook, the importance of leverage, and why permissionless platforms matter more than ever.',
    keyTakeaways: [
      'AI will make knowledge work abundant but judgment scarce',
      'Permissionless leverage (code, media) beats labor leverage',
      'Specific knowledge can\'t be taught but it can be learned',
      'Build equity, don\'t rent your time'
    ],
    topics: ['Entrepreneurship', 'AI', 'Wealth Creation', 'Career Strategy'],
    category: 'technology',
    tags: ['AI & Innovation', 'Startup Ecosystem', 'Cryptocurrency']
  },
  {
    id: 'e18',
    podcastId: '5',
    title: 'The Yen Carry Trade Unwind',
    date: '2026-01-13',
    duration: '38 min',
    summary: 'Tracy and Joe explain the mechanics of the yen carry trade and why its potential unwinding could trigger global market volatility.',
    keyTakeaways: [
      'Investors have borrowed trillions in yen to invest in higher-yielding assets',
      'Bank of Japan policy normalization threatens this trade',
      'A rapid unwind could trigger forced selling across asset classes',
      'Currency markets are showing early signs of stress'
    ],
    topics: ['Currency Markets', 'Leverage', 'Global Macro', 'Japan'],
    category: 'geo-politics',
    tags: ['Geopolitics', 'Interest Rates', 'Recession Risk']
  },
  {
    id: 'e19',
    podcastId: '6',
    title: 'The Crisis of Young Men',
    date: '2026-01-13',
    duration: '42 min',
    summary: 'Scott examines the statistical decline in young men\'s economic prospects, education attainment, and social connections - and what it means for society.',
    keyTakeaways: [
      'Men now represent only 40% of college students, down from 60% in 1970',
      'Young men are falling behind in earnings and career advancement',
      'Social isolation and lack of purpose are driving mental health crisis',
      'Policy solutions need to address masculinity without toxic elements'
    ],
    topics: ['Demographics', 'Education', 'Labor Markets', 'Social Trends'],
    category: 'geo-politics',
    tags: ['Regulation', 'Geopolitics']
  },
  {
    id: 'e20',
    podcastId: '15',
    title: 'Morgan Housel: Same As Ever',
    date: '2026-01-11',
    duration: '92 min',
    summary: 'Tim talks with Morgan Housel about his new book exploring the timeless truths about human behavior, risk, and decision-making.',
    keyTakeaways: [
      'The biggest economic risks are always the ones we\'re not paying attention to',
      'Room for error is underrated - planning for perfect execution is planning to fail',
      'Wealth is what you don\'t spend, not what you earn',
      'Historical patterns repeat because human nature never changes'
    ],
    topics: ['Behavioral Economics', 'Risk', 'Wealth', 'Decision Making'],
    category: 'finance',
    tags: ['Portfolio Strategy', 'Recession Risk', 'Stock Market']
  },
  {
    id: 'e21',
    podcastId: '7',
    title: 'Jack Bogle\'s Legacy: The Index Fund Revolution',
    date: '2026-01-09',
    duration: '58 min',
    summary: 'Meb reflects on Jack Bogle\'s impact on investing and why the shift to passive investing has been one of the greatest wealth transfers to ordinary investors.',
    keyTakeaways: [
      'Index funds have saved investors an estimated $1 trillion in fees',
      'The average active fund underperforms its benchmark by its fee',
      'Passive investing only works because most investors are still active',
      'Low costs are the only free lunch in investing'
    ],
    topics: ['Index Investing', 'Fees', 'Passive Investing', 'Vanguard'],
    category: 'finance',
    tags: ['Stock Market', 'Portfolio Strategy', 'Valuation']
  },
  {
    id: 'e22',
    podcastId: '8',
    title: 'Bitcoin at $100K: What Now?',
    date: '2026-01-11',
    duration: '47 min',
    summary: 'Ben and Michael discuss Bitcoin reaching six figures and debate whether crypto has finally matured into a legitimate asset class or if we\'re in another bubble.',
    keyTakeaways: [
      'Institutional adoption through ETFs has fundamentally changed crypto dynamics',
      'Bitcoin\'s correlation with tech stocks suggests it\'s a risk asset, not digital gold',
      'Regulatory clarity has improved but challenges remain',
      'The case for Bitcoin as inflation hedge hasn\'t played out as predicted'
    ],
    topics: ['Cryptocurrency', 'Bitcoin', 'Asset Allocation', 'Digital Assets'],
    category: 'technology',
    tags: ['Cryptocurrency', 'Regulation', 'Valuation', 'Portfolio Strategy']
  },
  {
    id: 'e23',
    podcastId: '13',
    title: 'Endowment Management Strategies',
    date: '2026-01-07',
    duration: '62 min',
    summary: 'Ted speaks with a major university endowment CIO about their investment approach, illiquid allocations, and lessons from the Yale model.',
    keyTakeaways: [
      'Endowments can exploit their long time horizon through illiquid investments',
      'The Yale model works but requires access and expertise most can\'t replicate',
      'Private equity and venture capital allocations now exceed 50% for many endowments',
      'Spending policy discipline is as important as investment returns'
    ],
    topics: ['Institutional Investing', 'Alternative Assets', 'Portfolio Management', 'Endowments'],
    category: 'finance',
    tags: ['Portfolio Strategy', 'Startup Ecosystem', 'Real Estate']
  },
  {
    id: 'e24',
    podcastId: '14',
    title: 'Retiring in a High Interest Rate World',
    date: '2026-01-06',
    duration: '48 min',
    summary: 'David explores how higher interest rates change retirement planning, from safe withdrawal rates to annuity considerations to portfolio construction.',
    keyTakeaways: [
      'Higher bond yields make 60/40 portfolios more attractive for retirees',
      'Annuities finally offer decent value after years of rock-bottom rates',
      'The 4% rule may be conservative again with bonds yielding 5%+',
      'Sequence of returns risk is lower in high-yield environments'
    ],
    topics: ['Retirement Planning', 'Interest Rates', 'Fixed Income', 'Annuities'],
    category: 'finance',
    tags: ['Interest Rates', 'Portfolio Strategy', 'Federal Reserve']
  },
  {
    id: 'e25',
    podcastId: '10',
    title: 'Ray Dalio on Changing World Order',
    date: '2026-01-15',
    duration: '74 min',
    summary: 'Barry interviews Ray Dalio about his framework for understanding major geopolitical and economic transitions throughout history.',
    keyTakeaways: [
      'We\'re in a classic power transition between established and rising empires',
      'Debt cycles and currency debasement follow predictable patterns',
      'Internal conflict often peaks during external power transitions',
      'China\'s rise mirrors other historical empire transitions'
    ],
    topics: ['Geopolitics', 'History', 'Macro Economics', 'China'],
    category: 'geo-politics',
    tags: ['Geopolitics', 'Federal Reserve', 'Interest Rates', 'Recession Risk']
  }
];