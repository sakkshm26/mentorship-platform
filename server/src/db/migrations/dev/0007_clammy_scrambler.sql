DO $$ BEGIN
 CREATE TYPE "public"."day_name" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_event_mentor" uuid NOT NULL,
	"fk_event_schedule" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_schedule_day_time" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_day_time_schedule" uuid NOT NULL,
	"day_name" "day_name" NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_schedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"fk_schedule_mentor" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mentor" ADD COLUMN "trial_fee" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "supabase_id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_event" ADD CONSTRAINT "mentor_event_fk_event_mentor_mentor_id_fk" FOREIGN KEY ("fk_event_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_event" ADD CONSTRAINT "mentor_event_fk_event_schedule_mentor_schedule_id_fk" FOREIGN KEY ("fk_event_schedule") REFERENCES "public"."mentor_schedule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_schedule_day_time" ADD CONSTRAINT "mentor_schedule_day_time_fk_day_time_schedule_mentor_schedule_id_fk" FOREIGN KEY ("fk_day_time_schedule") REFERENCES "public"."mentor_schedule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_schedule" ADD CONSTRAINT "mentor_schedule_fk_schedule_mentor_mentor_id_fk" FOREIGN KEY ("fk_schedule_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_supabase_id_unique" UNIQUE("supabase_id");