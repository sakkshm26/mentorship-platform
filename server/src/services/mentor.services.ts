import { and, asc, desc, eq, getTableColumns, gt, gte, ilike, inArray, isNull, like, lte, ne, or, sql } from "drizzle-orm";
import { DB } from "../db";
import { mentor_domain_map_table, mentor_experience_table, mentor_list_booking_table, mentor_list_map_table, mentor_list_table, mentor_skill_map_table, mentor_table, user_table } from "../db/schema";
import { arrayAgg, jsonAggBuildObject } from "../utils/drizzle";
import axios from "axios";
import { config } from "../providers/config";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface get_mentors_data {
    limit: number,
    offset: number,
    skills: any[],
    domains: any[],
    experience_min: number,
    experience_max: number,
    trial_fee_min: number,
    trial_fee_max: number,
    per_month_fee_min: number,
    per_month_fee_max: number,
    job_or_skill_search?: string
}

export const MentorService = {
    getMentors: async (data: get_mentors_data, recursive: boolean = false) => {
        const { limit, offset, skills, domains, experience_min, experience_max, trial_fee_max, trial_fee_min, per_month_fee_max, per_month_fee_min, job_or_skill_search } = data;
        const { internal_rating, ...mentor_columns } = getTableColumns(mentor_table);
        let query = DB.select({
            ...mentor_columns, full_name: user_table.full_name, profile_image_url: user_table.profile_image_url, linkedin_url: user_table.linkedin_url, skills: arrayAgg(mentor_skill_map_table.skill), domains: arrayAgg(mentor_domain_map_table.domain), job_experiences: sql`(
            SELECT json_agg(
                json_build_object(
                    'organization_name', organization_name,
                    'position', position,
                    'start_date', start_date,
                    'end_date', end_date
                )
                ORDER BY start_date DESC
            )
            FROM ${mentor_experience_table}
            WHERE ${mentor_experience_table.fk_experience_mentor} = ${mentor_table.id}
          )` })
            .from(mentor_table)
            .leftJoin(mentor_skill_map_table, eq(mentor_skill_map_table.fk_skill_mentor, mentor_table.id))
            .leftJoin(mentor_domain_map_table, eq(mentor_domain_map_table.fk_domain_mentor, mentor_table.id))
            .leftJoin(user_table, eq(mentor_table.fk_mentor_user, user_table.id))
            .groupBy(mentor_table.id, user_table.full_name, user_table.profile_image_url, user_table.linkedin_url)
            .orderBy(desc(mentor_table.internal_rating), asc(mentor_table.per_month_fee), asc(mentor_table.id))
            .limit(limit)
            .offset(offset)
        const conditions = and(
            gte(mentor_table.years_experience, experience_min),
            lte(mentor_table.years_experience, experience_max),
            gte(mentor_table.trial_fee, trial_fee_min),
            lte(mentor_table.trial_fee, trial_fee_max),
            gte(mentor_table.per_month_fee, per_month_fee_min),
            lte(mentor_table.per_month_fee, per_month_fee_max),
        )
        let skill_condition, domain_condition;
        skill_condition = skills.length ? inArray(mentor_skill_map_table.skill, skills) : undefined;
        if (domains.length) {
            domain_condition = inArray(mentor_domain_map_table.domain, domains);
        }
        let description_match_query;
        if (job_or_skill_search?.length) {
            description_match_query = ilike(mentor_table.about, `%${job_or_skill_search}%`);
        }
        query.where(and(conditions, skill_condition, domain_condition, description_match_query, or(isNull(mentor_table.hidden), eq(mentor_table.hidden, false))));
        let mentors_data = await query;
        if (mentors_data.length < 5 && !offset && !recursive) {
            mentors_data = await MentorService.getMentors({ ...data, per_month_fee_min: data.per_month_fee_min - 300000, per_month_fee_max: data.per_month_fee_max + 300000 }, true);
        }
        return mentors_data;
    },

    getSessionMentorList: async ({ limit, offset, session_id }: { limit: number, offset: number, session_id: string }) => {
        const { internal_rating, ...mentor_columns } = getTableColumns(mentor_table);
        const mentors = await DB.select(
            {
                ...mentor_columns,
                full_name: user_table.full_name,
                profile_image_url: user_table.profile_image_url,
                linkedin_url: user_table.linkedin_url,
                skills: arrayAgg(mentor_skill_map_table.skill),
                domains: arrayAgg(mentor_domain_map_table.domain),
                job_experiences: sql`(
                    SELECT json_agg(
                        json_build_object(
                            'organization_name', organization_name,
                            'position', position,
                            'start_date', start_date,
                            'end_date', end_date
                        )
                        ORDER BY start_date DESC
                    )
                    FROM ${mentor_experience_table}
                    WHERE ${mentor_experience_table.fk_experience_mentor} = ${mentor_table.id}
                )`
            })
            .from(mentor_list_table)
            .where(eq(mentor_list_table.session, session_id))
            .leftJoin(mentor_list_map_table, eq(mentor_list_map_table.fk_mentor_list, mentor_list_table.id))
            .leftJoin(mentor_table, eq(mentor_table.id, mentor_list_map_table.fk_mentor_id))
            .leftJoin(mentor_skill_map_table, eq(mentor_skill_map_table.fk_skill_mentor, mentor_table.id))
            .leftJoin(mentor_domain_map_table, eq(mentor_domain_map_table.fk_domain_mentor, mentor_table.id))
            .leftJoin(user_table, eq(mentor_table.fk_mentor_user, user_table.id))
            .groupBy(mentor_table.id, user_table.full_name, user_table.profile_image_url, user_table.linkedin_url)
            .limit(limit)
            .offset(offset)

        const mentor_list = await DB.select({ name: mentor_list_table.name }).from(mentor_list_table).where(eq(mentor_list_table.session, session_id));
        const list_name = mentor_list[0].name;
        return { name: list_name, mentors };
    },

    createSessionBooking: async ({ session_id, mentor_id }: { session_id: string, mentor_id: string }) => {
        const mentor_list = await DB.select().from(mentor_list_table).where(eq(mentor_list_table.session, session_id));
        const response = await DB.insert(mentor_list_booking_table).values({
            fk_booking_mentor: mentor_id,
            fk_booking_mentor_list: mentor_list[0].id
        }).returning();
        const mentor_name = (await DB.select({ name: user_table.full_name }).from(mentor_table).where(eq(mentor_table.id, mentor_id)).fullJoin(user_table, eq(mentor_table.fk_mentor_user, user_table.id)))[0]?.name;
        const list_name = (await DB.select({ name: mentor_list_table.name }).from(mentor_list_table).where(eq(mentor_list_table.session, session_id)))[0]?.name;
        /* await axios({
            method: "post",
            url: config.create_booking_script_url,
            data: [
                [
                    mentor_name,
                    `${list_name} (From Static Link)`,
                    dayjs(new Date()).tz("Asia/Kolkata").format('DD.MM.YYYY | hh:mm A')
                ]
            ]
        }) */
        return response[0];
    }
}