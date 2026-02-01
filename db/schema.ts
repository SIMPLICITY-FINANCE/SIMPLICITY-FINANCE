import { pgTable, text, timestamp, uuid, integer, jsonb, real, index } from "drizzle-orm/pg-core";

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
  youtubeChannelId: text("youtube_channel_id").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  youtubeChannelIdIdx: index("shows_youtube_channel_id_idx").on(table.youtubeChannelId),
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
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  videoIdIdx: index("episodes_video_id_idx").on(table.videoId),
  sourceIdx: index("episodes_source_idx").on(table.source),
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
  reportType: text("report_type").notNull(), // "daily" | "weekly" | "monthly"
  periodStart: text("period_start").notNull(), // ISO date
  periodEnd: text("period_end").notNull(), // ISO date
  
  summary: text("summary").notNull(), // Overall summary text
  
  // Approval workflow (same as episode_summary)
  approvalStatus: text("approval_status").notNull().default("pending"), // "pending" | "approved" | "rejected"
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  reportTypeIdx: index("reports_report_type_idx").on(table.reportType),
  periodIdx: index("reports_period_idx").on(table.periodStart, table.periodEnd),
  approvalStatusIdx: index("reports_approval_status_idx").on(table.approvalStatus),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Report Items - Links reports to specific bullets from episodes
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
