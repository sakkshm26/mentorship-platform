import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middlewares";
import { PaymentGatewayController } from "../controllers/payment_gateway.controllers";

const PaymentGatewayRouter = Router();

PaymentGatewayRouter.post("/order/trial", [AuthMiddleware.verifyAccessToken], PaymentGatewayController.createTrialBookingRazorpayOrder);
PaymentGatewayRouter.post("/order/trial/session", [AuthMiddleware.verifySession], PaymentGatewayController.createTrialBookingRazorpayOrderForSession);
PaymentGatewayRouter.post("/razorpay/webhook", PaymentGatewayController.razorpayPaymentCaptureWebhook)

export default PaymentGatewayRouter;