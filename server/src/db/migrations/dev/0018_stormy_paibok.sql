ALTER TYPE "skill" ADD VALUE 'asp_dot_net';--> statement-breakpoint
ALTER TYPE "skill" ADD VALUE 'dbms';--> statement-breakpoint
ALTER TYPE "skill" ADD VALUE 'dot_net';--> statement-breakpoint
ALTER TYPE "skill" ADD VALUE 'ms_excel';--> statement-breakpoint
ALTER TYPE "skill" ADD VALUE 'ms_powerpoint';--> statement-breakpoint
ALTER TYPE "skill" ADD VALUE 'ms_word';--> statement-breakpoint
ALTER TYPE "skill" ADD VALUE 'open_source';--> statement-breakpoint
ALTER TYPE "skill" ADD VALUE 'operating_system';--> statement-breakpoint
ALTER TYPE "skill" ADD VALUE 'py_spark';--> statement-breakpoint
ALTER TYPE "skill" ADD VALUE 'sas';--> statement-breakpoint
ALTER TYPE "skill" ADD VALUE 'tableau';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_list_booking" (
	"fk_booking_mentor_list" uuid NOT NULL,
	"fk_booking_mentor" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_list_booking_fk_booking_mentor_list_fk_booking_mentor_pk" PRIMARY KEY("fk_booking_mentor_list","fk_booking_mentor")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_list_map" (
	"fk_mentor_id" uuid NOT NULL,
	"fk_mentor_list" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_list_map_fk_mentor_id_fk_mentor_list_pk" PRIMARY KEY("fk_mentor_id","fk_mentor_list")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "profile_image_url" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_list_booking" ADD CONSTRAINT "mentor_list_booking_fk_booking_mentor_list_mentor_list_id_fk" FOREIGN KEY ("fk_booking_mentor_list") REFERENCES "public"."mentor_list"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_list_booking" ADD CONSTRAINT "mentor_list_booking_fk_booking_mentor_mentor_id_fk" FOREIGN KEY ("fk_booking_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_list_map" ADD CONSTRAINT "mentor_list_map_fk_mentor_id_mentor_id_fk" FOREIGN KEY ("fk_mentor_id") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_list_map" ADD CONSTRAINT "mentor_list_map_fk_mentor_list_mentor_list_id_fk" FOREIGN KEY ("fk_mentor_list") REFERENCES "public"."mentor_list"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "mentor" DROP COLUMN IF EXISTS "profile_image_url";