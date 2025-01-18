import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.services";
import CustomError from "../providers/error";
import axios from "axios";
import { config } from "../providers/config";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DOMAIN_VALUE_TO_NAME_MAP, SKILL_VALUE_TO_NAME_MAP } from "../constants";
import { normalizeCurrency } from "../utils/common";
import { MentorService } from "../services/mentor.services";
import { MenteeService } from "../services/mentee.services";

dayjs.extend(utc);
dayjs.extend(timezone);

export const UserController = {
    userSignup: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const response = await UserService.userSignup({ email, password });
            return res.send(response);
        } catch (err: any) {
            next(err);
        }
    },

    userLogin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const response = await UserService.userLogin(email, password);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    },

    userRefresh: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refresh_token = req.body.refresh_token;
            if (!refresh_token) {
                throw new CustomError("Invalid refresh token", 401);
            }
            const response = await UserService.userRefresh(refresh_token);
            return res.send({ access_token: response.access_token, refresh_token: response.refresh_token });
        } catch (err) {
            next(err);
        }
    },

    userLogout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refresh_token = req.body.refresh_token;
            if (!refresh_token) {
                return res.sendStatus(204);
            }
            await UserService.userLogout(refresh_token);
            return res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    },

    userExists: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            const response = await UserService.userExists(email);
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    updateUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = req.headers.user_id as string;
            const { full_name, phone } = req.body;
            const response = await UserService.updateUser({ id: user_id, full_name, phone });
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    getUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = req.params.user_id as string;
            const response = await UserService.getUser(user_id);
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    userMentorSignupWithPhone: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { phone, full_name, experience_level, domains, skills, monthly_budget_min, monthly_budget_max, goal } = req.body;
            const response = await UserService.userMentorSignupWithPhone({ phone, full_name, experience_level, goal, domains, monthly_budget_max, monthly_budget_min, skills });
            res.status(200).json(response);
            const mentors = await MentorService.getMentors({
                limit: 10,
                offset: 0,
                skills,
                domains,
                experience_min: 0,
                experience_max: 15,
                trial_fee_min: 0,
                trial_fee_max: 200000,
                per_month_fee_min: monthly_budget_min,
                per_month_fee_max: monthly_budget_max
            });
            try {
                await axios({
                    method: "post",
                    url: config.lead_create_script_url,
                    data: [
                        [
                            full_name,
                            `+91-${phone.slice(2)}`,
                            dayjs(new Date()).tz("Asia/Kolkata").format('DD.MM.YYYY | hh:mm A'),
                            [...domains.map((domain: string) => DOMAIN_VALUE_TO_NAME_MAP[domain]), ...skills.map((skill: string) => SKILL_VALUE_TO_NAME_MAP[skill])].join(", "),
                            `₹${normalizeCurrency({ value: monthly_budget_min, currency: "INR" })} - ₹${normalizeCurrency({ value: monthly_budget_max, currency: "INR" })}`,
                            ,
                            experience_level,
                            goal,
                            mentors.map(mentor => mentor.full_name).join(", ")
                        ]
                    ]
                })
            } catch (err) { }
            try {
                await axios.post("https://hooks.slack.com/services/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", {
                    text: `A mentee just signed up with name: ${full_name}, phone number: ${phone}, domains: ${domains.join()}, skills: ${skills.join()}, monthly_budget_min: ${normalizeCurrency({ value: monthly_budget_min, currency: "INR" })}, and monthly_budget_max: ${normalizeCurrency({ value: monthly_budget_max, currency: "INR" })}`
                })
            } catch (err) { }
        } catch (err) {
            next(err);
        }
    },

    phoneLogin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { phone } = req.body;
            const response = await UserService.phoneLogin(phone);
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    phoneLoginSignup: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { full_name, phone, domains, skills, mentor_id } = req.body;
            const response = await UserService.phoneLoginSignup(full_name, phone, domains, skills);
            res.status(200).json(response);
            if (response.type === "signup") {
                try {
                    // Adding record to the google sheet
                    await axios({
                        method: "post",
                        url: config.lead_create_script_url,
                        data: [
                            [
                                full_name,
                                `+91-${phone.slice(2)}`,
                                dayjs(new Date()).tz("Asia/Kolkata").format('DD.MM.YYYY | hh:mm A'),
                                [...domains.map((domain: string) => DOMAIN_VALUE_TO_NAME_MAP[domain]), ...skills.map((skill: string) => SKILL_VALUE_TO_NAME_MAP[skill])].join(", "),
                            ]
                        ]
                    })
                } catch (err) { }
                try {
                    // slack notification for signup
                    await axios.post("https://hooks.slack.com/services/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", {
                        text: `A mentee just signed up with name: ${full_name}, phone number: ${phone}, domains: ${domains.join()}, skills: ${skills.join()}`
                    })
                } catch (err) { }
            } else {
                try {
                    // Adding record to the lead login google sheet
                    await axios({
                        method: "post",
                        url: config.lead_login_script_url,
                        data: {
                            name: full_name,
                            phone: `+91-${phone.slice(2)}`,
                            date_time: dayjs(new Date()).tz("Asia/Kolkata").format('DD.MM.YYYY | hh:mm A')
                        }
                    })
                } catch (err) { }
                try {
                    // slack notification for login
                    await axios.post("https://hooks.slack.com/services/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", {
                        text: `A mentee just logged in with name: ${full_name}, phone number: ${phone}`
                    })
                } catch (err) { }
            }
            if (mentor_id) {
                await MenteeService.create_new_booking({ mentee_id: response.user_data.mentee_id as string, mentor_id });
            }
        } catch (err) {
            next(err);
        }
    },

    updateAfterPhoneLoginSignup: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentee_id = req.headers.mentee_id as string;
            const { experience_level, goal, monthly_budget_max, monthly_budget_min } = req.body;
            const response = await UserService.updateAfterPhoneLoginSignup({ mentee_id, experience_level, goal, monthly_budget_max, monthly_budget_min });
            res.status(200).json(response);
            try {
                const mentors = await MentorService.getMentors({
                    limit: 10,
                    offset: 0,
                    skills: response.skills.map(skill => skill.skill),
                    domains: response.domains.map(domain => domain.domain),
                    experience_min: 0,
                    experience_max: 15,
                    trial_fee_min: 0,
                    trial_fee_max: 200000,
                    per_month_fee_min: monthly_budget_min,
                    per_month_fee_max: monthly_budget_max
                });
                await axios({
                    method: "post",
                    url: config.lead_update_script_url,
                    data: {
                        phone: `+91-${response.user.phone?.slice(2)}`,
                        experience: response.experience_level,
                        goal: response.goal,
                        budget: `₹${normalizeCurrency({ value: monthly_budget_min, currency: "INR" })} - ₹${normalizeCurrency({ value: monthly_budget_max, currency: "INR" })}`,
                        suggested_mentors: mentors.map(mentor => mentor.full_name).join(", ")
                    }
                })
            } catch (err) { }
        } catch (err) {
            next(err);
        }
    },

    sendFBConversionEvent: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { event_name, event_id, event_source_url } = req.body;
            let phone;
            if (req.headers.user_id) {
                const user = await UserService.getUser(req.headers.user_id as string);
                phone = user.phone;
            }
            const response = await UserService.sendFBConversionEvent({ event_name, event_id, phone, event_source_url });
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}