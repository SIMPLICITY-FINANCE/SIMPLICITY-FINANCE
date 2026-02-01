import { X, User, Settings, HelpCircle, Crown, Sun, Moon, Mail, LogOut, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileSlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userImage?: string;
  isPremium?: boolean;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
  onSignOut: () => void;
  onAboutClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onDataClick?: () => void;
  onAccessibilityClick?: () => void;
}

export function ProfileSlideMenu({
  isOpen,
  onClose,
  userName,
  userImage,
  isPremium,
  onProfileClick,
  onSettingsClick,
  onHelpClick,
  onSignOut,
  onAboutClick,
  onPrivacyClick,
  onTermsClick,
  onDataClick,
  onAccessibilityClick
}: ProfileSlideMenuProps) {
  const { effectiveTheme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  const handleProfileClick = () => {
    onProfileClick();
    onClose();
  };

  const handleSettingsClick = () => {
    onSettingsClick();
    onClose();
  };

  const handleHelpClick = () => {
    onHelpClick();
    onClose();
  };

  const handleSignOut = () => {
    onSignOut();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Profile Card Menu */}
      <div
        className={`md:hidden fixed top-20 right-3 w-[90%] max-w-sm z-[70] transform transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Content */}
          <div className="flex flex-col max-h-[calc(100vh-10rem)] overflow-y-auto">
            {/* User Profile Header - Matching web design */}
            <div className="p-3 bg-muted">
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border shadow-sm flex-shrink-0">
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
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[11px] truncate text-foreground">{userName || 'User'}</p>
                  {isPremium && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Crown className="w-2.5 h-2.5 text-amber-500 fill-current" />
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Premium Member</span>
                    </div>
                  )}
                </div>
                
                {/* Theme Toggle Button */}
                <button
                  onClick={handleToggleTheme}
                  className="w-8 h-8 rounded-lg bg-background border border-border/50 shadow-sm hover:bg-muted hover:shadow-md transition-all flex items-center justify-center"
                  title={effectiveTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {effectiveTheme === 'dark' ? (
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Sun className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {/* Profile */}
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted transition-colors text-left"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-[11px] font-medium text-foreground">Profile</span>
              </button>

              {/* Settings */}
              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-[11px] font-medium text-foreground">Settings</span>
              </button>

              {/* Help */}
              <button
                onClick={handleHelpClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted transition-colors text-left"
              >
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-[11px] font-medium text-foreground">Help</span>
              </button>
            </div>

            {/* Separator */}
            <div className="border-t border-border/30 mx-3" />

            {/* Sign Out */}
            <div className="py-1">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left group"
              >
                <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400" />
                <span className="text-[11px] font-medium text-foreground group-hover:text-red-600 dark:group-hover:text-red-400">Sign Out</span>
              </button>
            </div>

            {/* Footer Section */}
            <div className="pt-3 pb-4 px-5 space-y-2 mt-0">
              {/* Top separator - cut off from corners */}
              <div className="border-t border-border/30 mx-6" />
              
              {/* Social Icons with vertical separators */}
              <div className="flex items-center justify-center gap-2.5">
                <a 
                  href="https://twitter.com/simplicity" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Follow us on X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                
                {/* Vertical separator */}
                <div className="w-px h-3.5 bg-border/30" />
                
                <a 
                  href="https://simplicity.substack.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Subscribe on Substack"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                  </svg>
                </a>
                
                {/* Vertical separator */}
                <div className="w-px h-3.5 bg-border/30" />
                
                <a 
                  href="mailto:hello@simplicity.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Email us"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
              
              {/* Horizontal separator between social and footer links */}
              <div className="border-t border-border/30 mx-6" />
              
              {/* Footer Links with vertical separators */}
              <div className="flex flex-wrap items-center justify-center gap-1 text-[5px] text-muted-foreground">
                {onAboutClick && (
                  <>
                    <button 
                      onClick={() => { onAboutClick(); onClose(); }}
                      className="hover:text-foreground transition-colors"
                    >
                      ABOUT
                    </button>
                    <span>|</span>
                  </>
                )}
                {onPrivacyClick && (
                  <>
                    <button 
                      onClick={() => { onPrivacyClick(); onClose(); }}
                      className="hover:text-foreground transition-colors"
                    >
                      PRIVACY
                    </button>
                    <span>|</span>
                  </>
                )}
                {onTermsClick && (
                  <>
                    <button 
                      onClick={() => { onTermsClick(); onClose(); }}
                      className="hover:text-foreground transition-colors"
                    >
                      TERMS
                    </button>
                    <span>|</span>
                  </>
                )}
                {onDataClick && (
                  <>
                    <button 
                      onClick={() => { onDataClick(); onClose(); }}
                      className="hover:text-foreground transition-colors"
                    >
                      DATA
                    </button>
                    <span>|</span>
                  </>
                )}
                {onAccessibilityClick && (
                  <button 
                    onClick={() => { onAccessibilityClick(); onClose(); }}
                    className="hover:text-foreground transition-colors"
                  >
                    ACCESSIBILITY
                  </button>
                )}
              </div>
              
              {/* Copyright */}
              <div className="text-center text-[5px] text-muted-foreground">
                © {new Date().getFullYear()} SIMPLICITY. ALL RIGHTS RESERVED.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}