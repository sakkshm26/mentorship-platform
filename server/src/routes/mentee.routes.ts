import { Router } from "express";
import { MenteeController } from "../controllers/mentee.controllers";
import { AuthMiddleware } from "../middlewares/auth.middlewares";

const MenteeRouter = Router();

MenteeRouter.get("/:mentee_id", [AuthMiddleware.verifyAccessToken], MenteeController.get_mentee);
MenteeRouter.post("/", [AuthMiddleware.verifyAccessToken], MenteeController.create_mentee);
MenteeRouter.post("/booking", [AuthMiddleware.verifyAccessToken], MenteeController.create_booking);
MenteeRouter.post("/new-booking", [AuthMiddleware.verifyAccessToken], MenteeController.create_new_booking);
MenteeRouter.post("/session-new-booking", [AuthMiddleware.verifySession], MenteeController.create_session_new_booking);

export default MenteeRouter;