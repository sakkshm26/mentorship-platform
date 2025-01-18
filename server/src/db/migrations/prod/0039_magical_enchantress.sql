ALTER TABLE "trial_booking" ALTER COLUMN "fk_booking_mentee" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "trial_booking" ADD COLUMN "session_id" uuid;