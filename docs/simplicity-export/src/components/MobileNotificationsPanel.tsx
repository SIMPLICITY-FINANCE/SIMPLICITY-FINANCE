import { X } from 'lucide-react';
import { NotificationsList } from './NotificationsList';
import { useEffect, useRef } from 'react';

interface MobileNotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
  isLoggedIn?: boolean;
  userImage?: string;
  userName?: string;
  onSignIn?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onSignOut?: () => void;
  onChatClick?: () => void;
}

export function MobileNotificationsPanel({
  isOpen,
  onClose,
  isPremium,
  onUpgrade,
  isLoggedIn,
  userImage,
  userName,
  onSignIn,
  onProfileClick,
  onSettingsClick,
  onHelpClick,
  onSignOut,
  onChatClick
}: MobileNotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking the notifications toggle button (mobile)
      if (
        target.closest('button[aria-label="Notifications"]') ||
        target.closest('button[aria-label="Close Notifications"]') ||
        target.closest('button[aria-label="Open Notifications"]')
      ) {
        return;
      }
      
      // Check if click is outside the panel
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Use mousedown with a slight delay to let the button click complete first
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Notifications Panel - Fits between top and bottom bars with rounded frame (same as MoreMenu and Chat) */}
      <div className="md:hidden fixed top-[4.5rem] bottom-20 left-0 right-0 z-50 px-3 pointer-events-none">
        <div 
          className={`h-full bg-card border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ease-out pointer-events-auto ${
            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
          ref={panelRef}
        >
          {/* Notifications Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <NotificationsList
                isPremium={isPremium}
                onUpgrade={onUpgrade}
                onChatClick={onChatClick}
                isLoggedIn={isLoggedIn}
                userImage={userImage}
                userName={userName}
                onSignIn={onSignIn}
                onProfileClick={onProfileClick}
                onSettingsClick={onSettingsClick}
                onHelpClick={onHelpClick}
                onSignOut={onSignOut}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}