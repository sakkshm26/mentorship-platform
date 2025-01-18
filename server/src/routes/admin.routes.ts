import { Router } from "express";
import { AdminController } from "../controllers/admin.controllers";
import { AuthMiddleware } from "../middlewares/auth.middlewares";

const AdminRouter = Router();

AdminRouter.post("/auth/login", AdminController.login);
AdminRouter.get("/mentor", [AuthMiddleware.verifyAdminKey], AdminController.getMentors);
AdminRouter.get("/session-mentor-list", [AuthMiddleware.verifyAdminKey], AdminController.getSessionMentorLists);
AdminRouter.post("/user-mentor", [AuthMiddleware.verifyAdminKey], AdminController.createUserAndMentor);
AdminRouter.post("/session-mentor-list", [AuthMiddleware.verifyAdminKey], AdminController.createSessionMentorList);
AdminRouter.get("/mentor/all", [AuthMiddleware.verifyAdminKey], AdminController.getAllMentors);
AdminRouter.get("/mentor/:mentor_id", [AuthMiddleware.verifyAdminKey], AdminController.getMentor);
AdminRouter.put("/mentor/:mentor_id", [AuthMiddleware.verifyAdminKey], AdminController.updateMentor);
AdminRouter.get("/mentee/all", [AuthMiddleware.verifyAdminKey], AdminController.getAllMentees);
AdminRouter.get("/mentee/:mentee_id", [AuthMiddleware.verifyAdminKey], AdminController.getMentee);
AdminRouter.put("/mentee/:mentee_id", [AuthMiddleware.verifyAdminKey], AdminController.updateMentee);

export default AdminRouter;