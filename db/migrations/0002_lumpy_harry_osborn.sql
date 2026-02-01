ALTER TABLE "episodes" ADD CONSTRAINT "episodes_video_id_unique" UNIQUE("video_id");--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_audio_id_unique" UNIQUE("audio_id");--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_file_id_unique" UNIQUE("file_id");