"use client";

import { Crown, Calendar, TrendingUp, Bell } from 'lucide-react';

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
    <aside className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header Icons */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
            <Crown size={20} className="text-yellow-600" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={20} className="text-gray-600" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
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

        <div className="space-y-3">
          {upNextItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gray-900 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                  {item.thumbnail}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                    {item.title}
                  </h4>
                  <div className="space-y-1 text-xs text-gray-500">
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

        <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
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
              <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-2xl mb-2 hover:bg-gray-200 transition-colors cursor-pointer">
                {suggestion.avatar}
              </div>
              <p className="text-xs font-medium text-gray-700 truncate">
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
              className="flex flex-col items-center gap-2 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-xs font-medium text-gray-700">
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
