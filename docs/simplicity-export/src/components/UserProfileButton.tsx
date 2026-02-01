import { User, LogIn, Crown, Settings, LogOut, HelpCircle, Sun, Moon, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';

interface UserProfileButtonProps {
  isLoggedIn?: boolean;
  isPremium?: boolean;
  userImage?: string;
  userName?: string;
  onSignIn?: () => void;
  onProfileClick?: () => void;
  onPremiumClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onSignOut?: () => void;
}

export function UserProfileButton({
  isLoggedIn = true,
  isPremium = false,
  userImage,
  userName = 'User',
  onSignIn = () => {},
  onProfileClick = () => {},
  onPremiumClick = () => {},
  onSettingsClick = () => {},
  onHelpClick = () => {},
  onSignOut = () => {},
}: UserProfileButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { effectiveTheme, setTheme } = useTheme();

  // Calculate menu position when opened
  useEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Position to align with notification and chatbot popups
      setMenuPosition({
        top: 110, // Match notification/chatbot popup top position
        right: 32, // Match notification/chatbot popup right position
      });
    }
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  // If not logged in, show sign in button
  if (!isLoggedIn) {
    return (
      <button
        onClick={onSignIn}
        className="flex-shrink-0 w-[140px] h-[58px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all border-2 border-transparent"
        title="Sign In"
      >
        <LogIn className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-bold">Sign In</span>
      </button>
    );
  }

  // Dropdown menu component
  const dropdownMenu = isMenuOpen ? (
    <div 
      ref={menuRef}
      className="fixed w-[336px] bg-card border border-border/50 rounded-xl shadow-lg z-[9999] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden"
      style={{
        top: `${menuPosition.top}px`,
        right: `${menuPosition.right}px`,
      }}
    >
      {/* User Info Header */}
      <div className="p-3 bg-card">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border shadow-sm flex-shrink-0">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[11px] truncate text-foreground">{userName}</p>
            {isPremium && (
              <div className="flex items-center gap-1 mt-0.5">
                <Crown className="w-2.5 h-2.5 text-amber-500 fill-current" />
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Premium Member</span>
              </div>
            )}
          </div>
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
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

      {/* Separator after user info */}
      <div className="border-t border-border/30 my-1 mx-3" />

      {/* Menu Items */}
      <div className="p-2 space-y-0.5">
        <button
          onClick={() => {
            onProfileClick();
            setIsMenuOpen(false);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-all text-left"
        >
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Profile</span>
        </button>

        <button
          onClick={() => {
            onSettingsClick();
            setIsMenuOpen(false);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-all text-left"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Settings</span>
        </button>

        <button
          onClick={() => {
            onHelpClick();
            setIsMenuOpen(false);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-all text-left"
        >
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Help</span>
        </button>
      </div>

      {/* Separator before Sign Out */}
      <div className="border-t border-border/30 my-1 mx-3" />

      {/* Sign Out */}
      <div className="p-2 space-y-0.5">
        <button
          onClick={() => {
            onSignOut();
            setIsMenuOpen(false);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-all text-left group"
        >
          <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400" />
          <span className="text-xs font-medium text-foreground group-hover:text-red-600 dark:group-hover:text-red-400">Sign Out</span>
        </button>
      </div>
    </div>
  ) : null;

  // If logged in, show profile button with dropdown
  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all border border-border/50 bg-card hover:bg-muted/50 overflow-hidden group"
        title={userName}
      >
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center rounded-lg">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </button>

      {/* Render dropdown in portal (at document body level) */}
      {dropdownMenu && createPortal(dropdownMenu, document.body)}
    </>
  );
}