'use client';

import { useState, useCallback } from 'react';
import { Newspaper, TrendingUp, DollarSign, Calendar, Target, Twitter } from 'lucide-react';
import { NewsTab } from './panel-tabs/NewsTab';
import { MarketsTab } from './panel-tabs/MarketsTab';
import { EarningsTab } from './panel-tabs/EarningsTab';
import { CalendarTab } from './panel-tabs/CalendarTab';
import { PredictionsTab } from './panel-tabs/PredictionsTab';
import { TweetsTab } from './panel-tabs/TweetsTab';

type Tab = 'news' | 'markets' | 'earnings' | 'calendar' | 'predictions' | 'tweets';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'news',        label: 'NEWS',        icon: Newspaper   },
  { id: 'markets',     label: 'MARKETS',     icon: TrendingUp  },
  { id: 'earnings',    label: 'EARNINGS',    icon: DollarSign  },
  { id: 'calendar',    label: 'CALENDAR',    icon: Calendar    },
  { id: 'predictions', label: 'PREDICTIONS', icon: Target      },
  { id: 'tweets',      label: 'TWEETS',      icon: Twitter     },
];

export function LiveDataPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('news');
  const [loadedTabs, setLoadedTabs] = useState<Set<Tab>>(new Set(['news']));

  const handleTabClick = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setLoadedTabs(prev => new Set([...prev, tab]));
  }, []);

  return (
    <div className="mt-4 border-t border-border pt-4">

      {/* Tab bar - 3x2 grid to fit the panel */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleTabClick(id)}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-semibold tracking-wide transition-colors ${
              activeTab === id
                ? 'bg-blue-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content - only render if tab has been clicked */}
      <div className="min-h-48">
        {activeTab === 'news'        && <NewsTab        key="news"        />}
        {activeTab === 'markets'     && <MarketsTab     key="markets"     />}
        {activeTab === 'earnings'    && <EarningsTab    key="earnings"    />}
        {activeTab === 'calendar'    && <CalendarTab    key="calendar"    />}
        {activeTab === 'predictions' && <PredictionsTab key="predictions" />}
        {activeTab === 'tweets'      && <TweetsTab      key="tweets"      />}
      </div>

    </div>
  );
}
