CREATE TABLE IF NOT EXISTS "user_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_token_user" uuid NOT NULL,
	"refresh_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_token_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_token" ADD CONSTRAINT "user_token_fk_token_user_user_id_fk" FOREIGN KEY ("fk_token_user") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
