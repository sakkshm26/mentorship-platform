import { and, asc, desc, eq, getTableColumns, ilike, like, or } from "drizzle-orm";
import { DB } from "../db";
import { mentee_table, mentor_domain_map_table, mentor_experience_table, mentor_list_map_table, mentor_list_table, mentor_skill_map_table, mentor_table, user_table } from "../db/schema";
import jwt from "jsonwebtoken";
import { config } from "../providers/config";
import CustomError from "../providers/error";
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10)

interface UserMentorData {
    full_name: string;
    phone: string;
    heading: string;
    about?: string;
    trial_fee: number;
    per_month_fee: number;
    profile_image_url?: string;
    years_experience: number;
    skills: any[];
    domains: any[];
    linkedin_url?: string;
    job_experiences: {
        organization_name: string;
        position: string;
        start_date: string;
        end_date?: string;
        about?: string;
    }[]
}

interface CreateSessionMentorListProps {
    mentor_ids: string[];
    name: string;
}

interface GetAllMentorsProps {
    limit: number;
    offset: number;
    name?: string;
    phone?: string;
    email?: string;
}

interface GetAllMenteesProps {
    limit: number;
    offset: number;
    name?: string;
    phone?: string;
    email?: string;
}

interface UpdateMentorProps {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    heading: string;
    about: string;
    internal_rating: string;
    external_rating: string;
    session_count: number;
    hidden: boolean
}

interface UpdateMenteeProps {
    id: string;
    full_name: string;
    phone: string;
    email: string;
}

