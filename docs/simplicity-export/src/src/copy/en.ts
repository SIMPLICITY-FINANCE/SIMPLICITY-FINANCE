/**
 * Centralized UI Copy & Localization
 * 
 * This file contains all user-facing strings for the Simplicity application.
 * Changes to UI copy should be made here to maintain consistency across the app.
 * 
 * Pattern: copy.[feature].[context]
 */

export const copy = {
  app: {
    name: 'Simplicity',
    tagline: 'AI-Powered Financial Podcast Summaries',
  },

  nav: {
    home: 'Home',
    upload: 'Upload',
    notebook: 'Notebook',
    reports: 'Reports',
    saved: 'Saved',
    following: 'Following',
    discover: 'Discover',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    billing: 'Billing',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    data: 'Data',
    accessibility: 'Accessibility',
    help: 'Help',
    signIn: 'Sign In',
    signOut: 'Sign Out',
  },

  feed: {
    title: 'Home',
    fullFeed: 'Full Feed',
    followingFeed: 'Following Feed',
    filterFullFeed: 'Full Feed',
    filterFollowingFeed: 'Following Feed',
    aboutTitle: 'ABOUT HOME',
    aboutDescription:
      'Your personalized feed displays the latest podcast summaries from financial shows. Stay updated with AI-generated insights, market analysis, and economic commentary from top podcasts.',
    aboutHowTo:
      'Toggle between "Full Feed" to see all available content or "Following Feed" to view only podcasts you\'re subscribed to. Click any episode card to read the full AI-generated summary.',
    emptyState: {
      title: 'Your feed is empty',
      description: 'Subscribe to podcasts to see their latest episode summaries here.',
    },
    emptyFollowing: {
      title: 'No followed feed yet',
      description: 'Follow some podcasts to see their episodes here',
    },
    noResults: {
      title: 'No results found',
      description: 'Try adjusting your search terms',
    },
  },

  following: {
    title: 'Following',
    filterAll: 'All',
    filterShows: 'Shows',
    filterPeople: 'People',
    following: 'Following',
    unfollow: 'Unfollow',
    aboutTitle: 'ABOUT FOLLOWING',
    aboutDescription:
      'Your curated collection of podcasts and people you\'re following. Stay up to date with new episodes and appearances from your favorite shows and guests. Filter by category to quickly find specific content.',
    aboutHowTo:
      'Browse the Discover section to find new shows and people to follow. Click the Follow button on any podcast or person to add them here. Manage your follows by hovering over the Following button to unfollow.',
    emptyState: {
      title: 'Not following any {type} content',
      description: 'Browse the catalog to find {type} shows and people to follow',
    },
  },

  saved: {
    title: 'Saved',
    filterAll: 'All',
    filterSummary: 'Summary',
    filterReport: 'Report',
    aboutTitle: 'ABOUT SAVED',
    aboutDescription:
      'Your personal library of saved podcast summaries and reports. Quickly access the content you\'ve bookmarked for later reading or reference.',
    aboutHowTo:
      'Click the bookmark icon on any episode summary or report to save it here. Manage your saved items by clicking the X button to remove them.',
    emptyState: {
      title: 'No saved items yet',
      description: 'Save episodes and reports to access them here',
    },
  },

  notifications: {
    title: 'Notifications',
    filterAll: 'All',
    filterUnread: 'Unread',
    markAllRead: 'Mark all as read',
    aboutTitle: 'ABOUT NOTIFICATIONS',
    aboutDescription:
      'Stay updated with new episodes from your followed podcasts and newly generated reports. Get notified when content you care about is available.',
    aboutHowTo:
      'New episodes from podcasts you follow and AI-generated reports appear here. Click on any notification to view the full content. Toggle the filter to show only unread notifications.',
    emptyState: {
      title: 'No notifications',
      description: 'New episode summaries and reports will appear here',
    },
  },

  discover: {
    title: 'Discover',
    filterAll: 'All',
    filterGeoPolitics: 'Geo-Politics',
    filterFinance: 'Finance',
    filterTechnology: 'Technology',
    topShows: 'Top Shows',
    newShows: 'New Shows',
    topPeople: 'Top People',
    viewAll: 'View All',
    follow: 'Follow',
    following: 'Following',
    aboutTitle: 'ABOUT DISCOVER',
    aboutDescription:
      'Browse and discover new financial podcasts and influential people in the finance world. Filter by category to find content that matches your interests.',
    aboutHowTo:
      'Explore podcasts by category using the filter tabs. Click on any podcast or person to view their profile. Follow shows and people to see their content in your feed.',
  },

  reports: {
    title: 'Reports',
    filterAll: 'All',
    filterDaily: 'Daily',
    filterWeekly: 'Weekly',
    filterMonthly: 'Monthly',
    filterQuarterly: 'Quarterly',
    filterAnnual: 'Annual',
    readTime: '{minutes} min read',
    episodeCount: '{count} episodes',
    daily: 'Daily Brief',
    weekly: 'Weekly Market Digest',
    monthly: 'Monthly Market Review',
    quarterly: 'Quarterly Economic Outlook',
    annual: 'Annual Financial Markets Review',
    aboutTitle: 'ABOUT REPORTS',
    aboutDescription:
      'AI-generated summaries that consolidate multiple podcast episodes into comprehensive market analysis reports. Get the big picture without listening to every episode.',
    aboutHowTo:
      'Select a report period to view AI-generated insights from that timeframe. Reports synthesize key themes, trends, and insights from multiple podcast episodes. Premium users get access to all report types.',
  },

  notebook: {
    title: 'Notebook',
    newNote: 'New Note',
    search: 'Search notes...',
    filterAll: 'All',
    filterToday: 'Today',
    filterThisWeek: 'This Week',
    filterThisMonth: 'This Month',
    filterThisQuarter: 'This Quarter',
    filterThisYear: 'This Year',
    filterPersonal: 'Personal',
    filterHighlights: 'Highlights',
    aboutTitle: 'ABOUT NOTEBOOK',
    aboutDescription:
      'Your personal note-taking space for podcast insights. Capture ideas, create highlights, and organize your thoughts from the episodes you listen to.',
    aboutHowTo:
      'Create new notes while reading episode summaries or write standalone notes. Organize notes by tagging them and use the search function to quickly find what you need.',
    emptyState: {
      title: 'No notes yet',
      description: 'Start taking notes from episode summaries',
    },
  },

  upload: {
    title: 'Upload',
    filterUploadVideo: 'Upload Video',
    filterSuggestShowPerson: 'Suggest Show/Person',
    dropzone: 'Drop your podcast audio file here or click to browse',
    uploading: 'Uploading...',
    processing: 'Processing with AI...',
    success: 'Upload successful!',
    error: 'Upload failed. Please try again.',
  },

  premium: {
    badge: 'Premium',
    upgrade: 'Upgrade to Premium',
    getPremium: 'Get Premium',
    tryAI: 'Try AI Assistant',
    unlockFeature: 'This is a Premium feature',
    benefits: {
      unlimitedSummaries: 'Unlimited summaries',
      aiChat: 'AI chat assistant',
      exclusiveInsights: 'Exclusive insights',
      adFree: 'Ad-free experience',
    },
    pricing: {
      monthly: 'From $9.99/mo',
      annual: '$99/year',
    },
  },

  actions: {
    save: 'Save',
    unsave: 'Unsave',
    saved: 'Saved',
    share: 'Share',
    download: 'Download',
    follow: 'Follow',
    following: 'Following',
    unfollow: 'Unfollow',
    read: 'Read',
    listen: 'Listen',
    viewMore: 'View More',
    viewAll: 'View All',
    viewAllSuggestions: 'View all suggestions',
    back: 'Back',
    backToBrowse: 'Back to Browse',
    backToDiscover: 'Back to Discover',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    showMore: 'Show more',
    showLess: 'Show less',
  },

  time: {
    minutesAgo: '{minutes}m ago',
    hoursAgo: '{hours}h ago',
    daysAgo: '{days}d ago',
    weeksAgo: '{weeks}w ago',
    monthsAgo: '{months}mo ago',
    now: 'Just now',
  },

  search: {
    placeholder: 'Search for notes, summaries & more',
    noResults: 'No results found',
  },

  categories: {
    finance: 'Finance',
    geoPolitics: 'Geo-Politics',
    technology: 'Technology',
  },

  episodeCard: {
    summary: 'Summary',
    report: 'Report',
    readMore: 'Read More',
    keyTakeaways: 'Key Takeaways',
    topics: 'Topics',
  },

  ads: {
    sponsored: 'Sponsored',
    ad: 'Ad',
    limitedOffer: 'Limited Offer',
    premiumFeature: 'Premium Feature',
  },

  profile: {
    title: 'Profile',
    editProfile: 'Edit Profile',
    yourStats: 'Your Stats',
    episodesRead: 'Episodes Read',
    notesCreated: 'Notes Created',
    showsFollowing: 'Shows Following',
  },

  settings: {
    title: 'Settings',
    account: 'Account',
    notifications: 'Notifications',
    appearance: 'Appearance',
    privacy: 'Privacy',
    billing: 'Billing',
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
  },

  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    notFound: 'Content not found.',
    unauthorized: 'Please sign in to continue.',
    premiumRequired: 'Premium subscription required.',
  },

  loading: {
    episodes: 'Loading episodes...',
    reports: 'Loading reports...',
    podcasts: 'Loading podcasts...',
    profile: 'Loading profile...',
  },

  // Modal and component-specific copy
  modals: {
    episodeSummary: {
      notFound: 'Episode summary not found',
      notFoundDescription: 'This episode doesn\'t have a summary yet.',
      geoPolitics: 'Geo-Politics',
      markets: 'Markets',
      noGuarantees: 'No Guarantees',
      noGuaranteesText: 'Past performance is not indicative of future results. All investments carry risk, including the potential loss of principal. Market conditions, economic factors, and individual circumstances vary. Simplicity and its content providers make no representations or warranties regarding the accuracy, completeness, or timeliness of this information.',
    },
    podcastDetail: {
      episodes: 'Episodes',
    },
    cancelSubscription: {
      title: 'Cancel Subscription',
      confirmButton: 'Cancel Subscription',
      noteLabel: 'Note:',
      noteText: 'You\'ll continue to have access to Premium features until Feb 15, 2026. After that, your account will be downgraded to the Free plan.',
    },
  },

  // Sidebar menus
  sidebar: {
    suggestions: 'Suggestions',
    news: 'News',
    calendar: 'Calendar',
    earnings: 'Earnings',
    tweets: 'Tweets',
    predictions: 'Predictions',
    markets: 'Markets',
    premiumMember: 'Premium Member',
    previousSuggestions: 'Previous suggestions',
    nextSuggestions: 'Next suggestions',
    previous: 'Previous',
    next: 'Next',
    actual: 'Actual',
    forecast: 'Forecast',
    prior: 'Prior',
    switchToLightMode: 'Switch to Light Mode',
    switchToDarkMode: 'Switch to Dark Mode',
    openAIAssistant: 'Open AI Assistant',
    closeAIAssistant: 'Close AI Assistant',
  },

  // Billing page
  billing: {
    title: 'Billing',
    premium: 'Premium',
    active: 'Active',
    freePlan: 'Free',
    freePlanDescription: 'Basic features included',
    basicFeatures: 'Basic features',
    standardProcessing: 'Standard processing',
    aiSummariesPerMonth: '5 AI summaries per month',
    billingHistory: 'BILLING HISTORY',
    billingHistoryDescription: 'View and download invoices',
    cancelSubscription: 'Cancel Subscription',
    cancelSubscriptionDescription: 'End your premium membership',
  },

  // Settings page
  settingsPage: {
    newEpisodes: 'New Episodes',
    newEpisodesDescription: 'Notify when podcasts you follow release new episodes',
    weeklyDigest: 'Weekly Digest',
    weeklyDigestDescription: 'Receive a weekly summary of your activity',
    downloadYourData: 'Download Your Data',
    downloadYourDataDescription: 'Request a copy of your data',
    deleteAccount: 'Delete Account',
    deleteAccountDescription: 'Permanently delete your account and data',
  },

  // Data page
  dataPage: {
    listeningHistory: 'Listening History',
    downloadYourData: 'Download Your Data',
    deleteYourAccount: 'Delete Your Account',
  },

  // About page
  aboutPage: {
    activeUsers: 'Active Users',
    episodesSummarized: 'Episodes Summarized',
    aiPoweredSummaries: 'AI-Powered Summaries',
    aiPoweredSummariesDescription: 'Get the essence of hour-long financial podcasts in just minutes with our advanced AI technology.',
    focusOnWhatMatters: 'Focus on What Matters',
    focusOnWhatMattersDescription: 'Skip the fluff and get straight to the key insights, actionable advice, and important takeaways.',
    comprehensiveText: 'Whether you\'re interested in investing, economics, personal finance, or market analysis, Simplicity extracts the key insights and actionable advice so you can learn more in less time. Get the essence of a 60-minute podcast in a 2-minute read.',
  },

  // Accessibility page
  accessibilityPage: {
    keyboardNavigation: 'Keyboard Navigation',
    keyboardNavigationDescription: 'Full keyboard support for all interactive elements. Use Tab to navigate, Enter to activate, and Escape to close dialogs.',
    focusIndicators: 'Focus indicators for all interactive elements',
  },

  // Terms page
  termsPage: {
    premiumSubscriptions: 'Premium Subscriptions',
    premiumSubscriptionsText: 'Premium subscriptions are billed on a recurring basis (monthly or annually) until cancelled. Charges are non-refundable except as required by law.',
    cancellation: 'Cancellation',
    cancellationText: 'You may cancel your Premium subscription at any time. Cancellation takes effect at the end of the current billing period.',
  },

  // Catalog and discovery
  catalog: {
    discoverShows: 'Discover Shows',
    discoverPeople: 'Discover People',
    recentlyAdded: 'Recently added podcasts to Simplicity',
    topPeopleSubtitle: 'The 20 most featured guests and experts',
    topShowsSubtitle: 'The 20 most popular financial podcasts',
    aboutDiscover: 'ABOUT DISCOVER',
    aboutDiscoverDescription: 'Explore our comprehensive catalog of financial podcasts covering markets, economics, investing, and business. Discover new shows from industry experts, financial analysts, and economic commentators to expand your knowledge and stay informed.',
    aboutDiscoverHowTo: 'How to use:',
    aboutDiscoverHowToText: 'Browse through featured categories to find podcasts by topic. Check out Top Shows based on popularity, or explore New Shows for the latest additions. Click any podcast to view episode list and summaries.',
  },

  // Premium features
  premiumFeatures: {
    title: 'Premium Features',
    description: 'Access advanced AI insights and exclusive reports with Premium.',
    aiPoweredInsights: 'AI-Powered Insights',
  },

  // Notifications empty states
  notificationsEmpty: {
    title: 'No notifications yet',
    description: 'New episode summaries and reports will appear here',
  },

  // Reports empty states
  reportsEmpty: {
    title: 'No reports available',
    description: 'AI-generated reports will appear here as new episodes are analyzed',
  },

  // Notebook empty states
  notebookEmpty: {
    title: 'No saved notes yet',
    description: 'Start taking notes from episode summaries',
  },
} as const;

/**
 * Helper function to replace placeholders in copy strings
 * Example: formatCopy(copy.reports.readTime, { minutes: 25 }) => "25 min read"
 */
export function formatCopy(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}