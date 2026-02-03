ALTER TABLE "episodes" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "qc_status" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "qc_score" integer;--> statement-breakpoint
CREATE INDEX "episodes_is_published_idx" ON "episodes" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "episodes_published_at_idx" ON "episodes" USING btree ("published_at");