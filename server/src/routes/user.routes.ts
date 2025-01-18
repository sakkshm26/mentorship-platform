import { Router } from "express";
import { UserController } from "../controllers/user.controllers";
import { AuthMiddleware } from "../middlewares/auth.middlewares";
const UserRouter = Router();

UserRouter.get("/exists", UserController.userExists);
UserRouter.get("/:user_id", [AuthMiddleware.verifyAccessToken], UserController.getUser);
UserRouter.post("/auth/login", UserController.userLogin);
UserRouter.post("/auth/signup", UserController.userSignup);
UserRouter.post("/auth/refresh", UserController.userRefresh);
UserRouter.post("/auth/logout", UserController.userLogout);
UserRouter.post("/auth/phone-signup", UserController.userMentorSignupWithPhone);
UserRouter.post("/auth/phone-login-signup", UserController.phoneLoginSignup);
UserRouter.post("/auth/phone-login", UserController.phoneLogin);
UserRouter.put("/", [AuthMiddleware.verifyAccessToken], UserController.updateUser);
UserRouter.put("/auth/phone-login-signup", [AuthMiddleware.verifyAccessToken], UserController.updateAfterPhoneLoginSignup);
UserRouter.post("/fb-conversion", [AuthMiddleware.verifyAccessToken], UserController.sendFBConversionEvent);

export default UserRouter;