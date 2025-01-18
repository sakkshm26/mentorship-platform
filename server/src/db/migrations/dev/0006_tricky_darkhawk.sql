ALTER TABLE "user" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "mentor" DROP COLUMN IF EXISTS "phone";