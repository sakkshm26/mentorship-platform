import { eq } from "drizzle-orm";
import { DB } from "../db";
import { mentee_domain_map_table, mentee_skill_map_table, mentee_table, user_table, user_token_table } from "../db/schema";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { config } from "../providers/config";
import CustomError from "../providers/error";
import { MenteeService } from "./mentee.services";
import axios from "axios";
import { DOMAIN_VALUE_TO_NAME_MAP, SKILL_VALUE_TO_NAME_MAP } from "../constants";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { normalizeCurrency } from "../utils/common";
import { createHash } from "crypto";

dayjs.extend(utc);
dayjs.extend(timezone);

interface user_signup {
    email: string;
    password: string;
}

interface update_user_data {
    id: string,
    full_name?: string;
    phone?: string;
}

interface user_mentor_phone_signup {
    full_name: string;
    phone: string;
    experience_level: "fresher" | "student" | "working_professional" | "other";
    skills: any[];
    domains: any[];
    monthly_budget_min: number;
    monthly_budget_max: number;
    goal: any
}

export const UserService = {
    userSignup: async (user_data: user_signup) => {
        if (typeof user_data.password !== "string" || user_data.password.length < 8) {
            throw new CustomError("Wrong password format");
        }
        const hashed_password = await argon2.hash(user_data.password);
        const user = await DB.insert(user_table).values({
            email: user_data.email,
            password: hashed_password,
        }).returning({ id: user_table.id, fk_user_mentor: user_table.fk_user_mentor, fk_user_mentee: user_table.fk_user_mentee });
        const access_token = jwt.sign(
            { user_id: user[0].id, mentor_id: user[0].fk_user_mentor, mentee_id: user[0].fk_user_mentee },
            config.access_token_secret as string,
            {
                expiresIn: "2h",
            }
        );
        const refresh_token = jwt.sign(
            { user_id: user[0].id, mentor_id: user[0].fk_user_mentor, mentee_id: user[0].fk_user_mentee },
            config.refresh_token_secret as string,
            {
                expiresIn: "15d",
            }
        )
        await DB.insert(user_token_table).values({
            fk_token_user: user[0].id,
            refresh_token
        });
        return { access_token, refresh_token, user_data: { user_id: user[0].id, mentor_id: user[0].fk_user_mentor, mentee_id: user[0].fk_user_mentee } };
    },

    userLogin: async (email: string, password: string) => {
        const user = await DB.select().from(user_table).where(eq(user_table.email, email));
        if (!user.length) {
            throw new CustomError("Invalid Credentials");
        }
        if (!user[0].password) {
            throw new CustomError("Cannot login for the user");
        }
        const valid_password = await argon2.verify(user[0].password, password);
        if (!valid_password) {
            throw new CustomError("Invalid Credentials");
        }
        const access_token = jwt.sign(
            { user_id: user[0].id, mentor_id: user[0].fk_user_mentor, mentee_id: user[0].fk_user_mentee },
            config.access_token_secret as string,
            {
                expiresIn: "2h",
            }
        );
        const refresh_token = jwt.sign(
            { user_id: user[0].id, mentor_id: user[0].fk_user_mentor, mentee_id: user[0].fk_user_mentee },
            config.refresh_token_secret as string,
            {
                expiresIn: "15d",
            }
        )
        await DB.insert(user_token_table).values({
            fk_token_user: user[0].id,
            refresh_token
        });
        return { access_token, refresh_token, user_data: { user_id: user[0].id, mentor_id: user[0].fk_user_mentor, mentee_id: user[0].fk_user_mentee } };
    },

    userRefresh: async (refresh_token: string) => {
        const user_token = await DB.select().from(user_token_table).where(eq(user_token_table.refresh_token, refresh_token));
        if (!user_token.length) {
            throw new CustomError("Invalid refresh token");
        }
        const decoded_data: any = jwt.verify(refresh_token, config.refresh_token_secret as string);
        const access_token = jwt.sign(
            { user_id: decoded_data.user_id, mentor_id: decoded_data.mentor_id, mentee_id: decoded_data.mentee_id },
            config.access_token_secret as string,
            {
                expiresIn: "2h",
            }
        );
        const new_refresh_token = jwt.sign(
            { user_id: decoded_data.user_id, mentor_id: decoded_data.mentor_id, mentee_id: decoded_data.mentee_id },
            config.refresh_token_secret as string,
            {
                expiresIn: "15d",
            }
        )
        await DB.insert(user_token_table).values({
            fk_token_user: decoded_data.user_id,
            refresh_token: new_refresh_token
        });
        return { access_token, refresh_token: new_refresh_token };
    },

    userLogout: async (refresh_token: string) => {
        await DB.delete(user_token_table).where(eq(user_token_table.refresh_token, refresh_token));
        return;
    },

    userExists: async (email: string) => {
        const user = await DB.select().from(user_table).where(eq(user_table.email, email));
        if (user.length) {
            return { user_exists: true };
        }
        return { user_exists: false };
    },

    updateUser: async (update_user_data: update_user_data) => {
        const { id, full_name, phone } = update_user_data;
        const user = await DB.update(user_table).set({ full_name, phone }).where(eq(user_table.id, id)).returning();
        const { password, ...user_data } = user[0];
        return user_data;
    },

    getUser: async (user_id: string) => {
        const user = await DB.select().from(user_table).where(eq(user_table.id, user_id));
        const { password, ...user_data } = user[0];
        return user_data;
    },

    userMentorSignupWithPhone: async (user_data: user_mentor_phone_signup) => {
        const { full_name, phone, experience_level, goal, skills, domains, monthly_budget_max, monthly_budget_min } = user_data;
        const found_user = await DB.select().from(user_table).where(eq(user_table.phone, phone));
        if (found_user.length) {
            const access_token = jwt.sign(
                { user_id: found_user[0].id, mentor_id: found_user[0].fk_user_mentor, mentee_id: found_user[0].fk_user_mentee },
                config.access_token_secret as string,
                {
                    expiresIn: "2h",
                }
            );
            const refresh_token = jwt.sign(
                { user_id: found_user[0].id, mentor_id: found_user[0].fk_user_mentor, mentee_id: found_user[0].fk_user_mentee },
                config.refresh_token_secret as string,
                {
                    expiresIn: "15d",
                }
            )
            await DB.insert(user_token_table).values({
                fk_token_user: found_user[0].id,
                refresh_token
            });
            return { access_token, refresh_token, user_data: { user_id: found_user[0].id, mentor_id: found_user[0].fk_user_mentor, mentee_id: found_user[0].fk_user_mentee }, type: "login" };
        }
        const user = await DB.insert(user_table).values({
            phone,
            full_name,
        }).returning({ id: user_table.id });
        const mentee = await MenteeService.create_mentee({ user_id: user[0].id, goal, experience_level, monthly_budget_max, monthly_budget_min, domains, skills });
        const access_token = jwt.sign(
            { user_id: user[0].id, mentee_id: mentee.id },
            config.access_token_secret as string,
            {
                expiresIn: "2h",
            }
        );
        const refresh_token = jwt.sign(
            { user_id: user[0].id, mentee_id: mentee.id },
            config.refresh_token_secret as string,
            {
                expiresIn: "15d",
            }
        )
        await DB.insert(user_token_table).values({
            fk_token_user: user[0].id,
            refresh_token
        });
        return { access_token, refresh_token, user_data: { user_id: user[0].id, mentee_id: mentee.id } };
    },

    phoneLogin: async (phone: string) => {
        const user = await DB.select().from(user_table).where(eq(user_table.phone, phone));
        if (!user.length) {
            throw new CustomError("Invalid Phone");
        }
        const access_token = jwt.sign(
            { user_id: user[0].id, mentor_id: user[0].fk_user_mentor, mentee_id: user[0].fk_user_mentee },
            config.access_token_secret as string,
            {
                expiresIn: "2h",
            }
        );
        const refresh_token = jwt.sign(
            { user_id: user[0].id, mentor_id: user[0].fk_user_mentor, mentee_id: user[0].fk_user_mentee },
            config.refresh_token_secret as string,
            {
                expiresIn: "15d",
            }
        )
        await DB.insert(user_token_table).values({
            fk_token_user: user[0].id,
            refresh_token
        });
        return { access_token, refresh_token, user_data: { user_id: user[0].id, mentor_id: user[0].fk_user_mentor, mentee_id: user[0].fk_user_mentee } };
    },

    phoneLoginSignup: async (full_name: string, phone: string, domains: any[], skills: any[]) => {
        const found_user = await DB.select().from(user_table).where(eq(user_table.phone, phone));
        if (found_user.length) {
            const access_token = jwt.sign(
                { user_id: found_user[0].id, mentor_id: found_user[0].fk_user_mentor, mentee_id: found_user[0].fk_user_mentee },
                config.access_token_secret as string,
                {
                    expiresIn: "2h",
                }
            );
            const refresh_token = jwt.sign(
                { user_id: found_user[0].id, mentor_id: found_user[0].fk_user_mentor, mentee_id: found_user[0].fk_user_mentee },
                config.refresh_token_secret as string,
                {
                    expiresIn: "15d",
                }
            )
            await DB.insert(user_token_table).values({
                fk_token_user: found_user[0].id,
                refresh_token
            });
            return { access_token, refresh_token, user_data: { user_id: found_user[0].id, mentor_id: found_user[0].fk_user_mentor, mentee_id: found_user[0].fk_user_mentee }, type: "login" };
        }
        const user = await DB.insert(user_table).values({
            phone,
            full_name,
        }).returning({ id: user_table.id });
        const mentee = await DB.insert(mentee_table).values({
            fk_mentee_user: user[0].id
        }).returning({ id: mentee_table.id })
        await DB.update(user_table).set({ fk_user_mentee: mentee[0].id }).where(eq(user_table.id, user[0].id));
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
        const access_token = jwt.sign(
            { user_id: user[0].id, mentee_id: mentee[0].id },
            config.access_token_secret as string,
            {
                expiresIn: "2h",
            }
        );
        const refresh_token = jwt.sign(
            { user_id: user[0].id, mentee_id: mentee[0].id },
            config.refresh_token_secret as string,
            {
                expiresIn: "15d",
            }
        )
        await DB.insert(user_token_table).values({
            fk_token_user: user[0].id,
            refresh_token
        });
        return { access_token, refresh_token, user_data: { user_id: user[0].id, mentee_id: mentee[0].id }, type: "signup" };
    },

    updateAfterPhoneLoginSignup: async ({ mentee_id, experience_level, goal, monthly_budget_max, monthly_budget_min }: { mentee_id: string, experience_level: any, goal: any, monthly_budget_min: number, monthly_budget_max: number }) => {
        const updated_mentee = await DB.update(mentee_table).set({ experience_level, goal, monthly_budget_max, monthly_budget_min }).where(eq(mentee_table.id, mentee_id)).returning();
        const skills = await DB.select().from(mentee_skill_map_table).where(eq(mentee_skill_map_table.fk_skill_mentee, mentee_id));
        const domains = await DB.select().from(mentee_domain_map_table).where(eq(mentee_domain_map_table.fk_domain_mentee, mentee_id));
        const user = await DB.select().from(user_table).where(eq(user_table.fk_user_mentee, mentee_id));
        return { ...updated_mentee[0], skills, domains, user: user[0] };
    },

    sendFBConversionEvent: async ({ event_name, event_id, phone, event_source_url }: { event_name: string, event_id: string, phone?: string | null, event_source_url: string }) => {
        await axios.post(`https://graph.facebook.com/v20.0/${config.facebook_pixel_id}/events?access_token=${config.facebook_conversions_api_access_token}`, {
            data: [
                {
                    event_name,
                    event_time: Math.floor(Date.now() / 1000),
                    event_source_url,
                    action_source: "website",
                    event_id,
                    user_data: {
                        ph: [phone ? createHash('sha256').update(phone).digest('hex') : undefined]
                    }
                }
            ],
            test_event_code: "TEST19210"
        })
    }
}