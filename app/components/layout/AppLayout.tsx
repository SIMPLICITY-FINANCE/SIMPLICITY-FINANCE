"use client";

import { Sidebar } from './Sidebar.js';
import { RightRail } from './RightRail.js';
import { Input } from '../ui/Input.js';
import { Search, Filter } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  showRightRail?: boolean;
  searchPlaceholder?: string;
}

export function AppLayout({ 
  children, 
  showRightRail = true,
  searchPlaceholder = "Search episodes..."
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className={`ml-60 ${showRightRail ? 'mr-80' : ''}`}>
        {/* Top Search Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                icon={<Search size={20} />}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={18} />
              <span>Full Feed</span>
              <span className="text-gray-400">↓</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {showRightRail && <RightRail />}
    </div>
  );
}
