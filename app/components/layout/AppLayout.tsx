"use client";

import { Sidebar } from './Sidebar.js';
import { Input } from '../ui/Input.js';
import { Search, Filter } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  searchPlaceholder?: string;
}

export function AppLayout({ 
  children, 
  searchPlaceholder = "Search episodes..."
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="ml-[236px] mr-[336px]">
        {/* Top Search Bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <form method="GET" action="/search" className="flex-1">
              <Input
                type="text"
                name="q"
                placeholder={searchPlaceholder}
                icon={<Search size={20} />}
              />
            </form>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors shadow-sm">
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
      
      {/* Dev Build Stamp - Prevents cached confusion */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 left-2 z-50 bg-gray-800 text-white px-2 py-1 rounded text-[10px] font-mono opacity-50">
          dev-49f310a
        </div>
      )}
    </div>
  );
}
