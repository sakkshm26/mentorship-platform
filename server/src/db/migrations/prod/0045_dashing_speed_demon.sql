DO $$ BEGIN
 CREATE TYPE "public"."carnival_lead_type" AS ENUM('customer_journey', 'analytics', 'customization');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "carnival_lead" ADD COLUMN "type" "carnival_lead_type" DEFAULT 'customer_journey' NOT NULL;