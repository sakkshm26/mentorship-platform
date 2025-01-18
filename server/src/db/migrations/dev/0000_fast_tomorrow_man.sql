DO $$ BEGIN
 CREATE TYPE "domain" AS ENUM('frontend', 'backend', 'fullstack', 'devops', 'data', 'testing', 'graphic_design', 'ui_ux_design', 'game_design', 'cybersecurity', 'engineering_management', 'data_science', 'machine_learning', 'data_analysis', 'sales', 'marketing', 'business_analysis', 'finance', 'hr', 'product_management', 'hardware', 'vlsi', 'embedded_engineering');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "language" AS ENUM('english', 'hindi');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "skill" AS ENUM('dsa', 'javascript', 'typescript', 'system_design', 'html', 'css', 'java', 'python', 'golang', 'rust', 'c', 'cpp', 'solidity', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'nosql', 'graphql', 'rest', 'soap', 'kafka', 'rabbitmq', 'redis', 'memcached', 'mongodb', 'mysql', 'psql', 'oracle', 'mariadb', 'sqlite', 'cassandra', 'dynamodb', 'firebase', 'aws', 'azure', 'gcp', 'heroku', 'netlify', 'vercel', 'docker', 'kubernetes', 'jenkins', 'git', 'github_actions', 'gitlab', 'bitbucket', 'ansible', 'terraform', 'prometheus', 'grafana', 'elk_stack', 'new_relic', 'datadog', 'sentry', 'api', 'oop', 'node_js', 'lld', 'hld', 'react_js', 'next_js', 'express_js', 'nest_js', 'angular', 'vue_js', 'svelte', 'jquery', 'bootstrap', 'tailwind_css', 'leadership', 'distributed_systems', 'microservices', 'monolith', 'teamwork', 'springboot', 'mern', 'elastic_search', 'react_native', 'flutter', 'pubsub', 'c_sharp', 'algorithms', 'data_structures', 'android', 'ios');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentee_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_token_mentee" uuid NOT NULL,
	"refresh_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentee_token_refresh_token_unique" UNIQUE("refresh_token")
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
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"short_bio" text,
	"long_bio" text,
	"phone" varchar(20),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fk_token_mentor" uuid NOT NULL,
	"refresh_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_token_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentee_token" ADD CONSTRAINT "mentee_token_fk_token_mentee_user_id_fk" FOREIGN KEY ("fk_token_mentee") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_domain_map" ADD CONSTRAINT "mentor_domain_map_fk_domain_mentor_mentor_id_fk" FOREIGN KEY ("fk_domain_mentor") REFERENCES "mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_experience" ADD CONSTRAINT "mentor_experience_fk_experience_mentor_mentor_id_fk" FOREIGN KEY ("fk_experience_mentor") REFERENCES "mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_language_map" ADD CONSTRAINT "mentor_language_map_fk_language_mentor_mentor_id_fk" FOREIGN KEY ("fk_language_mentor") REFERENCES "mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_review" ADD CONSTRAINT "mentor_review_fk_review_mentor_mentor_id_fk" FOREIGN KEY ("fk_review_mentor") REFERENCES "mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_review" ADD CONSTRAINT "mentor_review_fk_review_mentee_user_id_fk" FOREIGN KEY ("fk_review_mentee") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_skill_map" ADD CONSTRAINT "mentor_skill_map_fk_skill_mentor_mentor_id_fk" FOREIGN KEY ("fk_skill_mentor") REFERENCES "mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_token" ADD CONSTRAINT "mentor_token_fk_token_mentor_mentor_id_fk" FOREIGN KEY ("fk_token_mentor") REFERENCES "mentor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
