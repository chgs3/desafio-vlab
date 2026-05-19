import { Router } from "express";

import { lessonPlanRoutes } from "./lessonPlanRoutes";
import { smartAssistRoutes } from "./smartAssistRoutes";

export const routes = Router();

routes.use("/lesson-plans", lessonPlanRoutes);

routes.use(
  "/smart-assist",
  smartAssistRoutes
);