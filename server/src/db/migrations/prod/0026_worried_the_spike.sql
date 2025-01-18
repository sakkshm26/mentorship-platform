ALTER TABLE "booking" RENAME TO "trial_booking";--> statement-breakpoint
ALTER TABLE "trial_booking" DROP CONSTRAINT "booking_fk_booking_mentor_mentor_id_fk";
--> statement-breakpoint
ALTER TABLE "trial_booking" DROP CONSTRAINT "booking_fk_booking_mentee_mentee_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trial_booking" ADD CONSTRAINT "trial_booking_fk_booking_mentor_mentor_id_fk" FOREIGN KEY ("fk_booking_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trial_booking" ADD CONSTRAINT "trial_booking_fk_booking_mentee_mentee_id_fk" FOREIGN KEY ("fk_booking_mentee") REFERENCES "public"."mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
