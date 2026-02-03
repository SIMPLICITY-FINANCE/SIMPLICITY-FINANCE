ALTER TABLE "ingest_requests" ADD COLUMN "stage" text;--> statement-breakpoint
ALTER TABLE "shows" ADD COLUMN "ingest_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "shows" ADD COLUMN "ingest_source" text;--> statement-breakpoint
ALTER TABLE "shows" ADD COLUMN "youtube_playlist_id" text;--> statement-breakpoint
ALTER TABLE "shows" ADD COLUMN "rss_feed_url" text;--> statement-breakpoint
ALTER TABLE "shows" ADD COLUMN "last_ingested_at" timestamp;--> statement-breakpoint
ALTER TABLE "shows" ADD COLUMN "ingest_frequency" text DEFAULT 'daily';--> statement-breakpoint
CREATE INDEX "shows_ingest_enabled_idx" ON "shows" USING btree ("ingest_enabled");