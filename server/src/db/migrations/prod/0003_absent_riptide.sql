ALTER TABLE "user" ADD COLUMN "profile_image_url" text;--> statement-breakpoint
ALTER TABLE "mentor" DROP COLUMN IF EXISTS "profile_image_url";