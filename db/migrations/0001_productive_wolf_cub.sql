CREATE TABLE "episode_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"episode_id" uuid NOT NULL,
	"version" text NOT NULL,
	"video_id" text NOT NULL,
	"title" text NOT NULL,
	"published_at" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qc_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"episode_id" uuid NOT NULL,
	"summary_id" uuid NOT NULL,
	"version" text NOT NULL,
	"video_id" text NOT NULL,
	"qc_status" text NOT NULL,
	"qc_score" integer NOT NULL,
	"risk_flags" jsonb NOT NULL,
	"flags" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "summary_bullets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"summary_id" uuid NOT NULL,
	"section_name" text NOT NULL,
	"bullet_text" text NOT NULL,
	"confidence" real NOT NULL,
	"evidence_spans" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transcript_segments_raw" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"episode_id" uuid NOT NULL,
	"start_ms" integer NOT NULL,
	"end_ms" integer NOT NULL,
	"speaker" text,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "video_id" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "audio_id" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "file_id" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "youtube_title" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "youtube_channel_title" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "youtube_channel_id" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "youtube_published_at" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "youtube_description" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "youtube_thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "youtube_duration" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "youtube_view_count" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "episode_summary" ADD CONSTRAINT "episode_summary_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qc_runs" ADD CONSTRAINT "qc_runs_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qc_runs" ADD CONSTRAINT "qc_runs_summary_id_episode_summary_id_fk" FOREIGN KEY ("summary_id") REFERENCES "public"."episode_summary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "summary_bullets" ADD CONSTRAINT "summary_bullets_summary_id_episode_summary_id_fk" FOREIGN KEY ("summary_id") REFERENCES "public"."episode_summary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transcript_segments_raw" ADD CONSTRAINT "transcript_segments_raw_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "episode_summary_episode_id_idx" ON "episode_summary" USING btree ("episode_id");--> statement-breakpoint
CREATE INDEX "qc_runs_episode_id_idx" ON "qc_runs" USING btree ("episode_id");--> statement-breakpoint
CREATE INDEX "qc_runs_summary_id_idx" ON "qc_runs" USING btree ("summary_id");--> statement-breakpoint
CREATE INDEX "qc_runs_qc_status_idx" ON "qc_runs" USING btree ("qc_status");--> statement-breakpoint
CREATE INDEX "summary_bullets_summary_id_idx" ON "summary_bullets" USING btree ("summary_id");--> statement-breakpoint
CREATE INDEX "transcript_segments_episode_id_idx" ON "transcript_segments_raw" USING btree ("episode_id");--> statement-breakpoint
CREATE INDEX "transcript_segments_time_idx" ON "transcript_segments_raw" USING btree ("start_ms","end_ms");--> statement-breakpoint
CREATE INDEX "episodes_video_id_idx" ON "episodes" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "episodes_source_idx" ON "episodes" USING btree ("source");