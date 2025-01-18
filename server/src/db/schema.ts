import { AnyPgColumn, bigint, boolean, date, numeric, pgEnum, pgTable, primaryKey, smallint, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export function enumToPgEnum(myEnum: any): [string, ...string[]] {
    return Object.values(myEnum).map((value: any) => `${value}`) as [string, ...string[]]
}

export const domain_enum = pgEnum("domain", ['artificial_intelligence','backend', 'blockchain', 'business_analysis', 'cybersecurity', 'data_analysis', 'data_engineering', 'data_science', 'devops', 'engineering_management', 'finance', 'frontend', 'fullstack', 'game_development', 'hr', 'machine_learning', 'marketing', 'mobile_dev', 'product_management', 'sales', 'testing', 'ui_ux_design']);
export const skill_enum = pgEnum("skill", ['ajax','algorithms', 'analytics', 'android', 'angular', 'animation', 'ansible', 'apache_hadoop', 'apache_hive', 'apache_nifi', 'apache_spark', 'api', 'app_design', 'artificial_intelligence', 'asp_dot_net', 'aws', 'azure', 'big_data', 'bitbucket', 'bootstrap', 'c', 'competitive_analysis', 'competitive_programming', 'computer_network', 'computer_vision', 'ci_cd', 'c_sharp', 'cassandra', 'cpp', 'css', 'dart', 'data_structures', 'datadog', 'dbms', 'deep_learning', 'design_theory', 'design_systems', 'distributed_systems', 'django', 'docker', 'dot_net', 'dsa', 'dynamodb', 'elastic_search', 'elk_stack', 'entrepreneurship', 'express_js', 'fast_api', 'financial_analysis', 'fine_tune', 'firebase', 'flask', 'flutter', 'gcp', 'generative_ai', 'gin', 'git', 'github_actions', 'gitlab', 'golang', 'grafana', 'graphql', 'heroku', 'hld', 'html', 'image_processing', 'interactive_design','interview_preparation', 'interviewing', 'ionic', 'ios', 'java', 'javascript', 'jenkins', 'jquery', 'kafka', 'keras', 'kotlin', 'kubernetes', 'llm', 'leadership', 'linux', 'lld', 'mariadb', 'market_research', 'matlab', 'memcached', 'mern', 'microservices', 'mlops', 'mongodb', 'monolith', 'ms_excel', 'ms_powerpoint', 'ms_word', 'mysql', 'nest_js', 'netlify', 'new_relic', 'neural_network', 'next_js', 'natural_language_processing', 'node_js', 'nosql', 'oop', 'opencv', 'open_source', 'operating_system', 'oracle', 'php', 'power_bi', 'presentation', 'product_design', 'product_development_and_planning', 'product_knowledge', 'product_leadership', 'product_life_cycle', 'product_requirement_document', 'project_management', 'prometheus', 'psql', 'pubsub', 'python', 'py_spark', 'pytorch', 'quantum_computing', 'r', 'rabbitmq', 'react_js', 'react_native', 'redis', 'redux', 'rest', 'risk_management', 'ruby', 'rust', 'sas', 'scripting', 'sentry', 'snowflake', 'soap', 'solidity', 'spring_boot', 'sql', 'sqlite', 'svelte', 'swift', 'system_design', 'tableau', 'tailwind_css', 'teamwork', 'team_management', 'tensorflow', 'terraform', 'three_d', 'typescript', 'unity', 'user_design', 'user_experience', 'user_flows', 'user_research', 'vercel', 'visual_design', 'vue_js', 'web_design', 'web_socket', 'wireframes']);
export const language_enum = pgEnum("language", ["english", "hindi"]);
export const experience_level_enum = pgEnum("experience_level", ["fresher", "working_professional", "student", "other"]);
export const goal_enum = pgEnum("goal_enum", ["upskilling", "placements", "coursework", "job_switch", "domain_or_role_switch", "promotion", "unemployed_looking_for_job", "other"]);
export const day_name_enum = pgEnum("day_name", ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);
export const payment_type_enum = pgEnum("payment_type", ["trial_booking"]);
export const currency_enum = pgEnum("currency", ["INR"]);
export const carnival_lead_type_enum = pgEnum("carnival_lead_type", ["customer_journey", "analytics", "customization"]);

// users
export const user_table = pgTable("user", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    fk_user_mentor: uuid("fk_user_mentor").references((): AnyPgColumn => mentor_table.id).unique(),
    fk_user_mentee: uuid("fk_user_mentee").references((): AnyPgColumn => mentee_table.id).unique(),
    email: text("email").unique(),
    password: text("password"),
    phone: varchar("phone", { length: 20 }).unique(),
    full_name: text("full_name"),
    profile_image_url: text("profile_image_url"),
    linkedin_url: text("linkedin_url"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

// user token table
export const user_token_table = pgTable("user_token", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    fk_token_user: uuid("fk_token_user").references(() => user_table.id).notNull(),
    refresh_token: text("refresh_token").notNull().unique(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

// mentees
export const mentee_table = pgTable("mentee", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    fk_mentee_user: uuid("fk_mentee_user").references(() => user_table.id).notNull().unique(),
    experience_level: experience_level_enum("experience_level"),
    goal: goal_enum("goal"),
    monthly_budget_min: bigint("monthly_budget_min", { mode: "number" }),
    monthly_budget_max: bigint("monthly_budget_max", { mode: "number" }),
    trial_booked: boolean("trial_booked").notNull().default(false),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export const mentee_skill_map_table = pgTable("mentee_skill_map", {
    fk_skill_mentee: uuid("fk_skill_mentee").references(() => mentee_table.id).notNull(),
    skill: skill_enum("skill").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (t) => ({
    pk: primaryKey({ columns: [t.fk_skill_mentee, t.skill] }),
}))

export const mentee_domain_map_table = pgTable("mentee_domain_map", {
    fk_domain_mentee: uuid("fk_domain_mentee").references(() => mentee_table.id).notNull(),
    domain: domain_enum("domain").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (t) => ({
    pk: primaryKey({ columns: [t.fk_domain_mentee, t.domain] }),
}))

// mentors
export const mentor_table = pgTable("mentor", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    fk_mentor_user: uuid("fk_mentor_user").references(() => user_table.id).notNull().unique(),
    heading: text("heading"),
    about: text("about"),
    trial_fee: bigint("trial_fee", { mode: "number" }),
    per_month_fee: bigint("per_month_fee", { mode: "number" }),
    years_experience: smallint("year_experience"),
    hidden: boolean("hidden"),
    internal_rating: numeric("internal_rating", { precision: 2, scale: 1 }).notNull().default("4.5"),
    external_rating: numeric("external_rating", { precision: 2, scale: 1 }).notNull().default("0"),
    session_count: smallint("session_count").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export const mentor_skill_map_table = pgTable("mentor_skill_map", {
    fk_skill_mentor: uuid("fk_skill_mentor").references(() => mentor_table.id).notNull(),
    skill: skill_enum("skill").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (t) => ({
    pk: primaryKey({ columns: [t.fk_skill_mentor, t.skill] }),
}))

export const mentor_domain_map_table = pgTable("mentor_domain_map", {
    fk_domain_mentor: uuid("fk_domain_mentor").references(() => mentor_table.id).notNull(),
    domain: domain_enum("domain").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (t) => ({
    pk: primaryKey({ columns: [t.fk_domain_mentor, t.domain] }),
}))

export const mentor_language_map_table = pgTable("mentor_language_map", {
    fk_language_mentor: uuid("fk_language_mentor").references(() => mentor_table.id).notNull(),
    language: language_enum("language").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (t) => ({
    pk: primaryKey({ columns: [t.fk_language_mentor, t.language] }),
}))

export const mentor_experience_table = pgTable("mentor_experience", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    fk_experience_mentor: uuid("fk_experience_mentor").references(() => mentor_table.id).notNull(),
    organization_name: text("organization_name").notNull(),
    position: text("position").notNull(),
    start_date: date("start_date").notNull(),
    end_date: date("end_date"),
    about: text("about"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export const mentor_review_table = pgTable("mentor_review", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    fk_review_mentor: uuid("fk_review_mentor").references(() => mentor_table.id).notNull(),
    fk_review_mentee: uuid("fk_review_mentee").references(() => mentee_table.id).notNull(),
    // rating: numeric("rating").notNull(), // to confirm the rating range
    description: text("description"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export const mentor_schedule_table = pgTable("mentor_schedule", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    name: text("name").notNull(),
    fk_schedule_mentor: uuid("fk_schedule_mentor").references(() => mentor_table.id).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export const mentor_schedule_day_time_table = pgTable("mentor_schedule_day_time", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    fk_day_time_schedule: uuid("fk_day_time_schedule").references(() => mentor_schedule_table.id).notNull(),
    day_name: day_name_enum("day_name").notNull(),
    start_time: timestamp("start_time", { withTimezone: true }).notNull(),
    end_time: timestamp("end_time", { withTimezone: true }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export const mentor_event_table = pgTable("mentor_event", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    fk_event_mentor: uuid("fk_event_mentor").references(() => mentor_table.id).notNull(),
    fk_event_schedule: uuid("fk_event_schedule").references(() => mentor_schedule_table.id).notNull(),
    name: text("name").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export const trial_booking_table = pgTable("trial_booking", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    fk_booking_mentor: uuid("fk_booking_mentor").references(() => mentor_table.id).notNull(),
    fk_booking_mentee: uuid("fk_booking_mentee").references(() => mentee_table.id),
    session_id: text("session_id"),
    email: text("email"),
    interest: text("interest"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export const payment_table = pgTable("payment", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    fk_payment_trial_booking: uuid("fk_payment_trial_booking").references(() => trial_booking_table.id),
    type: payment_type_enum("type"),
    payment_id: text("payment_id").notNull().unique(), // razorpay payment ID
    order_id: text("order_id").notNull(), // razorpay order ID
    signatue: text("signature").notNull(), // razorpay signature
    event_id: text("event_id").notNull().unique(), // razorpay event ID
    amount: bigint("amount", { mode: "number" }).notNull(),
    currency: currency_enum("currency").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

// admin
export const mentor_list_table = pgTable("mentor_list", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    nano_id: text("nano_id"),
    session: text("session").notNull(),
    name: text("name").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export const mentor_list_map_table = pgTable("mentor_list_map", {
    fk_mentor_id: uuid("fk_mentor_id").references(() => mentor_table.id).notNull(),
    fk_mentor_list: uuid("fk_mentor_list").references(() => mentor_list_table.id).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (t) => ({
    pk: primaryKey({ columns: [t.fk_mentor_id, t.fk_mentor_list] }),
}))

export const mentor_list_booking_table = pgTable("mentor_list_booking", {
    fk_booking_mentor_list: uuid("fk_booking_mentor_list").references(() => mentor_list_table.id).notNull(),
    fk_booking_mentor: uuid("fk_booking_mentor").references(() => mentor_table.id).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (t) => ({
    pk: primaryKey({ columns: [t.fk_booking_mentor_list, t.fk_booking_mentor] }),
}))


// carnival table
export const carnival_lead_table = pgTable("carnival_lead", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    name: text("name").notNull(),
    phone: varchar("phone", { length: 20 }),
    type: carnival_lead_type_enum("type").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})