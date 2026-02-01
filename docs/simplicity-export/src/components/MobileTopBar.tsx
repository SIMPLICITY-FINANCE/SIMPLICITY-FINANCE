import { Bell, Crown, Sparkles, Bot } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MobileTopBarProps {
  notificationsCount?: number;
  onNotificationClick?: () => void;
  isPremium?: boolean;
  onUpgradeClick?: () => void;
  onChatClick?: () => void;
  isChatOpen?: boolean;
  isNotificationsOpen?: boolean;
  userName?: string;
  userImage?: string;
  onProfileClick?: () => void;
}

export function MobileTopBar({ 
  notificationsCount = 0,
  onNotificationClick,
  isPremium = false,
  onUpgradeClick,
  onChatClick,
  isChatOpen,
  isNotificationsOpen,
  userName,
  userImage,
  onProfileClick
}: MobileTopBarProps) {
  const { effectiveTheme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/50 md:hidden">
      <div className="flex items-center justify-between px-4 h-14 gap-2">
        {/* Left Side: Premium + Chat */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Premium Button */}
          <button
            onClick={onUpgradeClick}
            className={`w-9 h-9 rounded-lg transition-all flex items-center justify-center shadow-sm border ${
              isPremium 
                ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border-amber-200 dark:border-amber-900/50' 
                : 'bg-card border-border/50 hover:bg-muted'
            }`}
            aria-label={isPremium ? "Premium Member" : "Upgrade to Premium"}
          >
            <Crown className={`w-4.5 h-4.5 ${isPremium ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground'}`} />
          </button>

          {/* Chat Button */}
          <button
            onClick={onChatClick}
            className="w-9 h-9 rounded-lg bg-card border border-border/50 hover:bg-muted transition-all flex items-center justify-center shadow-sm"
            aria-label={isChatOpen ? "Close AI Assistant" : "Open AI Assistant"}
          >
            <Bot className="w-4.5 h-4.5 text-muted-foreground" />
          </button>
        </div>

        {/* Center: Logo + Text */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          {/* Logo Icon - Shows crown if premium */}
          <div className="relative w-7 h-7 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 dark:from-slate-800 dark:via-indigo-900 dark:to-purple-900 rounded-lg flex items-center justify-center shadow-lg ring-1 ring-black/5 dark:ring-white/5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            {isPremium && (
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 rounded-full flex items-center justify-center">
                <Crown className="w-1.5 h-1.5 text-amber-600 dark:text-amber-500" />
              </div>
            )}
          </div>
          {/* Simplicity Text */}
          <span className="text-sm font-bold tracking-wide text-foreground">SIMPLICITY</span>
        </div>

        {/* Right Side: Notifications + User Profile */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notifications Button with Badge */}
          <button
            onClick={onNotificationClick}
            className="relative w-9 h-9 rounded-lg bg-card border border-border/50 hover:bg-muted transition-all flex items-center justify-center shadow-sm"
            aria-label={isNotificationsOpen ? "Close Notifications" : "Open Notifications"}
          >
            <Bell className="w-4.5 h-4.5 text-muted-foreground" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {notificationsCount > 9 ? '9+' : notificationsCount}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          <button
            onClick={onProfileClick}
            className="w-9 h-9 rounded-lg border border-border/50 overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all shadow-sm"
            aria-label="Profile"
          >
            {userImage ? (
              <img 
                src={userImage} 
                alt={userName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {userName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}