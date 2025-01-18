import { NextFunction, Request, Response } from "express";
import { AdminService } from "../services/admin.services";
import { MentorService } from "../services/mentor.services";
import axios from "axios";
import { config } from "../providers/config";

export const AdminController = {
    createUserAndMentor: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { full_name, phone, heading, about, trial_fee, per_month_fee, profile_image_url, years_experience, skills, domains, linkedin_url, job_experiences } = req.body;
            const response = await AdminService.createUserAndMentor({ full_name, phone, heading, about, trial_fee, per_month_fee, profile_image_url, years_experience, skills, domains, linkedin_url, job_experiences });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const response = await AdminService.login({ email, password });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    createSessionMentorList: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { mentor_ids, name } = req.body;
            const response = await AdminService.createSessionMentorList({ mentor_ids, name });
            res.status(200).json(response);
            await axios.post(config.session_list_create_script_url, {
                name,
                link: `https://turtlex.in/session-mentor-list/${response.nano_id}`
            })
        } catch (err: any) {
            next(err);
        }
    },

    getMentors: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const skills = req.query.skills ? (req.query.skills as string).split(",") : [];
            const domains = req.query.domains ? (req.query.domains as string).split(",") : [];
            const experience_min = req.query.experience_min ? parseInt(req.query.experience_min as string) : 0;
            const experience_max = req.query.experience_max ? parseInt(req.query.experience_max as string) : 15;
            const trial_fee_min = req.query.trial_fee_min ? parseInt(req.query.trial_fee_min as string) : 0;
            const trial_fee_max = req.query.trial_fee_max ? parseInt(req.query.trial_fee_max as string) : 200000;
            const per_month_fee_min = req.query.per_month_fee_min ? parseInt(req.query.per_month_fee_min as string) : 0;
            const per_month_fee_max = req.query.per_month_fee_max ? parseInt(req.query.per_month_fee_max as string) : 2000000;
            const job_or_skill_search = req.query.job_or_skill_search ? req.query.job_or_skill_search as string : "";
            const response = await MentorService.getMentors({ limit, offset, skills, domains, experience_min, experience_max, trial_fee_max, trial_fee_min, per_month_fee_max, per_month_fee_min, job_or_skill_search });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    getSessionMentorLists: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const response = await AdminService.getSessionMentorLists({ limit, offset });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    getAllMentors: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const full_name = req.query.name as string;
            const email = req.query.email as string;
            const phone = req.query.phone as string;
            const response = await AdminService.getAllMentors({ limit, offset, phone, email, name: full_name });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    getMentor: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentor_id = req.params.mentor_id as string;
            const response = await AdminService.getMentor(mentor_id);
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    updateMentor: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentor_id = req.params.mentor_id as string;
            const { full_name, phone, email, heading, about, internal_rating, external_rating, session_count, hidden } = req.body;
            const response = await AdminService.updateMentor({ id: mentor_id, full_name, phone, email, heading, about, internal_rating, external_rating, session_count, hidden });
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    getAllMentees: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const full_name = req.query.name as string;
            const email = req.query.email as string;
            const phone = req.query.phone as string;
            const response = await AdminService.getAllMentees({ limit, offset, phone, email, name: full_name });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    getMentee: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentee_id = req.params.mentee_id as string;
            const response = await AdminService.getMentee(mentee_id);
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    updateMentee: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentee_id = req.params.mentee_id as string;
            const { full_name, phone, email } = req.body;
            const response = await AdminService.updateMentee({ id: mentee_id, full_name, phone, email });
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },
}