DO $$ BEGIN
 CREATE TYPE "public"."day_name" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."domain" AS ENUM('backend', 'business_analysis', 'cybersecurity', 'data_analysis', 'data_engineering', 'data_science', 'devops', 'engineering_management', 'finance', 'frontend', 'fullstack', 'hr', 'machine_learning', 'marketing', 'product_management', 'sales', 'testing', 'ui_ux_design');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."experience_level" AS ENUM('fresher', 'working_professional');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."language" AS ENUM('english', 'hindi');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."skill" AS ENUM('algorithms', 'android', 'asd', 'angular', 'ansible', 'api', 'aws', 'azure', 'bitbucket', 'bootstrap', 'c', 'c_sharp', 'cassandra', 'cpp', 'css', 'data_structures', 'datadog', 'distributed_systems', 'django', 'docker', 'dsa', 'dynamodb', 'elastic_search', 'elk_stack', 'express_js', 'fast_api', 'firebase', 'flask', 'flutter', 'gcp', 'gin', 'git', 'github_actions', 'gitlab', 'golang', 'grafana', 'graphql', 'heroku', 'hld', 'html', 'ios', 'java', 'javascript', 'jenkins', 'jquery', 'kafka', 'kotlin', 'kubernetes', 'leadership', 'lld', 'mariadb', 'memcached', 'mern', 'microservices', 'mongodb', 'monolith', 'mysql', 'nest_js', 'netlify', 'new_relic', 'next_js', 'node_js', 'nosql', 'oop', 'oracle', 'php', 'prometheus', 'psql', 'pubsub', 'python', 'rabbitmq', 'react_js', 'react_native', 'redis', 'rest', 'ruby', 'rust', 'sentry', 'soap', 'solidity', 'spring_boot', 'sql', 'sqlite', 'svelte', 'swift', 'system_design', 'tailwind_css', 'teamwork', 'terraform', 'typescript', 'vercel', 'vue_js');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_booking_mentor" uuid NOT NULL,
	"fk_booking_mentee" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentee_skill_map" (
	"fk_skill_mentee" uuid NOT NULL,
	"skill" "skill" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentee_skill_map_fk_skill_mentee_skill_pk" PRIMARY KEY("fk_skill_mentee","skill")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_mentee_user" uuid NOT NULL,
	"experience_level" "experience_level" NOT NULL,
	"monthly_budget_min" numeric(12, 2) NOT NULL,
	"monthly_budget_max" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentee_fk_mentee_user_unique" UNIQUE("fk_mentee_user")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_domain_map" (
	"fk_domain_mentor" uuid NOT NULL,
	"domain" "domain" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_domain_map_fk_domain_mentor_domain_pk" PRIMARY KEY("fk_domain_mentor","domain")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_event_mentor" uuid NOT NULL,
	"fk_event_schedule" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_experience_mentor" uuid NOT NULL,
	"organization_name" text NOT NULL,
	"position" text NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_language_map" (
	"fk_language_mentor" uuid NOT NULL,
	"language" "language" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_language_map_fk_language_mentor_language_pk" PRIMARY KEY("fk_language_mentor","language")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_review_mentor" uuid NOT NULL,
	"fk_review_mentee" uuid NOT NULL,
	"rating" numeric NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_schedule_day_time" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_day_time_schedule" uuid NOT NULL,
	"day_name" "day_name" NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_schedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"fk_schedule_mentor" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
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
CREATE TABLE IF NOT EXISTS "mentor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_mentor_user" uuid NOT NULL,
	"heading" text,
	"about" text,
	"trial_fee" numeric(12, 2),
	"per_month_fee" numeric(12, 2),
	"profile_image_url" text,
	"year_experience" smallint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_fk_mentor_user_unique" UNIQUE("fk_mentor_user")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_user_mentor" uuid,
	"fk_user_mentee" uuid,
	"email" text,
	"password" text,
	"phone" varchar(20),
	"full_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_fk_user_mentor_unique" UNIQUE("fk_user_mentor"),
	CONSTRAINT "user_fk_user_mentee_unique" UNIQUE("fk_user_mentee"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_fk_booking_mentor_mentor_id_fk" FOREIGN KEY ("fk_booking_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_fk_booking_mentee_mentee_id_fk" FOREIGN KEY ("fk_booking_mentee") REFERENCES "public"."mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentee_skill_map" ADD CONSTRAINT "mentee_skill_map_fk_skill_mentee_mentee_id_fk" FOREIGN KEY ("fk_skill_mentee") REFERENCES "public"."mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentee" ADD CONSTRAINT "mentee_fk_mentee_user_user_id_fk" FOREIGN KEY ("fk_mentee_user") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_domain_map" ADD CONSTRAINT "mentor_domain_map_fk_domain_mentor_mentor_id_fk" FOREIGN KEY ("fk_domain_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_event" ADD CONSTRAINT "mentor_event_fk_event_mentor_mentor_id_fk" FOREIGN KEY ("fk_event_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_event" ADD CONSTRAINT "mentor_event_fk_event_schedule_mentor_schedule_id_fk" FOREIGN KEY ("fk_event_schedule") REFERENCES "public"."mentor_schedule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_experience" ADD CONSTRAINT "mentor_experience_fk_experience_mentor_mentor_id_fk" FOREIGN KEY ("fk_experience_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_language_map" ADD CONSTRAINT "mentor_language_map_fk_language_mentor_mentor_id_fk" FOREIGN KEY ("fk_language_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_review" ADD CONSTRAINT "mentor_review_fk_review_mentor_mentor_id_fk" FOREIGN KEY ("fk_review_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_review" ADD CONSTRAINT "mentor_review_fk_review_mentee_mentee_id_fk" FOREIGN KEY ("fk_review_mentee") REFERENCES "public"."mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_schedule_day_time" ADD CONSTRAINT "mentor_schedule_day_time_fk_day_time_schedule_mentor_schedule_id_fk" FOREIGN KEY ("fk_day_time_schedule") REFERENCES "public"."mentor_schedule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_schedule" ADD CONSTRAINT "mentor_schedule_fk_schedule_mentor_mentor_id_fk" FOREIGN KEY ("fk_schedule_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_skill_map" ADD CONSTRAINT "mentor_skill_map_fk_skill_mentor_mentor_id_fk" FOREIGN KEY ("fk_skill_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor" ADD CONSTRAINT "mentor_fk_mentor_user_user_id_fk" FOREIGN KEY ("fk_mentor_user") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_fk_user_mentor_mentor_id_fk" FOREIGN KEY ("fk_user_mentor") REFERENCES "public"."mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_fk_user_mentee_mentee_id_fk" FOREIGN KEY ("fk_user_mentee") REFERENCES "public"."mentee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
