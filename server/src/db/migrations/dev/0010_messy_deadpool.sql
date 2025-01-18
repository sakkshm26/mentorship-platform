ALTER TYPE "skill" ADD VALUE 'asd';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_domain_map" (
	"fk_domain_mentor" uuid NOT NULL,
	"domain" "domain" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_domain_map_fk_domain_mentor_domain_pk" PRIMARY KEY("fk_domain_mentor","domain")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_skill_map" (
	"fk_skill_mentor" uuid NOT NULL,
	"skill" "skill" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_skill_map_fk_skill_mentor_skill_pk" PRIMARY KEY("fk_skill_mentor","skill")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_domain_map" ADD CONSTRAINT "mentor_domain_map_fk_domain_mentor_mentor_id_fk" FOREIGN KEY ("fk_domain_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_skill_map" ADD CONSTRAINT "mentor_skill_map_fk_skill_mentor_mentor_id_fk" FOREIGN KEY ("fk_skill_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
