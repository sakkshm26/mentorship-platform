import { NextFunction, Request, Response } from "express";
import { MenteeService } from "../services/mentee.services";

export const MenteeController = {
    create_mentee: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = req.headers.user_id as string;
            const { experience_level, monthly_budget_min, monthly_budget_max, skills } = req.body;
            const response = await MenteeService.create_mentee({ user_id, experience_level, monthly_budget_max, monthly_budget_min, skills });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    get_mentee: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentee_id = req.params.mentee_id as string;
            const response = await MenteeService.get_mentee(mentee_id);
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },
    
    create_booking: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { mentor_id } = req.body;
            const mentee_id = req.headers.mentee_id as string;
            const response = await MenteeService.create_booking({ mentee_id, mentor_id });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    create_new_booking: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { mentor_id, email, interest } = req.body;
            const mentee_id = req.headers.mentee_id as string;
            const response = await MenteeService.create_new_booking({ mentee_id, mentor_id, email, interest });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    create_session_new_booking: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { mentor_id, email, interest } = req.body;
            const session_id = req.headers.session_id as string;
            const response = await MenteeService.create_session_new_booking({ mentor_id, email, session_id, interest });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },
}