"use client";

import { useState } from 'react';
import { Crown, MessageCircle, RefreshCw, User, Settings, HelpCircle, Shield, Newspaper, TrendingUp, DollarSign, Calendar, Target, Twitter } from 'lucide-react';
import { useRouter } from 'next/navigation.js';
import { IconButton } from '../ui/IconButton.js';
import { NotificationDropdown } from '../NotificationDropdown.js';
import { NewsTab } from '../panel-tabs/NewsTab.js';
import { MarketsTab } from '../panel-tabs/MarketsTab.js';
import { EarningsTab } from '../panel-tabs/EarningsTab.js';
import { CalendarTab } from '../panel-tabs/CalendarTab.js';
import { PredictionsTab } from '../panel-tabs/PredictionsTab.js';
import { TweetsTab } from '../panel-tabs/TweetsTab.js';
import { UpNextSection } from '../panel-sections/UpNextSection.js';
import { SuggestionsSection } from '../panel-sections/SuggestionsSection.js';

type PanelTab = 'news' | 'markets' | 'earnings' | 'calendar' | 'predictions' | 'tweets' | null;

interface RightRailClientProps {
  user?: {
    name: string | null;
    email: string;
    role: 'admin' | 'user';
  } | null;
}

export function RightRailClient({ user }: RightRailClientProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<PanelTab>(null);

  const TABS = [
    { id: 'news' as const,        label: 'NEWS',        icon: Newspaper   },
    { id: 'markets' as const,     label: 'MARKETS',     icon: TrendingUp  },
    { id: 'earnings' as const,    label: 'EARNINGS',    icon: DollarSign  },
    { id: 'calendar' as const,    label: 'CALENDAR',    icon: Calendar    },
    { id: 'predictions' as const, label: 'PREDICTIONS', icon: Target      },
    { id: 'tweets' as const,      label: 'TWEETS',      icon: Twitter     },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <aside className="fixed right-4 top-4 bottom-4 w-[320px] bg-white rounded-2xl shadow-lg overflow-visible flex flex-col">
      {/* Header Icons */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-1">
          <IconButton 
            variant="subtle" 
            className="w-10 h-10 bg-yellow-50 hover:bg-yellow-100"
            onClick={() => router.push('/premium')}
          >
            <Crown size={20} className="text-yellow-600" />
          </IconButton>
          <IconButton 
            className="w-10 h-10"
            onClick={() => router.push('/chat')}
          >
            <MessageCircle size={20} className="text-gray-600" />
          </IconButton>
          <IconButton 
            className="w-10 h-10"
            onClick={handleRefresh}
          >
            <RefreshCw size={20} className={`text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </IconButton>
        </div>
        <div className="flex items-center gap-1 relative">
          <NotificationDropdown />

          {/* Auth Controls */}
          {!user ? (
            // Not signed in - show Sign In button
            <button
              onClick={() => router.push('/auth/signin')}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          ) : (
            // Signed in - show profile menu
            <div className="relative">
              <button 
                className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden hover:bg-gray-300 transition-colors flex items-center justify-center"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                title={user.email}
              >
                {user.name ? (
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={20} className="text-gray-600" />
                )}
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push('/profile');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push('/settings');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push('/help');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <HelpCircle size={16} />
                      Help
                    </button>

                    {/* Admin Link - Only for admin users */}
                    {user.role === 'admin' && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push('/admin');
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-semibold"
                        >
                          <Shield size={16} />
                          ADMIN
                        </button>
                      </>
                    )}

                    {/* Sign Out */}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push('/api/auth/signout');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <span className="text-base">→</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden rounded-b-2xl">
        {/* Conditional content */}
        {activeTab === null ? (
          // Default mode: show Up Next + Suggestions
          <>
            <UpNextSection />
            <SuggestionsSection />
          </>
        ) : (
          // Tab mode: show live data content
          <div className="px-4 pt-4 pb-4">
            {activeTab === 'news'        && <NewsTab        key="news"        />}
            {activeTab === 'markets'     && <MarketsTab     key="markets"     />}
            {activeTab === 'earnings'    && <EarningsTab    key="earnings"    />}
            {activeTab === 'calendar'    && <CalendarTab    key="calendar"    />}
            {activeTab === 'predictions' && <PredictionsTab key="predictions" />}
            {activeTab === 'tweets'      && <TweetsTab      key="tweets"      />}
          </div>
        )}
      </div>

      {/* Tab bar - fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-100 px-4 pt-3 pb-2">
        <div className="grid grid-cols-3 gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(prev => prev === id ? null : id)}
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
      </div>

      {/* Help Button - always at bottom */}
      <div className="px-4 pb-6 flex-shrink-0">
        <button 
          onClick={() => router.push('/help')}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-xl">❓</span>
          <span className="text-sm font-medium">Help & Support</span>
        </button>
      </div>
    </aside>
  );
}
