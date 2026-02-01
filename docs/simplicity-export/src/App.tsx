import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { HomePage } from './components/HomePage';
import { NotificationsPage } from './components/NotificationsPage';
import { FollowingPage } from './components/FollowingPage';
import { SavedPage } from './components/SavedPage';
import { DiscoverPage } from './components/DiscoverPage';
import { TopShowsPage } from './components/TopShowsPage';
import { NewShowsPage } from './components/NewShowsPage';
import { TopPeoplePage } from './components/TopPeoplePage';
import { ProfilePage } from './components/ProfilePage';
import { ContactPage } from './components/ContactPage';
import { ReportsPage } from './components/ReportsPage';
import { NotebookPage } from './components/NotebookPage';
import { UploadPage } from './components/UploadPage';
import { SettingsPage } from './components/SettingsPage';
import { BillingPage } from './components/BillingPage';
import { SignInPage } from './components/SignInPage';
import { SignUpPage } from './components/SignUpPage';
import { MarketBriefingLandingPage } from './components/MarketBriefingLandingPage';
import { AboutLandingPage } from './components/AboutLandingPage';
import { PrivacyLandingPage } from './components/PrivacyLandingPage';
import { TermsLandingPage } from './components/TermsLandingPage';
import { DataLandingPage } from './components/DataLandingPage';
import { AccessibilityLandingPage } from './components/AccessibilityLandingPage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { DataPage } from './components/DataPage';
import { AccessibilityPage } from './components/AccessibilityPage';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { BottomNavBar } from './components/BottomNavBar';
import { MoreMenu } from './components/MoreMenu';
import { ProfileSlideMenu } from './components/ProfileSlideMenu';
import { MobileTopBar } from './components/MobileTopBar';
import { MobileNotificationsPanel } from './components/MobileNotificationsPanel';
import { ChatBotOverlay } from './components/ChatBotOverlay';
import { EpisodeSummaryModal } from './components/EpisodeSummaryModal';
import { PodcastDetailModal } from './components/PodcastDetailModal';
import { PersonProfileModal } from './components/PersonProfileModal';
import { PremiumPlansPage } from './components/PremiumPlansPage';
import { CookieConsent } from './components/CookieConsent';
import { FeedSearch } from './components/FeedSearch';

