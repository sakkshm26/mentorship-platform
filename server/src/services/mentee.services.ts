import { DB } from "../db";
import { trial_booking_table, mentee_skill_map_table, mentee_table, mentor_table, user_table, mentee_domain_map_table, mentor_list_table } from "../db/schema";
import jwt from "jsonwebtoken";
import { config } from "../providers/config";
import { eq, getTableColumns } from "drizzle-orm";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DOMAIN_VALUE_TO_NAME_MAP } from "../constants";
import { normalizeCurrency } from "../utils/common";
import CustomError from "../providers/error";

dayjs.extend(utc);
dayjs.extend(timezone);

interface mentee_data {
    user_id: string;
    experience_level: "fresher" | "student" | "working_professional" | "other";
    monthly_budget_min: number;
    monthly_budget_max: number;
    skills?: any[];
    domains?: any[];
    goal?: any;
}

interface create_booking_props {
    mentor_id: string,
    mentee_id: string
}

export const MenteeService = {
    create_mentee: async (mentee_data: mentee_data) => {
        const { user_id, experience_level, goal, monthly_budget_max, monthly_budget_min, skills, domains } = mentee_data;
        const mentee = await DB.insert(mentee_table).values({ fk_mentee_user: user_id, experience_level, monthly_budget_max: monthly_budget_max, monthly_budget_min: monthly_budget_min, goal }).returning();
        await DB.update(user_table).set({ fk_user_mentee: mentee[0].id }).where(eq(user_table.id, user_id));
        if (skills?.length) {
            await Promise.all(skills.map(async (skill) => {
                await DB.insert(mentee_skill_map_table).values({
                    fk_skill_mentee: mentee[0].id,
                    skill,
                })
            }))
        }
        if (domains?.length) {
            await Promise.all(domains.map(async (domain) => {
                await DB.insert(mentee_domain_map_table).values({
                    fk_domain_mentee: mentee[0].id,
                    domain
                })
            }))
        }
        return mentee[0];
    },

    get_mentee: async (mentee_id: string) => {
        const mentee = await DB.select().from(mentee_table).where(eq(mentee_table.id, mentee_id));
        return mentee[0];
    },

    create_booking: async (booking_data: create_booking_props) => {
        const { mentor_id, mentee_id } = booking_data;
        const booking = await DB.insert(trial_booking_table).values({ fk_booking_mentor: mentor_id, fk_booking_mentee: mentee_id }).returning();
        const mentor = (await DB.select({ name: user_table.full_name, trial_fee: mentor_table.trial_fee, per_month_fee: mentor_table.per_month_fee }).from(mentor_table).where(eq(mentor_table.id, mentor_id)).fullJoin(user_table, eq(mentor_table.fk_mentor_user, user_table.id)))[0];
        if (!mentor) {
            throw new Error("Mentor not found");
        }
        const mentee = (await DB.select({ name: user_table.full_name, phone: user_table.phone, monthly_budget_min: mentee_table.monthly_budget_min, monthly_budget_max: mentee_table.monthly_budget_max }).from(mentee_table).where(eq(mentee_table.id, mentee_id)).fullJoin(user_table, eq(mentee_table.fk_mentee_user, user_table.id)))[0];
        if (!mentee) {
            throw new Error("Mentee not found");
        }
        const domains = await DB.select().from(mentee_domain_map_table).where(eq(mentee_domain_map_table.fk_domain_mentee, mentee_id));
        await axios({
            method: "post",
            url: config.create_booking_script_url,
            data: [
                [
                    mentor.name,
                    mentee.name,
                    mentee.phone,
                    dayjs(new Date()).tz("Asia/Kolkata").format('DD.MM.YYYY | hh:mm A'),
                    domains.map(domain => DOMAIN_VALUE_TO_NAME_MAP[domain.domain]).join(", "),
                    `₹ ${normalizeCurrency({ value: mentee.monthly_budget_min || 0, currency: "INR" })} - ₹ ${normalizeCurrency({ value: mentee.monthly_budget_max || 0, currency: "INR" })}`,
                    `₹ ${normalizeCurrency({ value: mentor.trial_fee || 0, currency: "INR" })}`,
                    `₹ ${normalizeCurrency({ value: mentor.per_month_fee || 0, currency: "INR" })}`,
                ]
            ]
        })
        return booking[0];
    },

    create_new_booking: async (DTO: { mentee_id: string, mentor_id: string, email?: string, interest?: string }) => {
        const { mentee_id, mentor_id, email, interest } = DTO;
        const found_mentee = await DB.select({
            trial_booked: mentee_table.trial_booked,
            full_name: user_table.full_name,
            phone: user_table.phone
        }).from(mentee_table).where(eq(mentee_table.id, mentee_id)).fullJoin(user_table, eq(mentee_table.fk_mentee_user, user_table.id));
        if (found_mentee[0]?.trial_booked) {
            throw new CustomError("You have already booked a trial session", 400);
        }
        const created_trial_booking = await DB.insert(trial_booking_table).values({ fk_booking_mentor: mentor_id, fk_booking_mentee: mentee_id, email, interest }).returning();
        await DB.update(mentee_table).set({ trial_booked: true }).where(eq(mentee_table.id, mentee_id));

        const found_mentor = await DB.select({
            full_name: user_table.full_name,
            phone: user_table.phone,
            per_month_fee: mentor_table.per_month_fee
        }).from(mentor_table).where(eq(mentor_table.id, mentor_id)).fullJoin(user_table, eq(mentor_table.fk_mentor_user, user_table.id));

        try {
            await axios({
                method: "post",
                url: config.payment_update_script_url,
                data: {
                    phone: `+91-${found_mentee[0]?.phone?.slice(2)}`,
                    mentor_name: found_mentor[0].full_name,
                    per_month_fee: `₹${normalizeCurrency({ currency: "INR", value: found_mentor[0].per_month_fee as number })}`
                }
            })
        } catch (err) { }
        try {
            await axios.post("https://hooks.slack.com/services/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", {
                text: `Mentee ${found_mentee[0].full_name} booked a trial session with ${found_mentor[0].full_name}`
            })
        } catch (err) { }

        return created_trial_booking[0];
    },

    create_session_new_booking: async (DTO: { mentor_id: string, email?: string, session_id: string, interest?: string }) => {
        const { mentor_id, email, session_id, interest } = DTO;
        const created_trial_booking = await DB.insert(trial_booking_table).values({ fk_booking_mentor: mentor_id, email, interest }).returning();
        const found_mentor = (await DB.select({
            full_name: user_table.full_name,
        }).from(mentor_table).where(eq(mentor_table.id, mentor_id)).fullJoin(user_table, eq(mentor_table.fk_mentor_user, user_table.id)))[0];
        const custom_list = await DB.select().from(mentor_list_table).where(eq(mentor_list_table.nano_id, session_id));
        try {
            await axios.post("https://hooks.slack.com/services/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", {
                text: `A trial session was booked with the mentor ${found_mentor.full_name} from the custom list ${custom_list[0]?.name}.`
            })
        } catch (err) { }
        return created_trial_booking[0];
    }
}