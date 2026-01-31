import { pgTable, text, timestamp, uuid, integer, jsonb, real, index } from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// Episodes - stores metadata for each ingested episode
// ─────────────────────────────────────────────────────────────────────────────

export const episodes = pgTable("episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: text("source").notNull(), // "youtube" | "audio" | "local"
  url: text("url"),
  videoId: text("video_id"),
  audioId: text("audio_id"),
  fileId: text("file_id"),
  
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
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  episodeIdIdx: index("episode_summary_episode_id_idx").on(table.episodeId),
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
