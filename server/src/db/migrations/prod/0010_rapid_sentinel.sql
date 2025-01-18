CREATE TABLE IF NOT EXISTS "mentor_list_booking" (
	"fk_booking_mentor_list" uuid NOT NULL,
	"fk_booking_mentor" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_list_booking_fk_booking_mentor_list_fk_booking_mentor_pk" PRIMARY KEY("fk_booking_mentor_list","fk_booking_mentor")
);
--> statement-breakpoint
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
