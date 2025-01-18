ALTER TABLE "user" DROP CONSTRAINT "user_supabase_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "supabase_id";