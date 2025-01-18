import { NextFunction, Request, Response } from "express";
import { OpenService } from "../services/open.services";
import axios from "axios";
import { config } from "../providers/config";
import dayjs from "dayjs";
import { UserService } from "../services/user.services";

export const OpenController = {
    getMentors: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const skills = req.query.skills ? (req.query.skills as string).split(",") : [];
            const domains = req.query.domains ? (req.query.domains as string).split(",") : [];
            const response = await OpenService.getMentors({ limit, offset, skills, domains });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    getStaticMentors: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await OpenService.getStaticMentors();
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    createCarnivalLead: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, phone, type } = req.body;
            await OpenService.createCarnivalLead(name, phone, type);
            res.send("Lead created successfully");
            await axios({
                method: "post",
                url: config.carnival_lead_create_script_url,
                data: {
                    name,
                    phone: `+${phone}`,
                    date: dayjs(new Date()).tz("Asia/Kolkata").format('DD.MM.YYYY | hh:mm A'),
                    type
                },
            })
        } catch (err: any) {
            next(err);
        }
    },

    getSessionListMentorsWithID: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { list_id } = req.params;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const response = await OpenService.getSessionListMentorsWithID({ id: list_id, limit, offset });
            return res.status(200).json(response);
        } catch (err: any) {
            next(err);
        }
    },

    sendFBConversionEvent: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { event_name, event_id, event_source_url } = req.body;
            const response = await UserService.sendFBConversionEvent({ event_name, event_id, event_source_url });
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}