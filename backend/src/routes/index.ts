import { Router } from "express";
import { lessonPlanRoutes } from "./lessonPlanRoutes";

export const routes = Router();

routes.use("/lesson-plans", lessonPlanRoutes);