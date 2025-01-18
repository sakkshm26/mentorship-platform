DO $$ BEGIN
 CREATE TYPE "public"."currency" AS ENUM('INR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "mentee" ALTER COLUMN "monthly_budget_min" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "mentee" ALTER COLUMN "monthly_budget_max" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "mentor" ALTER COLUMN "trial_fee" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "mentor" ALTER COLUMN "per_month_fee" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "mentor_review" DROP COLUMN IF EXISTS "rating";