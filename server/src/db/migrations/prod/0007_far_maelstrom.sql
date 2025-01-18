ALTER TYPE "skill" ADD VALUE 'asp_dot_net';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session_mentor_map" (
	"fk_session_mentor" uuid NOT NULL,
	"session" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_mentor_map_session_fk_session_mentor_pk" PRIMARY KEY("session","fk_session_mentor")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_mentor_map" ADD CONSTRAINT "session_mentor_map_fk_session_mentor_mentor_id_fk" FOREIGN KEY ("fk_session_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
