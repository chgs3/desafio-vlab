import { Router } from "express";
import { LessonPlanController } from "../controllers/lessonPlanController";

export const lessonPlanRoutes = Router();

const lessonPlanController = new LessonPlanController();

lessonPlanRoutes.post("/", lessonPlanController.create);
lessonPlanRoutes.get("/", lessonPlanController.list);
lessonPlanRoutes.get("/:id", lessonPlanController.findById);
lessonPlanRoutes.put("/:id", lessonPlanController.update);
lessonPlanRoutes.delete("/:id", lessonPlanController.delete);