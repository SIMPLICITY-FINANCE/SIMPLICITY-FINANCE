CREATE TABLE "admin_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "followed_people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"person_id" text NOT NULL,
	"person_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "followed_shows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"youtube_channel_id" text NOT NULL,
	"youtube_channel_title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notebook_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"bullet_id" uuid NOT NULL,
	"user_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"bullet_id" uuid NOT NULL,
	"context" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"report_type" text NOT NULL,
	"period_start" text NOT NULL,
	"period_end" text NOT NULL,
	"summary" text NOT NULL,
	"approval_status" text DEFAULT 'pending' NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_type" text NOT NULL,
	"episode_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "episode_summary" ADD COLUMN "approval_status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "episode_summary" ADD COLUMN "approved_by" uuid;--> statement-breakpoint
ALTER TABLE "episode_summary" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "episode_summary" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followed_people" ADD CONSTRAINT "followed_people_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followed_shows" ADD CONSTRAINT "followed_shows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notebook_items" ADD CONSTRAINT "notebook_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notebook_items" ADD CONSTRAINT "notebook_items_bullet_id_summary_bullets_id_fk" FOREIGN KEY ("bullet_id") REFERENCES "public"."summary_bullets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_items" ADD CONSTRAINT "report_items_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_items" ADD CONSTRAINT "report_items_bullet_id_summary_bullets_id_fk" FOREIGN KEY ("bullet_id") REFERENCES "public"."summary_bullets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_audit_logs_user_id_idx" ON "admin_audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "admin_audit_logs_resource_idx" ON "admin_audit_logs" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "admin_audit_logs_action_idx" ON "admin_audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "followed_people_user_id_idx" ON "followed_people" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "followed_people_person_id_idx" ON "followed_people" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "followed_people_user_person_unique" ON "followed_people" USING btree ("user_id","person_id");--> statement-breakpoint
CREATE INDEX "followed_shows_user_id_idx" ON "followed_shows" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "followed_shows_channel_id_idx" ON "followed_shows" USING btree ("youtube_channel_id");--> statement-breakpoint
CREATE INDEX "followed_shows_user_channel_unique" ON "followed_shows" USING btree ("user_id","youtube_channel_id");--> statement-breakpoint
CREATE INDEX "notebook_items_user_id_idx" ON "notebook_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notebook_items_bullet_id_idx" ON "notebook_items" USING btree ("bullet_id");--> statement-breakpoint
CREATE INDEX "notebook_items_user_bullet_unique" ON "notebook_items" USING btree ("user_id","bullet_id");--> statement-breakpoint
CREATE INDEX "report_items_report_id_idx" ON "report_items" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "report_items_bullet_id_idx" ON "report_items" USING btree ("bullet_id");--> statement-breakpoint
CREATE INDEX "reports_report_type_idx" ON "reports" USING btree ("report_type");--> statement-breakpoint
CREATE INDEX "reports_period_idx" ON "reports" USING btree ("period_start","period_end");--> statement-breakpoint
CREATE INDEX "reports_approval_status_idx" ON "reports" USING btree ("approval_status");--> statement-breakpoint
CREATE INDEX "saved_items_user_id_idx" ON "saved_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_items_episode_id_idx" ON "saved_items" USING btree ("episode_id");--> statement-breakpoint
CREATE INDEX "saved_items_user_episode_unique" ON "saved_items" USING btree ("user_id","episode_id");--> statement-breakpoint
ALTER TABLE "episode_summary" ADD CONSTRAINT "episode_summary_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "episode_summary_approval_status_idx" ON "episode_summary" USING btree ("approval_status");