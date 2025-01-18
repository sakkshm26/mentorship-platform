import { Router } from "express";
import { OpenController } from "../controllers/open.controllers";

const OpenRouter = Router();

OpenRouter.get("/mentors", OpenController.getMentors);
OpenRouter.get("/static-mentors", OpenController.getStaticMentors);
OpenRouter.get("/session-list/:list_id", OpenController.getSessionListMentorsWithID);

// carnival routes
OpenRouter.post('/carnival-lead', OpenController.createCarnivalLead);
OpenRouter.post("/fb-conversion", OpenController.sendFBConversionEvent);

export default OpenRouter;