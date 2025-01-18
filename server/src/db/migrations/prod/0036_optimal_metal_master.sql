DO $$ BEGIN
 CREATE TYPE "public"."goal_enum" AS ENUM('upskilling', 'placements', 'coursework', 'job_switch', 'domain_or_role_switch', 'promotion', 'unemployed_looking_for_job', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "experience_level" ADD VALUE 'student';--> statement-breakpoint
ALTER TYPE "experience_level" ADD VALUE 'other';--> statement-breakpoint
ALTER TABLE "mentee" ADD COLUMN "goal" "goal_enum";