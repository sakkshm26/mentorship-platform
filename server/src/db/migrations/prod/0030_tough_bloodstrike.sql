DO $$ BEGIN
 CREATE TYPE "public"."payment_type" AS ENUM('trial_booking');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_payment_trial_booking" uuid,
	"type" "payment_type",
	"payment_id" text NOT NULL,
	"order_id" text NOT NULL,
	"signature" text NOT NULL,
	"event_id" text NOT NULL,
	"amount" bigint NOT NULL,
	"currency" "currency" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_payment_id_unique" UNIQUE("payment_id"),
	CONSTRAINT "payment_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_fk_payment_trial_booking_trial_booking_id_fk" FOREIGN KEY ("fk_payment_trial_booking") REFERENCES "public"."trial_booking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
