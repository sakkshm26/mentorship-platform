import { NextFunction, Request, Response } from "express";
import { PaymentGatewayService } from "../services/payment_gateway.services";

export const PaymentGatewayController = {
    createTrialBookingRazorpayOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { mentor_id } = req.body;
            const user_id = req.headers.user_id as string;
            const mentee_id = req.headers.mentee_id as string;
            const response = await PaymentGatewayService.createTrialBookingRazorpayOrder({ mentor_id, user_id, mentee_id });
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    createTrialBookingRazorpayOrderForSession: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { mentor_id } = req.body;
            const session_id = req.headers.session_id as string;
            const response = await PaymentGatewayService.createTrialBookingRazorpayOrderForSession({ session_id, mentor_id });
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    razorpayPaymentCaptureWebhook: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.send({ status: "ok" });
            await PaymentGatewayService.razorpayPaymentCaptureWebhook({ payload: req.body, headers: req.headers });
        } catch (err) {
            next(err);
        }
    }
}