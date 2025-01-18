import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middlewares";
import { MentorController } from "../controllers/mentor.controllers";

const MentorRouter = Router();

MentorRouter.get("/", [AuthMiddleware.verifyAccessToken], MentorController.getMentors);
MentorRouter.get("/session", [AuthMiddleware.verifySession], MentorController.getSessionMentorList);
MentorRouter.post("/session/booking", [AuthMiddleware.verifySession], MentorController.createSessionBooking);

export default MentorRouter;