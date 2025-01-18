ALTER TABLE "mentor" ADD COLUMN "heading" text;--> statement-breakpoint
ALTER TABLE "mentor" ADD COLUMN "about" text;--> statement-breakpoint
ALTER TABLE "mentor" DROP COLUMN IF EXISTS "short_bio";--> statement-breakpoint
ALTER TABLE "mentor" DROP COLUMN IF EXISTS "long_bio";