/**
 * Core Types for Simplicity Application
 * 
 * Strict TypeScript interfaces for all data structures used across the application.
 * These types are shared between Web and Mobile implementations.
 */

// ============================================================================
// Entity Types
// ============================================================================

export interface Podcast {
  id: string;
  title: string;
  host: string;
  description: string;
  category: PodcastCategory;
  frequency: string;
  imageUrl: string;
  subscriberCount: string;
  episodeCount: number;
  handle?: string;
  isVerified?: boolean;
  views?: number;
  lastUpdated?: string;
}

export interface Episode {
  id: string;
  podcastId: string;
  title: string;
  date: string;
  duration: string;
  summary: string;
  keyTakeaways: string[];
  topics: string[];
  category?: 'geo-politics' | 'finance' | 'technology';
  tags?: string[];
  thumbnailUrl?: string;
  host?: string;
  guest?: string;
}

export interface Person {
  id: string;
  name: string;
  handle: string;
  imageUrl: string;
  bio: string;
  frequentShows: string[];
  totalAppearances: number;
  isVerified: boolean;
  category: PodcastCategory;
  lastAppearance?: string;
}

export interface Report {
  id: string;
  period: ReportPeriod;
  dateRange: string;
  title: ReportTitle;
  episodeCount: number;
  readTime: string;
  createdDate: string;
  content?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  episodeId?: string;
  podcastId?: string;
  tags?: string[];
  type: 'personal' | 'highlight';
}

export interface Notification {
  id: string;
  type: NotificationType;
  reportType?: ReportPeriod;
  podcastTitle: string;
  podcastImage: string;
  episodeTitle: string;
  duration: string;
  timeAgo: string;
  publishedAt: string;
  host?: string;
  episodeCount?: number;
  isUnread: boolean;
}

export interface SavedItem {
  id: string;
  podcastTitle: string;
  podcastImage: string;
  episodeTitle: string;
  duration: string;
  publishedAt: string;
  type: SavedItemType;
  host?: string;
  episodeCount?: number;
  content?: string;
}

// ============================================================================
// User & Auth Types
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  isPremium: boolean;
  createdAt: string;
}

export interface UserStats {
  episodesRead: number;
  notesCreated: number;
  showsFollowing: number;
  reportsViewed: number;
}

// ============================================================================
// Enums & Literal Types
// ============================================================================

export type PodcastCategory = 'finance' | 'geo-politics' | 'technology';

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'all';

export type ReportTitle =
  | 'Daily Brief'
  | 'Weekly Market Digest'
  | 'Monthly Market Review'
  | 'Quarterly Economic Outlook'
  | 'Annual Financial Markets Review';

export type NotificationType = 'episode' | 'report';

export type SavedItemType = 'summary' | 'report';

export type FilterTab = 'all' | 'shows' | 'people' | 'summary' | 'report' | 'unread';

export type ViewMode = 'all' | 'followed';

export type ThemeMode = 'light' | 'dark' | 'system';

export type View =
  | 'home'
  | 'upload'
  | 'notebook'
  | 'reports'
  | 'saved'
  | 'following'
  | 'discover'
  | 'top-shows'
  | 'new-shows'
  | 'top-people'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'billing'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'data'
  | 'accessibility'
  | 'signin'
  | 'podcast-detail'
  | 'episode-detail';

// ============================================================================
// View Models (Derived Data for UI)
// ============================================================================

export interface EpisodeWithPodcast extends Episode {
  podcast: Podcast;
}

export interface PodcastWithFollowState extends Podcast {
  isFollowing: boolean;
}

export interface PersonWithFollowState extends Person {
  isFollowing: boolean;
}

// ============================================================================
// Component Props (Shared Base Interfaces)
// ============================================================================

/**
 * Base props shared by all page components
 */
export interface BasePageProps {
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

/**
 * Props for components that handle episode interactions
 */
export interface EpisodeInteractionProps {
  onEpisodeClick?: (podcastId: string, episodeId: string) => void;
}

/**
 * Props for components that handle podcast interactions
 */
export interface PodcastInteractionProps {
  onPodcastClick?: (podcastId: string) => void;
}

/**
 * Props for components that handle person interactions
 */
export interface PersonInteractionProps {
  onPersonClick?: (personId: string) => void;
}

/**
 * Props for components that handle follow state
 */
export interface FollowStateProps {
  followedShows?: Set<string>;
  followedPeople?: Set<string>;
  onToggleFollowShow?: (showId: string) => void;
  onToggleFollowPerson?: (personId: string) => void;
}

/**
 * Combined props for full-featured page components
 */
export interface FullPageProps
  extends BasePageProps,
    EpisodeInteractionProps,
    PodcastInteractionProps,
    PersonInteractionProps,
    FollowStateProps {}

// ============================================================================
// API Response Types (Future-proofing)
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// State Types
// ============================================================================

export interface AppState {
  currentView: View;
  selectedPodcastId: string | null;
  selectedEpisodeId: string | null;
  selectedPersonId: string | null;
  isPremium: boolean;
  isLoggedIn: boolean;
  user: User | null;
  followedShows: Set<string>;
  followedPeople: Set<string>;
  searchQuery: string;
  isChatBotOpen: boolean;
  isMoreMenuOpen: boolean;
}

export interface UIState {
  isEpisodeModalOpen: boolean;
  isPodcastModalOpen: boolean;
  isPersonModalOpen: boolean;
  showPremiumPlans: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationCounts {
  newReportsCount: number;
  followingCount: number;
  notificationsCount: number;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isPodcast(entity: Podcast | Person): entity is Podcast {
  return 'episodeCount' in entity;
}

export function isPerson(entity: Podcast | Person): entity is Person {
  return 'totalAppearances' in entity;
}

export function isEpisodeNotification(
  notification: Notification
): notification is Notification & { type: 'episode' } {
  return notification.type === 'episode';
}

export function isReportNotification(
  notification: Notification
): notification is Notification & { type: 'report' } {
  return notification.type === 'report';
}