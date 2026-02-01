import { Sparkles, Bell, Menu, BookmarkCheck, Bookmark, Home, NotebookPen, FileBarChart, BookOpen, FileText } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';

interface BottomNavBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onMoreClick: () => void;
  isMoreMenuOpen?: boolean; // Add this to track menu state
  newReportsCount?: number; // Badge for new daily/weekly/monthly reports uploaded
  followingCount?: number; // Badge for new episodes from followed podcasts
  notificationsCount?: number; // Badge for total unread notifications
}

export function BottomNavBar({ currentView, onNavigate, onMoreClick, isMoreMenuOpen, newReportsCount, followingCount, notificationsCount }: BottomNavBarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, type: 'regular' },
    { id: 'saved', label: 'Saved', icon: Bookmark, type: 'regular' },
    { id: 'menu', label: 'Menu', icon: Menu, type: 'menu' },
    { id: 'notebook', label: 'Notebook', icon: BookOpen, type: 'regular' },
    { id: 'reports', label: 'Reports', icon: FileText, type: 'regular' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/50">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          // Handle Menu button
          if (item.type === 'menu') {
            return (
              <button
                key={item.id}
                onClick={onMoreClick}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-lg transition-all touch-manipulation min-w-[60px] active:scale-95 active:bg-muted ${
                  isMoreMenuOpen ? 'bg-muted/50' : 'hover:bg-muted/50'
                }`}
              >
                <div className="relative flex items-center justify-center w-7 h-7">
                  <Icon className={`w-5 h-5 ${isMoreMenuOpen ? 'text-foreground' : 'text-muted-foreground'}`} />
                </div>
                <span className={`text-[10px] font-medium ${isMoreMenuOpen ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </button>
            );
          }
          
          // Regular buttons
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-lg transition-all touch-manipulation min-w-[60px] active:scale-95 active:bg-muted ${
                isActive ? 'bg-muted/50' : 'hover:bg-muted/50'
              }`}
            >
              <div className="relative flex items-center justify-center w-7 h-7">
                <Icon 
                  className={`w-5 h-5 transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                />
                {item.id === 'reports' && newReportsCount !== undefined && newReportsCount > 0 && (
                  <div className="absolute -top-0.5 -right-0.5">
                    <NotificationBadge count={newReportsCount} />
                  </div>
                )}
                {item.id === 'saved' && followingCount !== undefined && followingCount > 0 && (
                  <div className="absolute -top-0.5 -right-0.5">
                    <NotificationBadge count={followingCount} />
                  </div>
                )}
              </div>
              <span 
                className={`text-[10px] font-medium transition-colors ${ 
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}