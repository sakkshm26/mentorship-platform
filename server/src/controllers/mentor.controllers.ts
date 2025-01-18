import { NextFunction, Request, Response } from "express";
import { MentorService } from "../services/mentor.services";

export const MentorController = {
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

    getSessionMentorList: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session_id = req.headers.session_id as string;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const response = await MentorService.getSessionMentorList({ session_id, limit, offset });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    createSessionBooking: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { mentor_id, session_id } = req.body;
            const response = await MentorService.createSessionBooking({ mentor_id, session_id });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },
}