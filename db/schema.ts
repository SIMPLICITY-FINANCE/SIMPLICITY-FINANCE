import { pgTable, text, timestamp, uuid, integer, jsonb, real, index, boolean } from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// Users - authentication and authorization
// ─────────────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "admin" | "user"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  roleIdx: index("users_role_idx").on(table.role),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Shows - podcast shows/channels
// ─────────────────────────────────────────────────────────────────────────────

export const shows = pgTable("shows", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  
  // YouTube metadata
  channelId: text("channel_id").notNull().unique(), // UC... format (source of truth)
  channelHandle: text("channel_handle"), // @username format
  channelUrl: text("channel_url").notNull(),
  channelDescription: text("channel_description"),
  channelThumbnail: text("channel_thumbnail"),
  subscriberCount: integer("subscriber_count"),
  
  // Classification
  category: text("category"), // 'markets' | 'macro' | 'technology' | 'geopolitics' | 'business'
  
  // Ingestion settings
  sourceType: text("source_type").notNull().default("youtube"), // 'youtube', 'rss', etc.
  status: text("status").$type<"enabled" | "disabled">().notNull().default("disabled"),
  ingestionFrequency: text("ingestion_frequency").default("every_6_hours"), // for future
  lastVideosToIngest: integer("last_videos_to_ingest").default(2), // configurable
  
  // Timestamps
  lastIngestedAt: timestamp("last_ingested_at"),
  lastCheckedAt: timestamp("last_checked_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  
  // Stats
  totalEpisodesIngested: integer("total_episodes_ingested").default(0),
}, (table) => ({
  channelIdIdx: index("shows_channel_id_idx").on(table.channelId),
  statusIdx: index("shows_status_idx").on(table.status),
  sourceTypeIdx: index("shows_source_type_idx").on(table.sourceType),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Episodes - stores metadata for each ingested episode
// ─────────────────────────────────────────────────────────────────────────────

export const episodes = pgTable("episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: text("source").notNull(), // "youtube" | "audio" | "local"
  url: text("url"),
  videoId: text("video_id").unique(),
  audioId: text("audio_id").unique(),
  fileId: text("file_id").unique(),
  
  // YouTube metadata (if source = youtube)
  youtubeTitle: text("youtube_title"),
  youtubeChannelTitle: text("youtube_channel_title"),
  youtubeChannelId: text("youtube_channel_id"),
  youtubePublishedAt: text("youtube_published_at"),
  youtubeDescription: text("youtube_description"),
  youtubeThumbnailUrl: text("youtube_thumbnail_url"),
  youtubeDuration: text("youtube_duration"),
  youtubeViewCount: text("youtube_view_count"),
  
  // Publishing and QC fields for feed eligibility
  isPublished: boolean("is_published").notNull().default(true),
  publishedAt: timestamp("published_at"), // Set when episode completes processing
  qcStatus: text("qc_status"), // "pass" | "fail" | "warn" | null
  qcScore: integer("qc_score"), // 0-100
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  videoIdIdx: index("episodes_video_id_idx").on(table.videoId),
  sourceIdx: index("episodes_source_idx").on(table.source),
  isPublishedIdx: index("episodes_is_published_idx").on(table.isPublished),
  publishedAtIdx: index("episodes_published_at_idx").on(table.publishedAt),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Transcript Segments - raw transcript data
// ─────────────────────────────────────────────────────────────────────────────

export const transcriptSegmentsRaw = pgTable("transcript_segments_raw", {
  id: uuid("id").primaryKey().defaultRandom(),
  episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
  
  startMs: integer("start_ms").notNull(),
  endMs: integer("end_ms").notNull(),
  speaker: text("speaker"), // null for no speaker diarization
  text: text("text").notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  episodeIdIdx: index("transcript_segments_episode_id_idx").on(table.episodeId),
  timeIdx: index("transcript_segments_time_idx").on(table.startMs, table.endMs),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Episode Summary - one summary per episode
// ─────────────────────────────────────────────────────────────────────────────

export const episodeSummary = pgTable("episode_summary", {
  id: uuid("id").primaryKey().defaultRandom(),
  episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
  
  version: text("version").notNull(), // "1"
  videoId: text("video_id").notNull(),
  title: text("title").notNull(),
  publishedAt: text("published_at").notNull(),
  
  // Approval workflow
  approvalStatus: text("approval_status").notNull().default("pending"), // "pending" | "approved" | "rejected"
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  episodeIdIdx: index("episode_summary_episode_id_idx").on(table.episodeId),
  approvalStatusIdx: index("episode_summary_approval_status_idx").on(table.approvalStatus),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Summary Bullets - individual bullets with evidence spans
// ─────────────────────────────────────────────────────────────────────────────

export const summaryBullets = pgTable("summary_bullets", {
  id: uuid("id").primaryKey().defaultRandom(),
  summaryId: uuid("summary_id").notNull().references(() => episodeSummary.id, { onDelete: "cascade" }),
  
  sectionName: text("section_name").notNull(),
  bulletText: text("bullet_text").notNull(),
  confidence: real("confidence").notNull(), // 0.0 to 1.0
  
  // Evidence spans stored as JSONB array: [{ start_ms: number, end_ms: number }, ...]
  evidenceSpans: jsonb("evidence_spans").notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  summaryIdIdx: index("summary_bullets_summary_id_idx").on(table.summaryId),
}));

// ─────────────────────────────────────────────────────────────────────────────
// QC Runs - quality control results for summaries
// ─────────────────────────────────────────────────────────────────────────────

export const qcRuns = pgTable("qc_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
  summaryId: uuid("summary_id").notNull().references(() => episodeSummary.id, { onDelete: "cascade" }),
  
  version: text("version").notNull(), // "1"
  videoId: text("video_id").notNull(),
  qcStatus: text("qc_status").notNull(), // "pass" | "warn" | "fail"
  qcScore: integer("qc_score").notNull(), // 0-100
  
  // Risk flags and detailed flags stored as JSONB
  riskFlags: jsonb("risk_flags").notNull(), // string[]
  flags: jsonb("flags").notNull(), // QCFlag[]
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  episodeIdIdx: index("qc_runs_episode_id_idx").on(table.episodeId),
  summaryIdIdx: index("qc_runs_summary_id_idx").on(table.summaryId),
  qcStatusIdx: index("qc_runs_qc_status_idx").on(table.qcStatus),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Admin Audit Logs - track all admin actions
// ─────────────────────────────────────────────────────────────────────────────

export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  
  action: text("action").notNull(), // "approve_summary" | "reject_summary" | "reprocess_summary" | etc
  resourceType: text("resource_type").notNull(), // "summary" | "report" | "suggestion"
  resourceId: uuid("resource_id").notNull(),
  
  // Additional context stored as JSONB
  metadata: jsonb("metadata"), // { reason: string, qc_score: number, etc }
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("admin_audit_logs_user_id_idx").on(table.userId),
  resourceIdx: index("admin_audit_logs_resource_idx").on(table.resourceType, table.resourceId),
  actionIdx: index("admin_audit_logs_action_idx").on(table.action),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Saved Items - Episodes and Reports only (NOT bullets)
// ─────────────────────────────────────────────────────────────────────────────

export const savedItems = pgTable("saved_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  
  itemType: text("item_type").notNull(), // "episode" | "report"
  episodeId: uuid("episode_id").references(() => episodes.id, { onDelete: "cascade" }),
  // reportId will be added when reports table is created
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("saved_items_user_id_idx").on(table.userId),
  episodeIdIdx: index("saved_items_episode_id_idx").on(table.episodeId),
  uniqueUserEpisode: index("saved_items_user_episode_unique").on(table.userId, table.episodeId),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Followed Shows - User follows for shows/channels
// ─────────────────────────────────────────────────────────────────────────────

export const followedShows = pgTable("followed_shows", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  
  // Store YouTube channel ID directly (no FK to shows table since we aggregate from episodes)
  youtubeChannelId: text("youtube_channel_id").notNull(),
  youtubeChannelTitle: text("youtube_channel_title").notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("followed_shows_user_id_idx").on(table.userId),
  channelIdIdx: index("followed_shows_channel_id_idx").on(table.youtubeChannelId),
  uniqueUserChannel: index("followed_shows_user_channel_unique").on(table.userId, table.youtubeChannelId),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Followed People - User follows for people/hosts
// ─────────────────────────────────────────────────────────────────────────────

export const followedPeople = pgTable("followed_people", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  
  // Store person ID (matches demo data for now, will be FK when people table exists)
  personId: text("person_id").notNull(),
  personName: text("person_name").notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("followed_people_user_id_idx").on(table.userId),
  personIdIdx: index("followed_people_person_id_idx").on(table.personId),
  uniqueUserPerson: index("followed_people_user_person_unique").on(table.userId, table.personId),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Ingest Requests - Track upload/processing status
// ─────────────────────────────────────────────────────────────────────────────

export const ingestRequests = pgTable("ingest_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  
  url: text("url").notNull().unique(), // Prevent duplicate submissions
  source: text("source").notNull(), // "youtube" | "audio"
  
  // Status tracking
  status: text("status").notNull().default("queued"), // "queued" | "running" | "succeeded" | "failed"
  stage: text("stage"), // "metadata" | "download" | "transcribe" | "summarize" | "qc" | "persist" | "cleanup" | "completed" | "failed"
  
  // Inngest event ID for tracking
  inngestEventId: text("inngest_event_id"),
  
  // Episode ID once created
  episodeId: uuid("episode_id").references(() => episodes.id),
  
  // Error tracking
  errorMessage: text("error_message"),
  errorDetails: jsonb("error_details"),
  
  // Timestamps
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("ingest_requests_user_id_idx").on(table.userId),
  statusIdx: index("ingest_requests_status_idx").on(table.status),
  urlIdx: index("ingest_requests_url_idx").on(table.url),
  episodeIdIdx: index("ingest_requests_episode_id_idx").on(table.episodeId),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Notebook Items - Bullets only (NOT episodes or reports)
// ─────────────────────────────────────────────────────────────────────────────

export const notebookItems = pgTable("notebook_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  
  bulletId: uuid("bullet_id").notNull().references(() => summaryBullets.id, { onDelete: "cascade" }),
  
  // Optional user notes on this bullet
  userNotes: text("user_notes"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("notebook_items_user_id_idx").on(table.userId),
  bulletIdIdx: index("notebook_items_bullet_id_idx").on(table.bulletId),
  uniqueUserBullet: index("notebook_items_user_bullet_unique").on(table.userId, table.bulletId),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Reports - Summaries of summaries (daily/weekly/monthly aggregations)
// ─────────────────────────────────────────────────────────────────────────────

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  title: text("title").notNull(),
  reportType: text("report_type").notNull(), // "daily" | "weekly" | "monthly" | "quarterly"
  generationType: text("generation_type").notNull().default("auto"), // "auto" | "manual"
  
  // Period this report covers
  date: text("date").notNull(), // YYYY-MM-DD canonical date for this report
  periodStart: text("period_start").notNull(), // ISO datetime
  periodEnd: text("period_end").notNull(), // ISO datetime
  
  // Generation status
  status: text("status").notNull().default("generating"), // "generating" | "ready" | "failed"
  
  // AI-generated content stored as JSONB
  contentJson: jsonb("content_json"), // { executiveSummary, insights[], themes[], sentiment, sentimentReasoning }
  
  // Legacy plain-text summary (kept for backward compat)
  summary: text("summary").notNull().default(""),
  
  // Metadata
  episodesIncluded: integer("episodes_included").notNull().default(0),
  generatedBy: text("generated_by").notNull().default("system"), // "system" | user_id
  
  // Approval workflow
  approvalStatus: text("approval_status").notNull().default("pending"), // "pending" | "approved" | "rejected"
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  
  generatedAt: timestamp("generated_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  reportTypeIdx: index("reports_report_type_idx").on(table.reportType),
  dateIdx: index("reports_date_idx").on(table.date),
  periodIdx: index("reports_period_idx").on(table.periodStart, table.periodEnd),
  statusIdx: index("reports_status_idx").on(table.status),
  approvalStatusIdx: index("reports_approval_status_idx").on(table.approvalStatus),
  uniqueTypeDate: index("reports_type_date_unique").on(table.reportType, table.date),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Report Episodes - Junction table linking reports to their source episodes
// ─────────────────────────────────────────────────────────────────────────────

export const reportEpisodes = pgTable("report_episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  reportIdIdx: index("report_episodes_report_id_idx").on(table.reportId),
  episodeIdIdx: index("report_episodes_episode_id_idx").on(table.episodeId),
  uniqueReportEpisode: index("report_episodes_unique").on(table.reportId, table.episodeId),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Report Themes - Tracks recurring themes across reports
// ─────────────────────────────────────────────────────────────────────────────

export const reportThemes = pgTable("report_themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  
  name: text("name").notNull(),
  description: text("description"),
  prominence: real("prominence").notNull().default(0.5), // 0.0 to 1.0
  episodeCount: integer("episode_count").notNull().default(1),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  reportIdIdx: index("report_themes_report_id_idx").on(table.reportId),
  nameIdx: index("report_themes_name_idx").on(table.name),
}));

// ─────────────────────────────────────────────────────────────────────────────
// People - Hosts, guests, and notable figures extracted from episodes
// ─────────────────────────────────────────────────────────────────────────────

export const people = pgTable("people", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  emoji: text("emoji"),
  avatarUrl: text("avatar_url"), // AI-generated headshot URL
  title: text("title"), // e.g. "CEO of Bridgewater Associates"
  bio: text("bio"),
  
  // Optional social/web links
  youtubeUrl: text("youtube_url"),
  twitterUrl: text("twitter_url"),
  websiteUrl: text("website_url"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  slugIdx: index("people_slug_idx").on(table.slug),
  nameIdx: index("people_name_idx").on(table.name),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Episode People - Junction table linking episodes to people
// ─────────────────────────────────────────────────────────────────────────────

export const episodePeople = pgTable("episode_people", {
  id: uuid("id").primaryKey().defaultRandom(),
  episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
  personId: uuid("person_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  
  role: text("role").$type<"host" | "guest" | "mentioned">().notNull().default("guest"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  episodeIdIdx: index("episode_people_episode_id_idx").on(table.episodeId),
  personIdIdx: index("episode_people_person_id_idx").on(table.personId),
  uniqueEpisodePerson: index("episode_people_unique").on(table.episodeId, table.personId),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Notifications - Real-time notifications for episodes and reports
// ─────────────────────────────────────────────────────────────────────────────

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),

  type: text("type").$type<
    "episode_ready" |
    "daily_report_ready" |
    "weekly_report_ready" |
    "monthly_report_ready" |
    "quarterly_report_ready"
  >().notNull(),

  title: text("title").notNull(),
  message: text("message"),

  link: text("link").notNull(),

  iconType: text("icon_type").$type<"episode" | "report">().notNull(),
  metadata: jsonb("metadata"),

  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  readAt: timestamp("read_at"),
}, (table) => ({
  userIdIdx: index("notifications_user_id_idx").on(table.userId),
  isReadIdx: index("notifications_is_read_idx").on(table.isRead),
  createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Report Items - Links reports to specific bullets from episodes (legacy)
// ─────────────────────────────────────────────────────────────────────────────

export const reportItems = pgTable("report_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  
  bulletId: uuid("bullet_id").notNull().references(() => summaryBullets.id, { onDelete: "cascade" }),
  
  // Optional context or commentary for this bullet in the report
  context: text("context"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  reportIdIdx: index("report_items_report_id_idx").on(table.reportId),
  bulletIdIdx: index("report_items_bullet_id_idx").on(table.bulletId),
}));
