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
DROP TABLE "session_mentor_map";--> statement-breakpoint
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
