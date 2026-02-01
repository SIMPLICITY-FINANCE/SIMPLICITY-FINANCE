import { Bot, Send, X, Sparkles, Lock, Crown, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ChatBotOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatBotOverlay({ isOpen, onClose, isPremium = true, onUpgrade }: ChatBotOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. I can help you discover financial podcasts, summarize episodes, and answer questions about investing. What can I help you with?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const mobileChatRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  // Calculate position - aligned with RightSidebar content area
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      // Top: Align slightly below the first card
      // 16px (aside p-4) + 72px (top section) + 1px (separator) + 16px (scrollable p-4 top) + 5px (slightly lower)
      // Right: 16px (aside p-4) + 16px (scrollable p-4) = 32px
      setPosition({
        top: 110, // Aligns slightly below the start of the first card in scrollable area
        right: 32, // Matches the right position of cards
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking the chat toggle button (desktop or mobile)
      if (
        target.closest('button[title*="AI Assistant"]') || 
        target.closest('button[title*="Close AI Assistant"]') || 
        target.closest('button[title*="Open AI Assistant"]') ||
        target.closest('button[aria-label*="AI Assistant"]') ||
        target.closest('button[aria-label*="Close AI Assistant"]') ||
        target.closest('button[aria-label*="Open AI Assistant"]')
      ) {
        return;
      }
      
      // Check both desktop and mobile chat panels
      if (
        (chatRef.current && !chatRef.current.contains(event.target as Node)) &&
        (mobileChatRef.current && !mobileChatRef.current.contains(event.target as Node))
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

  const handleSend = () => {
    if (!inputValue.trim() || !isPremium) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to help! This is a demo response. In the full version, I'd provide intelligent insights about financial podcasts and investing topics.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  if (!isOpen) return null;

  // Mobile version - matches MoreMenu frame style exactly
  const mobileVersion = (
    <>
      {/* Chat Panel - Fits between top and bottom bars with rounded frame (same as MoreMenu) */}
      <div className="md:hidden fixed top-[4.5rem] bottom-20 left-0 right-0 z-50 px-3 pointer-events-none">
        <div 
          className={`h-full bg-card border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ease-out pointer-events-auto ${
            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          {/* Locked Overlay for Non-Premium */}
          {!isPremium && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[0.5px] z-10 flex items-center justify-center p-6 pointer-events-none">
              <div className="text-center space-y-3 pointer-events-auto bg-background/95 backdrop-blur-xl rounded-xl p-5 shadow-2xl border border-border max-w-xs">
                <div className="flex justify-center">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">
                    Unlock AI Assistant
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Get instant answers and personalized recommendations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onUpgrade?.();
                    onClose();
                  }}
                  className="px-4 py-2 bg-foreground text-background rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2 mx-auto text-[11px]"
                >
                  <Crown className="w-3.5 h-3.5" />
                  Upgrade to Premium
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-background border-b border-border/30 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-card border border-border rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-foreground" />
              </div>
              <h3 className="text-xs font-bold text-foreground">AI Assistant</h3>
            </div>
          </div>

          {/* Messages - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 ${
                      message.sender === 'user'
                        ? 'bg-foreground text-background shadow-sm'
                        : 'bg-muted'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-semibold text-muted-foreground">AI</span>
                      </div>
                    )}
                    <p className="text-[11px] leading-relaxed text-foreground">{message.text}</p>
                    <p className={`text-[9px] mt-1 ${message.sender === 'user' ? 'text-background/60' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="px-3 py-2.5 border-t border-border/30 bg-background flex-shrink-0">
            <p className="text-[10px] text-muted-foreground mb-2 font-medium">Suggested questions:</p>
            <div className="flex flex-col gap-2">
              {['Summarize latest episodes', 'Top finance podcasts', 'Investment tips'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputValue(suggestion)}
                  className="text-[11px] px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-left bg-card font-medium text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border/30 bg-background flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-foreground/20 text-[11px] text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSend}
                disabled={!isPremium}
                className="w-9 h-9 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-muted hover:border-border transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Desktop version - matches notifications popup positioning and size
  const desktopVersion = createPortal(
    <div
      ref={chatRef}
      className="hidden md:flex fixed w-[336px] h-[calc(100vh-241px)] bg-background rounded-xl shadow-sm border border-border z-50 flex-col overflow-hidden"
      style={{ top: position.top, right: position.right }}
    >
      {/* Locked Overlay for Non-Premium */}
      {!isPremium && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[0.5px] z-10 flex items-center justify-center p-6 pointer-events-none">
          <div className="text-center space-y-3 pointer-events-auto bg-background/95 backdrop-blur-xl rounded-xl p-5 shadow-2xl border border-border max-w-xs">
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-foreground">
                Unlock AI Assistant
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Get instant answers and personalized recommendations.
              </p>
            </div>
            <button
              onClick={() => {
                onUpgrade?.();
                onClose();
              }}
              className="px-4 py-2 bg-foreground text-background rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2 mx-auto text-[11px]"
            >
              <Crown className="w-3.5 h-3.5" />
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}

      {/* Header - Fixed */}
      <div className="flex-shrink-0 border-b border-border/30 bg-card/50 backdrop-blur-sm px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-card border border-border rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-foreground" />
          </div>
          <h3 className="text-xs font-bold text-foreground">AI Assistant</h3>
        </div>
      </div>

      {/* Messages - Scrollable flex-1 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                  message.sender === 'user'
                    ? 'bg-foreground text-background shadow-sm'
                    : 'bg-muted border border-border'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">AI</span>
                  </div>
                )}
                <p className="text-xs leading-relaxed">{message.text}</p>
                <p className={`text-[9px] mt-1 ${message.sender === 'user' ? 'text-background/70' : 'text-muted-foreground'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-border bg-background">
        <p className="text-[10px] text-muted-foreground mb-2 font-medium">Suggested questions:</p>
        <div className="flex flex-col gap-2">
          {['Summarize latest episodes', 'Top finance podcasts', 'Investment tips'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputValue(suggestion)}
              className="text-[11px] px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-left bg-card font-medium"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-border bg-background">
        <div className="flex gap-2.5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-foreground/20 text-xs"
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-muted hover:border-border transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      {mobileVersion}
      {desktopVersion}
    </>
  );
}