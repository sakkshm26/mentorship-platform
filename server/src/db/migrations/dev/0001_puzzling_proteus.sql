CREATE TABLE IF NOT EXISTS "mentee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_mentee_user" uuid NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentee_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_token_user" uuid NOT NULL,
	"refresh_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_token_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
DROP TABLE "mentee_token";--> statement-breakpoint
DROP TABLE "mentor_token";--> statement-breakpoint
ALTER TABLE "mentor_review" DROP CONSTRAINT "mentor_review_fk_review_mentee_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "fk_user_mentor" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "fk_user_mentee" uuid;--> statement-breakpoint
ALTER TABLE "mentor" ADD COLUMN "fk_mentor_user" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_fk_user_mentor_mentor_id_fk" FOREIGN KEY ("fk_user_mentor") REFERENCES "mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_fk_user_mentee_mentee_id_fk" FOREIGN KEY ("fk_user_mentee") REFERENCES "mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_review" ADD CONSTRAINT "mentor_review_fk_review_mentee_mentee_id_fk" FOREIGN KEY ("fk_review_mentee") REFERENCES "mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor" ADD CONSTRAINT "mentor_fk_mentor_user_user_id_fk" FOREIGN KEY ("fk_mentor_user") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "last_name";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentee" ADD CONSTRAINT "mentee_fk_mentee_user_user_id_fk" FOREIGN KEY ("fk_mentee_user") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_token" ADD CONSTRAINT "user_token_fk_token_user_user_id_fk" FOREIGN KEY ("fk_token_user") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
