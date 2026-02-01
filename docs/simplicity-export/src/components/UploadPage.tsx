import { useState } from 'react';
import { Sparkles, Link as LinkIcon, Youtube, Lock, Crown, Video, Search, Upload, MessageSquarePlus, FileVideo, X, Filter, ChevronDown } from 'lucide-react';
import { copy } from '../src/copy/en';

interface UploadPageProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
  onChatClick?: () => void;
  isLoggedIn?: boolean;
  userImage?: string;
  userName?: string;
  onSignIn?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onSignOut?: () => void;
}

type UploadTab = 'upload-video' | 'suggest-show-person';

export function UploadPage({
  isPremium = false,
  onUpgrade,
}: UploadPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<UploadTab>('upload-video');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Upload Video state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [sourceType, setSourceType] = useState<'podcast' | 'earnings' | 'fed' | 'youtube'>('podcast');
  
  // Suggest Show/Person state
  const [suggestionType, setSuggestionType] = useState<'show' | 'person'>('show');
  const [suggestionName, setSuggestionName] = useState('');
  const [suggestionLink, setSuggestionLink] = useState('');
  const [suggestionNotes, setSuggestionNotes] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPremium) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    
    const sourceTypeLabels = {
      podcast: 'Podcast (Casual, opinionated)',
      earnings: 'Earnings Call (Formal, financial extraction)',
      fed: 'Fed Speech (Policy focused)',
      youtube: 'YouTube Video (General)'
    };
    
    alert(
      `Processing ${selectedFile ? 'video file' : 'video URL'}:\n` +
      `Source: ${selectedFile ? selectedFile.name : videoUrl}\n` +
      `Content Type: ${sourceTypeLabels[sourceType]}`
    );
    
    setSelectedFile(null);
    setVideoUrl('');
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionName.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    
    alert(`Suggestion submitted for approval:\nType: ${suggestionType}\nName: ${suggestionName}\nLink: ${suggestionLink || 'N/A'}`);
    
    setSuggestionName('');
    setSuggestionLink('');
    setSuggestionNotes('');
  };

  // Get filter label
  const getFilterLabel = () => {
    return activeTab === 'upload-video' ? copy.upload.filterUploadVideo : copy.upload.filterSuggestShowPerson;
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto relative">
        {/* Premium Lock Overlay */}
        {!isPremium && showPremiumOverlay && (
          <>
            {/* Gradient Blur Overlay */}
            <div className="absolute inset-0 z-50 bg-gradient-to-b from-transparent via-background/50 to-background backdrop-blur-[1px] pointer-events-auto -mx-4" style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)'
            }} />
            
            {/* Bottom Subscription Bar */}
            <div className="fixed bottom-4 left-0 right-0 md:left-[calc(256px+1rem)] md:right-[calc(320px+1rem)] z-50 px-4 md:px-0 pointer-events-none">
              <div className="bg-gray-50 dark:bg-gray-900/30 border border-border/50 rounded-3xl shadow-lg p-6 pointer-events-auto max-w-xl mx-auto">
                <div className="text-center space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-semibold text-foreground">
                      Upgrade to Premium to upload videos
                    </h3>
                    <p className="text-[13px] text-muted-foreground">
                      Upload custom videos and suggest shows for €1.99/month
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={onUpgrade}
                      className="px-6 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all text-[13px]"
                    >
                      Upgrade to Premium
                    </button>
                    <p className="text-[11px] text-muted-foreground">
                      Cancel anytime
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className={!isPremium ? 'pointer-events-none' : ''}>
          {/* Search and Filter Controls */}
          <div className="flex items-center gap-3 mb-7">
            {/* Search Bar - Always visible, extends to the right */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search uploads and suggestions..."
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>

            {/* Filter - Right Side */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-xs font-medium hover:bg-muted transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{getFilterLabel()}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Dropdown */}
              {showFilterDropdown && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowFilterDropdown(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/50 rounded-xl shadow-lg z-20 overflow-hidden">
                    <div className="p-2 space-y-0.5">
                      {(['upload-video', 'suggest-show-person'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setActiveTab(filter);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                            activeTab === filter
                              ? 'bg-muted text-foreground'
                              : 'text-foreground hover:bg-muted/50'
                          }`}
                        >
                          {filter === 'upload-video' ? copy.upload.filterUploadVideo : copy.upload.filterSuggestShowPerson}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content based on active tab */}
          {/* Upload Video Tab */}
          {activeTab === 'upload-video' && (
            <>
              <div className="bg-card border border-border/50 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all">
                <h2 className="text-sm font-semibold text-foreground mb-3">Submit Video Link</h2>
                <p className="text-[11px] text-muted-foreground mb-5">
                  Paste a YouTube or podcast link to get an AI-generated summary.
                </p>

                <form onSubmit={handleVideoUpload} className="space-y-4">
                  {/* URL Input */}
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-2">
                      Video Link
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Youtube className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        disabled={!isPremium}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !videoUrl.trim() || !isPremium}
                    className="w-full px-4 py-2.5 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-[13px]"
                  >
                    {isSubmitting ? 'Processing...' : 'Generate Summary'}
                  </button>
                </form>
              </div>

              {/* Separator */}
              <div className="border-t border-border/30 my-7" />

              {/* About Upload Video */}
              <div className="bg-muted/50 border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-2 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Video className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT SUBMIT VIDEO</h2>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
                      Transform any video into an AI-powered summary with key insights, timestamps, and actionable takeaways. Simply paste a YouTube or podcast link to get started.
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">How to use:</span> Paste a video link from YouTube or any podcast platform. Select the content type for better accuracy, then click "Generate Summary" to analyze the content and create a comprehensive summary within minutes.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Suggest Show/Person Tab */}
          {activeTab === 'suggest-show-person' && (
            <>
              <div className="bg-card border border-border/50 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all">
                <h2 className="text-sm font-semibold text-foreground mb-3">Suggest a Show or Person</h2>
                <p className="text-[11px] text-muted-foreground mb-4">
                  Help us expand our library by suggesting podcasts or guests you'd like to see covered.
                </p>

                <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-2">
                      Suggestion Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSuggestionType('show')}
                        className={`flex-1 py-2 px-4 rounded-lg text-[11px] font-medium transition-all border ${
                          suggestionType === 'show'
                            ? 'bg-background text-foreground border-border shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-900 text-muted-foreground border-transparent hover:text-foreground'
                        }`}
                      >
                        Podcast Show
                      </button>
                      <button
                        type="button"
                        onClick={() => setSuggestionType('person')}
                        className={`flex-1 py-2 px-4 rounded-lg text-[11px] font-medium transition-all border ${
                          suggestionType === 'person'
                            ? 'bg-background text-foreground border-border shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-900 text-muted-foreground border-transparent hover:text-foreground'
                        }`}
                      >
                        Guest/Person
                      </button>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-2">
                      {suggestionType === 'show' ? 'Show Name' : 'Person Name'}
                    </label>
                    <input
                      type="text"
                      value={suggestionName}
                      onChange={(e) => setSuggestionName(e.target.value)}
                      placeholder={suggestionType === 'show' ? 'e.g., The Tim Ferriss Show' : 'e.g., Warren Buffett'}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={!isPremium}
                      required
                    />
                  </div>

                  {/* Link Input */}
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-2">
                      Link (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <LinkIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <input
                        type="url"
                        value={suggestionLink}
                        onChange={(e) => setSuggestionLink(e.target.value)}
                        placeholder={suggestionType === 'show' ? 'https://podcast.show/...' : 'https://twitter.com/...'}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={!isPremium}
                      />
                    </div>
                  </div>

                  {/* Notes Input */}
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={suggestionNotes}
                      onChange={(e) => setSuggestionNotes(e.target.value)}
                      placeholder="Tell us why you'd like to see this show/person covered..."
                      rows={3}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      disabled={!isPremium}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !suggestionName.trim() || !isPremium}
                    className="w-full px-4 py-2.5 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-[13px]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                  </button>
                </form>
              </div>

              {/* Separator */}
              <div className="border-t border-border/30 my-7" />

              {/* About Suggest Show or Person */}
              <div className="bg-muted/50 border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-2 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <MessageSquarePlus className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT SUGGESTIONS</h2>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
                      Help shape the future of Simplicity by suggesting podcast shows or industry experts you'd like to see covered. Your input helps us expand our library with content that matters to you.
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">How to use:</span> Select whether you're suggesting a podcast show or a guest/person, enter the name and optionally provide a link and additional context. Our team reviews all suggestions and notifies you when your suggested content is added to the platform.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}