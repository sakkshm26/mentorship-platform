DO $$ BEGIN
 CREATE TYPE "domain" AS ENUM('backend', 'business_analysis', 'cybersecurity', 'data_analysis', 'data_engineering', 'data_science', 'devops', 'engineering_management', 'finance', 'frontend', 'fullstack', 'hr', 'machine_learning', 'marketing', 'product_management', 'sales', 'testing', 'ui_ux_design');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 CREATE TYPE "skill" AS ENUM('algorithms', 'android', 'angular', 'ansible', 'api', 'aws', 'azure', 'bitbucket', 'bootstrap', 'c', 'c_sharp', 'cassandra', 'cpp', 'css', 'data_structures', 'datadog', 'distributed_systems', 'django', 'docker', 'dsa', 'dynamodb', 'elastic_search', 'elk_stack', 'express_js', 'fast_api', 'firebase', 'flask', 'flutter', 'gcp', 'gin', 'git', 'github_actions', 'gitlab', 'golang', 'grafana', 'graphql', 'heroku', 'hld', 'html', 'ios', 'java', 'javascript', 'jenkins', 'jquery', 'kafka', 'kotlin', 'kubernetes', 'leadership', 'lld', 'mariadb', 'memcached', 'mern', 'microservices', 'mongodb', 'monolith', 'mysql', 'nest_js', 'netlify', 'new_relic', 'next_js', 'node_js', 'nosql', 'oop', 'oracle', 'php', 'prometheus', 'psql', 'pubsub', 'python', 'rabbitmq', 'react_js', 'react_native', 'redis', 'rest', 'ruby', 'rust', 'sentry', 'soap', 'solidity', 'spring_boot', 'sql', 'sqlite', 'svelte', 'swift', 'system_design', 'tailwind_css', 'teamwork', 'terraform', 'typescript', 'vercel', 'vue_js');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
ALTER TABLE "mentor" ADD COLUMN "per_month_fee" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "mentor" ADD COLUMN "profile_image_url" text;