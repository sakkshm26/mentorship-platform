ALTER TABLE "mentor" ADD COLUMN "external_rating" numeric(2, 1) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "mentor" ADD COLUMN "session_count" smallint DEFAULT 0 NOT NULL;