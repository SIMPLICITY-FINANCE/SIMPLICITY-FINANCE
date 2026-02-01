CREATE TABLE "ingest_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"url" text NOT NULL,
	"source" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"inngest_event_id" text,
	"episode_id" uuid,
	"error_message" text,
	"error_details" jsonb,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ingest_requests_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "ingest_requests" ADD CONSTRAINT "ingest_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingest_requests" ADD CONSTRAINT "ingest_requests_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ingest_requests_user_id_idx" ON "ingest_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ingest_requests_status_idx" ON "ingest_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ingest_requests_url_idx" ON "ingest_requests" USING btree ("url");--> statement-breakpoint
CREATE INDEX "ingest_requests_episode_id_idx" ON "ingest_requests" USING btree ("episode_id");