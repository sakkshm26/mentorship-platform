DO $$ BEGIN
 CREATE TYPE "public"."experience_level" AS ENUM('fresher', 'working_professional');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentee_experience_level_map" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_experience_mentee" uuid NOT NULL,
	"experience_level" "experience_level" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentee_experience_level_map" ADD CONSTRAINT "mentee_experience_level_map_fk_experience_mentee_mentee_id_fk" FOREIGN KEY ("fk_experience_mentee") REFERENCES "public"."mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "mentee" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "mentee" DROP COLUMN IF EXISTS "password";--> statement-breakpoint
ALTER TABLE "mentee" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "mentee" DROP COLUMN IF EXISTS "last_name";--> statement-breakpoint
ALTER TABLE "mentor" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "mentor" DROP COLUMN IF EXISTS "password";--> statement-breakpoint
ALTER TABLE "mentor" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "mentor" DROP COLUMN IF EXISTS "last_name";