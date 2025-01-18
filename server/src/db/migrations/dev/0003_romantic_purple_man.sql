ALTER TABLE "user" ADD COLUMN "full_name" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "last_name";