function AppContent() {
  const [isPremium, setIsPremium] = useState(true);
  const [showPremiumPlans, setShowPremiumPlans] = useState(false);
  const [currentView, setCurrentView] = useState('market-briefing');
  const [selectedPodcastId, setSelectedPodcastId] = useState<string | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileNotificationsOpen, setIsMobileNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for demo, change to false for sign-in flow
  const [userName, setUserName] = useState('Alex Johnson');
  const [userImage, setUserImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'); // Optional: set to undefined for default icon

  // Notification counts for new reports uploaded (daily/weekly/monthly etc)
  // In production, these would track actual new report uploads from backend
  const [newReportsCount, setNewReportsCount] = useState(2); // New daily/weekly reports not yet viewed
  const [followingCount, setFollowingCount] = useState(5); // New episodes from followed podcasts
  const [notificationsCount, setNotificationsCount] = useState(3); // Total unread notifications

  // Followed shows and people - randomize a few to start
  const [followedShows, setFollowedShows] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5', '6'])); // The Compound, Planet Money, All-In, Odd Lots, Animal Spirits, Invest Like the Best
  const [followedPeople, setFollowedPeople] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5'])); // Multiple people followed

  const toggleFollowShow = (showId: string) => {
    setFollowedShows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(showId)) {
        newSet.delete(showId);
      } else {
        newSet.add(showId);
      }
      return newSet;
    });
  };

  const toggleFollowPerson = (personId: string) => {
    setFollowedPeople(prev => {
      const newSet = new Set(prev);
      if (newSet.has(personId)) {
        newSet.delete(personId);
      } else {
        newSet.add(personId);
      }
      return newSet;
    });
  };

  const handleNavigate = (view: string, podcastId?: string) => {
    console.log('handleNavigate called:', { view, podcastId, isPodcastModalOpen });
    if (podcastId) {
      setSelectedPodcastId(podcastId);
      setIsPodcastModalOpen(true);
      console.log('Opening podcast modal for:', podcastId);
    } else {
      setCurrentView(view === 'help' ? 'contact' : view);
      setSelectedPodcastId(null);
      setSelectedEpisodeId(null);
    }
  };

  const handleBackFromPodcast = () => {
    setIsPodcastModalOpen(false);
    setSelectedPodcastId(null);
    setSelectedEpisodeId(null);
  };

  const handleEpisodeClick = (podcastId: string, episodeId: string) => {
    setSelectedPodcastId(podcastId);
    setSelectedEpisodeId(episodeId);
    setIsEpisodeModalOpen(true);
  };

  const handleBackFromEpisode = () => {
    setIsEpisodeModalOpen(false);
    setSelectedEpisodeId(null);
  };
  
  const handleUpgrade = () => {
    setShowPremiumPlans(true);
  };

  const handleSelectPlan = (planId: string) => {
    // User selected a plan, activate premium
    setIsPremium(true);
    setShowPremiumPlans(false);
  };
  
  const handleSignIn = () => {
    // Mock sign in - in real app, this would trigger auth flow
    setIsLoggedIn(true);
    setUserName('Alex Johnson');
    setUserImage('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop');
    setCurrentView('home');
  };
  
  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserImage(undefined);
    setCurrentView('signin');
  };
  
  // Determine if current view should show search bar
  const showSearchBar = ['home', 'notifications', 'following', 'saved', 'discover', 'reports', 'notebook', 'upload'].includes(currentView);

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomePage 
        onEpisodeClick={(podcastId, episodeId) => {
          setSelectedPodcastId(podcastId);
          setSelectedEpisodeId(episodeId);
          setIsEpisodeModalOpen(true);
        }} 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
        followedShows={followedShows}
      />; 
      case 'notifications': return <NotificationsPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'following': return <FollowingPage 
        onPodcastClick={(id) => {
          setSelectedPodcastId(id);
          setIsPodcastModalOpen(true);
        }}
        onPersonClick={(id) => {
          setSelectedPersonId(id);
          setIsPersonModalOpen(true);
        }}
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
        followedShows={followedShows}
        followedPeople={followedPeople}
        onToggleFollowShow={toggleFollowShow}
        onToggleFollowPerson={toggleFollowPerson}
      />;
      case 'saved': return <SavedPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'discover': return <DiscoverPage 
        onPodcastClick={(id) => {
          setSelectedPodcastId(id);
          setIsPodcastModalOpen(true);
        }}
        onPersonClick={(id) => {
          setSelectedPersonId(id);
          setIsPersonModalOpen(true);
        }}
        onTopShowsClick={() => handleNavigate('top-shows')}
        onNewShowsClick={() => handleNavigate('new-shows')}
        onTopPeopleClick={() => handleNavigate('top-people')}
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
        followedShows={followedShows}
        followedPeople={followedPeople}
        onToggleFollowShow={toggleFollowShow}
        onToggleFollowPerson={toggleFollowPerson}
      />;
      case 'top-shows': return <TopShowsPage 
        onBack={() => handleNavigate('discover')}
        onPodcastClick={(id) => {
          setSelectedPodcastId(id);
          setIsPodcastModalOpen(true);
        }}
      />;
      case 'new-shows': return <NewShowsPage 
        onBack={() => handleNavigate('discover')}
        onPodcastClick={(id) => {
          setSelectedPodcastId(id);
          setIsPodcastModalOpen(true);
        }}
      />;
      case 'top-people': return <TopPeoplePage 
        onBack={() => handleNavigate('discover')}
        onPersonClick={(id) => {
          setSelectedPersonId(id);
          setIsPersonModalOpen(true);
        }}
      />;
      case 'profile': return <ProfilePage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'contact': return <ContactPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'about': return <AboutPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'privacy': return <PrivacyPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'terms': return <TermsPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'data': return <DataPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'accessibility': return <AccessibilityPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'about-landing': return <AboutLandingPage 
        onBack={() => handleNavigate('market-briefing')}
      />;
      case 'reports': return <ReportsPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'notebook': return <NotebookPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
        onEpisodeClick={handleEpisodeClick}
      />;
      case 'upload': return <UploadPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'privacy-landing': return <PrivacyLandingPage 
        onBack={() => handleNavigate('market-briefing')}
      />;
      case 'terms-landing': return <TermsLandingPage 
        onBack={() => handleNavigate('market-briefing')}
      />;
      case 'data-landing': return <DataLandingPage 
        onBack={() => handleNavigate('market-briefing')}
      />;
      case 'accessibility-landing': return <AccessibilityLandingPage 
        onBack={() => handleNavigate('market-briefing')}
      />;
      case 'settings': return <SettingsPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
        onBillingClick={() => handleNavigate('billing')}
      />;
      case 'billing': return <BillingPage 
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
        onChatClick={() => setIsChatBotOpen(true)}
        isLoggedIn={isLoggedIn}
        userImage={userImage}
        userName={userName}
        onSignIn={handleSignIn}
        onProfileClick={() => handleNavigate('profile')}
        onSettingsClick={() => handleNavigate('settings')}
        onHelpClick={() => handleNavigate('contact')}
        onSignOut={handleSignOut}
      />;
      case 'market-briefing': return <MarketBriefingLandingPage 
        onSignIn={() => handleNavigate('signin')}
        onSignUp={() => handleNavigate('signup')}
        onViewSampleReport={() => handleNavigate('reports')}
      />;
      case 'signin': return <SignInPage 
        onSignIn={handleSignIn}
        onBackToLanding={() => handleNavigate('market-briefing')}
        onSignUp={() => handleNavigate('signup')}
      />;
      case 'signup': return <SignUpPage 
        onSignUpSuccess={handleSignIn}
        onBackToLanding={() => handleNavigate('market-briefing')}
        onSignIn={() => handleNavigate('signin')}
      />;
      default: return (
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {currentView}
          </h1>
          <p className="text-muted-foreground">Page: {currentView}</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Show sign-in, signup, and landing info pages as standalone without any app UI */}
      {['signin', 'signup', 'market-briefing', 'about-landing', 'privacy-landing', 'terms-landing', 'data-landing', 'accessibility-landing'].includes(currentView) ? (
        <div className="w-full h-screen overflow-y-auto overflow-x-hidden">
          {renderView()}
        </div>
      ) : (
        <>
          {/* Mobile Top Bar - Mobile only */}
          {showSearchBar && (
            <MobileTopBar
              notificationsCount={notificationsCount}
              onNotificationClick={() => setIsMobileNotificationsOpen(!isMobileNotificationsOpen)}
              isPremium={isPremium}
              onUpgradeClick={() => setIsPremium(!isPremium)}
              onChatClick={() => setIsChatBotOpen(!isChatBotOpen)}
              isChatOpen={isChatBotOpen}
              isNotificationsOpen={isMobileNotificationsOpen}
              userName={userName}
              userImage={userImage}
              onProfileClick={() => setIsProfileMenuOpen(true)}
            />
          )}

          {/* Mobile Search Overlay */}
          {isMobileSearchOpen && (
            <FeedSearch
              value={searchQuery}
              onChange={setSearchQuery}
              isMobileOverlay={true}
              onClose={() => setIsMobileSearchOpen(false)}
            />
          )}

          {/* Left Sidebar - Desktop only */}
          <div className="hidden md:block">
            <LeftSidebar 
              currentView={currentView} 
              onNavigate={handleNavigate}
              isPremium={isPremium}
              onTogglePremium={() => setIsPremium(!isPremium)}
              newReportsCount={newReportsCount}
              followingCount={followingCount}
              notificationsCount={notificationsCount}
              isLoggedIn={isLoggedIn}
            />
          </div>
          
          {/* Main Content - Hidden on mobile when chat is open */}
          <main className={`flex-1 flex flex-col overflow-x-hidden ${isChatBotOpen || isMobileNotificationsOpen ? 'hidden md:flex' : ''} ${isMoreMenuOpen ? 'md:flex' : ''}`}>
            {/* Scrollable Content */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isMoreMenuOpen ? 'hidden md:block' : ''}`}>
              <div className="px-4 md:px-10 pb-24 md:pb-10 pt-20 md:pt-5 py-5 md:py-10">
                {renderView()}
              </div>
            </div>
          </main>

          {/* Right Sidebar - Desktop only, permanently visible */}
          <div className="hidden md:block">
            <RightSidebar 
              isPremium={isPremium}
              onUpgrade={handleUpgrade}
              notificationsCount={notificationsCount}
              onNotificationClick={() => handleNavigate('notifications')}
              isLoggedIn={isLoggedIn}
              userImage={userImage}
              userName={userName}
              onProfileClick={() => handleNavigate('profile')}
              onSettingsClick={() => handleNavigate('settings')}
              onHelpClick={() => handleNavigate('contact')}
              onSignOut={handleSignOut}
              onToggleChat={() => setIsChatBotOpen(!isChatBotOpen)}
              isChatOpen={isChatBotOpen}
            />
          </div>

          {/* Mobile ChatBot - All users (locked for non-premium) */}
          <ChatBotOverlay 
            isOpen={isChatBotOpen} 
            onClose={() => setIsChatBotOpen(false)} 
            isPremium={isPremium}
            onUpgrade={handleUpgrade}
          />

          {/* Floating Chat Bubble - Mobile only, hidden on desktop since it's in right sidebar */}
          {/* Removed - Chat is now accessible via MobileTopBar */}

          {/* Bottom Navigation Bar - Mobile only */}
          <BottomNavBar
            currentView={currentView}
            onNavigate={handleNavigate}
            onMoreClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            isMoreMenuOpen={isMoreMenuOpen}
            newReportsCount={newReportsCount}
            followingCount={followingCount}
            notificationsCount={notificationsCount}
          />

          {/* More Menu - Mobile only */}
          <MoreMenu
            isOpen={isMoreMenuOpen}
            onClose={() => setIsMoreMenuOpen(false)}
            currentView={currentView}
            onNavigate={handleNavigate}
            isPremium={isPremium}
            onTogglePremium={() => setIsPremium(!isPremium)}
            onOpenChatBot={() => setIsChatBotOpen(true)}
            newReportsCount={newReportsCount}
            followingCount={followingCount}
            notificationsCount={notificationsCount}
          />

          {/* Profile Slide Menu - Mobile only */}
          <ProfileSlideMenu
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
            userName={userName}
            userImage={userImage}
            isPremium={isPremium}
            onProfileClick={() => { handleNavigate('profile'); setIsProfileMenuOpen(false); }}
            onSettingsClick={() => { handleNavigate('settings'); setIsProfileMenuOpen(false); }}
            onHelpClick={() => { handleNavigate('contact'); setIsProfileMenuOpen(false); }}
            onSignOut={handleSignOut}
            onAboutClick={() => handleNavigate('about')}
            onPrivacyClick={() => handleNavigate('privacy')}
            onTermsClick={() => handleNavigate('terms')}
            onDataClick={() => handleNavigate('data')}
            onAccessibilityClick={() => handleNavigate('accessibility')}
          />

          {/* Mobile Notifications Panel - Mobile only */}
          <MobileNotificationsPanel
            isOpen={isMobileNotificationsOpen}
            onClose={() => setIsMobileNotificationsOpen(false)}
            isPremium={isPremium}
            onUpgrade={handleUpgrade}
            isLoggedIn={isLoggedIn}
            userImage={userImage}
            userName={userName}
            onSignIn={handleSignIn}
            onProfileClick={() => handleNavigate('profile')}
            onSettingsClick={() => handleNavigate('settings')}
            onHelpClick={() => handleNavigate('contact')}
            onSignOut={handleSignOut}
            onChatClick={() => setIsChatBotOpen(true)}
          />

          {/* Episode Summary Modal */}
          {isEpisodeModalOpen && selectedPodcastId && selectedEpisodeId && (
            <EpisodeSummaryModal
              podcastId={selectedPodcastId}
              episodeId={selectedEpisodeId}
              onClose={handleBackFromEpisode}
            />
          )}

          {/* Podcast Detail Modal */}
          {isPodcastModalOpen && selectedPodcastId && (
            <PodcastDetailModal
              podcastId={selectedPodcastId}
              onClose={handleBackFromPodcast}
              onEpisodeClick={handleEpisodeClick}
            />
          )}

          {/* Person Profile Modal */}
          {isPersonModalOpen && selectedPersonId && (
            <PersonProfileModal
              personId={selectedPersonId}
              onClose={() => setIsPersonModalOpen(false)}
              onEpisodeClick={handleEpisodeClick}
            />
          )}

          {/* Premium Plans Modal */}
          {showPremiumPlans && (
            <PremiumPlansPage
              onBack={() => setShowPremiumPlans(false)}
              onSelectPlan={handleSelectPlan}
              isPremium={isPremium}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
      <CookieConsent />
    </ThemeProvider>
  );
}