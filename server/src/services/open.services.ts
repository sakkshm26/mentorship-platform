import { and, asc, desc, eq, getTableColumns, gte, inArray, isNull, or, sql } from "drizzle-orm";
import { carnival_lead_table, mentor_domain_map_table, mentor_experience_table, mentor_list_map_table, mentor_list_table, mentor_skill_map_table, mentor_table, user_table } from "../db/schema";
import { DB } from "../db";
import { arrayAgg } from "../utils/drizzle";

interface get_mentors_data {
    limit: number,
    offset: number,
    skills: any[],
    domains: any[],
}

export const OpenService = {
    getMentors: async (data: get_mentors_data) => {
        const { limit, offset, skills, domains } = data;
        let query = DB.select({
            full_name: user_table.full_name,
            profile_image_url: user_table.profile_image_url,
            years_experience: mentor_table.years_experience,
            about: mentor_table.about,
            skills: arrayAgg(mentor_skill_map_table.skill),
            organizations: arrayAgg(mentor_experience_table.organization_name)
        })
            .from(mentor_table)
            .leftJoin(mentor_skill_map_table, eq(mentor_skill_map_table.fk_skill_mentor, mentor_table.id))
            .leftJoin(mentor_domain_map_table, eq(mentor_domain_map_table.fk_domain_mentor, mentor_table.id))
            .leftJoin(mentor_experience_table, eq(mentor_experience_table.fk_experience_mentor, mentor_table.id))
            .leftJoin(user_table, eq(mentor_table.fk_mentor_user, user_table.id))
            .groupBy(mentor_table.id, user_table.full_name, user_table.profile_image_url)
            .orderBy(desc(mentor_table.internal_rating), asc(mentor_table.per_month_fee), asc(mentor_table.id))
            .limit(limit)
            .offset(offset)
        let skill_condition, domain_condition;
        if (skills.length) {
            skill_condition = inArray(mentor_skill_map_table.skill, skills);
        }
        if (domains.length) {
            domain_condition = inArray(mentor_domain_map_table.domain, domains);
        }
        query.where(and(skill_condition, domain_condition, or(isNull(mentor_table.hidden), eq(mentor_table.hidden, false))));
        const mentors_data = await query;
        return mentors_data;
    },

    getStaticMentors: async () => {
        const mentor_data = {
            all: [
                {
                    id: "3a31ef50-2cb9-4236-b6d9-6f11f9e9cb85",
                    skills: ["dsa", "golang", "system_design"]
                },
                {
                    id: "2f9ae4c7-8489-42b5-bba7-260ad55f4465",
                    skills: ["dsa", "python", "django"]
                },
                {
                    id: "cbf64e5b-71f4-49d9-aa64-722ea3ab7e6a",
                    skills: ["dsa", "cpp", "system_design"]
                },
                {
                    id: "9e629ceb-18d8-4079-ba15-d3ea2017ec55",
                    skills: ["c", "cpp", "dsa"]
                },
                {
                    id: "97b8fcf5-3f2a-4447-8067-fc9fb6d5a00a",
                    skills: ["python", "natural_language_processing", "generative_ai"]
                },
                {
                    id: "e83921f6-360b-4c5b-8855-9e3a626674d4",
                    skills: ["cpp", "python", "dsa"]
                },
                {
                    id: "bce50773-aa8a-4fbf-bdf5-0121f3d2effb",
                    skills: ["sql", "python", "tableau"]
                },
                {
                    id: "30d11da7-82fa-4034-acb5-0950e862ddcb",
                    skills: ["java", "kotlin", "flutter"]
                },
            ],
            dsa: [
                {
                    id: "96ef0dcd-fb80-4347-a9e8-54b0211e96be",
                    skills: ["dsa", "oop", "system_design"]
                },
                {
                    id: "9cd4e621-4dcb-4788-9663-c69d36692afb",
                    skills: ["dsa", "spring_boot", "kafka"]
                },
                {
                    id: "577fada5-0eb6-40fb-bc0e-52dcdefc4523",
                    skills: ["dsa", "dbms", "sql"]
                },
                {
                    id: "bc28fb94-dcb4-4d1f-8c71-ad7803e3b426",
                    skills: ["dsa", "aws", "oop"]
                },
                {
                    id: "5679e51d-f66b-4d74-b591-7eba7e260b0e",
                    skills: ["dsa", "sql", "python"]
                },
                {
                    id: "c5971768-f847-4185-a9af-9b6d21232ff2",
                    skills: ["dsa", "golang", "docker"]
                },
                {
                    id: "eec3b388-0aba-455f-ba31-20ecb0de3147",
                    skills: ["dsa", "java", "spring_boot"]
                },
                {
                    id: "15d66f10-f2b5-428e-a34e-5a4fe380a737",
                    skills: ["dsa", "dbms", "cpp"]
                },
                {
                    id: "54682945-b8c7-4764-a28a-e0ea234c741f",
                    skills: ["dsa", "node_js", "competitive_programming"]
                },
            ],
            data_science: [
                {
                    id: "5679e51d-f66b-4d74-b591-7eba7e260b0e",
                    skills: ["dsa", "sql", "python"]
                },
                {
                    id: "e878a144-33e8-446d-b7e2-a952adf91067",
                    skills: ["sql", "python", "java"]
                },
                {
                    id: "b8691d66-1fad-4414-815c-2fc9b0533c3d",
                    skills: ["sql", "python", "dbms"]
                },
                {
                    id: "bce50773-aa8a-4fbf-bdf5-0121f3d2effb",
                    skills: ["sql", "python", "tableau"]
                },
            ],
            ai: [
                {
                    id: "69522d75-9ef1-47ec-8ca5-0ab73891c9a0",
                    skills: ["sql", "python", "generative_ai"]
                },
                {
                    id: "0385e45b-68d9-4d9e-a7aa-11f23f691c56",
                    skills: ["generative_ai", "react_js", "javascript"]
                },
                {
                    id: "0da2ec90-105d-48a6-b32f-abad286e4872",
                    skills: ["keras", "opencv", "tensorflow"]
                },
                {
                    id: "b1ca3dc4-3e6f-4e0d-a150-0c0c358c9a3c",
                    skills: ["pytorch", "deep_learning", "tensorflow"]
                },
                {
                    id: "e677a690-827f-4f04-8bac-30717093ff49",
                    skills: ["llm", "deep_learning", "keras"]
                },
                {
                    id: "97b8fcf5-3f2a-4447-8067-fc9fb6d5a00a",
                    skills: ["python", "natural_language_processing", "generative_ai"]
                },
                {
                    id: "806c5ad7-412c-4c99-973e-38006e5bcea7",
                    skills: ["generative_ai", "natural_language_processing", "dbms"]
                },
                {
                    id: "cc2baf95-f3de-448e-995a-2627b1218f14",
                    skills: ["generative_ai", "sql", "dbms"]
                },
            ],
            devops: [
                {
                    id: "7a49a031-f5dc-4a44-9051-9e50a7e3c6f2",
                    skills: ["docker", "kubernetes", "golang"]
                },
                {
                    id: "14ce0563-f8d9-4fc0-9b17-f55be5d50f9a",
                    skills: ["aws", "golang", "system_design"]
                },
                {
                    id: "658d6d30-a19c-4ae8-b79a-bcf7e870946a",
                    skills: ["aws", "dbms", "oop"]
                },
                {
                    id: "64404862-ae2c-48d4-94de-7a469c58c38e",
                    skills: ["lld", "dsa", "operating_system"]
                },
            ]
        }
        const temp_obj: Record<string, any> = {};
        for (const [key, value] of Object.entries(mentor_data)) {
            value.map(mentor => {
                temp_obj[mentor.id] = true;
            })
        }
        const unique_mentor_ids = Object.keys(temp_obj);
        const { internal_rating, hidden, ...mentor_columns } = getTableColumns(mentor_table);
        let mentors = await DB.select({
            ...mentor_columns, full_name: user_table.full_name, profile_image_url: user_table.profile_image_url, job_experiences: sql`(
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
            .from(user_table)
            .where(inArray(user_table.id, unique_mentor_ids))
            .innerJoin(mentor_table, eq(mentor_table.fk_mentor_user, user_table.id));
        const mentors_obj: Record<string, any> = {};
        mentors.map(mentor => {
            mentors_obj[mentor.fk_mentor_user] = mentor;
        })

        let return_obj: Record<string, any> = {};
        for (const [key, value] of Object.entries(mentor_data)) {
            let domain_mentor_array: any[] = [];
            value.map(mentor => {
                domain_mentor_array.push({ ...mentors_obj[mentor.id], skills: mentor.skills });
            })
            return_obj[key] = domain_mentor_array;
        }
        return return_obj;
    },

    createCarnivalLead: async (name: string, phone: string, type: any) => {
        await DB.insert(carnival_lead_table).values({ name, phone, type });
    },

    getSessionListMentorsWithID: async ({ id, limit, offset }: { id: string, limit: number, offset: number }) => {
        const mentor_list = await DB.select({ name: mentor_list_table.name, session_id: mentor_list_table.session }).from(mentor_list_table).where(eq(mentor_list_table.nano_id, id));
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
            .where(eq(mentor_list_table.nano_id, id))
            .leftJoin(mentor_list_map_table, eq(mentor_list_map_table.fk_mentor_list, mentor_list_table.id))
            .leftJoin(mentor_table, eq(mentor_table.id, mentor_list_map_table.fk_mentor_id))
            .leftJoin(mentor_skill_map_table, eq(mentor_skill_map_table.fk_skill_mentor, mentor_table.id))
            .leftJoin(mentor_domain_map_table, eq(mentor_domain_map_table.fk_domain_mentor, mentor_table.id))
            .leftJoin(user_table, eq(mentor_table.fk_mentor_user, user_table.id))
            .groupBy(mentor_table.id, user_table.full_name, user_table.profile_image_url, user_table.linkedin_url)
            .limit(limit)
            .offset(offset)

        const list_name = mentor_list[0].name;
        return { name: list_name, mentors };
    }
}