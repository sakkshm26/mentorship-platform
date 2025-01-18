CREATE TABLE IF NOT EXISTS "mentee_domain_map" (
	"fk_domain_mentee" uuid NOT NULL,
	"domain" "skill" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentee_domain_map_fk_domain_mentee_domain_pk" PRIMARY KEY("fk_domain_mentee","domain")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentee_domain_map" ADD CONSTRAINT "mentee_domain_map_fk_domain_mentee_mentee_id_fk" FOREIGN KEY ("fk_domain_mentee") REFERENCES "public"."mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
