"use client";

import { Crown, Calendar, TrendingUp, Bell } from 'lucide-react';
import { IconButton } from '../../components/ui/IconButton.js';

const upNextItems = [
  {
    id: 1,
    title: 'Market Analysis: Fed Policy and Tech Earnings',
    show: 'All-In Podcast',
    host: 'Chamath',
    date: '01-15-2026',
    thumbnail: '🎙️',
  },
  {
    id: 2,
    title: 'Quarterly Economic Outlook - January 14, 2026',
    show: 'Quarterly Report',
    summaries: 142,
    date: '01-14-2026',
    thumbnail: '📊',
  },
  {
    id: 3,
    title: "Understanding the Federal Reserve's Balance Sheet",
    show: 'Odd Lots',
    host: 'Tracy Alloway',
    date: '01-13-2026',
    thumbnail: '🎵',
  },
];

const suggestions = [
  { name: 'Planet Money', avatar: '💰' },
  { name: 'Josh Brown', avatar: '👨' },
  { name: 'Masters in Business', avatar: '👩' },
  { name: 'Chamath Palihapitiya', avatar: '👨‍💼' },
];

const quickActions = [
  { label: 'NEWS', icon: '📰' },
  { label: 'CALENDAR', icon: '📅' },
  { label: 'EARNINGS', icon: '💼' },
  { label: 'TWEETS', icon: '🐦' },
  { label: 'PREDICTIONS', icon: '📈' },
  { label: 'MARKETS', icon: '📊' },
];

export function RightRail() {
  return (
    <aside className="fixed right-4 top-4 bottom-4 w-[320px] bg-white rounded-2xl shadow-lg overflow-y-auto">
      {/* Header Icons */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <IconButton variant="subtle" className="w-10 h-10 bg-yellow-50 hover:bg-yellow-100">
            <Crown size={20} className="text-yellow-600" />
          </IconButton>
          <IconButton className="w-10 h-10">
            <Calendar size={20} className="text-gray-600" />
          </IconButton>
          <IconButton className="w-10 h-10">
            <TrendingUp size={20} className="text-gray-600" />
          </IconButton>
        </div>
        <div className="flex items-center gap-1">
          <IconButton className="relative w-10 h-10">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </IconButton>
          <button className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden hover:bg-gray-300 transition-colors">
            <span className="text-xl">👤</span>
          </button>
        </div>
      </div>

      {/* Up Next Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-base">⏱️</span>
            Up Next
          </h3>
        </div>

        <div className="space-y-2">
          {upNextItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {item.thumbnail}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-foreground line-clamp-2 mb-2">
                    {item.title}
                  </h4>
                  <div className="space-y-1 text-[10px] text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <span>🎙️</span>
                      <span>{item.show}</span>
                    </p>
                    {item.host && (
                      <p className="flex items-center gap-1">
                        <span>👤</span>
                        <span>{item.host}</span>
                      </p>
                    )}
                    {item.summaries && (
                      <p className="flex items-center gap-1">
                        <span>📝</span>
                        <span>{item.summaries} summaries</span>
                      </p>
                    )}
                    <p className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{item.date}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <span className="text-lg">🔖</span>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <span className="text-lg">↗️</span>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <span className="text-lg">⬇️</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          Show More ↓
        </button>
      </div>

      {/* Suggestions Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-base">💡</span>
            Suggestions
          </h3>
          <div className="flex gap-1">
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100">
              ←
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100">
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="text-center">
              <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center text-2xl mb-2 hover:bg-gray-100 transition-colors cursor-pointer">
                {suggestion.avatar}
              </div>
              <p className="text-[10px] font-medium text-foreground truncate">
                {suggestion.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="flex flex-col items-center gap-2 py-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-[10px] font-medium text-foreground">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Help Button */}
      <div className="px-4 pb-6">
        <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <span className="text-xl">❓</span>
          <span className="text-sm font-medium">Help & Support</span>
        </button>
      </div>
    </aside>
  );
}
