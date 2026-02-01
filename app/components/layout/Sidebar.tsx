"use client";

import { Home, Bookmark, BookOpen, FileText, Upload, Compass } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: <Home size={20} /> },
  { label: 'Saved', href: '/saved', icon: <Bookmark size={20} /> },
  { label: 'Notebook', href: '/notebook', icon: <BookOpen size={20} /> },
  { label: 'Reports', href: '/reports', icon: <FileText size={20} />, badge: 2 },
  { label: 'Upload', href: '/upload', icon: <Upload size={20} /> },
  { label: 'Discover', href: '/discover', icon: <Compass size={20} /> },
];

const shows = [
  { name: 'The Compound', avatar: '🎙️', href: '/show/the-compound' },
  { name: 'Planet Money', avatar: '💰', href: '/show/planet-money' },
  { name: 'All-In Podcast', avatar: '🎯', href: '/show/all-in' },
  { name: 'Odd Lots', avatar: '📊', href: '/show/odd-lots' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
          <span className="text-xl">👑</span>
        </div>
        <span className="text-lg font-bold text-gray-900">SIMPLICITY</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-semibold rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>

        {/* Shows Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-1">
            {shows.map((show) => (
              <a
                key={show.href}
                href={show.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base">
                  {show.avatar}
                </div>
                <span>{show.name}</span>
              </a>
            ))}
          </div>
          <button className="mt-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Show More ↓
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center justify-around text-gray-400">
          <a href="/about" className="hover:text-gray-600 transition-colors">
            <span className="text-xl">✕</span>
          </a>
          <a href="/archive" className="hover:text-gray-600 transition-colors">
            <span className="text-xl">📁</span>
          </a>
          <a href="/contact" className="hover:text-gray-600 transition-colors">
            <span className="text-xl">✉</span>
          </a>
        </div>
        <div className="mt-3 text-center text-xs text-gray-400">
          <p>ABOUT | PRIVACY | TERMS | DATA</p>
          <p className="mt-1">© 2026 SIMPLICITY. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </aside>
  );
}
