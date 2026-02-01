import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show popup after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  const handleCustomize = () => {
    // For now, just accept. In production, this would open a detailed preferences modal
    localStorage.setItem('cookieConsent', 'customized');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed left-7 bottom-6 z-[9999] w-[200px] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-2xl shadow-lg p-4">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-foreground hover:bg-muted/80 bg-muted/50 rounded-full p-1 transition-colors"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Content */}
        <div>
          <h3 className="text-[10px] font-semibold text-foreground mb-2 tracking-wide uppercase">
            We Value Your Privacy
          </h3>
          <p className="text-[9px] text-muted-foreground leading-relaxed mb-4 pr-4">
            We use cookies to enhance your experience. By clicking "Accept", you consent to our use of cookies.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAcceptAll}
              className="w-full px-3 py-2 text-[10px] font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all shadow-sm uppercase tracking-wide"
            >
              Accept All
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleCustomize}
                className="flex-1 px-2 py-1.5 text-[9px] font-medium text-foreground hover:bg-accent rounded-md transition-colors border border-border"
              >
                Customize
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-2 py-1.5 text-[9px] font-medium text-foreground hover:bg-accent rounded-md transition-colors border border-border"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}