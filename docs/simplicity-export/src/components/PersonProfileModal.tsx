import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PersonProfile } from './PersonProfile';

interface PersonProfileModalProps {
  personId: string;
  onClose: () => void;
  onEpisodeClick?: (podcastId: string, episodeId: string) => void;
}

export function PersonProfileModal({ personId, onClose, onEpisodeClick }: PersonProfileModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Container - Aligned with sidebars */}
      <div 
        className="relative bg-background rounded-xl shadow-sm overflow-hidden border border-border"
        style={{
          marginLeft: '256px', // Left sidebar width (w-64)
          marginRight: '320px', // Right sidebar width (w-80)
          width: 'calc(100vw - 256px - 320px)', // Fill space between sidebars
          height: 'calc(100vh - 24px)', // Match sidebar height (accounting for p-3 = 12px top + 12px bottom)
          marginTop: '12px',
          marginBottom: '12px',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-secondary hover:bg-muted transition-all backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto p-4 md:p-5">
          <PersonProfile
            personId={personId}
            onBack={onClose}
            onEpisodeClick={onEpisodeClick}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
