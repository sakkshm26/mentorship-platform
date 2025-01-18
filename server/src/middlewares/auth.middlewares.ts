import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { config } from "../providers/config";
import CustomError from "../providers/error";
import { ErrorType } from "../types";

export const AuthMiddleware = {
    verifyAccessToken: (req: Request, res: Response, next: NextFunction) => {
        try {
            const auth_header = req.headers.authorization;
            const access_token = auth_header?.split(" ")[1];
            if (!access_token) {
                throw new CustomError("Unauthorized", 401);
            }
            const decoded_data: any = jwt.verify(access_token, config.access_token_secret as string);
            // req.headers["user_id"] = decoded_data.user_metadata.user_id;
            // req.headers["mentor_id"] = decoded_data.user_metadata.mentor_id;
            // req.headers["mentee_id"] = decoded_data.user_metadata.mentee_id;
            req.headers["user_id"] = decoded_data.user_id;
            req.headers["mentor_id"] = decoded_data.mentor_id;
            req.headers["mentee_id"] = decoded_data.mentee_id;
            next();
        } catch (err: any) {
            if (err.expiredAt) {
                throw new CustomError("Access token expired", 401, ErrorType.ACCESS_TOKEN_EXPIRED);
            }
            next(err);
        }
    },

    verifyAdminKey: (req: Request, res: Response, next: NextFunction) => {
        try {
            const api_key = req.headers["x-api-key"];
            if (!api_key || api_key !== config.admin_api_key) {
                throw new CustomError("Unauthorized", 401);
            }
            next();
        } catch (err) {
            next(err);
        }
    },

    verifySession: (req: Request, res: Response, next: NextFunction) => {
        try {
            const auth_header = req.headers.authorization;
            const access_token = auth_header?.split(" ")[1];
            if (!access_token) {
                throw new CustomError("Unauthorized", 401);
            }
            if (access_token.length !== 10) {
                jwt.verify(access_token, config.access_token_secret as string);
            }
            req.headers["session_id"] = access_token;
            next();
        } catch (err) {
            next(err);
        }
    }
}