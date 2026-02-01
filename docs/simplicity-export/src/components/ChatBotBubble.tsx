import { Bot } from 'lucide-react';

interface ChatBotBubbleProps {
  onToggleChat: () => void;
  isOpen: boolean;
}

export function ChatBotBubble({ onToggleChat, isOpen }: ChatBotBubbleProps) {
  return (
    <>
      {/* Floating Chat Bubble - Always stays at bottom-right */}
      <button
        onClick={onToggleChat}
        className={`fixed bottom-5 right-5 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-105 transition-all duration-200 border ${
          isOpen
            ? 'bg-muted/80 border-border/50'
            : 'bg-card border-border/50 hover:bg-muted/50'
        }`}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        <Bot className={`w-6 h-6 md:w-7 md:h-7 ${
          isOpen 
            ? 'text-foreground' 
            : 'text-muted-foreground'
        }`} />
      </button>
    </>
  );
}