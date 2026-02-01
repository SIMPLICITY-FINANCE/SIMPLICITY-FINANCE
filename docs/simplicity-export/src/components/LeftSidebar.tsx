import { Home, Bookmark, Compass, FileText, BookOpen, User, ChevronUp, ChevronDown, Crown, Sparkles, Upload, ChevronRight, Twitter, Mail, LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { NotificationBadge } from './NotificationBadge';

interface LeftSidebarProps {
  currentView: string;
  onNavigate: (view: string, podcastId?: string) => void;
  isPremium: boolean;
  onTogglePremium: () => void;
  newReportsCount?: number; // Badge for new daily/weekly/monthly reports uploaded
  followingCount?: number; // Badge for new episodes from followed podcasts
  isLoggedIn: boolean; // User authentication state
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  badgeCount?: number;
  isPremiumOnly?: boolean;
  isAccountOnly?: boolean;
}

interface MockShow {
  id: string;
  name: string;
  avatar: string;
  podcastId: string;
}

const mockShows: MockShow[] = [
  { id: 's1', name: 'The Compound', avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=100&h=100&fit=crop', podcastId: '1' },
  { id: 's2', name: 'Planet Money', avatar: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop', podcastId: '2' },
  { id: 's3', name: 'All-In Podcast', avatar: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=100&h=100&fit=crop', podcastId: '3' },
  { id: 's4', name: 'Odd Lots', avatar: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=100&h=100&fit=crop', podcastId: '4' },
  { id: 's5', name: 'Animal Spirits', avatar: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=100&h=100&fit=crop', podcastId: '5' },
  { id: 's6', name: 'Invest Like Best', avatar: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=100&h=100&fit=crop', podcastId: '6' },
  { id: 's7', name: 'The Prof G Pod', avatar: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=100&h=100&fit=crop', podcastId: '7' },
  { id: 's8', name: 'Meb Faber Show', avatar: 'https://images.unsplash.com/photo-1614680376408-81e0d76e3f03?w=100&h=100&fit=crop', podcastId: '8' },
  { id: 's9', name: 'Masters in Business', avatar: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop', podcastId: '9' },
  { id: 's10', name: 'Capital Allocators', avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&h=100&fit=crop', podcastId: '10' },
];

// Section header button component - YouTube style
function SectionHeader({ icon: Icon, label, onClick, isActive, isCollapsed, badgeCount, showPremium }: { icon: LucideIcon; label: string; onClick: () => void; isActive: boolean; isCollapsed: boolean; badgeCount?: number; showPremium?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-lg transition-all relative ${
        isActive
          ? 'bg-muted/80'
          : 'hover:bg-muted'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} />
          {badgeCount !== undefined && badgeCount > 0 && (
            <div className="absolute -top-0.5 -right-0.5">
              <NotificationBadge count={badgeCount} />
            </div>
          )}
        </div>
        {!isCollapsed && (
          <span className={`text-sm ${isActive ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{label}</span>
        )}
      </div>
      {!isCollapsed && showPremium && (
        <Crown className="w-4 h-4 text-amber-500" />
      )}
    </button>
  );
}

// Show item component - similar to YouTube subscriptions
function ShowItem({ show, onClick, isCollapsed }: { show: MockShow; onClick: () => void; isCollapsed: boolean }) {
  return (
    <button 
      onClick={onClick}
      title={isCollapsed ? show.name : undefined}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-left`}
    >
      <img src={show.avatar} alt={show.name} className="w-6 h-6 rounded-full shrink-0 object-cover" />
      {!isCollapsed && (
        <span className="text-xs truncate text-muted-foreground">{show.name}</span>
      )}
    </button>
  );
}

function MenuButton({ item, isActive, onClick, isCollapsed, badgeCount, isPremiumOnly, isPremium, isAccountOnly, isLoggedIn }: { item: MenuItem; isActive: boolean; onClick: () => void; isCollapsed: boolean; badgeCount?: number; isPremiumOnly?: boolean; isPremium?: boolean; isAccountOnly?: boolean; isLoggedIn?: boolean }) {
  const Icon = item.icon;
  const isPremiumLocked = isPremiumOnly && !isPremium;
  const isAccountLocked = isAccountOnly && !isLoggedIn;
  
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg transition-all relative ${
        isActive
          ? 'bg-gray-100 dark:bg-gray-900'
          : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
      }`}
    >
      <div className="relative">
        <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-muted-foreground'}`} />
        {badgeCount !== undefined && <NotificationBadge count={badgeCount} />}
      </div>
      {!isCollapsed && (
        <div className="flex items-center justify-between flex-1">
          <span className={`text-xs ${isActive ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
          {isPremiumLocked && <Crown className="w-3.5 h-3.5 text-amber-500" />}
          {isAccountLocked && <User className="w-3.5 h-3.5 text-blue-500" />}
        </div>
      )}
      {isCollapsed && isPremiumLocked && (
        <div className="absolute -top-1 -right-1">
          <Crown className="w-3 h-3 text-amber-500" />
        </div>
      )}
      {isCollapsed && isAccountLocked && (
        <div className="absolute -top-1 -right-1">
          <User className="w-3 h-3 text-blue-500" />
        </div>
      )}
    </button>
  );
}

export function LeftSidebar({ currentView, onNavigate, isPremium, onTogglePremium, newReportsCount, followingCount, isLoggedIn }: LeftSidebarProps) {
  const [showAllDiscoverShows, setShowAllDiscoverShows] = useState(false);
  const visibleShows = showAllDiscoverShows ? mockShows : mockShows.slice(0, 4);

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-background transition-all duration-300 p-3.5">
      {/* Framed Container */}
      <div className="flex-1 bg-card border border-border/50 rounded-3xl shadow-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-3.5">
          {/* Logo - Shows crown if premium */}
          <div className="w-full flex items-center gap-2.5 px-2.5 py-2 mb-8">
            <div className="relative w-7.5 h-7.5 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 dark:from-slate-800 dark:via-indigo-900 dark:to-purple-900 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-black/5 dark:ring-white/5">
              <Sparkles className="w-4 h-4 text-white" />
              {isPremium && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 rounded-full flex items-center justify-center">
                  <Crown className="w-2.5 h-2.5 text-amber-600 dark:text-amber-500" />
                </div>
              )}
            </div>
            <h1 className="text-base font-bold tracking-wide text-foreground">
              SIMPLICITY
            </h1>
          </div>

          {/* Separator */}
          <div className="border-t border-border/30 mb-4" />

          {/* Home Section */}
          <nav className="mb-1">
            <SectionHeader 
              icon={Home}
              label="Home"
              onClick={() => onNavigate('home')}
              isActive={currentView === 'home'}
              isCollapsed={false}
            />
          </nav>

          {/* Saved Section */}
          <nav className="mb-1">
            <SectionHeader 
              icon={Bookmark}
              label="Saved"
              onClick={() => onNavigate('saved')}
              isActive={currentView === 'saved'}
              isCollapsed={false}
            />
          </nav>

          {/* Separator */}
          <div className="border-t border-border/30 mb-2 mt-2" />

          {/* Notebook Section */}
          <nav className="mb-1">
            <SectionHeader 
              icon={BookOpen}
              label="Notebook"
              onClick={() => onNavigate('notebook')}
              isActive={currentView === 'notebook'}
              isCollapsed={false}
            />
          </nav>

          {/* Reports Section */}
          <nav className="mb-1">
            <SectionHeader 
              icon={FileText}
              label="Reports"
              onClick={() => onNavigate('reports')}
              isActive={currentView === 'reports'}
              isCollapsed={false}
              badgeCount={newReportsCount}
              showPremium={!isPremium}
            />
          </nav>

          {/* Separator */}
          <div className="border-t border-border/30 mb-2 mt-2" />

          {/* Upload Section */}
          <nav className="mb-1">
            <SectionHeader 
              icon={Upload}
              label="Upload"
              onClick={() => onNavigate('upload')}
              isActive={currentView === 'upload'}
              isCollapsed={false}
              showPremium={!isPremium}
            />
          </nav>

          {/* Discover Section */}
          <div className="mb-3">
            <SectionHeader 
              icon={Compass}
              label="Discover"
              onClick={() => onNavigate('discover')}
              isActive={currentView === 'discover'}
              isCollapsed={false}
            />

            <div className="space-y-0.5">
              {visibleShows.map((show) => (
                <ShowItem
                  key={show.id}
                  show={show}
                  onClick={() => onNavigate('podcast-detail', show.podcastId)}
                  isCollapsed={false}
                />
              ))}
            </div>

            <div className="flex justify-start mt-2 pl-2.5">
              <button
                onClick={() => setShowAllDiscoverShows(!showAllDiscoverShows)}
                className="flex items-center gap-1 px-2.5 py-1 bg-card border border-border shadow-sm rounded-lg text-[10px] font-medium text-foreground hover:bg-muted/50 transition-all"
                aria-label={showAllDiscoverShows ? 'Show Less' : 'Show More'}
              >
                <span>{showAllDiscoverShows ? 'Show Less' : 'Show More'}</span>
                {showAllDiscoverShows ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links - Bottom of sidebar */}
        <div className="px-3 pb-2.5">
          {/* Separator before Social Media */}
          <div className="border-t border-border/30 mb-3" />
          
          {/* Social Links Section */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <a 
              href="https://twitter.com/simplicity" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-card border border-border/50 hover:bg-muted transition-all flex items-center justify-center shadow-sm"
              title="Follow us on X"
            >
              <svg className="w-3.5 h-3.5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            <div className="h-4 w-px bg-border/40" />
            
            <a 
              href="https://simplicity.substack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-card border border-border/50 hover:bg-muted transition-all flex items-center justify-center shadow-sm"
              title="Subscribe on Substack"
            >
              <svg className="w-3.5 h-3.5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
              </svg>
            </a>
            
            <div className="h-4 w-px bg-border/40" />
            
            <a 
              href="mailto:hello@simplicity.com"
              className="w-8 h-8 rounded-lg bg-card border border-border/50 hover:bg-muted transition-all flex items-center justify-center shadow-sm"
              title="Email us"
            >
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          </div>
          
          <div className="border-t border-border/30 mb-1.5" />
          <div className="flex flex-wrap items-center justify-center gap-1 text-[7px] text-muted-foreground">
            <button 
              onClick={() => onNavigate('about')}
              className="hover:text-foreground transition-colors"
            >
              ABOUT
            </button>
            <span>|</span>
            <button 
              onClick={() => onNavigate('privacy')}
              className="hover:text-foreground transition-colors"
            >
              PRIVACY
            </button>
            <span>|</span>
            <button 
              onClick={() => onNavigate('terms')}
              className="hover:text-foreground transition-colors"
            >
              TERMS
            </button>
            <span>|</span>
            <button 
              onClick={() => onNavigate('data')}
              className="hover:text-foreground transition-colors"
            >
              DATA
            </button>
            <span>|</span>
            <button 
              onClick={() => onNavigate('accessibility')}
              className="hover:text-foreground transition-colors"
            >
              ACCESSIBILITY
            </button>
          </div>
          <div className="text-center text-[7px] text-muted-foreground mt-1">
            © {new Date().getFullYear()} SIMPLICITY. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </aside>
  );
}