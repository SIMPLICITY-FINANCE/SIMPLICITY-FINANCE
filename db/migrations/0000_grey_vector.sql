CREATE TABLE "episodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
