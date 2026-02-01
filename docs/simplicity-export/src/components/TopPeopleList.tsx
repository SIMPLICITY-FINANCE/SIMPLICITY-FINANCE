import { ArrowLeft, Users, CheckCircle2 } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  handle: string;
  imageUrl: string;
  bio: string;
  expertise: string[];
  totalAppearances: number;
  isVerified: boolean;
}

interface TopPeopleListProps {
  onBack: () => void;
  onPersonClick?: (personId: string) => void;
}

const mockPeople: Person[] = [
  {
    id: '1',
    name: 'Ray Dalio',
    handle: '@raydalio',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Founder of Bridgewater Associates, one of the world\'s largest hedge funds. Author of Principles.',
    expertise: ['Investing', 'Economics', 'Management', 'Philosophy'],
    totalAppearances: 24,
    isVerified: true
  },
  {
    id: '5',
    name: 'Warren Buffett',
    handle: '@warrenbuffett',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'Chairman and CEO of Berkshire Hathaway. One of the most successful investors of all time.',
    expertise: ['Value Investing', 'Business', 'Finance'],
    totalAppearances: 21,
    isVerified: true
  },
  {
    id: '2',
    name: 'Cathie Wood',
    handle: '@cathiewood',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Founder and CEO of ARK Invest, focused on disruptive innovation in tech and healthcare.',
    expertise: ['Innovation', 'Technology', 'Healthcare', 'ETFs'],
    totalAppearances: 18,
    isVerified: true
  },
  {
    id: '4',
    name: 'Janet Yellen',
    handle: '@janetyellen',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'U.S. Treasury Secretary, former Federal Reserve Chair. Expert in monetary policy and economics.',
    expertise: ['Monetary Policy', 'Economics', 'Government'],
    totalAppearances: 15,
    isVerified: true
  },
  {
    id: '6',
    name: 'Christine Lagarde',
    handle: '@christinelagarde',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    bio: 'President of the European Central Bank, former IMF Managing Director. Expert on global finance.',
    expertise: ['Central Banking', 'Global Finance', 'Economics'],
    totalAppearances: 14,
    isVerified: true
  },
  {
    id: '3',
    name: 'Michael Burry',
    handle: '@michaelburry',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Hedge fund manager known for predicting the 2008 financial crisis. Featured in The Big Short.',
    expertise: ['Value Investing', 'Market Analysis', 'Contrarian'],
    totalAppearances: 12,
    isVerified: true
  },
  {
    id: '7',
    name: 'Jerome Powell',
    handle: '@jeromepowell',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Chair of the Federal Reserve. Leading voice in U.S. monetary policy and financial regulation.',
    expertise: ['Monetary Policy', 'Federal Reserve', 'Economics'],
    totalAppearances: 16,
    isVerified: true
  },
  {
    id: '8',
    name: 'Charlie Munger',
    handle: '@charliemunger',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Vice Chairman of Berkshire Hathaway. Known for his wit and wisdom on investing and business.',
    expertise: ['Value Investing', 'Business', 'Philosophy'],
    totalAppearances: 19,
    isVerified: true
  },
  {
    id: '9',
    name: 'Mary Erdoes',
    handle: '@maryerdoes',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    bio: 'CEO of J.P. Morgan Asset & Wealth Management, overseeing $2.5 trillion in assets.',
    expertise: ['Asset Management', 'Wealth Management', 'Finance'],
    totalAppearances: 11,
    isVerified: true
  },
  {
    id: '10',
    name: 'Larry Fink',
    handle: '@larryfink',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'CEO and Chairman of BlackRock, the world\'s largest asset manager with $10 trillion in AUM.',
    expertise: ['Asset Management', 'ESG', 'Finance'],
    totalAppearances: 13,
    isVerified: true
  },
  {
    id: '11',
    name: 'Bill Ackman',
    handle: '@billackman',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Founder and CEO of Pershing Square Capital Management. Known for activist investing.',
    expertise: ['Activist Investing', 'Hedge Funds', 'Finance'],
    totalAppearances: 15,
    isVerified: true
  },
  {
    id: '12',
    name: 'Abigail Johnson',
    handle: '@abigailjohnson',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'CEO and President of Fidelity Investments. Third generation leader of the investment giant.',
    expertise: ['Asset Management', 'Mutual Funds', 'Finance'],
    totalAppearances: 10,
    isVerified: true
  },
  {
    id: '13',
    name: 'David Tepper',
    handle: '@davidtepper',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Founder of Appaloosa Management. One of the world\'s most successful hedge fund managers.',
    expertise: ['Hedge Funds', 'Distressed Debt', 'Investing'],
    totalAppearances: 8,
    isVerified: true
  },
  {
    id: '14',
    name: 'Stanley Druckenmiller',
    handle: '@standruckenmiller',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'Legendary investor and founder of Duquesne Capital. Former lead portfolio manager for George Soros.',
    expertise: ['Macro Investing', 'Hedge Funds', 'Trading'],
    totalAppearances: 12,
    isVerified: true
  },
  {
    id: '15',
    name: 'Bridgewater Ray Dalio',
    handle: '@bridgewaterray',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Investor and philanthropist. Known for groundbreaking work in emerging markets.',
    expertise: ['Emerging Markets', 'Private Equity', 'Philanthropy'],
    totalAppearances: 9,
    isVerified: true
  },
  {
    id: '16',
    name: 'Mohamed El-Erian',
    handle: '@mohamederian',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Chief Economic Advisor at Allianz. Former CEO of PIMCO. Leading voice on global economics.',
    expertise: ['Economics', 'Fixed Income', 'Global Markets'],
    totalAppearances: 17,
    isVerified: true
  },
  {
    id: '17',
    name: 'Nouriel Roubini',
    handle: '@nourielroubini',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Professor at NYU Stern. Known as "Dr. Doom" for predicting the 2008 financial crisis.',
    expertise: ['Economics', 'Crisis Prediction', 'Global Markets'],
    totalAppearances: 14,
    isVerified: true
  },
  {
    id: '18',
    name: 'Howard Marks',
    handle: '@howardmarks',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'Co-founder of Oaktree Capital Management. Famous for his investment memos on market cycles.',
    expertise: ['Distressed Debt', 'Value Investing', 'Market Cycles'],
    totalAppearances: 11,
    isVerified: true
  },
  {
    id: '19',
    name: 'Ken Griffin',
    handle: '@kengriffin',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Founder and CEO of Citadel. One of the world\'s most successful hedge fund managers.',
    expertise: ['Hedge Funds', 'Quantitative Trading', 'Finance'],
    totalAppearances: 10,
    isVerified: true
  },
  {
    id: '20',
    name: 'Janet Yellen',
    handle: '@janet_yellen',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Economic policy expert and former White House advisor. Specialist in macroeconomic trends.',
    expertise: ['Economic Policy', 'Macroeconomics', 'Government'],
    totalAppearances: 7,
    isVerified: true
  }
];

// Sort by total appearances for Top 20
const topPeople = [...mockPeople].sort((a, b) => b.totalAppearances - a.totalAppearances).slice(0, 20);

export function TopPeopleList({ onBack, onPersonClick }: TopPeopleListProps) {
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
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Top People</h1>
            <p className="text-sm text-muted-foreground">The 20 most featured guests and experts</p>
          </div>
        </div>
      </div>

      {/* Grid of People */}
      <div className="space-y-3 mb-10">
        {topPeople.map((person, index) => (
          <div
            key={person.id}
            onClick={() => onPersonClick?.(person.id)}
            className="bg-card border border-border rounded-xl p-4 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex gap-4">
              {/* Person Photo */}
              <div className="flex-shrink-0">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted border-2 border-border group-hover:border-emerald-300 dark:group-hover:border-emerald-700 transition-colors">
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Person Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-bold text-sm text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {person.name}
                  </h3>
                  {person.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {person.handle}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {person.expertise.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {person.totalAppearances} podcast appearances
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-900/30 rounded-xl p-6">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">About Top People</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These are the most featured financial experts, investors, and thought leaders on Simplicity, ranked by their total podcast appearances. Each person brings unique expertise and valuable insights from their experience in markets, economics, and finance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}