CREATE TABLE IF NOT EXISTS "mentee_skill_map" (
	"fk_skill_mentee" uuid NOT NULL,
	"skill" "skill" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentee_skill_map_fk_skill_mentee_skill_pk" PRIMARY KEY("fk_skill_mentee","skill")
);
--> statement-breakpoint
DROP TABLE "mentee_experience_level_map";--> statement-breakpoint
DROP TABLE "user_token";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mentee" ADD COLUMN "experience_level" "experience_level" DEFAULT 'fresher' NOT NULL;--> statement-breakpoint
ALTER TABLE "mentee" ADD COLUMN "monthly_budget_min" numeric(12, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentee_skill_map" ADD CONSTRAINT "mentee_skill_map_fk_skill_mentee_mentee_id_fk" FOREIGN KEY ("fk_skill_mentee") REFERENCES "public"."mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_phone_unique" UNIQUE("phone");