export const AdminService = {
    createUserAndMentor: async (DTO: UserMentorData) => {
        const { full_name, phone, heading, about, trial_fee, per_month_fee, profile_image_url, years_experience, skills, domains, linkedin_url, job_experiences } = DTO;
        const user = await DB.insert(user_table).values({
            full_name,
            phone,
            profile_image_url,
            linkedin_url
        }).returning()
        const mentor = await DB.insert(mentor_table).values({
            fk_mentor_user: user[0].id,
            heading,
            about,
            trial_fee: trial_fee,
            per_month_fee: per_month_fee,
            years_experience
        }).returning()
        await DB.update(user_table).set({ fk_user_mentor: mentor[0].id }).where(eq(user_table.id, user[0].id));
        await Promise.all(skills.map(async skill => {
            await DB.insert(mentor_skill_map_table).values({
                skill,
                fk_skill_mentor: mentor[0].id
            })
        }))
        await Promise.all(domains.map(async domain => {
            await DB.insert(mentor_domain_map_table).values({
                domain,
                fk_domain_mentor: mentor[0].id
            })
        }))
        await Promise.all(job_experiences.map(async job => {
            await DB.insert(mentor_experience_table).values({
                fk_experience_mentor: mentor[0].id,
                organization_name: job.organization_name,
                position: job.position,
                start_date: job.start_date,
                end_date: job.end_date
            })
        }))
        return "success";
    },

    login: async (DTO: { email: string, password: string }) => {
        const { email, password } = DTO;
        if (email !== config.admin_email || password !== config.admin_password) {
            throw new CustomError("Invalid credentials");
        }
        return { api_key: config.admin_api_key };
    },

    createSessionMentorList: async (DTO: CreateSessionMentorListProps) => {
        const { name, mentor_ids } = DTO;
        const session = jwt.sign(
            {},
            config.access_token_secret,
            {
                expiresIn: "20d",
            }
        );
        const mentor_list = await DB.insert(mentor_list_table).values({
            session,
            name,
            nano_id: nanoid()
        }).returning();
        await Promise.all(mentor_ids.map(async mentor_id => {
            await DB.insert(mentor_list_map_table).values({
                fk_mentor_id: mentor_id,
                fk_mentor_list: mentor_list[0].id
            })
        }))
        return mentor_list[0];
    },

    getSessionMentorLists: async ({ limit, offset }: { limit: number, offset: number }) => {
        const response = await DB.select({ ...getTableColumns(mentor_list_table) }).from(mentor_list_table).limit(limit).offset(offset).orderBy(desc(mentor_list_table.created_at));
        return response;
    },

    getAllMentors: async ({ limit, offset, name, phone, email }: GetAllMentorsProps) => {
        let query = DB.select({
            id: mentor_table.id,
            email: user_table.email,
            phone: user_table.phone,
            full_name: user_table.full_name
        })
            .from(mentor_table)
            .leftJoin(user_table, eq(mentor_table.fk_mentor_user, user_table.id))
            .limit(limit)
            .offset(offset)
            .orderBy(asc(user_table.full_name));
        let where_query;
        if (name) {
            where_query = or(
                ilike(user_table.full_name, `%${name}%`),
                ilike(user_table.full_name, `${name}%`),
                ilike(user_table.full_name, `%${name}`),
            );
        }
        if (phone) {
            if (where_query) {
                where_query = and(where_query, eq(user_table.phone, phone));
            } else {
                where_query = eq(user_table.phone, phone);
            }
        }
        if (email) {
            if (where_query) {
                where_query = and(where_query, eq(user_table.email, email));
            } else {
                where_query = eq(user_table.email, email);
            }
        }
        if (where_query) {
            query.where(where_query);
        }
        const mentors = await query;
        return mentors;
    },

    getMentor: async (mentor_id: string) => {
        const mentor_columns = getTableColumns(mentor_table);
        const { password, ...user_columns } = getTableColumns(user_table);
        const mentor = await DB.select({
            ...mentor_columns,
            user: user_columns
        })
            .from(mentor_table)
            .where(eq(mentor_table.id, mentor_id))
            .leftJoin(user_table, eq(mentor_table.fk_mentor_user, user_table.id));
        if (!mentor.length) {
            throw new CustomError("Mentor not found");
        }
        return mentor[0];
    },

    updateMentor: async (mentor_data: UpdateMentorProps) => {
        const mentor = await DB.select().from(mentor_table).where(eq(mentor_table.id, mentor_data.id));
        const user_id = mentor[0].fk_mentor_user;
        const { password, ...user_columns } = getTableColumns(user_table);
        const updated_mentor = await DB.update(mentor_table).set({
            heading: mentor_data.heading,
            about: mentor_data.about,
            internal_rating: mentor_data.internal_rating,
            external_rating: mentor_data.external_rating,
            session_count: mentor_data.session_count,
            hidden: mentor_data.hidden
        }).where(eq(mentor_table.id, mentor_data.id)).returning();
        let update_obj:any = {
            phone: mentor_data.phone,
            full_name: mentor_data.full_name
        };
        if (mentor_data.email?.length) {
            update_obj = { ...update_obj, email: mentor_data.email };
        }
        const updated_user = await DB.update(user_table).set(update_obj).where(eq(user_table.id, user_id)).returning(user_columns);
        return { ...updated_mentor[0], user: updated_user[0] };
    },

    getAllMentees: async ({ limit, offset, name, phone, email }: GetAllMenteesProps) => {
        let query = DB.select({
            id: mentee_table.id,
            email: user_table.email,
            phone: user_table.phone,
            full_name: user_table.full_name
        })
            .from(mentee_table)
            .leftJoin(user_table, eq(mentee_table.fk_mentee_user, user_table.id))
            .limit(limit)
            .offset(offset)
            .orderBy(asc(user_table.full_name));
        let where_query;
        if (name) {
            where_query = or(
                ilike(user_table.full_name, `%${name}%`),
                ilike(user_table.full_name, `${name}%`),
                ilike(user_table.full_name, `%${name}`),
            );
        }
        if (phone) {
            if (where_query) {
                where_query = and(where_query, eq(user_table.phone, phone));
            } else {
                where_query = eq(user_table.phone, phone);
            }
        }
        if (email) {
            if (where_query) {
                where_query = and(where_query, eq(user_table.email, email));
            } else {
                where_query = eq(user_table.email, email);
            }
        }
        if (where_query) {
            query.where(where_query);
        }
        const mentees = await query;
        return mentees;
    },

    getMentee: async (mentee_id: string) => {
        const mentee_columns = getTableColumns(mentee_table);
        const { password, ...user_columns } = getTableColumns(user_table);
        const mentee = await DB.select({
            ...mentee_columns,
            user: user_columns
        })
            .from(mentee_table)
            .where(eq(mentee_table.id, mentee_id))
            .leftJoin(user_table, eq(mentee_table.fk_mentee_user, user_table.id));
        if (!mentee.length) {
            throw new CustomError("Mentee not found");
        }
        return mentee[0];
    },

    updateMentee: async (mentee_data: UpdateMenteeProps) => {
        const mentee = await DB.select().from(mentee_table).where(eq(mentee_table.id, mentee_data.id));
        const user_id = mentee[0].fk_mentee_user;
        const { password, ...user_columns } = getTableColumns(user_table);
        const updated_user = await DB.update(user_table).set({
            email: mentee_data.email,
            phone: mentee_data.phone,
            full_name: mentee_data.full_name
        }).where(eq(user_table.id, user_id)).returning(user_columns);
        return { ...mentee[0], user: updated_user[0] };
    },
}